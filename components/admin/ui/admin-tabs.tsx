"use client";

type AdminTab = {
  id: string;
  label: string;
};

type AdminTabsProps = {
  tabs: AdminTab[];
  active: string;
  onChange: (id: string) => void;
};

export function AdminTabs({ tabs, active, onChange }: AdminTabsProps) {
  return (
    <div className="admin-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={active === tab.id ? "admin-tab-active" : "admin-tab"}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
