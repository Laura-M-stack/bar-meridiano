import { describe, expect, it } from 'vitest';
import { diaDeSemana, estadoAhora, hhmm } from './horario';

// Buenos Aires es UTC-3 todo el año. Estas fechas de diciembre de 2026 caen:
// 2026-12-04 viernes, 12-05 sábado, 12-06 domingo, 12-07 lunes, 12-08 martes.
const ba = (iso: string, hora: string) => new Date(`${iso}T${hora}:00-03:00`);

describe('hhmm', () => {
  it('formatea minutos y pliega pasada la medianoche', () => {
    expect(hhmm(19 * 60)).toBe('19:00');
    expect(hhmm(25 * 60)).toBe('01:00');
    expect(hhmm(27 * 60 + 30)).toBe('03:30');
  });
});

describe('diaDeSemana', () => {
  it('no depende de la zona horaria del navegador', () => {
    expect(diaDeSemana('2026-12-05')).toBe(6);
    expect(diaDeSemana('2026-12-07')).toBe(1);
  });
});

describe('estadoAhora', () => {
  it('está abierto el sábado a las 22:00 y cierra a las 03:00', () => {
    const e = estadoAhora(ba('2026-12-05', '22:00'));
    expect(e.abierto).toBe(true);
    expect(e.texto).toContain('03:00');
  });

  it('sigue abierto el sábado a la 01:30 por la noche del viernes', () => {
    expect(estadoAhora(ba('2026-12-05', '01:30')).abierto).toBe(true);
  });

  it('el domingo a las 02:00 todavía está abierto por la noche del sábado', () => {
    expect(estadoAhora(ba('2026-12-06', '02:00')).abierto).toBe(true);
  });

  it('el domingo a las 03:00 ya cerró', () => {
    expect(estadoAhora(ba('2026-12-06', '03:00')).abierto).toBe(false);
  });

  it('el lunes está cerrado todo el día y abre mañana', () => {
    const e = estadoAhora(ba('2026-12-07', '21:00'));
    expect(e.abierto).toBe(false);
    expect(e.texto).toContain('mañana');
  });

  it('el lunes a las 00:30 ya está cerrado: el domingo cierra a medianoche', () => {
    expect(estadoAhora(ba('2026-12-07', '00:30')).abierto).toBe(false);
  });

  it('antes de abrir informa la hora de apertura de hoy', () => {
    const e = estadoAhora(ba('2026-12-08', '15:00'));
    expect(e.abierto).toBe(false);
    expect(e.texto).toContain('19:00');
  });

  it('martes a la 01:00 sigue sin abrir: el lunes no hay servicio', () => {
    expect(estadoAhora(ba('2026-12-08', '01:00')).abierto).toBe(false);
  });

  it('el miércoles de madrugada, tras cerrar el martes, anuncia la apertura de hoy', () => {
    const e = estadoAhora(ba('2026-12-09', '02:00'));
    expect(e.abierto).toBe(false);
    expect(e.texto).toContain('hoy');
  });

  it('el domingo a las 23:30 está abierto y a las 03:30 ya cerró hasta hoy', () => {
    expect(estadoAhora(ba('2026-12-06', '23:30')).abierto).toBe(true);
    const tarde = estadoAhora(ba('2026-12-06', '03:30'));
    expect(tarde.abierto).toBe(false);
    expect(tarde.texto).toContain('hoy');
  });
});
