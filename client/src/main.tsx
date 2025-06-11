<<<<<<< HEAD
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import App from './App.tsx'
import './index.css'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#7c3aed',
          colorBackground: '#0a0a0a',
          colorInputBackground: '#1a1a1a',
          colorInputText: '#ffffff',
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
=======
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
>>>>>>> origin/main
