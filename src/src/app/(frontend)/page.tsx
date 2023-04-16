import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="main-background flex w-screen min-h-screen flex-col items-center justify-between p-24 bg-slate-950"></main>
  );
}
