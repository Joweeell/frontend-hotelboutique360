import type { AuthProviderProps } from 'react-oidc-context';

const requiredEnv = (name: 'VITE_COGNITO_AUTHORITY' | 'VITE_COGNITO_CLIENT_ID') => {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Revisa .env.local.`);
  }
  return value;
};

export const cognitoAuthConfig: AuthProviderProps = {
  authority: requiredEnv('VITE_COGNITO_AUTHORITY'),
  client_id: requiredEnv('VITE_COGNITO_CLIENT_ID'),
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid email phone',
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

/**
 * URL del API Gateway (producción). Se deja por compatibilidad con el .env actual.
 */
export const API_GATEWAY_URL: string = import.meta.env.VITE_API_URL ?? '';

/**
 * Base de las llamadas a la API.
 *
 * - '' (vacío): las llamadas van al mismo origen. En local lo resuelve el proxy de
 *   Vite, que además inyecta la cabecera X-Secret-Gateway que el BFF exige.
 * - La URL del API Gateway: cuando el frontend se sirve desde S3/CloudFront y la API
 *   vive en otro dominio (en ese caso el API Gateway debe tener CORS configurado).
 *
 * Se define con VITE_API_BASE porque '' es un valor válido (mismo origen) y con
 * `??` no se puede confundir con "variable no definida".
 */
export const API_BASE: string = import.meta.env.VITE_API_BASE ?? API_GATEWAY_URL;
