"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/auth/signup`, {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password,
                    confirmPassword: password,
                }),
            });
            if (res.ok) {
                signIn("credentials", {
                    email,
                    password,
                    callbackUrl: "/chat",
                });
            } else {
                throw Error();
            }
        } catch (err: any) {
            console.log(err.message);
            alert(err.message);
        }
    };
    return (
        <div className="main-background h-screen flex flex-col justify-center items-center w-full">
            <form
                className="flex flex-col w-full px-10 sm:w-96"
                method="POST"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col w-full">
                    <label className="text-slate-400 font-bold" htmlFor="email">
                        Email
                    </label>
                    <div className="flex flex-row items-center">
                        <span className="text-orange-400">→</span>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full text-slate-200 bg-transparent focus:outline-none py-2 px-4"
                            placeholder="email@example.com"
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex flex-col mt-4 w-full">
                    <label
                        className="text-slate-400 font-bold"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="flex flex-row items-center">
                        <span className="text-orange-400">→</span>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full text-slate-200 bg-transparent focus:outline-none py-2 px-4"
                            placeholder="password"
                            onChange={(e) => setPassword(e.currentTarget.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col mt-4 w-full">
                    <label
                        className="text-slate-400 font-bold"
                        htmlFor="password"
                    >
                        Confirm Password
                    </label>
                    <div className="flex flex-row items-center">
                        <span className="text-orange-400">→</span>
                        <input
                            type="password"
                            name="confirm-password"
                            id="confirm-password"
                            className="w-full text-slate-200 bg-transparent focus:outline-none py-2 px-4"
                            placeholder="confirm password"
                            onChange={(e) => setPassword(e.currentTarget.value)}
                        />
                    </div>
                </div>

                <button
                    className="w-full bg-orange-500 bg-opacity-40 rounded-lg my-4 text-slate-200 font-semibold py-2 mt-8"
                    type="submit"
                >
                    Sign Up
                </button>
            </form>

            <div className="flex flex-row text-slate-400 gap-2 text-sm mt-4">
                <p>{"Already have an account?"}</p>
                <Link
                    className="text-slate-200 hover:underline"
                    href={"/signin"}
                >
                    Sign In →
                </Link>
            </div>
        </div>
    );
}
