import { SignUp } from '@clerk/clerk-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Join <span className="text-purple-400">ChatLure</span>
          </h1>
          <p className="text-gray-300">
            Create your account and start exploring amazing stories
          </p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-gray-700">
          <SignUp 
            routing="path" 
            path="/signup"
            signInUrl="/login"
            afterSignUpUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent shadow-none",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-300",
                socialButtonsBlockButton: "bg-gray-700 hover:bg-gray-600 text-white border-gray-600",
                formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
                formFieldInput: "bg-gray-700 border-gray-600 text-white",
                formFieldLabel: "text-gray-300",
                dividerLine: "bg-gray-600",
                dividerText: "text-gray-400",
                footerActionLink: "text-purple-400 hover:text-purple-300"
              }
            }}
          />
        </div>
        
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Already have an account? <a href="/login" className="text-purple-400 hover:text-purple-300">Sign in here</a></p>
        </div>
      </div>
    </div>
  );
} 