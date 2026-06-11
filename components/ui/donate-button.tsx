"use client";

import type { ReactNode } from "react";
import { useDonateModal } from "@/lib/donate-modal-context";

type DonateButtonProps = {
  children?: ReactNode;
  className?: string;
};

export function DonateButton({ children = "Faire un don", className = "btn-primary-lg w-full sm:w-auto" }: DonateButtonProps) {
  const { openDonate } = useDonateModal();

  return (
    <button type="button" onClick={openDonate} className={className}>
      {children}
    </button>
  );
}
