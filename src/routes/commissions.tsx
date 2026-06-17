import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/commissions")({
  head: () => ({ meta: [
    { title: "Commissions — Influencer Dashboard" },
    { name: "description", content: "Pending, approved, paid and bonus commission." },
    { property: "og:title", content: "Commissions" },
    { property: "og:description", content: "Pending, approved, paid and bonus commission." },
  ]}),
  component: () => <StubPage title="Commissions" subtitle="Track everything you have earned — pending, approved, paid and bonus." icon={Wallet}
    sections={["Pending", "Approved", "Paid", "Bonus", "History", "Payout Requests", "Wallet"]} />,
});
