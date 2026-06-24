"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import styles from "../page.module.css";

export default function HistoryViewer() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ ai: [], manual: [] });
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/logs/stats?module=ADMISSION");
        if (!res.ok) throw new Error("Error fetching history");
        const json = await res.json();
        setData(json.logs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatSecs = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const LogTable = ({ logs, isAi }) => {
    if (!logs || logs.length === 0) return <p className={styles.emptyMsg}>No hay registros.</p>;
    
    return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Usuario</th>
              <th>Duración</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} onClick={() => setSelectedLog({ ...log, isAi })} className={styles.tableRow}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.user?.name || log.userId}</td>
                <td>{log.durationString || formatSecs(log.durationSeconds)}</td>
                <td><button className={styles.viewDetailBtn}>Ver Detalle</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.historyViewerContainer}>
      {loading && <div className={styles.loader}><div className={styles.spinner}></div></div>}
      {error && <div className={styles.saveStatusError}>{error}</div>}

      {!loading && !error && (
        <div className={styles.historyTablesLayout}>
          <div className={styles.historyColumn}>
            <h3 className={styles.historyColumnTitle}>Historial Asistente IA</h3>
            <LogTable logs={data.ai} isAi={true} />
          </div>
          <div className={styles.historyColumn}>
            <h3 className={styles.historyColumnTitle}>Historial Carga Manual</h3>
            <LogTable logs={data.manual} isAi={false} />
          </div>
        </div>
      )}

      {selectedLog && (
        <div className={styles.overlay} onClick={() => setSelectedLog(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Detalle del Registro</h2>
              <button className={styles.closeButton} onClick={() => setSelectedLog(null)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}><strong>Usuario:</strong> {selectedLog.user?.name}</div>
                <div className={styles.detailItem}><strong>Fecha:</strong> {new Date(selectedLog.createdAt).toLocaleString()}</div>
                <div className={styles.detailItem}><strong>Inicio:</strong> {new Date(selectedLog.startTime).toLocaleTimeString()}</div>
                <div className={styles.detailItem}><strong>Fin:</strong> {new Date(selectedLog.endTime).toLocaleTimeString()}</div>
                <div className={styles.detailItem}><strong>Duración Total:</strong> {selectedLog.durationString}</div>
              </div>
              
              <div className={styles.detailSection}>
                <h4>Texto Ingresado</h4>
                <div className={styles.detailBox}>
                  {selectedLog.inputText}
                </div>
              </div>

              {selectedLog.isAi && (
                <div className={styles.detailSection}>
                  <h4>Respuesta de la IA</h4>
                  <div className={styles.detailBox}>
                    <ReactMarkdown>{selectedLog.outputText}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
