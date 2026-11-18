/** Validación de reservas y armado del mensaje de WhatsApp. Sin dependencias del DOM. */
import { HORARIO, ZONA, DIAS, diaDeSemana, hhmm } from './horario';

export const MAX_PERSONAS = 10;
/** Margen antes del cierre en el que ya no se toman reservas. */
const MARGEN_CIERRE = 90;
const PASO = 30;

export type Reserva = {
  nombre: string;
  fecha: string; // AAAA-MM-DD
  hora: string; // HH:MM
  personas: number;
  notas: string;
};

export type Errores = Partial<Record<keyof Reserva, string>>;

/** Fecha de hoy (AAAA-MM-DD) en Buenos Aires. */
export function hoyISO(ahora: Date = new Date()): string {
  // en-CA formatea como AAAA-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA }).format(ahora);
}

export function aMinutos(hora: string): number {
  const m = /^(\d{2}):(\d{2})$/.exec(hora);
  if (!m) return NaN;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** Horarios reservables para una fecha. Vacío si el bar está cerrado ese día. */
export function horariosPara(fecha: string): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return [];
  const franja = HORARIO[diaDeSemana(fecha)];
  if (!franja) return [];
  const ultimo = franja.cierra - MARGEN_CIERRE;
  const out: string[] = [];
  for (let t = franja.abre; t <= ultimo; t += PASO) out.push(hhmm(t));
  return out;
}

export function validar(r: Reserva, ahora: Date = new Date()): Errores {
  const e: Errores = {};

  if (r.nombre.trim().length < 2) e.nombre = 'Ingrese un nombre para la reserva.';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.fecha) || Number.isNaN(Date.parse(`${r.fecha}T12:00:00Z`))) {
    e.fecha = 'Elija una fecha.';
  } else if (r.fecha < hoyISO(ahora)) {
    e.fecha = 'La fecha ya pasó.';
  } else if (!HORARIO[diaDeSemana(r.fecha)]) {
    e.fecha = `Los ${DIAS[diaDeSemana(r.fecha)]} el bar permanece cerrado.`;
  }

  if (!e.fecha) {
    if (!horariosPara(r.fecha).includes(r.hora)) e.hora = 'Elija un horario disponible.';
    else if (r.fecha === hoyISO(ahora)) {
      const reloj = new Intl.DateTimeFormat('en-US', {
        timeZone: ZONA,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(ahora);
      const h = Number(reloj.find((p) => p.type === 'hour')?.value);
      const m = Number(reloj.find((p) => p.type === 'minute')?.value);
      if (aMinutos(r.hora) <= h * 60 + m) e.hora = 'Ese horario ya pasó.';
    }
  }

  if (!Number.isInteger(r.personas) || r.personas < 1) e.personas = 'Indique cuántas personas asistirán.';
  else if (r.personas > MAX_PERSONAS) {
    e.personas = `Para grupos de más de ${MAX_PERSONAS} personas, escríbanos por WhatsApp.`;
  }

  return e;
}

/** "2026-12-05" → "sábado 5 de diciembre". */
export function fechaLarga(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  const mes = new Intl.DateTimeFormat('es-AR', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
  return `${DIAS[diaDeSemana(iso)]} ${d} de ${mes}`;
}

export function mensajeWhatsapp(r: Reserva): string {
  const lineas = [
    'Hola, quisiera reservar una mesa en Bar Meridiano.',
    `Nombre: ${r.nombre.trim()}`,
    `Fecha: ${fechaLarga(r.fecha)}`,
    `Hora: ${r.hora} h`,
    `Personas: ${r.personas}`,
  ];
  const notas = r.notas.trim();
  if (notas) lineas.push(`Notas: ${notas}`);
  return lineas.join('\n');
}

export function whatsappUrl(telefono: string, r: Reserva): string {
  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeWhatsapp(r))}`;
}
