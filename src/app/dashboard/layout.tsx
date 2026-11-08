import type { ReactNode } from "react";

import { exigirPaginaAutenticada } from "../../lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await exigirPaginaAutenticada();
  return children;
}
