import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import cors from "cors"
import { serve } from "inngest/express"
import { inngest, functions } from "./lib/inngest.js";

// 1. RECREATE __dirname FOR ES MODULES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(express.json());
// credentials: true meaning?? => server alloes a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true}));

app.use("/api/inngest", serve({client: inngest, functions}));

app.get("/health", (req, res) => {
    res.status(200).json({msg : "api is up and running"});
})

app.get("/books", (req, res) => {
    res.status(200).json({msg : "this is the books endpoint"});
})

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
    // 2. PATH FIX: Go up 2 levels (../../) to escape 'src' and 'backend'
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));

    // 3. EXPRESS 5 FIX: Use '*splat' for the wildcard
    app.get("*splat", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
    })
}

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => console.log(`server is running on port: ${ENV.PORT}`));
    } catch (error) {
        console.error(`Error starting the server: ${error}`);
    }
}

startServer();