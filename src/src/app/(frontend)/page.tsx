"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="main-background relative flex w-screen min-h-screen overflow-hidden flex-col items-center justify-between p-24 bg-slate-950">
      <div className="flex flex-col items-center text-slate-400 text-center w-screen px-8 lg:w-[700px] z-20">
        <h1 className="font-bold text-4xl sm:text-6xl text-slate-200 ">
          {`The next generation 'ChatGPT' like web app`}
        </h1>
        <p className="italic mb-4 mt-4">{`created by typescript enjoyers and friends`}</p>
        <Link
          href={"/chat"}
          className="special-button hover:animate-pulse my-8 bg-slate-950 py-3 w-full sm:w-[400px] font-bold text-slate-200 rounded-lg"
        >
          TRY NOW →
        </Link>
      </div>
      <div className="fixed -bottom-1/3 md:-bottom-1/2 flex flex-col z-10 justify-cente items-center -space-y-6 sm:-space-y-10">
        <div className="relative z-10 w-32 sm:w-48 h-32 sm:h-48">
          <Image
            src={"/shiba.png"}
            alt="shiba-ai-logo"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <Image
          src={"/earth-illust.png"}
          alt="earth"
          width={680}
          height={680}
          className="animate-spin-slow rounded-full"
        />
      </div>
      <Image
        src={"/star-bg.png"}
        alt="star-bg"
        fill
        style={{ objectFit: "cover" }}
        className="absolute top-0 left-0 bg-blend-screen mix-blend-screen"
      />
    </main>
  );
}
