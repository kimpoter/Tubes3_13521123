"use client";

import React, { createContext, useContext, useState } from "react";

interface ISettingsContext {
  algorithm: "KMP" | "BM";
  setAlgorithm: (algorithm: "KMP" | "BM") => void;
}

const SettingsContextDefault: ISettingsContext = {
  algorithm: "KMP",
  setAlgorithm: (algorithm: "KMP" | "BM") => {},
};

const SettingsContext = createContext(SettingsContextDefault);

export function SettingsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [algorithm, setAlgorithm] = useState<"KMP" | "BM">("KMP");

  return (
    <SettingsContext.Provider value={{ algorithm, setAlgorithm }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}
