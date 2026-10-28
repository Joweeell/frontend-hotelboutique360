import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getUserRolesFromToken } from './authUtils';

// Arma un JWT de prueba sin firma real: header.payload.firma, con payload en base64url.
const makeToken = (payload: object): string => {
  const base64url = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `eyJhbGciOiJub25lIn0.${base64url}.firma`;
};

describe('getUserRolesFromToken', () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = () => {}; // el caso del token inválido registra un error esperado
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('devuelve GUEST cuando no hay token', () => {
    expect(getUserRolesFromToken(undefined)).toEqual(['GUEST']);
    expect(getUserRolesFromToken('')).toEqual(['GUEST']);
  });

  it('lee los grupos del claim cognito:groups', () => {
    const token = makeToken({ sub: 'abc', 'cognito:groups': ['ADMIN'] });
    expect(getUserRolesFromToken(token)).toEqual(['ADMIN']);
  });

  it('devuelve varios grupos cuando el usuario pertenece a más de uno', () => {
    const token = makeToken({ 'cognito:groups': ['RECEPCIONISTA', 'HUESPED'] });
    expect(getUserRolesFromToken(token)).toEqual(['RECEPCIONISTA', 'HUESPED']);
  });

  it('asigna HUESPED si el token no trae grupos', () => {
    const token = makeToken({ sub: 'abc', email: 'huesped@hotel.cl' });
    expect(getUserRolesFromToken(token)).toEqual(['HUESPED']);
  });

  it('decodifica base64url con los caracteres - y _', () => {
    // '>>>' y '???' generan '+' y '/' en base64, que base64url reemplaza por '-' y '_'.
    const payload = { nota: '>>>???>>>???', 'cognito:groups': ['ADMIN'] };
    const token = makeToken(payload);
    expect(token.split('.')[1]).toMatch(/[-_]/);
    expect(getUserRolesFromToken(token)).toEqual(['ADMIN']);
  });

  it('devuelve GUEST si el token está mal formado', () => {
    expect(getUserRolesFromToken('esto-no-es-un-jwt')).toEqual(['GUEST']);
    expect(getUserRolesFromToken('a.%%%.c')).toEqual(['GUEST']);
  });
});
