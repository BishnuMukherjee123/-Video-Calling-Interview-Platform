import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      if (!user) {
        console.log("User not found in DB, attempting to fetch from Clerk directly");
        try {
          const clerkUser = await clerkClient.users.getUser(clerkId);
          
          const email = clerkUser.emailAddresses[0]?.emailAddress;
          if (!email) {
              return res.status(400).json({ message: "User email not found in Clerk" });
          }
          
          user = await User.create({
              clerkId: clerkId,
              email: email,
              name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
              profileImage: clerkUser.imageUrl,
          });
          
          // try to sync with Stream just like the webhook does
          try {
              const { upsertStreamUser } = await import("../lib/stream.js");
              await upsertStreamUser({
                  id: clerkId,
                  name: user.name,
                  image: user.profileImage,
              });
              console.log("Stream user created during fallback sync");
          } catch (streamError) {
              console.error("Failed to create stream user during fallback sync:", streamError);
          }
          
        } catch (clerkError) {
          console.error("Error fetching user from Clerk:", clerkError);
          return res.status(404).json({ message: "User not found" });
        }
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];