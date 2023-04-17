"use client";

import Image from "next/image";
import Link from "next/link";

function Home() {
  return (
    <main className="main-background relative flex w-screen min-h-screen flex-col items-center justify-between p-24 bg-slate-950">
      <div className="flex flex-col items-center text-slate-400 text-center w-96 z-20">
        <h1 className="font-bold text-4xl">SHIBAl</h1>
        <p className="italic mb-4 mt-10">{`“The next generation ‘ChatGPT’ like web app created by typescript enjoyers and friends.”`}</p>
        <p className="font-bold">-- Sozy, 2023</p>
        <Link
          href={"/chat"}
          className="special-button hover:animate-pulse my-10 bg-slate-950 w-64 py-2 font-bold text-slate-200 rounded-lg"
        >
          TRY NOW →
        </Link>
      </div>
      <div className="fixed -bottom-56 flex flex-col z-20 justify-cente items-center -space-y-10">
        <div className="z-10">
          <Image
            src={"/shiba.png"}
            alt="shiba-ai-logo"
            width={200}
            height={200}
          />
        </div>
        <Image
          src={"/earth.png"}
          alt="earth"
          width={600}
          height={600}
          className="animate-spin-slow"
        />
      </div>
      <Image
        src={"/element-left.png"}
        alt="element"
        width={560}
        height={560}
        className="fixed left-0 top-0"
      />
      <Image
        src={"/element-right.png"}
        alt="element"
        width={560}
        height={560}
        className="fixed right-0 top-0"
      />
    </main>
  );
}

export default Home;
