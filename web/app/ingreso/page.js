"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";
import {
  AGENT_INSTRUCTIONS_INGRESO,
  CLINICAL_EXAMPLES_INGRESO,
  INTEGRATION_TEXT_INGRESO,
  DATA_SOURCES_TEXT_INGRESO
} from "../constants";

import ManualEntry from "./components/ManualEntry";
import Dashboard from "./components/Dashboard";
import HistoryViewer from "./components/HistoryViewer";
import RatingDashboard from "./components/RatingDashboard";

export default function IngresoClinico() {
  const [mainTab, setMainTab] = useState("AI"); // 'AI' | 'MANUAL' | 'HISTORY' | 'DASHBOARD'
  
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [currentLogId, setCurrentLogId] = useState(null);
  const [rating, setRating] = useState(0);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("sources");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const originalInputRef = useRef("");
  const [instructions, setInstructions] = useState(AGENT_INSTRUCTIONS_INGRESO);
  const [instructionsEditMode, setInstructionsEditMode] = useState(false);
  const [savingInstructions, setSavingInstructions] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [examples, setExamples] = useState(CLINICAL_EXAMPLES_INGRESO);
  const [examplesEditMode, setExamplesEditMode] = useState(false);
  const [savingExamples, setSavingExamples] = useState(false);
  const [saveExamplesStatus, setSaveExamplesStatus] = useState(null);

  useEffect(() => {
    async function fetchInstructions() {
      try {
        const res = await fetch("/api/instructions-ingreso");
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
        const res = await fetch("/api/examples-ingreso");
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
      const res = await fetch("/api/instructions-ingreso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions }),
      });
      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(null), 3000);
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
      const res = await fetch("/api/instructions-ingreso/history");
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
      const res = await fetch("/api/examples-ingreso", {
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

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta el reconocimiento de voz. Te recomendamos usar Google Chrome o Microsoft Edge.");
      return;
    }

    originalInputRef.current = input + (input.trim() ? " " : "");
    const recognition = new SpeechRecognition();
    recognition.lang = "es-AR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        interimTranscript += event.results[i][0].transcript;
      }
      setInput(originalInputRef.current + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'audio-capture') {
        alert("No se detectó ningún micrófono. Asegúrate de que el micrófono esté conectado y configurado en tu sistema operativo.");
      } else if (event.error === 'not-allowed') {
        alert("Permiso denegado para usar el micrófono. Debes permitir el acceso en la barra de direcciones de tu navegador.");
      } else {
        alert("Error de reconocimiento de voz: " + event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");
    setCurrentLogId(null);
    setRating(0);
    setRatingSuccess(false);

    const startTime = new Date();

    try {
      const res = await fetch("/api/ingreso", {
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
      
      const endTime = new Date();
      const durationSeconds = Math.round((endTime - startTime) / 1000);
      
      // Enviar log
      const logRes = await fetch("/api/logs/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationSeconds,
          durationString: `${Math.floor(durationSeconds/3600).toString().padStart(2,'0')}:${Math.floor((durationSeconds%3600)/60).toString().padStart(2,'0')}:${(durationSeconds%60).toString().padStart(2,'0')}`,
          inputText: input,
          outputText: accumulatedText,
          module: "ADMISSION"
        })
      });
      if (logRes.ok) {
        const logData = await logRes.json();
        setCurrentLogId(logData.logId);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (value) => {
    if (!currentLogId || isRatingSubmitting) return;
    setIsRatingSubmitting(true);
    setRating(value);
    
    try {
      const res = await fetch("/api/logs/ai/rating", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId: currentLogId, rating: value }),
      });
      
      if (res.ok) {
        setRatingSuccess(true);
      }
    } catch (err) {
      console.error("Error al enviar la valoración:", err);
    } finally {
      setIsRatingSubmitting(false);
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

  const handleClear = () => {
    setInput("");
    setResponse(null);
    setCurrentLogId(null);
    setError("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Copiloto Ingreso Clínico</h1>
        <p className={styles.subtitle}>
          Asistencia para la elaboración de ingresos en internación de cuidados intermedios y moderados.
        </p>
      </div>

      <div className={styles.mainTabs}>
        <button className={`${styles.mainTabBtn} ${mainTab === "AI" ? styles.activeMainTab : ""}`} onClick={() => setMainTab("AI")}>
          Asistente IA
        </button>
        <button className={`${styles.mainTabBtn} ${mainTab === "MANUAL" ? styles.activeMainTab : ""}`} onClick={() => setMainTab("MANUAL")}>
          Carga Manual
        </button>
        <button className={`${styles.mainTabBtn} ${mainTab === "HISTORY" ? styles.activeMainTab : ""}`} onClick={() => setMainTab("HISTORY")}>
          Historiales
        </button>
        <button className={`${styles.mainTabBtn} ${mainTab === "DASHBOARD" ? styles.activeMainTab : ""}`} onClick={() => setMainTab("DASHBOARD")}>
          Dashboard Analítico
        </button>
        <button className={`${styles.mainTabBtn} ${mainTab === "RATING_STATS" ? styles.activeMainTab : ""}`} onClick={() => setMainTab("RATING_STATS")}>
          Evolución Comportamiento
        </button>
      </div>

      <div className={`${styles.container} ${mainTab === "HISTORY" || mainTab === "DASHBOARD" || mainTab === "RATING_STATS" ? styles.wideContainer : ""}`}>
        {mainTab === "AI" && (
          <>
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
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={`${styles.micButton} ${isListening ? styles.listening : ""}`}
                    onClick={toggleListening}
                    title={isListening ? "Detener dictado" : "Iniciar dictado por voz"}
                  >
                    {isListening ? (
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={handleClear}
                    disabled={loading || (!input.trim() && !response)}
                    style={{ backgroundColor: '#ef4444' }}
                    title="Limpiar consulta"
                  >
                    Limpiar
                  </button>
                  <button type="submit" className={styles.button} disabled={loading || !input.trim()}>
                    {loading ? "Procesando..." : "Analizar Ingreso"}
                  </button>
                </div>
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
                <h3>Análisis del Ingreso Clínico</h3>
                <div className={styles.content}>
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
                
                {currentLogId && (
                  <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <h4 style={{ marginBottom: '10px', color: '#334155', fontSize: '15px' }}>¿Qué tan útil fue esta respuesta?</h4>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          disabled={isRatingSubmitting || ratingSuccess}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: (isRatingSubmitting || ratingSuccess) ? 'default' : 'pointer',
                            color: star <= rating ? '#eab308' : '#cbd5e1',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => { if (!ratingSuccess && !isRatingSubmitting) e.currentTarget.style.color = '#eab308'; }}
                          onMouseLeave={(e) => { if (!ratingSuccess && !isRatingSubmitting) e.currentTarget.style.color = star <= rating ? '#eab308' : '#cbd5e1'; }}
                        >
                          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill={star <= rating ? '#eab308' : 'none'} strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        </button>
                      ))}
                    </div>
                    {ratingSuccess && (
                      <p style={{ marginTop: '10px', color: '#16a34a', fontSize: '14px', fontWeight: '500' }}>¡Gracias por tu valoración!</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {mainTab === "MANUAL" && <ManualEntry />}
        {mainTab === "HISTORY" && <HistoryViewer />}
        {mainTab === "DASHBOARD" && <Dashboard />}
        {mainTab === "RATING_STATS" && <RatingDashboard />}
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
              <h2 className={styles.modalTitle}>Guía del Asistente de Ingreso</h2>
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
                  <ReactMarkdown>{INTEGRATION_TEXT_INGRESO}</ReactMarkdown>
                </div>
              )}
              {activeTab === "sources" && (
                <div className={styles.instructionsText}>
                  <ReactMarkdown>{DATA_SOURCES_TEXT_INGRESO}</ReactMarkdown>
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
