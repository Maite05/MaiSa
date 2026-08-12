"use client";

import { Button, color, font, Modal, space, StatusPill, typography } from "@maisa/ui";
import { useState } from "react";
import { AppShellHeader } from "@/components/AppShellHeader";
import { formatDate } from "../../../lib/format";
import { ChangePlanForm } from "../components/ChangePlanForm";
import { useSubscription } from "../hooks";

export function SubscriptionPage() {
  const { data: subscription, isLoading } = useSubscription();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <AppShellHeader />

      <main style={{ maxWidth: 640, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` }}>
        <p style={{ ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) }}>Billing</p>
        <h1 style={{ ...typography.headlineLg, fontSize: "36px", margin: `0 0 ${space(4)}` }}>Subscription</h1>

        {isLoading || !subscription ? (
          <p style={{ color: color.onSurfaceVariant }}>Loading…</p>
        ) : (
          <div style={{ border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(3) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: space(2) }}>
              <div>
                <p style={{ fontFamily: font.serif, fontSize: "28px", margin: 0 }}>{subscription.plan}</p>
                <p style={{ fontSize: "13px", color: color.onSurfaceVariant, margin: `${space(0.5)} 0 0` }}>
                  {subscription.seats} seats · Renews {formatDate(subscription.renewsAt)}
                </p>
              </div>
              <StatusPill
                label={subscription.status.replace("_", " ")}
                tone={subscription.status === "ACTIVE" ? "success" : subscription.status === "PAST_DUE" ? "warning" : "danger"}
              />
            </div>
            <Button onClick={() => setModalOpen(true)}>Change Plan</Button>
          </div>
        )}
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Change Plan">
        {subscription && <ChangePlanForm current={subscription} onDone={() => setModalOpen(false)} />}
      </Modal>
    </div>
  );
}

export default SubscriptionPage;
