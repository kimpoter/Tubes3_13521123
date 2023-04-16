"use client";
import {
  ChatBubbleIcon,
  Cross1Icon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const dummyHistory = [
  {
    id: "1",
    question:
      "Halo, apakah kamu bisa membantu saya dengan masalah komputer saya?",
  },
  {
    id: "2",
    question: "Halo, apakah kamu bisa membantu saya membuat website?",
  },
];

export function Navbar() {
  const [isSideNavbarExpanded, setIsSideNavbarExpanded] = useState(false);
  const sideNavbarRef = useRef<null | HTMLDivElement>(null);
  const doubleArrowRightIconRef = useRef<null | HTMLButtonElement>(null);
  const params = useParams();

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
        className={`lg:block absolute lg:relative max-w-xs h-screen py-4 pl-4 z-20 transition-all ease-in-out duration-200  ${
          isSideNavbarExpanded ? "translate-x-0 " : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="w-full h-full py-4 px-4 space-y-4 flex flex-col bg-blur bg-slate-950 lg:bg-slate-400 bg-opacity-50 lg:bg-opacity-10 border-opacity-30 border-l border-t border-l-orange-500 border-t-orange-500 rounded-lg">
          <button
            className="flex lg:hidden w-full justify-end"
            onClick={hideSideNavbar}
          >
            <DoubleArrowLeftIcon style={{ height: 24, width: 24 }} />
          </button>
          <Link
            href={"/chat"}
            className="w-full font-bold bg-slate-950 py-4 px-4 rounded-lg flex flex-row items-center space-x-4"
          >
            <PlusIcon
              style={{ width: 20, height: 20 }}
              stroke="#94a3b8"
              strokeWidth={1}
            />
            <p>New Session</p>
          </Link>
          <ol className="space-y-4 pt-4">
            {dummyHistory.map((history) => {
              return (
                <Link href={`/chat/${history.id}`} key={history.id}>
                  <li
                    className={`py-2 px-4 flex flex-row items-center space-x-4 ${
                      params.id == history.id &&
                      "bg-orange-500 bg-opacity-30 text-slate-200"
                    } rounded-lg hover:cursor-pointer mb-4`}
                  >
                    <ChatBubbleIcon
                      style={{ width: 100 }}
                      stroke={params.id == history.id ? "#e2e8f0" : "#94a3b8"}
                      strokeWidth={1}
                    />
                    <p className="truncate">
                      what is a proper commit message for adding folder
                      structure in python project with empty files (for
                      template)?
                    </p>
                    {params.id == history.id && (
                      <Cross1Icon
                        style={{ opacity: 0.5, width: 100 }}
                        stroke="#CDD5E0"
                        strokeWidth={1}
                      />
                    )}
                  </li>
                </Link>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
