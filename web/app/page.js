"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";
import {
  AGENT_INSTRUCTIONS,
  CLINICAL_EXAMPLES,
  INTEGRATION_TEXT,
  DATA_SOURCES_TEXT
} from "./constants";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("sources");

  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/prescribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Ocurrió un error al procesar la consulta.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkValue = decoder.decode(value);
          accumulatedText += chunkValue;
          setResponse(accumulatedText);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCase = (text) => {
    setInput(text);
    setIsModalOpen(false);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Copiloto Pediátrico</h1>
        <p className={styles.subtitle}>
          Asistencia rápida y segura para la prescripción pediátrica farmacoterapéutica.
        </p>
      </div>

      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Para simular cargar datos de la HC. (Presiona Enter para enviar, Shift+Enter para nueva línea)"
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

      {/* Floating Action Button (FAB) */}
      <button
        className={styles.fab}
        onClick={() => setIsModalOpen(true)}
        title="Ver Comportamiento e Historias Clínicas de Ejemplo"
        aria-label="Información y ejemplos"
      >
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.fabIcon}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <line x1="12" y1="7" x2="12" y2="13"></line>
          <line x1="9" y1="10" x2="15" y2="10"></line>
        </svg>
      </button>

      {/* Floating Modal Form */}
      {isModalOpen && (
        <div className={styles.overlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Guía del Asistente Pediátrico</h2>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>

            <div className={styles.tabs}>
              <button
                className={`${styles.tabButton} ${activeTab === "sources" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("sources")}
              >
                Fuentes de Información
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "instructions" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("instructions")}
              >
                Comportamiento (Instrucciones)
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "examples" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("examples")}
              >
                Casos de Ejemplo (HC)
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "integration" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("integration")}
              >
                Integración HCE Garrahan
              </button>
            </div>

            <div className={styles.modalBody}>
              {activeTab === "instructions" && (
                <div className={styles.instructionsText}>
                  <ReactMarkdown>{AGENT_INSTRUCTIONS}</ReactMarkdown>
                </div>
              )}
              {activeTab === "examples" && (
                <div className={styles.examplesContainer}>
                  {CLINICAL_EXAMPLES.map((example) => (
                    <div key={example.id} className={styles.exampleCard}>
                      <h3 className={styles.exampleTitle}>{example.title}</h3>
                      <p className={styles.exampleSummary}>{example.summary}</p>
                      <div className={styles.examplePreview}>
                        {example.text}
                      </div>
                      <button
                        className={styles.loadButton}
                        onClick={() => handleLoadCase(example.text)}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 11 12 14 22 4"></polyline>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                        Cargar en Formulario
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "integration" && (
                <div className={styles.instructionsText}>
                  <ReactMarkdown>{INTEGRATION_TEXT}</ReactMarkdown>
                </div>
              )}
              {activeTab === "sources" && (
                <div className={styles.instructionsText}>
                  <ReactMarkdown>{DATA_SOURCES_TEXT}</ReactMarkdown>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.closeModalBtn} onClick={() => setIsModalOpen(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
