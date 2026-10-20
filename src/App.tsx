import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import { useAuth } from 'react-oidc-context';
import { Alert, Button, Card, Container, Spinner } from 'react-bootstrap';
import axiosInstance from './api/axiosInstance';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RoleGuard } from './components/RoleGuard';
import { getUserRolesFromToken } from './utils/authUtils';
import type { UserRole } from './types';

import { DashboardView } from './views/DashboardView';
import { RoomsView } from './views/RoomsView';
import { ReservationsView } from './views/ReservationsView';
import { ReportsView } from './views/Reportsview';

export const App: React.FC = () => {
  const auth = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [healthResponse, setHealthResponse] = useState<string>('');
  const [healthLoading, setHealthLoading] = useState(false);

  const userRoles: UserRole[] = auth.isAuthenticated
    ? getUserRolesFromToken(auth.user?.id_token)
    : ['GUEST'];

  const checkHealth = async () => {
    setHealthLoading(true);
    setHealthResponse('');
    try {
      const response = await axiosInstance.get('/health');
      setHealthResponse(JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (isAxiosError(error)) {
        setHealthResponse(`HTTP ${error.response?.status ?? 'sin respuesta'}: ${error.response?.data ?? error.message}`);
      } else {
        setHealthResponse(`Error de red: ${error instanceof Error ? error.message : 'desconocido'}`);
      }
    } finally {
      setHealthLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView userRoles={userRoles} />;
      case 'rooms':
        return <RoomsView userRoles={userRoles} />;
      case 'reservations':
        return <ReservationsView />;
      case 'reports':
        return (
          <RoleGuard allowedRoles={['ADMIN']} userRoles={userRoles}>
            <ReportsView />
          </RoleGuard>
        );
      default:
        return <DashboardView userRoles={userRoles} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar userRoles={userRoles} onToggleSidebar={() => setIsSidebarOpen(true)} />

      <div className="d-flex flex-grow-1">
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          userRoles={userRoles}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="hb-main flex-grow-1 py-4">
          <Container fluid="xl">
            {auth.isLoading && (
              <Alert variant="info" className="d-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" /> Cargando sesión de Cognito...
              </Alert>
            )}
            {auth.error && <Alert variant="danger">Error de Cognito: {auth.error.message}</Alert>}

            {auth.isAuthenticated && (
              <Card className="mb-4">
                <Card.Header className="hb-serif fs-5">Prueba de conexión</Card.Header>
                <Card.Body>
                  <Card.Text>
                    Sesión activa: {auth.user?.profile.email ?? 'usuario autenticado'}
                  </Card.Text>
                  <Button variant="primary" onClick={() => void checkHealth()} disabled={healthLoading}>
                    {healthLoading ? 'Consultando...' : 'Consultar API health'}
                  </Button>
                  {healthResponse && (
                    <pre className="bg-light border rounded p-3 mt-3 mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>
                      {healthResponse}
                    </pre>
                  )}
                </Card.Body>
              </Card>
            )}

            {renderView()}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default App;
