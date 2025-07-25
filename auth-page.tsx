
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { signUpWithPassword, SignUpWithPasswordInput } from "@/ai/flows/auth-flow";
import { User, Lock, Briefcase } from "lucide-react";
import { AlertCircle } from "lucide-react";

const Logo = ({ className }: { className?: string }) => (
    <svg
      width="80"
      height="80"
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        d="M35.208 17.062C35.208 16.125 35.083 15.25 34.791 14.5C34.5 13.687 34.083 12.937 33.5 12.25C32.916 11.562 32.208 11 31.375 10.562C30.541 10.125 29.583 9.875 28.5 9.875C27.083 9.875 25.875 10.312 24.875 11.187C23.875 12.062 23.375 13.25 23.375 14.75V15.5H17.875C16.812 15.5 15.875 15.25 15.062 14.75C14.25 14.25 13.562 13.562 13 12.75C12.437 11.937 12.125 10.937 12.125 9.75C12.125 8.437 12.562 7.25 13.437 6.187C14.312 5.125 15.5 4.5 16.875 4.5C18.125 4.5 19.25 4.812 20.25 5.437C21.25 6.062 22 6.875 22.5 7.875H27.5C26.937 5.875 25.75 4.25 23.937 3C22.125 1.75 20.062 1.125 17.75 1.125C15.812 1.125 14.062 1.562 12.5 2.437C10.937 3.312 9.625 4.562 8.562 6.187C7.5 7.812 7 9.625 7 11.625C7 13.312 7.375 14.812 8.125 16.125C8.875 17.437 9.875 18.5 11.125 19.312V19.5C10.125 20.125 9.312 20.937 8.687 21.937C8.062 22.937 7.75 24.062 7.75 25.312C7.75 27.062 8.25 28.625 9.25 30C10.25 31.375 11.562 32.375 13.187 33L13.5 33.125H13.625C14.125 33.625 14.75 34.062 15.5 34.437C16.25 34.812 17.062 35 18 35H18.125C19.687 35 21.062 29.875 21.25 29.625V29.5C21.812 28.562 22.125 27.5 22.125 26.312C22.125 24.812 21.687 23.5 20.812 22.375C20 21.25 18.75 20.5 17.125 20.5H16V18H23.375V25.25C23.375 26.812 23.812 28.125 24.687 29.187C25.562 30.25 26.75 30.75 28.25 30.75C29.437 30.75 30.5 30.437 31.437 29.812C32.375 29.187 33.062 28.312 33.5 27.187C33.937 26.062 34.125 24.75 34.125 23.25C34.125 21.625 33.687 20.25 32.812 19.125C31.937 18 30.75 17.312 29.25 17.187V17.062H35.208Z"
        fill="url(#paint0_linear_logo)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_logo"
          x1="21.5"
          y1="0"
          x2="21.5"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A11CB" />
          <stop offset="1" stopColor="#2575FC" />
        </linearGradient>
      </defs>
    </svg>
);


export function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    // Mock sign-in
    setTimeout(() => {
      router.push("/home");
      setLoading(false);
    }, 1000);
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const input: SignUpWithPasswordInput = {
      fullName: formData.get("fullname") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const result = await signUpWithPassword(input);
      if (result.success) {
        console.log("Sign up successful:", result.userId);
        router.push("/home");
      } else {
        setError(result.message);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
        {icon}
      </div>
      <Input
        {...props}
        className="pl-12 py-6 text-md bg-transparent border-none rounded-full soft-shadow-inset focus:ring-0 focus:ring-offset-0"
      />
    </div>
  );

  return (
    <Card className="w-full max-w-sm mx-auto shadow-none rounded-3xl border-none bg-card p-2">
        <CardContent className="p-8 text-center flex flex-col items-center">
            <Logo />
            <h2 className="text-3xl font-bold mt-6 text-gray-800">Progpt</h2>
            <p className="text-muted-foreground mt-1 mb-8">
                Your Personal AI Assistant
            </p>
            
            {error && (
              <div className="mb-4 w-full flex items-center space-x-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}

            <form className="space-y-6 w-full" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                {isSignUp && (
                  <InputField
                    icon={<Briefcase className="w-5 h-5" />}
                    name="fullname"
                    type="text"
                    placeholder="Full Name"
                    required
                  />
                )}
                <InputField
                  icon={<User className="w-5 h-5" />}
                  name="email"
                  type="email"
                  placeholder="username"
                  required
                />
                <InputField
                  icon={<Lock className="w-5 h-5" />}
                  name="password"
                  type="password"
                  placeholder="password"
                  required
                />
                
                <Button type="submit" className="w-full !rounded-full !py-6 !text-lg font-bold soft-shadow soft-shadow-press" size="lg" disabled={loading}>
                  {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Login")}
                </Button>
            </form>

            <div className="mt-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                Forgot password?
              </a>
              <span className="mx-2 text-gray-400">or</span>
              <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="text-gray-500 hover:text-primary font-semibold transition-colors">
                {isSignUp ? "Login" : "Sign Up"}
              </button>
            </div>
        </CardContent>
    </Card>
  );
}
