"use client";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { useSessionContext } from "../../context/SessionContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useRouter } from "next/navigation";

enum Algorithm {
  KMP,
  BM,
}

export default function NavbarLayout({
  children,
}: {
  children: (hideSideNavbar: any) => React.ReactNode;
}) {
  const { algorithm, setAlgorithm } = useSettingsContext();
  const [isSideNavbarExpanded, setIsSideNavbarExpanded] = useState(false);
  const sideNavbarRef = useRef<null | HTMLDivElement>(null);
  const doubleArrowRightIconRef = useRef<null | HTMLButtonElement>(null);
  const { setCurrentSession } = useSessionContext();
  const router = useRouter();

  function showSideNavbar() {
    setIsSideNavbarExpanded(true);
    if (doubleArrowRightIconRef.current != null) {
      doubleArrowRightIconRef.current.style.display = "none";
    }
  }

  function hideSideNavbar() {
    setIsSideNavbarExpanded(false);
    if (doubleArrowRightIconRef.current != null) {
      doubleArrowRightIconRef.current.style.display = "block";
    }
  }
  return (
    <>
      <div className="w-full fixed top-0 z-10 h-32 px-4 py-8 bg-gradient-to-b from-slate-950">
        <button
          ref={doubleArrowRightIconRef}
          className="lg:text-slate-950"
          onClick={showSideNavbar}
        >
          <DoubleArrowRightIcon style={{ height: 24, width: 24 }} />
        </button>
      </div>

      <div
        ref={sideNavbarRef}
        className={`lg:block absolute lg:relative w-80 h-screen py-4 pl-4 z-20 transition-all ease-in-out duration-200  ${
          isSideNavbarExpanded ? "translate-x-0 " : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="w-full h-full py-4 px-4 flex flex-col justify-between bg-blur bg-slate-950 lg:bg-slate-400 lg:bg-opacity-10 border-opacity-30 border-l border-t border-l-orange-500 border-t-orange-500 rounded-lg">
          <div className="w-full flex flex-col space-y-4">
            <button
              className="flex lg:hidden w-full justify-end"
              onClick={hideSideNavbar}
            >
              <DoubleArrowLeftIcon style={{ height: 24, width: 24 }} />
            </button>
            <button
              className="w-full font-bold bg-slate-950 py-4 px-4 rounded-lg flex flex-row items-center space-x-4"
              onClick={() => {
                hideSideNavbar();
                setCurrentSession(undefined);
                router.push("/chat");
              }}
            >
              <PlusIcon
                style={{ width: 20, height: 20 }}
                stroke="#94a3b8"
                strokeWidth={1}
              />
              <p>New Session</p>
            </button>
            {children(hideSideNavbar)}
          </div>

          <div className="w-full relative bg-slate-950 font-bold py-1 px-1 flex flex-row justify-between rounded-lg">
            <button
              className={`py-2 px-2 rounded-lg w-full z-20 ${
                algorithm == Algorithm.KMP && "text-slate-200"
              }`}
              onClick={() => setAlgorithm(Algorithm.KMP)}
            >
              KMP
            </button>
            <button
              className={`py-2 px-2 rounded-lg w-full z-20 ${
                algorithm == Algorithm.BM && "text-slate-200"
              }`}
              onClick={() => setAlgorithm(Algorithm.BM)}
            >
              BM
            </button>
            <div
              className={`absolute w-1/2 py-2 px-2 rounded-lg h-[calc(100%-0.5rem)] 
                            bg-orange-500 bg-opacity-40 text-slate-200 transition-all ease-in-out duration-200
                            ${
                              algorithm == Algorithm.KMP
                                ? " translate-x-0"
                                : " translate-x-[calc(100%-0.5rem)]"
                            }`}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
