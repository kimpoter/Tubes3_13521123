"use client";

import { useParams } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

export interface ISession {
  id: number;
  name: string;
}

interface ISessionContext {
  sessions: ISession[];
  currentSession: string | undefined;
  setSessions: (sessions: ISession[]) => void;
  setCurrentSession: (session: string | undefined) => void;
}

const SessionContextDefault: ISessionContext = {
  sessions: [],
  currentSession: undefined,
  setSessions: (sessions: ISession[]) => {},
  setCurrentSession: (session: string | undefined) => {},
};

const SessionContext = createContext(SessionContextDefault);

export function SessionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const param = useParams();
  const [sessions, setSessions] = useState<ISession[]>([]);
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
