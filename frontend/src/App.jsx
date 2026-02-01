import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function App() {
  return (
    <>
    <h1>AI Powered Learning Assistant</h1>
    <SignedOut>
      <SignInButton mode='modal'>
        <button>Sign up please</button>
      </SignInButton>
    </SignedOut>
    <SignedIn>
      <SignOutButton />
    </SignedIn>
    <UserButton />
    </>
  )
}

export default App