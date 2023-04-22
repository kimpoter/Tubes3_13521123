"use client";

import { Session } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

interface ISessionContext {
  sessions: Session[];
  currentSession: string | undefined;
  setSessions: (sessions: Session[]) => void;
  setCurrentSession: (session: string | undefined) => void;
}

const SessionContextDefault: ISessionContext = {
  sessions: [],
  currentSession: undefined,
  setSessions: (sessions: Session[]) => {},
  setCurrentSession: (session: string | undefined) => {},
};

const SessionContext = createContext(SessionContextDefault);

export function SessionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const param = useParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<undefined | string>(
    param.id
  );

  return (
    <SessionContext.Provider
      value={{ sessions, setSessions, currentSession, setCurrentSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
