"use client";
import { ChatBubbleIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ISession, useSessionContext } from "../../context/SessionContext";
import NavbarLayout from "./NavbarLayout";
import LoadingNavbar from "./LoadingNavbar";
import { useRouter } from "next/navigation";

const dummysession = [
  {
    id: 1,
    name: "Halo, apakah kamu bisa membantu saya dengan masalah komputer saya?",
  },
  {
    id: 2,
    name: "Halo, apakah kamu bisa membantu saya membuat website?",
  },
];

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function getSessions(): Promise<ISession[]> {
  return delay(2000).then(() => dummysession);
}

export default function Navbar() {
  const { sessions, setSessions, currentSession, setCurrentSession } =
    useSessionContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSessions()
      .then((value) => {
        setSessions(value);
      })
      .finally(() => setLoading(false));
  }, []);

  function deleteSession() {
    setSessions(
      sessions.filter((session) => session.id.toString() != currentSession)
    );
    setCurrentSession(undefined);
    router.push("/chat");
  }

  if (loading) {
    return <LoadingNavbar />;
  }

  return (
    <NavbarLayout>
      {(hideSideNavbar) => (
        <ul className="w-64 space-y-4 pt-4">
          {sessions.map((session) => {
            return (
              <Link
                href={`chat/` + session.id.toString()}
                key={session.id}
                onClick={() => {
                  hideSideNavbar();
                  setCurrentSession(session.id.toString());
                }}
              >
                <li
                  className={`py-2 px-4 flex flex-row items-center space-x-4 ${
                    currentSession == session.id.toString() &&
                    "bg-orange-500 bg-opacity-30 text-slate-200"
                  } rounded-lg hover:cursor-pointer mb-4`}
                >
                  <div className="w-8">
                    <ChatBubbleIcon
                      style={{ width: 24 }}
                      stroke={
                        currentSession == session.id.toString()
                          ? "#e2e8f0"
                          : "#94a3b8"
                      }
                      strokeWidth={1}
                    />
                  </div>
                  <p className="truncate animate-typing w-full flex-grow">
                    {session.name}
                  </p>
                  {currentSession == session.id.toString() && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteSession();
                      }}
                    >
                      <Cross1Icon
                        style={{ opacity: 0.5, width: 32 }}
                        stroke="#CDD5E0"
                        strokeWidth={1}
                      />
                    </button>
                  )}
                </li>
              </Link>
            );
          })}
        </ul>
      )}
    </NavbarLayout>
  );
}
