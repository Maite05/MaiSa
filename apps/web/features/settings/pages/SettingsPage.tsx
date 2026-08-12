"use client";

import { Button, color, font, space, Spinner, typography } from "@maisa/ui";
import { AppShellHeader } from "@/components/AppShellHeader";
import { useLogoutAction } from "../../authentication/actions";
import { useSession } from "../../authentication/store";
import { OrganizationProfileForm } from "../components/OrganizationProfileForm";
import { useOrganization } from "../hooks";
import { canEditOrganization } from "../services";

export function SettingsPage() {
  const session = useSession();
  const logout = useLogoutAction();
  const { data: organization, isLoading } = useOrganization(session?.organizationId);

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <AppShellHeader />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: space(4) }}>
          <div>
            <p style={{ ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) }}>Settings</p>
            <h1 style={{ ...typography.headlineLg, fontSize: "36px", margin: 0 }}>Organization Profile</h1>
          </div>
          <Button variant="ghost" onClick={logout}>
            Log Out
          </Button>
        </div>

        {isLoading || !organization ? (
          <Spinner />
        ) : canEditOrganization(organization) ? (
          <OrganizationProfileForm organization={organization} />
        ) : (
          <p style={{ color: color.onSurfaceVariant }}>
            Only Owners and Admins can edit organization settings. You're signed in as {organization.role.toLowerCase()}.
          </p>
        )}
      </main>
    </div>
  );
}

export default SettingsPage;
