export const AGENT_INSTRUCTIONS = `Eres un Farmacéutico Clínico Pediátrico.

Analiza el contexto clínico recibido y genera recomendaciones farmacoterapéuticas para el paciente actual.

REGLAS

* Utiliza exclusivamente información recuperada mediante File Search.
* Toda recomendación debe incluir respaldo documental.
* No utilices conocimiento propio.
* No infieras información ausente.
* Si no existe evidencia documental suficiente responde únicamente:
  "Sin recomendaciones farmacoterapéuticas documentadas."

PRIORIZAR

1. Seguridad.
2. Interacciones.
3. Ajustes de dosis.
4. Monitoreo.
5. Recomendaciones terapéuticas.

RESPUESTA

REC

* Medicamento | Dosis | Intervalo | Vía

ALERTAS

* Riesgo, interacción, ajuste o monitoreo.

FUENTE

* Documento | Sección.

RESTRICCIONES

* Máximo 3 recomendaciones.
* Máximo 100 palabras.
* Sin introducciones ni conclusiones.
* No repetir información.`;

export const CLINICAL_EXAMPLES = [
  {
    id: 1,
    title: "Caso 1: Lactante con Bronquiolitis y CIV (Cardiopatía Congénita)",
    summary: "Lactante de 8 meses (7.2 kg) con bronquiolitis por VRS (5 días de evolución) y Comunicación Interventricular (CIV) pequeña. Presenta taquipnea, retracción costal moderada y sibilancias bilaterales. SatO2 91% en aire ambiente. Frecuencia cardíaca: 142 lpm. Recibe Salbutamol aerosol 2 puffs c/4h, Paracetamol gotas 70 mg c/6h si fiebre y Furosemida 7 mg VO c/12h.",
    text: `Paciente: Lactante de 8 meses
Peso: 7.2 kg
Diagnóstico: Bronquiolitis por VRS (5 días de evolución) + Cardiopatía Congénita (Comunicación Interventricular - CIV pequeña).
Evolución clínica: Ingresó por taquipnea y retracción costal moderada. Presenta picos febriles y dificultad para alimentarse. Hoy cursa con sibilancias bilaterales y saturación de oxígeno de 91% en aire ambiente. Frecuencia cardíaca: 142 lpm.
Medicación activa:
- Salbutamol aerosol 100 mcg: 2 puffs cada 4 horas.
- Paracetamol gotas (100 mg/mL): 0.7 mL (70 mg) cada 6 horas condicionado a fiebre.
- Furosemida: 7 mg vía oral cada 12 horas (por su CIV).
Alergias: Sin alergias conocidas.
Laboratorios recientes: PCR 12 mg/L, Creatinina 0.3 mg/dL, electrolitos séricos en rango normal.`
  },
  {
    id: 2,
    title: "Caso 2: Escolar con Crisis Asmática y Neumonía Lobar Izquierda",
    summary: "Paciente de 6 años (21 kg) asmático en tratamiento con Budesonida/Formoterol. Consulta por crisis asmática moderada y fiebre de 39°C de 48h asociada a neumonía lobar izquierda. FR 34 rpm. Medicación activa: Prednisona 20 mg VO c/24h (hace 1 día) y Amoxicilina 400 mg VO c/8h (hace 24h). Sospecha de alergia a la Dipirona (urticaria previa).",
    text: `Paciente: Escolar de 6 años
Peso: 21 kg
Diagnóstico: Crisis asmática moderada + Neumonía lobar izquierda en evolución.
Evolución clínica: Paciente asmático en tratamiento de mantenimiento regular con Budesonida/Formoterol. Consulta por fiebre de 39°C de 48 horas de evolución, tos productiva y disnea. Al examen físico se auscultan crepitantes en base izquierda y sibilancias espiratorias difusas. Frecuencia respiratoria: 34 rpm.
Medicación activa:
- Budesonida/Formoterol 125/4.5 mcg: 1 puff cada 12 horas.
- Prednisona: 20 mg vía oral cada 24 horas (iniciada hace 1 día).
- Amoxicilina suspensión (250 mg/5mL): 8 mL (400 mg) vía oral cada 8 horas (iniciada hace 24 horas).
- Ibuprofeno suspensión (40 mg/mL): 5 mL (200 mg) vía oral cada 6 horas condicionado a fiebre.
Alergias: Sospecha de hipersensibilidad a la Dipirona (antecedente de urticaria generalizada tras administración previa).
Laboratorios recientes: Leucocitos 14,500/mm3 (Segmentados 78%), PCR 45 mg/L.`
  },
  {
    id: 3,
    title: "Caso 3: Neonato con Sospecha de Sepsis Neonatal y Conducto Arterioso Persistente (DAP)",
    summary: "Neonato de 12 días (2.8 kg, nacido a las 36 semanas) con sospecha de Sepsis Neonatal Temprana y Conducto Arterioso Persistente (DAP) sintomático. Presenta hipoactividad, inestabilidad térmica, episodios de apnea y soplo sistólico grado II/VI. Medicación activa: Ampicilina 150 mg IV c/12h, Gentamicina 12 mg IV c/24h, Ibuprofeno IV en evaluación.",
    text: `Paciente: Neonato de 12 días
Peso: 2.8 kg (Edad gestacional al nacer: 36 semanas)
Diagnóstico: Sospecha de Sepsis Neonatal Temprana + Conducto Arterioso Persistente (DAP) sintomático.
Evolución clínica: Nacido por cesárea, buena transición inicial. En las últimas 12 horas presenta hipoactividad, inestabilidad térmica (temperatura varía de 35.8°C a 38.2°C) y episodios de apnea intermitentes. Se ausculta soplo sistólico grado II/VI. Se decide inicio de antibioticoterapia empírica previa toma de cultivos.
Medicación activa:
- Ampicilina: 150 mg IV cada 12 horas.
- Gentamicina: 12 mg IV cada 24 horas.
- Ibuprofeno IV: dosis inicial de 10 mg/kg en evaluación para cierre farmacológico del DAP.
Alergias: No conocidas.
Laboratorios recientes: Hemograma con Leucocitos 6,000/mm3, Plaquetas 120,000/mm3, PCR: 8.5 mg/L, Creatinina 0.6 mg/dL.`
  }
];

export const INTEGRATION_TEXT = `### Integración en la HCE del Hospital Garrahan

El Copiloto Pediátrico está diseñado para operar de manera integrada y eficiente dentro de la **Historia Clínica Electrónica (HCE)** del Hospital Garrahan, estructurándose bajo el siguiente modelo funcional:

1. **Ejecución Automática al Inicio (Asistente Proactivo)**
   Este copiloto se activa de forma automática en el momento exacto en que el profesional **abre la herramienta de prescripción**. Su función es proactiva: analiza de inmediato la información disponible en la HCE del paciente (edad, peso, diagnósticos activos codificados en SNOMED, antecedentes clínicos relevantes, alergias registradas y últimos resultados de laboratorio) para sugerir recomendaciones farmacoterapéuticas óptimas y seguras antes de iniciar la carga.

2. **Evidencia Científica y Protocolos Locales**
   Toda recomendación emitida por el asistente toma como base exclusiva la documentación científica y regulatoria oficial provista por el hospital (guías de práctica clínica, tablas de dosificación pediátrica, boletines de farmacovigilancia y procedimientos normalizados de trabajo disponibles en la intranet del Hospital Garrahan).

3. **Módulo de Validación de Prescripciones (Segundo Agente)**
   *Nota de diseño futuro:* Adicionalmente, se prevé la ejecución de un **segundo asistente de validación**, el cual entrará en acción una vez que suceda el **evento de prescripción** (es decir, en el momento en que el profesional de la salud confirme e intente registrar las indicaciones médicas). Este agente validará las dosis ingresadas en función del peso real del paciente, verificará interacciones directas, contraindicaciones por alergias y adhiriencia a protocolos, emitiendo alertas críticas de seguridad antes de que la orden médica sea firmada y guardada.`;

export const DATA_SOURCES_TEXT = `### Fuentes de Información del Hospital Garrahan

El asistente basa sus recomendaciones farmacoterapéuticas exclusivamente en los documentos clínicos validados e indexados en el almacén de vectores (Vector Store) de la plataforma OpenAI, los cuales provienen de las siguientes fuentes oficiales del hospital:

*   **[Centro de Información de Medicamentos (CIME)](https://www.garrahan.gov.ar/cime)**
    Centro de referencia institucional para la consulta sobre compatibilidades, estabilidad, diluciones y formas farmacéuticas recomendadas en pediatría.
*   **[Medicamentos de Alto Riesgo](https://www.garrahan.gov.ar/medicamentos-de-alto-riesgo)**
    Listado y guías institucionales para la manipulación y dosificación segura de fármacos de estrecho margen terapéutico y alto riesgo.
*   **[Guías y Consensos Clínicos](https://www.garrahan.gov.ar/guias-y-consensos)**
    Protocolos vigentes redactados y aprobados por los Comités de Expertos y los diferentes servicios médicos del Hospital Garrahan.
*   **[Tablas de Dosificación Pediátrica](https://www.garrahan.gov.ar/tablas)**
    Tablas rápidas de referencia para dosis e intervalos basadas en el peso corporal y edad gestacional del paciente.

---

> [!TIP]
> Toda respuesta provista por el copiloto incluye una sección de **FUENTE** detallando el documento y la sección específica para facilitar la rápida verificación de la recomendación por parte del profesional médico.`;
