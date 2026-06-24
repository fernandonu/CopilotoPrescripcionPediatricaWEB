"use client";

import { useState, useRef, useEffect } from "react";
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
  const [instructions, setInstructions] = useState(AGENT_INSTRUCTIONS);
  const [instructionsEditMode, setInstructionsEditMode] = useState(false);
  const [savingInstructions, setSavingInstructions] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [examples, setExamples] = useState(CLINICAL_EXAMPLES);
  const [examplesEditMode, setExamplesEditMode] = useState(false);
  const [savingExamples, setSavingExamples] = useState(false);
  const [saveExamplesStatus, setSaveExamplesStatus] = useState(null);

  const [suggestedPrescription, setSuggestedPrescription] = useState("");
  const [isPrescModalOpen, setIsPrescModalOpen] = useState(false);

  useEffect(() => {
    async function fetchInstructions() {
      try {
        const res = await fetch("/api/instructions");
        if (res.ok) {
          const data = await res.json();
          setInstructions(data.instructions);
        }
      } catch (err) {
        console.error("Error loading instructions:", err);
      }
    }
    async function fetchExamples() {
      try {
        const res = await fetch("/api/examples");
        if (res.ok) {
          const data = await res.json();
          setExamples(data.examples);
        }
      } catch (err) {
        console.error("Error loading examples:", err);
      }
    }
    fetchInstructions();
    fetchExamples();
  }, []);

  const handleSaveInstructions = async () => {
    setSavingInstructions(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/instructions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions }),
      });
      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(null), 3000);
        // Recargar el historial si estaba abierto
        if (showHistory) fetchHistory();
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      console.error("Error saving instructions:", err);
      setSaveStatus("error");
    } finally {
      setSavingInstructions(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/instructions/history");
      if (res.ok) {
        const data = await res.json();
        setHistoryData(data.history || []);
      }
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleToggleHistory = () => {
    if (!showHistory) {
      fetchHistory();
    }
    setShowHistory(!showHistory);
    setInstructionsEditMode(false);
  };

  const handleSaveExamples = async () => {
    setSavingExamples(true);
    setSaveExamplesStatus(null);
    try {
      const res = await fetch("/api/examples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examples }),
      });
      if (res.ok) {
        setSaveExamplesStatus("success");
        setTimeout(() => setSaveExamplesStatus(null), 3000);
      } else {
        setSaveExamplesStatus("error");
      }
    } catch (err) {
      console.error("Error saving examples:", err);
      setSaveExamplesStatus("error");
    } finally {
      setSavingExamples(false);
    }
  };

  const textareaRef = useRef(null);

  const handleConsultarClick = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setIsPrescModalOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setIsPrescModalOpen(false);
    setLoading(true);
    setError("");
    setResponse("");

    let finalInput = input;
    if (suggestedPrescription.trim()) {
      finalInput += "\n\nprescripcion actual que  realiza el medico: " + suggestedPrescription.trim();
    }

    try {
      const res = await fetch("/api/prescribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: finalInput }),
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
    setSuggestedPrescription("");
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
        <h1 className={styles.title}>Copiloto Pediátrico de Prescripción</h1>
        <p className={styles.subtitle}>
          Asistencia rápida y segura para la prescripción pediátrica farmacoterapéutica.
        </p>
      </div>

      <div className={styles.container}>
        <form onSubmit={handleConsultarClick} className={styles.form}>
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
                    handleConsultarClick(e);
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
                <div className={styles.instructionsContainer}>
                  <div className={styles.instructionsHeader}>
                    <div className={styles.instructionsToggle}>
                      <button
                        className={`${styles.toggleBtn} ${!instructionsEditMode ? styles.activeToggle : ""}`}
                        onClick={() => setInstructionsEditMode(false)}
                      >
                        Vista Previa
                      </button>
                      <button
                        className={`${styles.toggleBtn} ${instructionsEditMode ? styles.activeToggle : ""}`}
                        onClick={() => {
                          setInstructionsEditMode(true);
                          setShowHistory(false);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className={`${styles.toggleBtn} ${showHistory ? styles.activeToggle : ""}`}
                        onClick={handleToggleHistory}
                      >
                        Ver Historial
                      </button>
                    </div>
                    {instructionsEditMode && (
                      <button
                        className={styles.saveInstructionsBtn}
                        onClick={handleSaveInstructions}
                        disabled={savingInstructions}
                      >
                        {savingInstructions ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    )}
                  </div>

                  {saveStatus === "success" && (
                    <div className={styles.saveStatusSuccess}>
                      ¡Instrucciones guardadas con éxito!
                    </div>
                  )}
                  {saveStatus === "error" && (
                    <div className={styles.saveStatusError}>
                      Error al guardar las instrucciones. Inténtalo nuevamente.
                    </div>
                  )}

                  {showHistory ? (
                    <div className={styles.historyContainer}>
                      <h3 className={styles.historyTitle}>Historial de Versiones</h3>
                      {loadingHistory ? (
                        <p>Cargando historial...</p>
                      ) : historyData.length === 0 ? (
                        <p>No hay versiones anteriores.</p>
                      ) : (
                        <div className={styles.historyTimeline}>
                          {historyData.map((item) => (
                            <div key={item.id} className={styles.historyCard}>
                              <div className={styles.historyDate}>
                                {new Date(item.createdAt).toLocaleString()}
                              </div>
                              <div className={styles.historyText}>
                                <ReactMarkdown>{item.content}</ReactMarkdown>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : instructionsEditMode ? (
                    <textarea
                      className={styles.instructionsEditor}
                      value={instructions}
                      onChange={(e) => {
                        setInstructions(e.target.value);
                        if (saveStatus) setSaveStatus(null);
                      }}
                      placeholder="Escribe las instrucciones del agente aquí..."
                    />
                  ) : (
                    <div className={styles.instructionsText}>
                      <ReactMarkdown>{instructions}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "examples" && (
                <div className={styles.examplesContainer}>
                  <div className={styles.instructionsHeader}>
                    <div className={styles.instructionsToggle}>
                      <button
                        className={`${styles.toggleBtn} ${!examplesEditMode ? styles.activeToggle : ""}`}
                        onClick={() => setExamplesEditMode(false)}
                      >
                        Vista Previa
                      </button>
                      <button
                        className={`${styles.toggleBtn} ${examplesEditMode ? styles.activeToggle : ""}`}
                        onClick={() => setExamplesEditMode(true)}
                      >
                        Editar Casos
                      </button>
                    </div>
                    {examplesEditMode && (
                      <button
                        className={styles.saveInstructionsBtn}
                        onClick={handleSaveExamples}
                        disabled={savingExamples}
                      >
                        {savingExamples ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    )}
                  </div>

                  {saveExamplesStatus === "success" && (
                    <div className={styles.saveStatusSuccess}>
                      ¡Casos guardados con éxito!
                    </div>
                  )}
                  {saveExamplesStatus === "error" && (
                    <div className={styles.saveStatusError}>
                      Error al guardar los casos. Inténtalo nuevamente.
                    </div>
                  )}

                  {examples.map((example, index) => (
                    <div key={example.id} className={styles.exampleCard}>
                      <h3 className={styles.exampleTitle}>{example.title}</h3>
                      <p className={styles.exampleSummary}>{example.summary}</p>
                      
                      {examplesEditMode ? (
                        <textarea
                          className={styles.instructionsEditor}
                          style={{ minHeight: '150px', marginTop: '10px' }}
                          value={example.text}
                          onChange={(e) => {
                            const newExamples = [...examples];
                            newExamples[index].text = e.target.value;
                            setExamples(newExamples);
                            if (saveExamplesStatus) setSaveExamplesStatus(null);
                          }}
                          placeholder="Texto del caso clínico..."
                        />
                      ) : (
                        <div className={styles.examplePreview}>
                          {example.text}
                        </div>
                      )}

                      {!examplesEditMode && (
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
                      )}
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

      {/* Ventana emergente: Prescripción que sugiere el médico */}
      {isPrescModalOpen && (
        <div className={styles.overlay} onClick={() => setIsPrescModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Prescripción que sugiere el médico</h2>
              <button className={styles.closeButton} onClick={() => setIsPrescModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalSubtitle}>
                Ingrese la prescripción que tiene planeado sugerir para este paciente (opcional). Esta información se sumará al análisis del copiloto.
              </p>
              <textarea
                className={styles.prescEditor}
                value={suggestedPrescription}
                onChange={(e) => setSuggestedPrescription(e.target.value)}
                placeholder="Ej: Levofloxacina 20 mg/kg/día EV c/24h..."
                rows={5}
                autoFocus
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelModalBtn} onClick={() => setIsPrescModalOpen(false)}>
                Cancelar
              </button>
              <button className={styles.confirmModalBtn} onClick={() => handleSubmit()}>
                Consultar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
