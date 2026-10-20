import React from 'react';
import { Nav, Offcanvas } from 'react-bootstrap';
import { LayoutDashboard, BedDouble, CalendarCheck, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRoles: UserRole[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  show: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, userRoles, isOpen, setIsOpen }) => {
  const isAdmin = userRoles.includes('ADMIN');
  const isStaff = userRoles.includes('ADMIN') || userRoles.includes('RECEPCIONISTA');

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { id: 'rooms', label: 'Habitaciones', icon: BedDouble, show: true },
    { id: 'reservations', label: 'Reservas', icon: CalendarCheck, show: isStaff },
    { id: 'reports', label: 'Reportes KPIs', icon: BarChart3, show: isAdmin },
  ];

  const renderNav = (closeOnSelect: boolean) => (
    <Nav variant="pills" className="flex-column gap-1">
      {menuItems
        .filter((item) => item.show)
        .map((item) => {
          const Icon = item.icon;
          return (
            <Nav.Link
              key={item.id}
              as="button"
              type="button"
              active={currentView === item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (closeOnSelect) setIsOpen(false);
              }}
            >
              <Icon size={20} />
              {item.label}
            </Nav.Link>
          );
        })}
    </Nav>
  );

  return (
    <>
      {/* Escritorio: barra lateral fija */}
      <aside className="hb-sidebar-desktop d-none d-lg-block p-3">{renderNav(false)}</aside>

      {/* Móvil y tablet: panel deslizable */}
      <Offcanvas
        show={isOpen}
        onHide={() => setIsOpen(false)}
        placement="start"
        className="hb-sidebar d-lg-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="hb-serif">Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{renderNav(true)}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
