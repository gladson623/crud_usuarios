import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Usuario } from "./usuarios";

const nomeCookie = "veletric_token";
const validadeSessaoMs = 1000 * 60 * 60 * 24 * 7;
const segredoToken = process.env.AUTH_SECRET || "veletric-segredo-local";

function tokenDoCookie(cookie: string | null) {
  return cookie
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${nomeCookie}=`))
    ?.slice(nomeCookie.length + 1);
}

export function verificarSenha(senha: string, senhaHash: string) {
  const [salt, hashHex] = senhaHash.split(":");
  if (!salt || !hashHex) return false;
  const hashCalculado = scryptSync(senha, salt, 64);
  const hashArmazenado = Buffer.from(hashHex, "hex");
  return hashCalculado.length === hashArmazenado.length && timingSafeEqual(hashCalculado, hashArmazenado);
}

export function criarSessao(usuario: Usuario) {
  const dados = Buffer.from(JSON.stringify({
    usuarioId: usuario.id,
    expiraEm: Date.now() + validadeSessaoMs,
    nonce: randomBytes(16).toString("hex"),
  })).toString("base64url");
  const assinatura = createHmac("sha256", segredoToken).update(dados).digest("base64url");
  return `${dados}.${assinatura}`;
}

export async function usuarioIdDoToken(token: string | undefined) {
  if (!token) return null;
  const [dados, assinatura] = token.split(".");
  if (!dados || !assinatura) return null;

  const assinaturaEsperada = createHmac("sha256", segredoToken).update(dados).digest("base64url");
  const assinaturaRecebida = Buffer.from(assinatura);
  const assinaturaCalculada = Buffer.from(assinaturaEsperada);
  if (assinaturaRecebida.length !== assinaturaCalculada.length || !timingSafeEqual(assinaturaRecebida, assinaturaCalculada)) return null;

  try {
    const sessao = JSON.parse(Buffer.from(dados, "base64url").toString("utf8")) as { usuarioId?: unknown; expiraEm?: unknown };
    return typeof sessao.usuarioId === "string" && typeof sessao.expiraEm === "number" && sessao.expiraEm > Date.now()
      ? sessao.usuarioId
      : null;
  } catch {
    return null;
  }
}

export async function usuarioIdDaRequisicao(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : tokenDoCookie(request.headers.get("cookie"));
  return usuarioIdDoToken(token);
}

export async function exigirAutenticacao(request: Request) {
  if (!(await usuarioIdDaRequisicao(request))) {
    return Response.json({ erro: "Autenticação necessária." }, { status: 401 });
  }
  return null;
}

export async function exigirPaginaAutenticada() {
  const token = (await cookies()).get(nomeCookie)?.value;
  if (!(await usuarioIdDoToken(token))) redirect("/login");
}

export { nomeCookie, validadeSessaoMs };
