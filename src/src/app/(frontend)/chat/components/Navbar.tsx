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

enum Algorithm {
  KMP,
  BM,
}

export function Navbar() {
  const [isSideNavbarExpanded, setIsSideNavbarExpanded] = useState(false);
  const [algorithm, setAlgorithm] = useState(Algorithm.KMP);
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
        <div className="w-full h-full py-4 px-4 flex flex-col justify-between bg-blur bg-slate-950 lg:bg-slate-400 lg:bg-opacity-10 border-opacity-30 border-l border-t border-l-orange-500 border-t-orange-500 rounded-lg">
          <div className="flex flex-col space-y-4">
            <button
              className="flex lg:hidden w-full justify-end"
              onClick={hideSideNavbar}
            >
              <DoubleArrowLeftIcon style={{ height: 24, width: 24 }} />
            </button>
            <Link
              href={"/chat"}
              className="w-full font-bold bg-slate-950 py-4 px-4 rounded-lg flex flex-row items-center space-x-4"
              onClick={() => hideSideNavbar()}
            >
              <PlusIcon
                style={{ width: 20, height: 20 }}
                stroke="#94a3b8"
                strokeWidth={1}
              />
              <p>New Session</p>
            </Link>
            <ul className="space-y-4 pt-4">
              {dummyHistory.map((history) => {
                return (
                  <Link
                    href={`/chat/${history.id}`}
                    key={history.id}
                    onClick={() => hideSideNavbar()}
                  >
                    <li
                      className={`py-2 px-4 flex flex-row items-center space-x-4 ${
                        params.id == history.id &&
                        "bg-orange-500 bg-opacity-30 text-slate-200"
                      } rounded-lg hover:cursor-pointer mb-4`}
                    >
                      <div className="w-8">
                        <ChatBubbleIcon
                          style={{ width: 24 }}
                          stroke={
                            params.id == history.id ? "#e2e8f0" : "#94a3b8"
                          }
                          strokeWidth={1}
                        />
                      </div>
                      <p className="truncate">{history.question}</p>
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
            </ul>
          </div>

          <div className="relative bg-slate-950 font-bold py-1 px-1 flex flex-row justify-between rounded-lg">
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
