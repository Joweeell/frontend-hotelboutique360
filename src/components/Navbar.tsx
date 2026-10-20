import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Badge, Button, Container, Navbar as BsNavbar } from 'react-bootstrap';
import { LogIn, LogOut, Hotel, Menu, User } from 'lucide-react';
import type { UserRole } from '../types';

interface NavbarProps {
  userRoles: UserRole[];
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userRoles, onToggleSidebar }) => {
  const auth = useAuth();

  return (
    <BsNavbar variant="dark" sticky="top" className="hb-navbar">
      <Container fluid className="px-3 px-lg-4">
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="link"
            className="text-white p-0 me-1 d-lg-none"
            onClick={onToggleSidebar}
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </Button>
          <BsNavbar.Brand className="d-flex align-items-center gap-2 m-0">
            <Hotel size={24} className="hb-accent" />
            <span>
              HOTEL BOUTIQUE <span className="hb-accent">360</span>
            </span>
          </BsNavbar.Brand>
        </div>

        <div className="d-flex align-items-center gap-3">
          {auth.isAuthenticated ? (
            <>
              <div className="d-none d-md-flex align-items-center gap-2 text-white">
                <User size={18} className="hb-accent" />
                <small>{auth.user?.profile.email}</small>
                <Badge bg="primary">{userRoles[0] || 'HUESPED'}</Badge>
              </div>
              <Button
                variant="outline-light"
                size="sm"
                className="d-flex align-items-center gap-2"
                onClick={() => void auth.removeUser()}
              >
                <LogOut size={16} /> Salir
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="d-flex align-items-center gap-2"
              onClick={() => void auth.signinRedirect()}
            >
              <LogIn size={18} />
              <span className="d-none d-sm-inline">Iniciar sesión</span>
            </Button>
          )}
        </div>
      </Container>
    </BsNavbar>
  );
};
