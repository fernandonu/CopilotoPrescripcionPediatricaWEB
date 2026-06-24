"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "../page.module.css";

const COLORS = ['#3b82f6', '#f59e0b'];

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/logs/stats?module=ADMISSION";
      
      if (dateRange !== "all" && dateRange !== "custom") {
        const end = new Date();
        const start = new Date();
        if (dateRange === "week") start.setDate(start.getDate() - 7);
        if (dateRange === "month") start.setMonth(start.getMonth() - 1);
        if (dateRange === "year") start.setFullYear(start.getFullYear() - 1);
        
        url += `&startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
      } else if (dateRange === "custom" && customStart && customEnd) {
        url += `&startDate=${new Date(customStart).toISOString()}&endDate=${new Date(customEnd).toISOString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error fetching stats");
      const json = await res.json();
      setData(json.stats);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handleCustomDateSubmit = (e) => {
    e.preventDefault();
    if (customStart && customEnd) {
      fetchData();
    }
  };

  const formatSecs = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.filtersCard}>
        <h3>Filtros de Período</h3>
        <div className={styles.filterOptions}>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className={styles.selectFilter}
          >
            <option value="all">Todo el histórico</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="year">Último año</option>
            <option value="custom">Rango personalizado</option>
          </select>
        </div>
        
        {dateRange === "custom" && (
          <form onSubmit={handleCustomDateSubmit} className={styles.customDateForm}>
            <input 
              type="date" 
              value={customStart} 
              onChange={(e) => setCustomStart(e.target.value)} 
              required 
              className={styles.dateInput}
            />
            <span>hasta</span>
            <input 
              type="date" 
              value={customEnd} 
              onChange={(e) => setCustomEnd(e.target.value)} 
              required 
              className={styles.dateInput}
            />
            <button type="submit" className={styles.filterBtn}>Aplicar</button>
          </form>
        )}
      </div>

      {loading && <div className={styles.loader}><div className={styles.spinner}></div></div>}
      {error && <div className={styles.saveStatusError}>{error}</div>}

      {data && !loading && (
        <>
          {data.comparison.savingsPercentage > 0 && (
            <div className={styles.highlightBanner}>
              <strong>¡El proceso con IA es {data.comparison.speedRatio} veces más rápido!</strong>
              <p>Has ahorrado un {data.comparison.savingsPercentage}% de tiempo en promedio.</p>
            </div>
          )}

          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <h4>Asistente IA</h4>
              <div className={styles.kpiStat}>
                <span className={styles.kpiLabel}>Ejecuciones</span>
                <span className={styles.kpiValue}>{data.ai.total}</span>
              </div>
              <div className={styles.kpiStat}>
                <span className={styles.kpiLabel}>T. Promedio</span>
                <span className={styles.kpiValue} style={{color: '#3b82f6'}}>{formatSecs(data.ai.avg)}</span>
              </div>
              <div className={styles.kpiStat}>
                <span className={styles.kpiLabel}>T. Mín/Máx</span>
                <span className={styles.kpiValueSmall}>{formatSecs(data.ai.min)} / {formatSecs(data.ai.max)}</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <h4>Carga Manual</h4>
              <div className={styles.kpiStat}>
                <span className={styles.kpiLabel}>Registros</span>
                <span className={styles.kpiValue}>{data.manual.total}</span>
              </div>
              <div className={styles.kpiStat}>
                <span className={styles.kpiLabel}>T. Promedio</span>
                <span className={styles.kpiValue} style={{color: '#f59e0b'}}>{formatSecs(data.manual.avg)}</span>
              </div>
              <div className={styles.kpiStat}>
                <span className={styles.kpiLabel}>T. Mín/Máx</span>
                <span className={styles.kpiValueSmall}>{formatSecs(data.manual.min)} / {formatSecs(data.manual.max)}</span>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Comparativa de Tiempos Acumulados (Segundos)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Total IA', value: data.ai.sum },
                    { name: 'Total Manual', value: data.manual.sum }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[1]} />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
