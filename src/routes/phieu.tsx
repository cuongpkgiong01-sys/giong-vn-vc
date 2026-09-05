import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/phieu")({ component: PhieuLayout });

function PhieuLayout() {
  return <Outlet />;
}
