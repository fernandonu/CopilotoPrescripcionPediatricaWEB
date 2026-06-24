"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  ComposedChart
} from "recharts";
import styles from "../page.module.css";

export default function RatingDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/logs/rating-by-instruction?module=ADMISSION");
        if (!res.ok) throw new Error("Error al obtener los datos");
        const json = await res.json();
        
        // Mapear los datos para el gráfico
        const formattedData = json.data.map((item, index) => ({
          ...item,
          versionName: `Versión ${index + 1}`,
          displayDate: new Date(item.date).toLocaleDateString(),
        }));
        
        setData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 5px' }}>{data.versionName}</p>
          <p style={{ margin: '0' }}>Fecha: {data.displayDate}</p>
          <p style={{ margin: '0', color: '#eab308' }}>Promedio: {data.averageRating} ★</p>
          <p style={{ margin: '0', color: '#3b82f6' }}>Valoraciones: {data.totalRatings}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className={styles.loader}><div className={styles.spinner}></div></div>;
  if (error) return <div className={styles.saveStatusError}>{error}</div>;

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1e293b' }}>
        Evolución de Valoraciones por Comportamiento
      </h2>
      
      {data.length === 0 ? (
        <p>No hay suficientes datos de valoraciones o instrucciones para mostrar.</p>
      ) : (
        <>
          <div style={{ height: '300px', width: '100%', marginBottom: '40px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="versionName" />
                <YAxis yAxisId="left" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} label={{ value: 'Estrellas', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" allowDecimals={false} label={{ value: 'Cant. Valoraciones', angle: 90, position: 'insideRight' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="right" dataKey="totalRatings" name="Cantidad de Valoraciones" fill="#bae6fd" barSize={40} />
                <Line yAxisId="left" type="monotone" dataKey="averageRating" name="Promedio de Estrellas" stroke="#eab308" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#475569' }}>Detalle por Versión</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Versión</th>
                    <th>Fecha Inicio</th>
                    <th>Promedio</th>
                    <th>Total Val.</th>
                    <th>Comportamiento (Fragmento)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id} className={styles.tableRow} style={{ cursor: 'default' }}>
                      <td style={{ fontWeight: '500' }}>{row.versionName}</td>
                      <td>{new Date(row.date).toLocaleString()}</td>
                      <td>
                        {row.totalRatings > 0 ? (
                          <span style={{ color: '#eab308', fontWeight: 'bold' }}>{row.averageRating} ★</span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>
                      <td>{row.totalRatings}</td>
                      <td style={{ fontSize: '12px', color: '#64748b', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.snippet}>
                        {row.snippet}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
