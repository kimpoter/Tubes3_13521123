"use client";
import {
  DotsHorizontalIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  ExitIcon,
  GitHubLogoIcon,
  PlusIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import React, { useRef, useState } from "react";
import { useSessionContext } from "../../context/SessionContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

function NavbarMenu({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`absolute bottom-12 ${
        isOpen
          ? "translate-y-0 opacity-100 z-50"
          : "translate-y-[200%] opacity-0 -z-50"
      } transition-all ease-in-out delay-0 w-full bg-slate-950 py-1 px-1 rounded-lg divide-y divide-slate-800 border-slate-800 border sm:border-none`}
    >
      <Link
        href={"https://github.com/sozyGithub/Tubes3_13521123"}
        className="w-full flex flex-row items-center space-x-4 hover:bg-slate-900 py-4 px-3 rounded-lg"
      >
        <GitHubLogoIcon style={{ width: 16, height: 16 }} />
        <p>See Project</p>
      </Link>
      <button
        className="w-full flex flex-row items-center space-x-4 hover:bg-slate-900 py-4 px-3 rounded-lg"
        onClick={() => signOut()}
      >
        <ExitIcon style={{ width: 16, height: 16 }} />
        <p>Sign Out</p>
      </button>
    </div>
  );
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
  const { currentSession, setCurrentSession } = useSessionContext();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function showSideNavbar() {
    setIsSideNavbarExpanded(true);
    if (doubleArrowRightIconRef.current != null) {
      doubleArrowRightIconRef.current.style.display = "none";
    }
  }

  function hideSideNavbar() {
    setIsSideNavbarExpanded(false);
    setIsOpen(false);
    if (doubleArrowRightIconRef.current != null) {
      doubleArrowRightIconRef.current.style.display = "block";
    }
  }
  return (
    <>
      <div className="w-full fixed top-0 z-10 h-32 px-4 py-8 bg-gradient-to-b from-slate-950 flex justify-between items-center">
        <button
          ref={doubleArrowRightIconRef}
          className="lg:text-slate-950"
          onClick={showSideNavbar}
        >
          <DoubleArrowRightIcon style={{ height: 24, width: 24 }} />
        </button>
        <Link
          href={
            "https://github.com/sozyGithub/Tubes3_13521123/blob/main/README.md"
          }
          target="_blank"
          className="lg:mr-10"
        >
          <QuestionMarkCircledIcon style={{ height: 24, width: 24 }} />
        </Link>
      </div>

      <div
        ref={sideNavbarRef}
        className={`lg:block absolute lg:relative w-full sm:w-96 h-screen py-4 px-4 sm:pl-4 z-20 transition-all ease-in-out duration-200  ${
          isSideNavbarExpanded ? "translate-x-0 " : "-translate-x-full"
        } lg:translate-x-0 overflow-y-hidden`}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(false);
        }}
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
                if (currentSession != undefined) {
                  router.push(
                    `/chat/new chat ${Math.ceil(Math.random() * 1000 + 1)}`
                  );
                  setCurrentSession(undefined);
                }
              }}
            >
              <PlusIcon
                style={{ width: 20, height: 20 }}
                stroke="#94a3b8"
                strokeWidth={1}
              />
              <p>New Session</p>
            </button>
          </div>
          {children(hideSideNavbar)}

          <div className="w-full space-y-2">
            <div className="w-full relative bg-slate-950 font-bold py-1 px-1 flex flex-row justify-between rounded-lg">
              <button
                className={`py-2 px-2 rounded-lg w-full z-20 ${
                  algorithm == "KMP" && "text-slate-200"
                }`}
                onClick={() => setAlgorithm("KMP")}
              >
                KMP
              </button>
              <button
                className={`py-2 px-2 rounded-lg w-full z-20 ${
                  algorithm == "BM" && "text-slate-200"
                }`}
                onClick={() => setAlgorithm("BM")}
              >
                BM
              </button>
              <div
                className={`absolute w-1/2 py-2 px-2 rounded-lg h-[calc(100%-0.5rem)] 
                            bg-orange-500 bg-opacity-40 text-slate-200 transition-all ease-in-out duration-200
                            ${
                              algorithm == "KMP"
                                ? " translate-x-0"
                                : " translate-x-[calc(100%-0.5rem)]"
                            }`}
              />
            </div>

            <div
              className={`${
                isOpen && "bg-blur"
              } relative w-full flex justify-end z-20 py-2 hover:cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              <DotsHorizontalIcon
                style={{ width: 20, height: 20, marginRight: "0.5rem" }}
              />
              <NavbarMenu isOpen={isOpen} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
