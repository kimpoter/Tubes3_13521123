import { SessionContextProvider } from "./context/SessionContext";
import { SettingsContextProvider } from "./context/SettingsContext";
import React from "react";
import Navbar from "./components/Navbar/Navbar";
export const metadata = {
  title: "ShibAl - Chat",
  description:
    "The next generation ”ChatGPT” like web app created by typescript enjoyers and friends.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="main-background relative max-h-screen flex flex-row text-slate-400 scrollbar-hide">
        <SettingsContextProvider>
          <SessionContextProvider>
            <Navbar />
            <div className="w-full px-4">{children}</div>
          </SessionContextProvider>
        </SettingsContextProvider>
      </body>
    </html>
  );
}
