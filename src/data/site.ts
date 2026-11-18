export const site = {
  name: 'Bar Meridiano',
  kind: 'Coctelería de autor',
  neighborhood: 'Palermo, Buenos Aires',
  tagline: 'Cócteles de autor, jazz en vivo y la hora justa para brindar.',
  /** Número ficticio: este es un sitio de demostración. */
  whatsapp: '5491100000000',
  instagram: 'barmeridiano',
  isDemo: true,
} as const;

export type Plato = { nombre: string; detalle: string; precio: number };
export type Seccion = { id: string; titulo: string; items: Plato[] };

export const CARTA: Seccion[] = [
  {
    id: 'clasicos',
    titulo: 'Clásicos',
    items: [
      { nombre: 'Negroni', detalle: 'Gin, Campari y vermut rosso. Cáscara de naranja.', precio: 11500 },
      { nombre: 'Old Fashioned', detalle: 'Bourbon, azúcar, amargo de angostura.', precio: 12500 },
      { nombre: 'Daiquiri', detalle: 'Ron blanco, lima y almíbar. Seco y frío.', precio: 10500 },
    ],
  },
  {
    id: 'autor',
    titulo: 'De autor',
    items: [
      { nombre: 'Meridiano', detalle: 'Gin, vermut blanco, pomelo rosado y flor de saúco.', precio: 13500 },
      { nombre: 'Gran Hotel', detalle: 'Whisky, miel de ciudad, limón y un toque ahumado.', precio: 14500 },
      { nombre: 'Pasaje 1929', detalle: 'Ron añejo, café frío, cacao amargo y naranja.', precio: 14000 },
      { nombre: 'Jardín de invierno', detalle: 'Vodka, pera, romero y espuma de limón.', precio: 13000 },
    ],
  },
  {
    id: 'sin-alcohol',
    titulo: 'Sin alcohol',
    items: [
      { nombre: 'Aurora', detalle: 'Pomelo, jengibre, miel y soda.', precio: 7500 },
      { nombre: 'Vermut cero', detalle: 'Infusión de hierbas, cítricos y tónica.', precio: 8000 },
    ],
  },
  {
    id: 'picar',
    titulo: 'Para picar',
    items: [
      { nombre: 'Aceitunas y almendras', detalle: 'Tostadas con sal de mar y romero.', precio: 6000 },
      { nombre: 'Tabla de quesos', detalle: 'Tres quesos, frutos secos y mermelada de higo.', precio: 16500 },
      { nombre: 'Croquetas de jamón', detalle: 'Ocho unidades con alioli de limón.', precio: 11000 },
    ],
  },
];

export type Evento = { dia: string; titulo: string; texto: string };

export const EVENTOS: Evento[] = [
  { dia: 'Jueves', titulo: 'Jazz en vivo', texto: 'Trío en vivo desde las 21 h. Sin entrada ni consumo mínimo.' },
  { dia: 'Viernes', titulo: 'Noche de vermut', texto: 'Seis vermuts de autor en copa chica, para probar de a uno o todos.' },
  { dia: 'Domingo', titulo: 'Vinilos y gin', texto: 'Una selección de discos clásicos y la carta de gin tonic completa.' },
];

export const pesos = (n: number): string => `$ ${n.toLocaleString('es-AR')}`;
