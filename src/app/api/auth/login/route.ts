import { NextResponse } from "next/server";

import { criarSessao, nomeCookie, validadeSessaoMs, verificarSenha } from "../../../../lib/auth";
import { lerUsuarios } from "../../../../lib/usuarios";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: unknown; senha?: unknown };
  try {
    body = await request.json() as { email?: unknown; senha?: unknown };
  } catch {
    return Response.json({ erro: "Corpo da requisição inválido." }, { status: 400 });
  }

  if (typeof body.email !== "string" || typeof body.senha !== "string") {
    return Response.json({ erro: "Informe e-mail e senha." }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const usuario = (await lerUsuarios()).find((item) => item.email.toLowerCase() === email);
  if (!usuario || !verificarSenha(body.senha, usuario.senhaHash)) {
    return Response.json({ erro: "E-mail ou senha inválidos." }, { status: 401 });
  }

  const token = criarSessao(usuario);
  const resposta = NextResponse.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  resposta.cookies.set({
    name: nomeCookie,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: validadeSessaoMs / 1000,
  });
  return resposta;
}
