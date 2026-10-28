import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { UserRole } from '../types';
import { RoleGuard } from './RoleGuard';

// Renderiza el guard a HTML para comprobar qué ve cada rol, sin necesitar un navegador.
const render = (allowedRoles: UserRole[], userRoles: UserRole[]): string =>
  renderToStaticMarkup(
    createElement(RoleGuard, {
      allowedRoles,
      userRoles,
      children: createElement('p', null, 'Contenido de reportes'),
    }),
  );

describe('RoleGuard', () => {
  it('muestra el contenido cuando el usuario tiene el rol permitido', () => {
    const html = render(['ADMIN'], ['ADMIN']);
    expect(html).toContain('Contenido de reportes');
    expect(html).not.toContain('403');
  });

  it('muestra el contenido si tiene al menos uno de varios roles permitidos', () => {
    const html = render(['ADMIN', 'RECEPCIONISTA'], ['HUESPED', 'RECEPCIONISTA']);
    expect(html).toContain('Contenido de reportes');
  });

  it('bloquea el contenido y muestra el aviso 403 si no tiene el rol', () => {
    const html = render(['ADMIN'], ['HUESPED']);
    expect(html).not.toContain('Contenido de reportes');
    expect(html).toContain('Acceso Restringido (403 Forbidden)');
  });

  it('bloquea al visitante sin sesión (GUEST)', () => {
    const html = render(['ADMIN'], ['GUEST']);
    expect(html).toContain('403');
  });
});
