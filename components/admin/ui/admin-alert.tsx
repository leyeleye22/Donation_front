type AdminAlertProps = {
  tone?: "success" | "error" | "info";
  children: React.ReactNode;
};

const tones = {
  success: "admin-alert-success",
  error: "admin-alert-error",
  info: "admin-alert-info",
};

export function AdminAlert({ tone = "info", children }: AdminAlertProps) {
  return <div className={tones[tone]}>{children}</div>;
}
