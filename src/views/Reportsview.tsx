import React from 'react';
import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';

export const ReportsView: React.FC = () => {
  // Mock de datos para el reporte
  const kpiData = {
    totalRevenue: 45250,
    occupancyRate: 85,
    adr: 120, // Average Daily Rate (tarifa media diaria)
    revPar: 102, // Revenue Per Available Room (ingreso por habitación disponible)
  };

  const revenueByRoomType = [
    { type: 'SUITE', bookings: 45, revenue: 18500 },
    { type: 'DOUBLE', bookings: 120, revenue: 15600 },
    { type: 'SINGLE', bookings: 85, revenue: 6800 },
    { type: 'PRESIDENCIAL', bookings: 5, revenue: 4350 },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Reportes y Analíticas</h2>
        <p className="text-secondary mb-0">Indicadores clave de rendimiento (KPIs) del mes actual.</p>
      </div>

      {/* Tarjetas superiores de KPIs */}
      <Row xs={1} sm={2} xl={4} className="g-3 mb-4">
        <Col>
          <Card className="hb-kpi-card h-100">
            <Card.Body>
              <div className="hb-kpi-label">Ingresos totales</div>
              <div className="hb-kpi-value mt-2">
                ${kpiData.totalRevenue.toLocaleString()} <small className="fs-6 text-secondary">USD</small>
              </div>
              <div className="text-success small fw-semibold mt-2">↑ +12.5% vs mes anterior</div>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="hb-kpi-card h-100">
            <Card.Body>
              <div className="hb-kpi-label">Ocupación</div>
              <div className="hb-kpi-value mt-2">{kpiData.occupancyRate}%</div>
              <ProgressBar now={kpiData.occupancyRate} variant="primary" className="mt-3" style={{ height: 8 }} />
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="hb-kpi-card h-100">
            <Card.Body>
              <div className="hb-kpi-label">ADR (tarifa media)</div>
              <div className="hb-kpi-value mt-2">
                ${kpiData.adr} <small className="fs-6 text-secondary">USD</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="hb-kpi-card h-100">
            <Card.Body>
              <div className="hb-kpi-label">RevPAR</div>
              <div className="hb-kpi-value mt-2">
                ${kpiData.revPar} <small className="fs-6 text-secondary">USD</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Ingresos por tipo de habitación */}
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header className="hb-serif fs-5">Ingresos por tipo de habitación</Card.Header>
            <Card.Body className="d-flex flex-column gap-3">
              {revenueByRoomType.map((item) => {
                const percentage = (item.revenue / kpiData.totalRevenue) * 100;
                return (
                  <div key={item.type}>
                    <div className="d-flex justify-content-between small fw-semibold mb-1">
                      <span>{item.type}</span>
                      <span>${item.revenue.toLocaleString()} USD</span>
                    </div>
                    <ProgressBar now={percentage} variant="primary" style={{ height: 12 }} />
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        </Col>

        {/* Desglose de reservas */}
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header className="hb-serif fs-5">Desglose de reservas</Card.Header>
            <Table responsive hover className="hb-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th className="text-center">Total reservas</th>
                  <th className="text-end">Ingreso bruto</th>
                </tr>
              </thead>
              <tbody>
                {revenueByRoomType.map((item) => (
                  <tr key={`table-${item.type}`}>
                    <td className="fw-semibold">{item.type}</td>
                    <td className="text-center">{item.bookings}</td>
                    <td className="text-end">${item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
