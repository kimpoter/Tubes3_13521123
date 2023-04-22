import { ISession, SessionContextProvider } from "./context/SessionContext";
import { SettingsContextProvider } from "./context/SettingsContext";
import React, { Suspense } from "react";
import LoadingNavbar from "./components/Navbar/LoadingNavbar";
import Navbar from "./components/Navbar/Navbar";
export const metadata = {
  title: "ShibAl - Chat",
  description:
    "The next generation ”ChatGPT” like web app created by typescript enjoyers and friends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="main-background relative max-h-screen flex flex-row text-slate-400 scrollbar-hide">
        <SettingsContextProvider>
          <SessionContextProvider>
            <Suspense fallback={<LoadingNavbar />}>
              <Navbar />
            </Suspense>
            <div className="w-full px-4">{children}</div>
          </SessionContextProvider>
        </SettingsContextProvider>
      </body>
    </html>
  );
}
