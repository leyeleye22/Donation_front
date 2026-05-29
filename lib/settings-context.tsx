"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadGlobalSettings, type GlobalSettings, defaultGlobalSettings } from "@/lib/admin/global-settings";

const SettingsContext = createContext<GlobalSettings>(defaultGlobalSettings);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GlobalSettings>(defaultGlobalSettings);

  useEffect(() => {
    loadGlobalSettings().then(setSettings).catch(console.error);
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings(): GlobalSettings {
  return useContext(SettingsContext);
}
