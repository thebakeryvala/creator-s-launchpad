import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [
    { title: "Sales — Influencer Dashboard" },
    { name: "description", content: "Orders, revenue, customers and conversions." },
    { property: "og:title", content: "Sales" },
    { property: "og:description", content: "Orders, revenue, customers and conversions." },
  ]}),
  component: () => <StubPage title="Sales" subtitle="Orders, revenue, customers, conversions and top-selling products." icon={ShoppingBag}
    sections={["Orders", "Revenue", "Customers", "Conversions", "Top Products", "Analytics"]} />,
});
