"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type DonateModalContextValue = {
  isOpen: boolean;
  openDonate: () => void;
  closeDonate: () => void;
};

const DonateModalContext = createContext<DonateModalContextValue>({
  isOpen: false,
  openDonate: () => {},
  closeDonate: () => {},
});

export function DonateModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDonate = useCallback(() => setIsOpen(true), []);
  const closeDonate = useCallback(() => setIsOpen(false), []);

  return (
    <DonateModalContext.Provider value={{ isOpen, openDonate, closeDonate }}>
      {children}
    </DonateModalContext.Provider>
  );
}

export function useDonateModal(): DonateModalContextValue {
  return useContext(DonateModalContext);
}
