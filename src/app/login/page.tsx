"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setCarregando(true);
    const dados = new FormData(event.currentTarget);
    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: dados.get("email"), senha: dados.get("password") }),
      });
      if (!resposta.ok) {
        const retorno = await resposta.json() as { erro?: string };
        throw new Error(retorno.erro || "Não foi possível entrar.");
      }
      router.replace("/dashboard");
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível entrar.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-story">
        <a className="brand" href="/login" aria-label="Veletric, início">
          <span className="brand-mark" aria-hidden="true">v.</span>
          <span>Veletric</span>
        </a>
        <div className="story-copy">
          <span className="story-kicker">Gestão sem complicação</span>
          <h1>Seu estoque, em equilíbrio.</h1>
          <p>Acompanhe produtos, níveis de estoque e movimentações em um só lugar.</p>
        </div>
        <span className="story-footer">Veletric · Painel de gestão</span>
      </section>

      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Boas-vindas</h2>
          <p className="form-intro">Entre para acessar seu painel.</p>
          <label className="form-field">
            <span className="field-label">E-mail</span>
            <input
              type="email"
              name="email"
              placeholder="voce@empresa.com.br"
              autoComplete="email"
              required
            />
          </label>
          <label className="form-field">
            <span className="field-label">Senha</span>
            <input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </label>
          {erro && <p className="form-error" role="alert">{erro}</p>}
          <button className="primary-button" type="submit" disabled={carregando}>{carregando ? "Entrando..." : "Entrar no painel"}</button>
        </form>
      </section>
    </main>
  );
}
