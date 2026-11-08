import { lerUsuarios } from "../../lib/usuarios";
import { exigirPaginaAutenticada } from "../../lib/auth";

export default async function UsuariosLayout({ children }: LayoutProps<"/usuarios">) {
  if ((await lerUsuarios()).length > 0) await exigirPaginaAutenticada();
  return children;
}
