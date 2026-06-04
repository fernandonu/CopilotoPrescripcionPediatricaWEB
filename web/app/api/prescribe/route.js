import OpenAI from 'openai';

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'La variable de entorno OPENAI_API_KEY no está configurada en el archivo .env.local.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = new OpenAI({
      apiKey: apiKey,
    });

    const body = await request.json();
    const { input } = body;

    if (!input) {
      return new Response(JSON.stringify({ error: 'Input is required' }), { status: 400 });
    }

    const responseStream = await client.responses.create({
      //Debido a que el agente se activa al momento de abrir la herramienta de prescripcion 
      // y sugiere nuevas prescripciones en funcion de la HC del paciente es necesario usar 
      // un modelo con mayor capacidad de procesamiento como gpt-5
      model: "gpt-5",

      //Este modelo se utilizaria si quisiera evaluar la prescripcion ya realizada por el usuario
      //model: "gpt-5-mini",

      max_output_tokens: 16000,
      reasoning: {
        effort: "low"
      },
      tools: [
        {
          type: "file_search",
          vector_store_ids: [
            "vs_6a20b6372b588191b0c0afe2b72e80df",
            "vs_6a20b5a1c0a48191a4d65c56eeb7b3fe"
          ]
        }
      ],
      instructions: `
        Eres un Farmacéutico Clínico Pediátrico.

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
        * No repetir información.
    `,
      input: input,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of responseStream) {
            if (chunk.type === 'response.output_text.delta' && chunk.delta) {
              controller.enqueue(encoder.encode(chunk.delta));
            }
          }
        } catch (err) {
          console.error("Error streaming OpenAI response:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
