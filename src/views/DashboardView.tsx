import React from 'react';
import { Badge, Button, Card, Col, Row, Table } from 'react-bootstrap';
import type { UserRole } from '../types';
import ReportRequestPanel from '../components/ReportRequestPanel';

interface DashboardProps {
  userRoles: UserRole[];
}

export const DashboardView: React.FC<DashboardProps> = ({ userRoles }) => {
  const role = userRoles[0] || 'GUEST';

  // 1. ADMIN: métricas globales
  if (role === 'ADMIN') {
    return (
      <div>
        <h2 className="mb-1">Panel de Administración</h2>
        <p className="text-secondary mb-4">Métricas globales e ingresos del Hotel Boutique.</p>

        <ReportRequestPanel />

        <Row xs={1} md={3} className="g-3">
          <Col>
            <Card className="hb-kpi-card h-100">
              <Card.Body>
                <div className="hb-kpi-label">Ocupación total</div>
                <div className="hb-kpi-value mt-2">88%</div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="hb-kpi-card h-100">
              <Card.Body>
                <div className="hb-kpi-label">Ingresos del mes</div>
                <div className="hb-kpi-value mt-2">$12,450</div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="hb-kpi-card h-100" style={{ borderLeftColor: 'var(--bs-success)' }}>
              <Card.Body>
                <div className="hb-kpi-label">Check-ins hoy</div>
                <div className="hb-kpi-value mt-2 text-success">12</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // 2. RECEPCIONISTA: operaciones y tabla de reservas del día
  if (role === 'RECEPCIONISTA') {
    return (
      <div>
        <h2 className="mb-1">Recepción y Operaciones</h2>
        <p className="text-secondary mb-4">Accesos rápidos para la gestión de huéspedes.</p>

        <Row className="g-3 mb-4">
          <Col xs={12} sm={6}>
            <Button variant="primary" size="lg" className="w-100">Registrar check-in</Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button variant="outline-primary" size="lg" className="w-100">Registrar check-out</Button>
          </Col>
        </Row>

        <Card>
          <Card.Header className="hb-serif fs-5">Reservas de hoy</Card.Header>
          <Table responsive hover className="hb-table align-middle mb-0">
            <thead>
              <tr>
                <th>Huésped</th>
                <th>Habitación</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-semibold">María López</td>
                <td>102 (DOUBLE)</td>
                <td><Badge bg="warning" text="dark">PENDIENTE</Badge></td>
                <td className="text-end"><Button size="sm" variant="primary">Hacer check-in</Button></td>
              </tr>
              <tr>
                <td className="fw-semibold">Roberto Gómez</td>
                <td>205 (SUITE)</td>
                <td><Badge bg="success">CONFIRMADA</Badge></td>
                <td className="text-end"><Button size="sm" variant="primary">Hacer check-in</Button></td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </div>
    );
  }

  // 3. HUÉSPED: su reserva activa
  if (role === 'HUESPED') {
    return (
      <div>
        <h2 className="mb-4">Mi Estancia</h2>

        <Card className="mb-4">
          <Card.Header className="hb-serif fs-5">Tu reserva activa</Card.Header>
          <Card.Body>
            <Row className="align-items-center g-3">
              <Col xs={12} md>
                <p className="mb-1"><strong>Habitación:</strong> Suite 101</p>
                <p className="mb-0"><strong>Check-in:</strong> 15 de octubre de 2026</p>
              </Col>
              <Col xs={12} md="auto">
                <Badge bg="success" className="fs-6 px-3 py-2">CONFIRMADA</Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="bg-white">
          <Card.Body>
            <Card.Title className="hb-serif">¿Buscas otra experiencia?</Card.Title>
            <Card.Text className="text-secondary">
              Explora nuestras habitaciones y reserva tu próxima visita.
            </Card.Text>
            <Button variant="primary">Ver catálogo</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // 4. GUEST (sin sesión): portada de bienvenida
  return (
    <div>
      <section className="hb-hero text-center text-md-start mb-4">
        <h1 className="display-5 mb-3">Hotel Boutique 360</h1>
        <p className="fs-5 mb-0 mx-auto mx-md-0">
          Descubre el confort y la elegancia. Inicia sesión para reservar habitaciones o gestionar tus estadías.
        </p>
      </section>

      <Card className="mx-auto" style={{ maxWidth: 480 }}>
        <Card.Body>
          <Card.Title className="hb-serif">Acceso de invitado</Card.Title>
          <Card.Text className="text-secondary mb-0">
            Usa el botón «Iniciar sesión» de la barra superior para ingresar con tu cuenta y acceder a todas las funciones.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};
