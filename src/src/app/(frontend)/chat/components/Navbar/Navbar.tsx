"use client";
import { ChatBubbleIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSessionContext } from "../../context/SessionContext";
import NavbarLayout from "./NavbarLayout";
import LoadingNavbar from "./LoadingNavbar";
import { useRouter } from "next/navigation";
import { Session } from "@prisma/client";

async function getSessions(): Promise<Session[]> {
  const res = await fetch(`/api/sessions`);
  if (res.ok) {
    const data = await res.json();

    return data.data;
  }

  return [];
}

export default function Navbar() {
  const { sessions, setSessions, currentSession, setCurrentSession } =
    useSessionContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSessions()
      .then((data) => {
        console.log(data);
        setSessions(data);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  /**
   * delete session with id
   *
   * @param id session id
   */
  async function deleteSession(id: number) {
    const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    setSessions(sessions.filter((session) => session.id != id));
    setCurrentSession(undefined);
    router.push(`/chat/new chat ${Math.ceil(Math.random() * 1000 + 1)}`);

    if (!res.ok) {
      console.log(await res.json());
    }
  }

  if (loading) {
    return <LoadingNavbar />;
  }

  return (
    <NavbarLayout>
      {(hideSideNavbar) => (
        <ul className="w-full flex-grow space-y-4 pt-4 overflow-scroll scrollbar-hide">
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
                  <p className="truncate w-full flex-grow">{session.name}</p>
                  {currentSession == session.id.toString() && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteSession(session.id);
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
