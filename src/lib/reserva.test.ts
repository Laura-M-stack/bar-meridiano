import { describe, expect, it } from 'vitest';
import { fechaLarga, hoyISO, horariosPara, mensajeWhatsapp, validar, whatsappUrl, type Reserva } from './reserva';

const ahora = new Date('2026-12-02T15:00:00-03:00'); // miércoles
const base: Reserva = { nombre: 'Laura', fecha: '2026-12-05', hora: '21:00', personas: 4, notas: '' };

describe('hoyISO', () => {
  it('usa la fecha de Buenos Aires, no la UTC', () => {
    // 01:00 UTC del 3 de diciembre = 22:00 del 2 en Buenos Aires.
    expect(hoyISO(new Date('2026-12-03T01:00:00Z'))).toBe('2026-12-02');
  });
});

describe('horariosPara', () => {
  it('viernes: de 19:00 a 01:30 (90 min antes del cierre de las 03:00)', () => {
    const h = horariosPara('2026-12-04');
    expect(h[0]).toBe('19:00');
    expect(h.at(-1)).toBe('01:30');
    expect(h).toContain('00:00');
  });
  it('domingo: último turno a las 22:30', () => {
    expect(horariosPara('2026-12-06').at(-1)).toBe('22:30');
  });
  it('lunes cerrado y fechas inválidas no ofrecen horarios', () => {
    expect(horariosPara('2026-12-07')).toEqual([]);
    expect(horariosPara('')).toEqual([]);
    expect(horariosPara('hoy')).toEqual([]);
  });
});

describe('validar', () => {
  it('acepta una reserva correcta', () => {
    expect(validar(base, ahora)).toEqual({});
  });
  it('exige nombre', () => {
    expect(validar({ ...base, nombre: ' ' }, ahora).nombre).toBeDefined();
  });
  it('rechaza fechas pasadas', () => {
    expect(validar({ ...base, fecha: '2026-12-01' }, ahora).fecha).toContain('pasó');
  });
  it('rechaza los lunes', () => {
    expect(validar({ ...base, fecha: '2026-12-07' }, ahora).fecha).toContain('lunes');
  });
  it('rechaza horarios fuera de la franja', () => {
    expect(validar({ ...base, hora: '18:00' }, ahora).hora).toBeDefined();
    expect(validar({ ...base, hora: '' }, ahora).hora).toBeDefined();
    expect(validar({ ...base, fecha: '2026-12-06', hora: '23:30' }, ahora).hora).toBeDefined();
  });
  it('rechaza un horario que ya pasó si la reserva es para hoy', () => {
    const hoyViernes = new Date('2026-12-04T21:15:00-03:00');
    const r = { ...base, fecha: '2026-12-04', hora: '21:00' };
    expect(validar(r, hoyViernes).hora).toContain('pasó');
    expect(validar({ ...r, hora: '21:30' }, hoyViernes)).toEqual({});
  });
  it('limita la cantidad de personas', () => {
    expect(validar({ ...base, personas: 0 }, ahora).personas).toBeDefined();
    expect(validar({ ...base, personas: 2.5 }, ahora).personas).toBeDefined();
    expect(validar({ ...base, personas: Number.NaN }, ahora).personas).toBeDefined();
    expect(validar({ ...base, personas: 11 }, ahora).personas).toContain('WhatsApp');
    expect(validar({ ...base, personas: 10 }, ahora)).toEqual({});
  });
  it('no valida la hora si la fecha es inválida (evita un segundo error confuso)', () => {
    const e = validar({ ...base, fecha: '' }, ahora);
    expect(e.fecha).toBeDefined();
    expect(e.hora).toBeUndefined();
  });
});

describe('mensaje de WhatsApp', () => {
  it('formatea la fecha en español', () => {
    expect(fechaLarga('2026-12-05')).toBe('sábado 5 de diciembre');
  });
  it('incluye los datos y omite las notas vacías', () => {
    const m = mensajeWhatsapp({ ...base, nombre: '  Laura ' });
    expect(m).toContain('Nombre: Laura');
    expect(m).toContain('sábado 5 de diciembre');
    expect(m).toContain('Personas: 4');
    expect(m).not.toContain('Notas');
    expect(mensajeWhatsapp({ ...base, notas: 'Cumpleaños' })).toContain('Notas: Cumpleaños');
  });
  it('codifica el texto en la URL', () => {
    const url = whatsappUrl('5491100000000', { ...base, notas: 'Mesa & vista' });
    expect(url.startsWith('https://wa.me/5491100000000?text=')).toBe(true);
    expect(url).toContain(encodeURIComponent('Mesa & vista'));
    expect(url).not.toContain(' ');
  });
});
