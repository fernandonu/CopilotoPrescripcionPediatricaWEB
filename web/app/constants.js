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
    title: "Caso 1: Paciente de 4 años en Post-Trasplante de Médula Ósea (TMO) con Neutropenia e Hipogammaglobulinemia",
    summary: "Paciente de 4 años (16 kg) en Día +15 de Trasplante alogénico de Células Progenitoras Hematopoyéticas por LLA en recaída. Presenta neutropenia profunda (RAN 80 cel/mm³), mucositis oral grado II, y catéter venoso central (CVC) trilumen. Laboratorio reporta IgG sérica de 280 mg/dL (hipogammaglobulinemia secundaria severa). Se encuentra afebril. Se evalúa profilaxis antibacteriana y reposición de inmunoglobulina.",
    text: `Paciente: Preescolar de 4 años
Peso: 16 kg
Diagnóstico: Día +15 de Trasplante de Células Progenitoras Hematopoyéticas (TCPH/TMO) alogénico por LLA en recaída + Neutropenia profunda + Mucositis oral grado II + Catéter Venoso Central (CVC) trilumen.
Evolución clínica: Paciente en fase previa al prendimiento (pre-engraftment). Actualmente afebril, pero con dolor moderado por mucositis oral. Se constató hipogammaglobulinemia secundaria severa en el laboratorio de hoy.
Medicación activa:
- Aciclovir: 160 mg vía oral cada 8 horas (prevención de reactivación de VHS).
- Trimetoprima-Sulfametoxazol (suspensión 40/200 mg en 5 mL): 10 mL (80 mg de TMP) vía oral los días lunes, miércoles y viernes (profilaxis de Pneumocystis jirovecii).
- Posaconazol suspensión (40 mg/mL): 5 mL (200 mg) vía oral cada 8 horas (profilaxis antifúngica).
- Profilaxis antibacteriana: En evaluación por el equipo de trasplante debido a neutropenia profunda.
- Reposición de inmunoglobulina: En evaluación por dosaje bajo de IgG sérica.
Alergias: Sin alergias conocidas.
Laboratorios recientes: Leucocitos 300/mm³, RAN (Recuento Absoluto de Neutrófilos) 80/mm³, Plaquetas 25,000/mm³, Creatinina 0.4 mg/dL, IgG sérica 280 mg/dL (Valor de referencia normal: > 500 mg/dL).`
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

export const AGENT_INSTRUCTIONS_INGRESO = `Eres un Médico Pediatra Especialista en Internación de Cuidados Intermedios y Moderados.

Analiza la información disponible en la Historia Clínica Electrónica y asiste en la elaboración del ingreso clínico del paciente, previniendo omisiones críticas.

REGLAS

* Utiliza exclusivamente la información provista en la consulta y documentos recuperados mediante File Search.
* Se considerará omisión crítica la ausencia de información capaz de modificar decisiones clínicas inmediatas o comprometer la continuidad asistencial.
* No infieras información ausente. Si no hay datos sobre un punto crítico, indícalo explícitamente.

PRIORIZAR (OMISIONES CRÍTICAS A EVITAR)

1. Alergias relevantes.
2. Soporte ventilatorio.
3. Dispositivos invasivos.
4. Cultivos positivos activos.
5. Medicación crónica imprescindible.
6. Diagnóstico principal.
7. Pendientes críticos.

RESPUESTA

DIAGNÓSTICO PRINCIPAL Y RESUMEN
* Breve síntesis clínica.

PUNTOS CRÍTICOS
* Alergias: [Detalle o "Sin datos"]
* Soporte Ventilatorio: [Detalle o "Sin datos"]
* Dispositivos Invasivos: [Detalle o "Sin datos"]
* Cultivos Positivos: [Detalle o "Sin datos"]
* Medicación Crónica Imprescindible: [Detalle o "Sin datos"]

PENDIENTES CRÍTICOS
* Lista de tareas o evaluaciones pendientes urgentes.

RESTRICCIONES
* Máximo 150 palabras.
* Sin introducciones ni conclusiones.
* Ser directo y conciso.`;

export const CLINICAL_EXAMPLES_INGRESO = [
  {
    id: 1,
    title: "Caso 1: Neumonía Complicada con Derrame",
    summary: "Escolar de 8 años derivado de guardia por neumonía basal derecha complicada con derrame pleural paraneumónico. Alérgico a penicilina. Requiere oxígeno por cánula nasal. Pendiente resultado de hemocultivo y ecografía pleural.",
    text: `Paciente: Escolar de 8 años
Peso: 25 kg
Motivo de ingreso: Dificultad respiratoria y fiebre.
Antecedentes: Alergia documentada a penicilina (rash cutáneo). Asma leve intermitente (usa Salbutamol a demanda).
Enfermedad actual: Cuadro de 4 días de evolución con fiebre (39°C), tos tusígena y dolor pleurítico derecho. Hoy agrega tiraje subcostal y taquipnea (FR 35).
Examen físico: Regular estado general. SatO2 91% a aire ambiente. Se coloca Cánula Nasal a 2 L/min mejorando a 95%. Hipoventilación en base derecha con matidez a la percusión.
Laboratorio: Leucocitos 18.000 (85% neutrófilos), PCR 120. Se tomaron 2 hemocultivos (pendientes).
Imágenes: Rx tórax de frente: opacidad en base derecha que borra el seno costodiafragmático.
Pendientes: Ecografía pleural solicitada a diagnóstico por imágenes. Iniciar antibioticoterapia empírica (evaluar alternativas por alergia).`
  },
  {
    id: 2,
    title: "Caso 2: Postoperatorio Apendicitis Complicada",
    summary: "Adolescente de 13 años cursando 1er día de postoperatorio de apendicectomía laparoscópica por apendicitis perforada con peritonitis localizada. Portador de drenaje tipo Jackson-Pratt y Vía Venosa Central. Cultivo de líquido peritoneal positivo para E. coli (pendiente antibiograma).",
    text: `Paciente: Adolescente de 13 años
Peso: 45 kg
Motivo de ingreso: Postoperatorio de apendicectomía.
Antecedentes: Sin antecedentes patológicos de relevancia.
Enfermedad actual: Cursando PO día 1 de apendicectomía videolaparoscópica de urgencia. Hallazgo intraoperatorio: apendicitis perforada con peritonitis localizada purulenta.
Dispositivos: Vía Venosa Central de inserción periférica (PICC) en miembro superior derecho. Drenaje abdominal Jackson-Pratt en fosa ilíaca derecha (débito serohemático escaso).
Evolución: Afebril en las últimas 12 hs. Dolor abdominal controlado con analgesia reglada. Tolerando líquidos claros.
Infectología: Cultivo de líquido peritoneal (tomado en quirófano) informa desarrollo preliminar de E. coli. Antibiograma en proceso.
Medicación actual: Ceftriaxona + Metronidazol EV. Analgesia EV.
Pendientes: Resultado de antibiograma para adecuar tratamiento. Retiro de drenaje si débito <10cc/día.`
  },
  {
    id: 3,
    title: "Caso 3: Cetoacidosis Diabética Leve",
    summary: "Preescolar de 5 años con debut diabético. Presenta Cetoacidosis Diabética (CAD) leve ya compensada en emergencia, sube a sala para transición a insulina subcutánea. Requiere medicación crónica (levotiroxina). Pendiente educación diabetológica a la familia.",
    text: `Paciente: Preescolar de 5 años
Peso: 18 kg
Motivo de ingreso: Debut DBT tipo 1 - Cetoacidosis Diabética.
Antecedentes: Hipotiroidismo congénito en tratamiento con Levotiroxina 50 mcg/día (crónica imprescindible, no suspender).
Enfermedad actual: Ingresa por guardia con cuadro de polidipsia, poliuria y pérdida de peso de 3 semanas. Laboratorio de ingreso: Glucemia 450 mg/dL, pH 7.28, HCO3 14 mEq/L, cetonemia positiva. Se manejó como CAD leve.
Evolución: Recibió expansión con solución fisiológica y luego infusión continua de insulina (0.05 UI/kg/h) con plan de hidratación. Actualmente lúcido, buen estado de hidratación. Último laboratorio: pH 7.35, HCO3 18 mEq/L.
Dispositivos: Dos vías venosas periféricas.
Medicación: Insulina regular en bomba de infusión continua.
Pendientes: Iniciar tolerancia oral. Transición a esquema de insulina subcutánea (NPH/Corriente) una vez tolerada la vía oral. Interconsulta con nutrición y educación diabetológica a padres.`
  }
];

export const INTEGRATION_TEXT_INGRESO = `### Integración en la HCE del Hospital Garrahan

El Copiloto de Ingreso Clínico está diseñado para asistir a los profesionales en las salas de cuidados intermedios y moderados:

1. **Síntesis Orientada a la Seguridad**
   Este copiloto analiza automáticamente los datos crudos del paciente para estructurar la nota de ingreso, asegurando que elementos críticos como alergias, dispositivos invasivos, cultivos y medicaciones crónicas no pasen por alto.

2. **Evidencia y Protocolos Locales**
   Mantiene la concordancia con las guías de manejo clínico del hospital, alertando sobre discrepancias o sugiriendo intervenciones iniciales en base al diagnóstico principal detectado.
`;

export const DATA_SOURCES_TEXT_INGRESO = `### Fuentes de Información del Hospital Garrahan

Para los ingresos clínicos, el asistente utiliza:

*   **[Guías de Manejo Clínico Institucionales](https://www.garrahan.gov.ar/guias-y-consensos)**
    Protocolos de manejo inicial en salas de internación pediátrica.
*   **[Manual de Procedimientos de Enfermería y Dispositivos](https://www.garrahan.gov.ar/procedimientos)**
    Recomendaciones sobre el manejo de vías, catéteres y drenajes.
*   **[Comité de Control de Infecciones](https://www.garrahan.gov.ar/infecciones)**
    Algoritmos de manejo de cultivos positivos y aislamientos.
`;
