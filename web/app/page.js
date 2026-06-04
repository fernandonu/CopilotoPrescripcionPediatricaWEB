"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("/api/prescribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al procesar la consulta.");
      }

      setResponse(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Copiloto Pediátrico</h1>
        <p className={styles.subtitle}>
          Asistencia rápida y segura para la prescripción farmacoterapéutica
        </p>
      </div>

      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <textarea
              className={styles.textarea}
              placeholder="Aca van los datos de la HC&#10;(Presiona Enter para enviar, Shift+Enter para nueva línea)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !loading) {
                    handleSubmit(e);
                  }
                }
              }}
              disabled={loading}
            />
            <button type="submit" className={styles.button} disabled={loading || !input.trim()}>
              {loading ? "Consultando..." : "Consultar"}
            </button>
          </div>
        </form>

        {loading && (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {error && (
          <div className={styles.result} style={{ color: "#ef4444" }}>
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className={styles.result}>
            <h3>Resultados de la Prescripción</h3>
            <div className={styles.content}>
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
