import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingDonateButton } from "@/components/ui/floating-donate-button";
import { FooterVisibility } from "@/components/ui/footer-visibility";
import { DonateModalProvider } from "@/lib/donate-modal-context";
import { SettingsProvider } from "@/lib/settings-context";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SettingsProvider>
      <DonateModalProvider>
      <SiteHeader />
      <main>{children}</main>
      <FloatingDonateButton />
      <FooterVisibility>
        <SiteFooter />
      </FooterVisibility>
      </DonateModalProvider>
    </SettingsProvider>
  );
}
