"use client";

import React, { createContext, useContext, useState } from "react";

export enum Algorithm {
  KMP,
  BM,
}

interface ISettingsContext {
  algorithm: Algorithm;
  setAlgorithm: (algorithm: Algorithm) => void;
}

const SettingsContextDefault: ISettingsContext = {
  algorithm: Algorithm.KMP,
  setAlgorithm: (algorithm: Algorithm) => {},
};

const SettingsContext = createContext(SettingsContextDefault);

export function SettingsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.KMP);

  return (
    <SettingsContext.Provider value={{ algorithm, setAlgorithm }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}
