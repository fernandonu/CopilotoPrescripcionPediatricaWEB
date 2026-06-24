"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../page.module.css";

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function ManualEntry() {
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    if (!startTime) setStartTime(new Date());
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(0);
    setStartTime(null);
    setText("");
    setSaveStatus(null);
  };

  const handleSave = async () => {
    setIsActive(false);
    setIsPaused(true);
    setSaving(true);
    setSaveStatus(null);
    
    const endTime = new Date();
    const durationSeconds = time;
    const durationString = formatTime(time);

    try {
      const res = await fetch("/api/logs/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationSeconds,
          durationString,
          inputText: text,
          module: "ADMISSION"
        }),
      });

      if (res.ok) {
        setSaveStatus("success");
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.manualEntryContainer}>
      <div className={styles.timerHeader}>
        <div className={styles.timerDisplay}>
          {formatTime(time)}
        </div>
        <div className={styles.timerControls}>
          {!isActive || isPaused ? (
            <button onClick={handleStart} className={`${styles.timerBtn} ${styles.btnPlay}`}>
              {time === 0 ? "Empezar Redacción" : "Continuar"}
            </button>
          ) : (
            <button onClick={handlePause} className={`${styles.timerBtn} ${styles.btnPause}`}>
              Pausar
            </button>
          )}
          <button onClick={handleReset} className={`${styles.timerBtn} ${styles.btnReset}`}>
            Reiniciar
          </button>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          style={{ 
            opacity: (!isActive || isPaused) ? 0.7 : 1,
            pointerEvents: (!isActive || isPaused) ? 'none' : 'auto'
          }}
          placeholder="Presiona Empezar para habilitar la escritura del ingreso clínico..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!isActive || isPaused}
        />
        <button 
          onClick={handleSave} 
          className={styles.button} 
          disabled={saving || time === 0 || !text.trim()}
          style={{ marginTop: '1rem' }}
        >
          {saving ? "Guardando..." : "Guardar Carga Manual"}
        </button>
      </div>
      
      {saveStatus === "success" && (
        <div className={styles.saveStatusSuccess} style={{ marginTop: '1rem' }}>
          ¡Ingreso manual registrado con éxito en la bitácora!
        </div>
      )}
      {saveStatus === "error" && (
        <div className={styles.saveStatusError} style={{ marginTop: '1rem' }}>
          Ocurrió un error al guardar el registro.
        </div>
      )}
    </div>
  );
}
