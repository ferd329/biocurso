import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "biocursos",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function run() {
  const p = mysql.createPool(pool);
  const conn = await p.getConnection();

  try {
    console.log("🌱 Sembrando datos de BioCursos...");

    // 1. Insertar planes
    const [planesResult] = await conn.execute(
      "SELECT id FROM planes"
    );
    const planesExistentes = planesResult.length;

    if (!planesExistentes) {
      await conn.execute(
        "INSERT INTO planes (nombre, tipo, precio_mensual) VALUES (?, ?, ?)",
        ["Plan Básico", "mensual", 49.99]
      );
      await conn.execute(
        "INSERT INTO planes (nombre, tipo, precio_mensual) VALUES (?, ?, ?)",
        ["Plan Pro", "anual", 499.99]
      );
      await conn.execute(
        "INSERT INTO planes (nombre, tipo, precio_mensual) VALUES (?, ?, ?)",
        ["Plan Enterprise", "unique", 1499.99]
      );
      console.log("  ✅ Planes creados");
    } else {
      console.log("  ⚠️ Planes ya existen, saltando");
    }

    // 2. Insertar cursos (con módulos, lecciones, flashcards y labs)
    // Los datos vienen inspeccionados de data.js original
    const cursosData = [
      {
        slug: "fundamentos-biologia",
        titulo: "Fundamentos de Biología",
        subtitulo: "Desde la célula hasta los organismos complejos",
        descripcion: "Un viaje completo por los principios fundamentales de la biología moderna.",
        area: "Biología",
        tema: "Celular",
        nivel_educativo: "Preparatoria",
        formato: "Online",
        precio_individual: 79.99,
        tono: "navy",
        modulos: [
          {
            id: "bio-m1",
            titulo: "La célula viva",
            descripcion: "Estructura, transporte y energía.",
            lecciones: [
              {
                id: "bio-l1",
                titulo: "La célula: la unidad de la vida",
                duracion: "12:40",
                duracion_seg: 760,
                resumen: "Reconoce los organelos esenciales y la función que cumple cada uno dentro de la célula.",
                puntos_clave: ["La membrana separa el interior celular del entorno.", "Las mitocondrias transforman energía química en ATP.", "Procariotas y eucariotas difieren en la organización de su material genético."],
                quiz: [
                  { id: "bio-q1", pregunta: "¿Qué organelo produce la mayor parte del ATP en una célula eucariota?", opciones: ["Ribosoma", "Mitocondria", "Lisosoma", "Aparato de Golgi"], correcta: 1, explicacion: "La mitocondria lleva a cabo la respiración celular y genera ATP, la moneda energética de la célula." },
                  { id: "bio-q2", pregunta: "¿Cuál es una función principal de la membrana plasmática?", opciones: ["Sintetizar proteínas", "Almacenar el ADN", "Regular el intercambio de sustancias", "Producir enzimas digestivas"], correcta: 2, explicacion: "La membrana es selectivamente permeable: controla qué entra y qué sale de la célula." },
                  { id: "bio-q3", pregunta: "Una diferencia clave de las células procariotas es que…", opciones: ["Tienen núcleo", "Carecen de membrana nuclear", "Tiene mitocondrias", "Son más grandes"], correcta: 1, explicacion: "Las células procariotas carecen de un núcleo delimitado por membrana." }
                ],
                flashcards: [
                  { id: "bio-f1", frente: "¿Qué organelo produce la mayor parte del ATP?", reverso: "La mitocondria, mediante la respiración celular.", pista: "Tiene doble membrana." },
                  { id: "bio-f2", frente: "¿Cuál es la función de la membrana plasmática?", reverso: "Regular el intercambio de sustancias entre la célula y su entorno.", pista: "Es selectivamente permeable." }
                ]
              },
              {
                id: "bio-l2",
                titulo: "Transporte celular y respiración",
                duracion: "15:20",
                duracion_seg: 920,
                resumen: "Cómo se mueven sustancias dentro y fuera de la célula y cómo se genera energía.",
                puntos_clave: ["El transporte activo requiere energía (ATP).", "El transporte pasivo ocurre por gradientes de concentración.", "La respiración celular ocurre en las mitocondrias."],
                quiz: [
                  { id: "bio-q4", pregunta: "¿Qué tipo de transporte requiere energía directa?", opciones: ["Difusión", "Facilitada", "Activo", "Ósmosis"], correcta: 2, explicacion: "El transporte activo gasta ATP para mover sustancias contra el gradiente." },
                  { id: "bio-q5", pregunta: "¿Dónde tiene lugar la respiración celular?", opciones: ["Núcleo", "Mitosoma", "Mitocondria", "Retículo endoplásmico"], correcta: 2 }
                ],
                flashcards: [
                  { id: "bio-f3", frente: "¿Cuál es la moneda energética de la célula?", reverso: "ATP", pista: "Intercambio de fosfato." },
                  { id: "bio-f4", frente: "¿Difusión o transporte activo?", reverso: "Transporte activo (gasta ATP)", pista: "Mueve contra el gradiente." }
                ]
              }
            ],
            flashcards: [
              { id: "bio-f1", frente: "¿Qué organelo produce la mayor parte del ATP?", reverso: "La mitocondria, mediante la respiración celular.", pista: "Tiene doble membrana." },
              { id: "bio-f2", frente: "¿Cuál es la función de la membrana plasmática?", reverso: "Regular el intercambio de sustancias entre la célula y su entorno.", pista: "Es selectivamente permeable." }
            ]
          },
          {
            id: "bio-m2",
            titulo: "Genética y Herencia",
            descripcion: "Los principios de Mendel y la expresión de rasgos.",
            lecciones: [
              {
                id: "bio-l3",
                titulo: "Herencia mendeliana",
                duracion: "18:30",
                duracion_seg: 1100,
                resumen: "Leyes de segregación e independientes de Mendel.",
                puntos_clave: ["La ley de la segregación.", "La ley de la independencia.", "Los alelos se separan durante la meiosis."],
                quiz: [
                  { id: "bio-q6", pregunta: "¿Qué ley establece que los alelos se separan durante la meiosis?", opciones: ["Ley de segregación", "Ley de dominancia", "Ley de independencia", "Ley de uniformidad"], correcta: 0, explicacion: "La ley de segregación establece que los alelos se separan durante la meiosis." },
                  { id: "bio-q7", pregunta: "¿Cuál es la razón por la que los rasgos heredan de forma independiente?", opciones: ["Por que los genes están en el mismo cromosoma", "Por que los genes están en cromosomas diferentes", "Por que los alelos se mezclan", "Por que los cromosomas se duplican"], correcta: 1, explicacion: "Los genes localizados en cromosomas diferentes se heredan de forma independiente." }
                ],
                flashcards: [
                  { id: "bio-f5", frente: "¿Cuántas leyes fundamentales propuso Mendel?", reverso: "Dos (segregación e independencia)", pista: "Publicadas en 1866." }
                ]
              }
            ],
            flashcards: [
              { id: "bio-f6", frente: "¿Qué ley establece que los alelos se separan?", reverso: "Ley de segregación", pista: "Durante la meiosis." }
            ]
          },
          {
            id: "bio-m3",
            titulo: "Evolución y Diversidad",
            descripcion: "Mecanismos de evolución y clasificación de seres vivos.",
            lecciones: [
              {
                id: "bio-l4",
                titulo: "Origen de la vida y evolución",
                duracion: "20:00",
                duracion_seg: 1200,
                resumen: "Teorías sobre el origen de la vida y mecanismos evolutivos.",
                puntos_clave: ["Selección natural.", "Drift genético.", "Mutaciones como fuente de variación."],
                quiz: [
                  { id: "bio-q8", pregunta: "¿Cuál es el principal mecanismo de evolución?", opciones: ["Mutación", "Selección natural", "Migración", "Drift genético"], correcta: 1, explicacion: "La selección natural es el principal mecanismo de evolución propuesto por Darwin." }
                ],
                flashcards: [
                  { id: "bio-f7", frente: "¿Quién propuso la teoría de la selección natural?", reverso: "Charles Darwin", pista: "Publicó 'El origen de las especies' en 1859." }
                ]
              }
            ],
            flashcards: [
              { id: "bio-f8", frente: "¿El drift genético es selección natural?", reverso: "No, es un cambio aleatorio en la frecuencia alélica", pista: "Afecta poblaciones pequeñas." }
            ]
          }
        ],
        labs: [
          { id: "punnett", titulo: "Genética con cruces de Punnett", descripcion: "Simulación de herencia mendeliana usando cruces monohíbridos y dihíbridos.", tipo: "simulacion", pasos: ["Selecciona los padres y sus alelos", "Completa la cuadrícula de Punnett", "Cuenta las proporciones fenotípicas y genotípicas", "Interpreta los resultados esperados"] },
          { id: "enzyme", titulo: "Simulación de cinética enzimática", descripcion: "Explora cómo la concentración de sustrato, pH y temperatura afectan la actividad enzimática.", tipo: "simulacion", pasos: ["Ajusta el parámetro de concentración de sustrato", "Varía el pH del entorno", "Modifica la temperatura de la reacción", "Observa la velocidad de la reacción en el gráfico"] }
        ]
      },
      {
        slug: "fundamentos-quimica",
        titulo: "Fundamentos de Química",
        subtitulo: "Estructura atómica y reacciones químicas",
        descripcion: "Los principios básicos que rigen la materia y sus transformaciones.",
        area: "Química",
        tema: "Atómica",
        nivel_educativo: "Preparatoria",
        formato: "Online",
        precio_individual: 69.99,
        tono: "emerald",
        modulos: [
          {
            id: "qui-m1",
            titulo: "Estructura atómica",
            descripcion: "Protoelectrones, neutrones y organización nuclear.",
            lecciones: [
              {
                id: "qui-l1",
                titulo: "El átomo y sus partículas",
                duracion: "10:15",
                duracion_seg: 615,
                resumen: "Protones, neutrones y electrones: composición y cargas.",
                puntos_clave: ["El átomo está compuesto por protones, neutrones y electrones.", "Los protones tienen carga positiva, los electrones negativa y los neutrones son neutrales.", "El núcleo contiene protones y neutrones (núcleo atómico)."],
                quiz: [
                  { id: "qui-q1", pregunta: "¿Qué partículas componen el núcleo atómico?", opciones: ["Protones y electrones", "Neutrones y electrones", "Protones y neutrones", "Leptones y quarks"], correcta: 2, explicacion: "El núcleo atómico está formado por protones y neutrones." },
                  { id: "qui-q2", pregunta: "¿Carga eléctrica del protón?", opciones: ["Positiva", "Negativa", "Neutral", "Variable"], correcta: 0 }
                ],
                flashcards: [
                  { id: "qui-f1", frente: "Carga del protón:", reverso: "Positiva", pista: "+1." }
                ]
              },
              {
                id: "qui-l2",
                titulo: "Configuración electrónica",
                duracion: "12:45",
                duracion_seg: 765,
                resumen: "Cómo se distribuyen los electrones en los orbitales atómicos.",
                puntos_clave: ["Los electrones ocupan orbitales alrededor del núcleo.", "Siguen el principio de Aufbau, Paul exclusivo y regla de Hund.", "La configuración determina propiedades químicas y reactividad."],
                quiz: [
                  { id: "qui-q3", pregunta: "¿Cuántos electrones pueden ocupar un orbital p?", opciones: ["1", "2", "3", "4"], correcta: 1, explicacion: "Un orbital p máximo 2 electrones (principio de exclusión de Pauli)." }
                ],
                flashcards: [
                  { id: "qui-f2", frente: "Principio de exclusión de Pauli:", reverso: "Máximo 2 electrones por orbital", pista: "Porspin opuesto." }
                ]
              }
            ],
            flashcards: [
              { id: "qui-f1", frente: "Carga del protón:", reverso: "Positiva", pista: "+1." },
              { id: "qui-f3", frente: "Configuración electrónica del H:", reverso: "1s¹", pista: "Un solo electrón." }
            ]
          },
          {
            id: "qui-m2",
            titulo: "Enlaces y reacciones",
            descripcion: "Tipos de enlaces químicos y equilibrio químico.",
            lecciones: [
              {
                id: "qui-l3",
                titulo: "Tipos de enlaces iónicos y covalentes",
                duracion: "14:30",
                duracion_seg: 870,
                resumen: "Diferencias entre transferencia y compartición de electrones.",
                puntos_clave: ["Enlace iónico: transferencia de electrones entre átomos.", "Enlace covalente: compartición de pares de electrones.", "Enlace metálico: mar de electrones libres en metales."],
                quiz: [
                  { id: "qui-q4", pregunta: "¿En un enlace iónico, qué ocurre con los electrones?", opciones: ["Se comparten", "Se transfieren", "Se emparejan", "Se repelen"], correcta: 1, explicacion: "En el enlace iónico los electrones se transfieren de un átomo a otro." }
                ],
                flashcards: [
                  { id: "qui-f4", frente: "Tipo de enlace entre Na y Cl:", reverso: "Iónico (transferencia de electrón)", pista: "Metales y no metales." }
                ]
              },
              {
                id: "qui-l4",
                titulo: "Equilibrio químico",
                duracion: "16:00",
                duracion_seg: 960,
                resumen: "Constante de equilibrio y ley de acción de masas.",
                puntos_clave: ["En equilibrio, las reacciones directa e inversa ocurren a misma velocidad.", "La constante K expresa la relación entre productos y reactivos.", "Los cambios de presión/conc. desplazan el equilibrio (Le Chatelier)."],
                quiz: [
                  { id: "qui-q5", pregunta: "¿Qué ocurre en equilibrio químico?", opciones: ["Reacción se detiene", "Productos se acaban", "Reacciones directa e inversa a misma velocidad", "Reactivos se acaban"], correcta: 2 }
                ],
                flashcards: [
                  { id: "qui-f5", frente: "Constante de equilibrio > 1:", reverso: "Productos favorecidos", pista: "Más productos que reactivos a equilibrio." }
                ]
              }
            ],
            flashcards: [
              { id: "qui-f6", frente: "Enlace iónico vs covalente:", reverso: "Transferencia vs compartición", pista: "Metales vs no metales." }
            ]
          }
        ],
        labs: [
          {
            id: "ph",
            titulo: "Simulación de pH y fuerza iónica",
            descripcion: "Explora cómo el pH afecta la ionización de moléculas y la solubilidad.",
            tipo: "simulacion",
            pasos: ["Selecciona una molécula débil", "Ajusta el pH usando el control deslizante", "Observa el grado de ionización", "Mide la solubilidad resultante"]
          }
        ]
      },
      {
        slug: "fotosintesis-celular",
        titulo: "Fotosíntesis y Respiración Celular",
        subtitulo: "Transformación de energía en los organismos",
        descripcion: "Los procesos por los cuales los organismos convierten luz y materia en energía utilizable.",
        area: "Biología",
        tema: "Energía",
        nivel_educativo: "Preparatoria",
        formato: "Online",
        precio_individual: 89.99,
        tono: "navy",
        modulos: [
          {
            id: "fis-m1",
            titulo: "Fotosíntesis",
            descripcion: "Conversión de energía lumínica en energía química.",
            lecciones: [
              {
                id: "fis-l1",
                titulo: "Etapas de la fotosíntesis",
                duracion: "22:00",
                duracion_seg: 1320,
                resumen: "Fase luminosa y fase independiente de luz (Calvin).",
                puntos_clave: ["Fase luminosa: captura de luz, producción de ATP y NADPH en tilacoides.", "Fase de Calvin: fijo de CO₂, reducción a glucosa en el estroma.", "O₂ se libera como subproducto de la fase luminosa."],
                quiz: [
                  { id: "fis-q1", pregunta: "¿Dónde tiene lugar la fase luminosa de la fotosíntesis?", opciones: ["Estroma", "Tilacoides", "Mitocondria", "Núcleo"], correcta: 1, explicacion: "La fase luminosa ocurre en las membranas de los tilacoides de los cloroplastos." },
                  { id: "fis-q2", pregunta: "¿Qué subproducto se libera durante la fotosíntesis?", opciones: ["CO₂", "O₂", "N₂", "H₂O"], correcta: 1 }
                ],
                flashcards: [
                  { id: "fis-f1", frente: "¿Dónde ocurre la fotosíntesis?", reverso: "En los cloroplastos", pista: "Orgánelo fotosintético." }
                ]
              },
              {
                id: "fis-l2",
                titulo: "Factor limitante",
                duracion: "15:00",
                duracion_seg: 900,
                resumen: "Intensidad lumínica, CO₂ y temperatura.",
                puntos_clave: ["La fotosíntesis es limitada por el factor más escaso.", "Aumentar luz, CO₂ o temperatura incrementa la velocidad (hasta un límite)."],
                quiz: [
                  { id: "fis-q3", pregunta: "¿Cuál NO es un factor limitante de la fotosíntesis?", opciones: ["Luz", "CO₂", "Temperatura", "Gravedad"], correcta: 3 }
                ],
                flashcards: [
                  { id: "fis-f2", frente: "Factor limitante principal:", reverso: "Intensidad lumínica", pista: "Si la luz es baja, no hay más fotosíntesis." }
                ]
              }
            ],
            flashcards: [
              { id: "fis-f1", frente: "¿Dónde ocurre la fotosíntesis?", reverso: "En los cloroplastos", pista: "Orgánelo fotosintético." },
              { id: "fis-f3", frente: "Factor limitante:", reverso: "El más escaso de luz, CO₂, temperatura", pista: "Lei Liebig." }
            ]
          },
          {
            id: "fis-m2",
            titulo: "Respiración Celular",
            descripcion: "Glicolisis, ciclo de Krebs y cadena de transporte de electrones.",
            lecciones: [
              {
                id: "fis-l3",
                titulo: "Etapas de la respiración celular",
                duracion: "25:00",
                duracion_seg: 1500,
                resumen: "Glicolisis, ciclo de Krebs y cadena respiratoria.",
                puntos_clave: ["Glicolisis: glucosa a piruvato en citoplasma, genera ATP y NADH.", "Ciclo de Krebs: piruvato en mitocondria, genera CO₂, ATP, NADH y FADH₂.", "Cadena de transporte: NADH y FADH₂ ceden electrones para generar ATP quimiosmótico."],
                quiz: [
                  { id: "fis-q4", pregunta: "¿En qué parte de la célula tiene lugar la glicolisis?", opciones: ["Mitocondria", "Citoplasma", "Núcleo", "Retículo endoplásmico"], correcta: 1 }
                ],
                flashcards: [
                  { id: "fis-f3", frente: "¿Dónde ocurre la glicolisis?", reverso: "En el citoplasma", pista: "No requiere oxígeno." }
                ]
              },
              {
                id: "fis-l4",
                titulo: "Rendimiento ATP",
                duracion: "18:00",
                duracion_seg: 1080,
                resumen: "Total de ATP por molécula de glucosa.",
                puntos_clave: ["Glicolisis: 2 ATP netos + 2 NADH.", "Ciclo de Krebs: 2 ATP + 6 NADH + 2 FADH₂.", "Cadena respiratoria: ~26-30 ATP desde NADH y ~18-20 desde FADH₂.", "Total aproximado: 30-38 ATP por glucosa."],
                quiz: [
                  { id: "fis-q5", pregunta: "¿Cuántos ATP se producen directamente en el ciclo de Krebs por glucosa?", opciones: ["2", "6", "10", "12"], correcta: 0 }
                ],
                flashcards: [
                  { id: "fis-f4", frente: "ATP neto de glicolisis:", reverso: "2 ATP", pista: "Por molécula de glucosa." }
                ]
              }
            ],
            flashcards: [
              { id: "fis-f3", frente: "¿Dónde ocurre la glicolisis?", reverso: "En el citoplasma", pista: "No requiere oxígeno." },
              { id: "fis-f5", frente: "ATP total por glucosa:", reverso: "30-38 ATP", pista: "Aproximado según el shuttle." }
            ]
          }
        ],
        labs: [
          {
            id: "respiracion",
            titulo: "Simulación de respiración celular",
            descripcion: "Glicolisis, ciclo de Krebs y cadena de transporte de electrones en condiciones variables.",
            tipo: "simulacion",
            pasos: ["Selecciona sustrato (glucosa o grasa)", "Ajusta disponibilidad de oxígeno", "Observa producción de ATP y CO₂", "Compara rendimiento aeróbico vs anaeróbico"]
          }
        ]
      },
      {
        slug: "genetica-avanzada",
        titulo: "Genética Avanzada",
        subtitulo: "Más allá de Mendel: regulación y poblaciones",
        descripcion: "Genética molecular, regulación génica y poblaciones evolutivas.",
        area: "Biología",
        tema: "Molecular",
        nivel_educativo: "Universidad",
        formato: "Online",
        precio_individual: 129.99,
        tono: "emerald",
        modulos: [
          {
            id: "gen-m1",
            titulo: "Regulación génica",
            descripcion: "Cómo las células controlan la expresión génica.",
            lecciones: [
              {
                id: "gen-l1",
                titulo: "Operador y promotor",
                duracion: "16:00",
                duracion_seg: 960,
                resumen: "RNA polimerasa y factores de transcripción.",
                puntos_clave: ["El operador es la región donde se liga el represor.", "La promotor es donde inicia la transcripción.", "Los factores de transcripción activan o reprimen la expresión."],
                quiz: [
                  { id: "gen-q1", pregunta: "¿Dónde se liga el represor para apagar un gen?", opciones: ["Promotor", "Operador", "Enhancer", "Silencer"], correcta: 1 }
                ],
                flashcards: [
                  { id: "gen-f1", frente: "¿Qué región se liga al represor?", reverso: "Operador", pista: "Está junto al promotor." }
                ]
              },
              {
                id: "gen-l2",
                titulo: "Epigenética",
                duracion: "14:00",
                duracion_seg: 840,
                resumen: "Modificaciones al cromatina que afectan la expresión sin cambiar el ADN.",
                puntos_clave: ["Metilación de ADN usualmente reprime la expresión.", "Histonas acetiladas favorecen la expresión.", "Cambios epigenéticos pueden heretarse."],
                quiz: [
                  { id: "gen-q2", pregunta: "¿Qué modificacion epigenética usualmente reprime la expresión?", opciones: ["Acetilación de histonas", "Metilación de ADN", "Fosforilación de histonas", "Ubiquitinación"], correcta: 1 }
                ],
                flashcards: [
                  { id: "gen-f2", frente: "Metilación de ADN usualmente:", reverso: "Reprime la expresión génica", pista: "En regiones CpG." }
                ]
              }
            ],
            flashcards: [
              { id: "gen-f1", frente: "¿Qué región se liga al represor?", reverso: "Operador", pista: "Está junto al promotor." },
              { id: "gen-f3", frente: "DNA methylation effect:", reverso: "Usual mente reprime", pista: "En islas CpG." }
            ]
          },
          {
            id: "gen-m2",
            titulo: " poblaciones evolutivas",
            descripcion: "Drift genético, flujo de genes y selección en poblaciones.",
            lecciones: [
              {
                id: "gen-l3",
                titulo: "Drift genético y flujo de genes",
                duracion: "17:00",
                duracion_seg: 1020,
                resumen: "Cambios aleatorios en frecuencias alélicas entre generaciones.",
                puntos_clave: ["Drift genético: cambio aleatorio, más fuerte en poblaciones pequeñas.", "Flujo de genes: movimiento de alelos entre poblaciones.", " Ambos pueden reducir la diferenciación poblacional."],
                quiz: [
                  { id: "gen-q3", pregunta: "¿En qué tipo de poblaciones es más fuerte el drift genético?", opciones: ["Grandes", "Medianas", "Pequeñas", "Cualquiera"], correcta: 2 }
                ],
                flashcards: [
                  { id: "gen-f4", frente: "Drift genético más fuerte en:", reverso: "Poblaciones pequeñas", pista: "El azar tiene más efecto." }
                ]
              },
              {
                id: "gen-l4",
                titulo: "Equilibrio de Hardy-Weinberg",
                duracion: "15:00",
                duracion_seg: 900,
                resumen: "Frecuencias alélicas estables sin evolución.",
                puntos_clave: ["p + q = 1", "p² + 2pq + q² = 1", "Supuestos: población grande, aleatoriedad, sin migración, sin mutación, sin selección."],
                quiz: [
                  { id: "gen-q4", pregunta: "¿Qué condición NO es necesaria para el equilibrio de Hardy-Weinberg?", opciones: ["Población grande", "Aleatoriedad en apareamiento", "Sin mutación", "Selección natural activa"], correcta: 3 }
                ],
                flashcards: [
                  { id: "gen-f5", frente: "¿Qué excluye la selección natural del equilibrio HW?", reverso: "Cambio en frecuencias alélicas", pista: "La HW asume ausencia de selección." }
                ]
              }
            ],
            flashcards: [
              { id: "gen-f6", frente: "Condición HW: población grande:", reverso: "El azar es negligible", pista: "El drift es pequeño." },
              { id: "gen-f7", frente: "p + q = 1:", reverso "Frecuencias alélicas", pista: "Siempre se cumplen." }
            ]
          }
        ],
        labs: [
          {
            id: "hw-simul",
            titulo: "Simulación de Hardy-Weinberg",
            descripcion: "Visualiza cómo las frecuencias alélicas se mantienen o cambian en una población.",
            tipo: "simulacion",
            pasos: ["Ingresa la frecuencia alélica inicial (p)", "Simula varias generaciones", "Observa la estabilidad o cambio en p y q", "Comprueba los supuestos (tamaño, migración, mutación)"]
          }
        ]
      }
    ];

    for (const curso of cursosData) {
      // Insertar curso
      const [courseResult] = await conn.execute(
        `INSERT INTO cursos (slug, titulo, subtitulo, descripcion, area, tema, nivel_educativo, formato, precio_individual, rating, estudiantes, tono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [curso.slug, curso.titulo, curso.subtitulo, curso.descripcion, curso.area, curso.tema, curso.nivel_educativo, curso.formato, curso.precio_individual, curso.rating || 0, curso.estudiantes || 0, curso.tono]
      );
      const courseId = courseResult.insertId;

      // Insertar módulos
      for (const modulo of curso.modulos) {
        await conn.execute(
          `INSERT INTO modulos (id, curso_id, titulo, descripcion, orden) VALUES (?, ?, ?, ?, ?)`,
          [modulo.id, courseId, modulo.titulo, modulo.descripcion, 0]
        );

        // Insertar lecciones
        for (const leccion of modulo.lecciones) {
          await conn.execute(
            `INSERT INTO lecciones (id, modulo_id, titulo, duracion, duracion_seg, resumen, puntos_clave, quiz) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [leccion.id, modulo.id, leccion.titulo, leccion.duracion, leccion.duracion_seg, leccion.resumen, JSON.stringify(leccion.puntos_clave), JSON.stringify(leccion.quiz)]
          );

          // Insertar flashcards
          for (const fc of leccion.flashcards) {
            await conn.execute(
              `INSERT INTO flashcards (id, leccion_id, frente, reverso, pista) VALUES (?, ?, ?, ?, ?)`,
              [fc.id, leccion.id, fc.frente, fc.reverso, fc.pista]
            );
          }
        }

        // Insertar labs
        for (const lab of modulo.labs) {
          await conn.execute(
            `INSERT INTO labs (id, curso_id, titulo, descripcion, tipo, pasos) VALUES (?, ?, ?, ?, ?, ?)`,
            [lab.id, courseId, lab.titulo, lab.descripcion, lab.tipo, JSON.stringify(lab.pasos)]
          );
        }
      }

      // Insertar flashcards de módulo (nivel superior)
      for (const fc of curso.flashcards) {
        await conn.execute(
          `INSERT INTO flashcards (id, leccion_id, frente, reverso, pista) VALUES (?, ?, ?, ?, ?)`,
          [fc.id, null, fc.frente, fc.reverso, fc.pista]
        );
      }
    }

    // 3. Insertar un contacto de ejemplo
    const [contactoExists] = await conn.execute(
      "SELECT COUNT(*) as c FROM contactos"
    );
    if (contactoExists[0].c === 0) {
      await conn.execute(
        `INSERT INTO contactos (nombre, email, empresa, mensaje) VALUES (?, ?, ?, ?)`,
        ["Empresa Beta", "contacto@betalab.com", "Beta Labs", "Interesados en planes empresariales para equipo de 20 personas"]
      );
      console.log("  ✅ Contacto de ejemplo creado");
    }

    console.log("🌱 Seed completado exitosamente");
  } catch (err) {
    console.error("❌ Error en seed:", err);
    process.exit(1);
  } finally {
    await conn.release();
    await p.end();
  }
}

run();