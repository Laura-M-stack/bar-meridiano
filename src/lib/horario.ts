/** Horarios del bar y cálculo de "abierto ahora" en hora de Buenos Aires. */

export const ZONA = 'America/Argentina/Buenos_Aires';

/** Minutos desde las 00:00. Si `cierra` supera 1440, el local cierra después de medianoche. */
export type Franja = { abre: number; cierra: number };

/** 0 = domingo … 6 = sábado. `null` = cerrado todo el día. */
export const HORARIO: Record<number, Franja | null> = {
  0: { abre: 19 * 60, cierra: 24 * 60 },
  1: null,
  2: { abre: 19 * 60, cierra: 25 * 60 },
  3: { abre: 19 * 60, cierra: 25 * 60 },
  4: { abre: 19 * 60, cierra: 25 * 60 },
  5: { abre: 19 * 60, cierra: 27 * 60 },
  6: { abre: 19 * 60, cierra: 27 * 60 },
};

export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const;

export type Estado = { abierto: boolean; texto: string };

export function hhmm(minutos: number): string {
  const m = ((minutos % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** Día de la semana y minutos del día de un instante, según la hora de Buenos Aires. */
export function relojLocal(fecha: Date): { dia: number; minutos: number } {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(fecha);
  const get = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? '';
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { dia, minutos: Number(get('hour')) * 60 + Number(get('minute')) };
}

/** Día de la semana de una fecha ISO (AAAA-MM-DD), sin depender de la zona horaria del navegador. */
export function diaDeSemana(iso: string): number {
  return new Date(`${iso}T12:00:00Z`).getUTCDay();
}

export function estadoAhora(ahora: Date = new Date()): Estado {
  const { dia, minutos } = relojLocal(ahora);

  // ¿Sigue abierto desde la noche anterior (cierre pasada la medianoche)?
  const ayer = HORARIO[(dia + 6) % 7];
  if (ayer && ayer.cierra > 1440 && minutos < ayer.cierra - 1440) {
    return { abierto: true, texto: `Abierto ahora · cierra a las ${hhmm(ayer.cierra)}` };
  }

  const hoy = HORARIO[dia];
  if (hoy && minutos >= hoy.abre && minutos < hoy.cierra) {
    return { abierto: true, texto: `Abierto ahora · cierra a las ${hhmm(hoy.cierra)}` };
  }
  if (hoy && minutos < hoy.abre) {
    return { abierto: false, texto: `Cerrado · abre hoy a las ${hhmm(hoy.abre)}` };
  }

  // Ya cerró hoy (u hoy no abre): buscar el próximo día con servicio.
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    const f = HORARIO[d];
    if (f) {
      const cuando = i === 1 ? 'mañana' : `el ${DIAS[d]}`;
      return { abierto: false, texto: `Cerrado · abre ${cuando} a las ${hhmm(f.abre)}` };
    }
  }
  return { abierto: false, texto: 'Cerrado' };
}
