import React, { useState } from 'react';
import { Badge, Button, Card, Form, Modal, Table } from 'react-bootstrap';
import type { Reservation } from '../types';

export const ReservationsView: React.FC = () => {
  // 1. Estado local de reservas (mock de base de datos)
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 'RES-1001', guestName: 'Carlos Mendoza', roomNumber: '101', checkIn: '2026-09-12', status: 'CONFIRMADA' },
    { id: 'RES-1002', guestName: 'Laura Silva', roomNumber: '102', checkIn: '2026-09-13', status: 'PENDIENTE' },
    { id: 'RES-1003', guestName: 'Roberto Gómez', roomNumber: '205', checkIn: '2026-09-10', status: 'CHECKED_IN' },
  ]);

  // 2. Estados del modal de nueva reserva
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Reservation>>({});

  // 3. Cambios rápidos de estado (check-in / check-out / cancelar)
  const changeReservationStatus = (id: string, newStatus: Reservation['status']) => {
    setReservations((prev) => prev.map((res) => (res.id === id ? { ...res, status: newStatus } : res)));
  };

  // 4. Formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newReservation: Reservation = {
      id: `RES-${Math.floor(Math.random() * 9000) + 1000}`, // ID aleatorio tipo RES-8452
      guestName: formData.guestName || 'Sin nombre',
      roomNumber: formData.roomNumber || '000',
      checkIn: formData.checkIn || new Date().toISOString().split('T')[0],
      status: 'PENDIENTE',
    };
    setReservations((prev) => [newReservation, ...prev]);
    closeModal();
  };

  // Badge según el estado de la reserva
  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'CONFIRMADA':
        return <Badge bg="success">Confirmada</Badge>;
      case 'PENDIENTE':
        return <Badge bg="warning" text="dark">Pendiente</Badge>;
      case 'CHECKED_IN':
        return <Badge bg="dark">En habitación</Badge>;
      case 'CHECKED_OUT':
        return <Badge bg="secondary">Finalizada</Badge>;
      case 'CANCELADA':
        return <Badge bg="danger">Cancelada</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
        <div>
          <h2 className="mb-1">Gestión de Reservas</h2>
          <p className="text-secondary mb-0">Control de ingresos y salidas del día.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Nueva reserva
        </Button>
      </div>

      {/* Tabla de reservas */}
      <Card>
        <Table responsive hover className="hb-table align-middle mb-0">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Huésped</th>
              <th>Habitación</th>
              <th>Check-in</th>
              <th>Estado</th>
              <th className="text-end">Acciones rápidas</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td className="fw-semibold">{res.id}</td>
                <td>{res.guestName}</td>
                <td>{res.roomNumber}</td>
                <td>{res.checkIn}</td>
                <td>{getStatusBadge(res.status)}</td>
                <td>
                  <div className="d-flex justify-content-end gap-2">
                    {(res.status === 'PENDIENTE' || res.status === 'CONFIRMADA') && (
                      <Button size="sm" variant="primary" onClick={() => changeReservationStatus(res.id, 'CHECKED_IN')}>
                        Check-in
                      </Button>
                    )}

                    {res.status === 'CHECKED_IN' && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => changeReservationStatus(res.id, 'CHECKED_OUT')}
                      >
                        Check-out
                      </Button>
                    )}

                    {(res.status === 'PENDIENTE' || res.status === 'CONFIRMADA') && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => changeReservationStatus(res.id, 'CANCELADA')}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-secondary py-4">
                  No hay reservas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* Modal para nueva reserva */}
      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title className="hb-serif">Crear nueva reserva</Modal.Title>
          </Modal.Header>

          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group controlId="guestName">
              <Form.Label>Nombre del huésped</Form.Label>
              <Form.Control required type="text" name="guestName" value={formData.guestName ?? ''} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="roomNumber">
              <Form.Label>N° de habitación</Form.Label>
              <Form.Control required type="text" name="roomNumber" value={formData.roomNumber ?? ''} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="checkIn">
              <Form.Label>Fecha de check-in</Form.Label>
              <Form.Control required type="date" name="checkIn" value={formData.checkIn ?? ''} onChange={handleChange} />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar reserva
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
