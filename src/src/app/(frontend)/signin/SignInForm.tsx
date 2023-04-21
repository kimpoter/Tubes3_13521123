"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signIn("credentials", {
      email,
      password,
      callbackUrl: "/chat",
    });
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center w-full">
      <form className="flex flex-col" method="POST" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className="text-zinc-500"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="text-zinc-500"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>

        <button
          className="w-full bg-zinc-200 rounded-md my-4 text-zinc-500 font-semibold py-2"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
