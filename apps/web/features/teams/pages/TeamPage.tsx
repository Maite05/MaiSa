"use client";

import { Button, color, font, Modal, space, StatusPill, Table, tableIconButtonStyle, typography, type TableColumn } from "@maisa/ui";
import { AppShellHeader } from "@/components/AppShellHeader";
import { useLogoutAction } from "../../authentication/actions";
import { useSession } from "../../authentication/store";
import { useTeamActions } from "../actions";
import { InviteMemberForm } from "../components/InviteMemberForm";
import { useMembers, useRemoveMember, useUpdateMemberRole } from "../hooks";
import { getRoleLabel, getRoleTone } from "../services";
import { useTeamUiStore } from "../store";
import type { Member, OrgRole } from "../types";
import { canManageMembers } from "../validators";

const ROLE_OPTIONS: OrgRole[] = ["MEMBER", "PLANNER", "ADMIN", "OWNER"];

export function TeamPage() {
  const session = useSession();
  const logout = useLogoutAction();
  const inviteModalOpen = useTeamUiStore((s) => s.inviteModalOpen);
  const { openInvite, closeInvite } = useTeamActions();

  const { data: members = [], isLoading } = useMembers();
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const currentMember = members.find((m) => m.id === session?.userId);
  const canManage = currentMember ? canManageMembers(currentMember.role) : false;

  const columns: TableColumn<Member>[] = [
    { key: "name", header: "Name", render: (m) => <span style={{ fontWeight: 600 }}>{m.name ?? "—"}</span> },
    { key: "email", header: "Email", render: (m) => m.email },
    {
      key: "role",
      header: "Role",
      render: (m) =>
        canManage ? (
          <select
            value={m.role}
            onChange={(e) => updateRole.mutate({ userId: m.id, role: e.target.value as OrgRole })}
            style={{ fontSize: "13px", padding: "2px 4px", border: `1px solid ${color.borderSubtle}`, borderRadius: "0.125rem" }}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {getRoleLabel(r)}
              </option>
            ))}
          </select>
        ) : (
          <StatusPill label={getRoleLabel(m.role)} tone={getRoleTone(m.role)} />
        ),
    },
  ];

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <AppShellHeader activeNavId="team" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: space(4), gap: space(2), flexWrap: "wrap" }}>
          <div>
            <p style={{ ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) }}>
              {session?.organizationName ?? "Your organization"}
            </p>
            <h1 style={{ ...typography.headlineLg, fontSize: "36px", margin: 0 }}>Team</h1>
          </div>
          <div style={{ display: "flex", gap: space(1.5) }}>
            <Button variant="ghost" onClick={logout}>
              Log Out
            </Button>
            {canManage && <Button onClick={openInvite}>+ Invite Member</Button>}
          </div>
        </div>

        <div style={{ background: color.surfaceContainerLowest, border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}>
          <Table
            columns={columns}
            rows={members}
            getRowId={(m) => m.id}
            loading={isLoading}
            emptyTitle="No teammates yet"
            emptyDescription="Invite teammates to collaborate on events with you."
            rowActions={
              canManage
                ? (m) => (
                    <button
                      style={tableIconButtonStyle}
                      onClick={() => {
                        if (window.confirm(`Remove ${m.name ?? m.email} from the organization?`)) removeMember.mutate(m.id);
                      }}
                    >
                      Remove
                    </button>
                  )
                : undefined
            }
          />
        </div>
      </main>

      <Modal open={inviteModalOpen} onClose={closeInvite} title="Invite Teammate">
        <InviteMemberForm onDone={closeInvite} />
      </Modal>
    </div>
  );
}

export default TeamPage;
