import React from 'react';
import { Alert } from 'react-bootstrap';
import type { UserRole } from '../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  userRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, userRoles, children }) => {
  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return (
      <Alert variant="danger" className="text-center py-4">
        <Alert.Heading>Acceso restringido (403 Forbidden)</Alert.Heading>
        <p className="mb-0">
          No posees los permisos (claims) requeridos en Cognito para consultar esta sección.
        </p>
      </Alert>
    );
  }

  return <>{children}</>;
};
