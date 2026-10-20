import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Alert, Badge, Button, Card, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';
import type { Room, UserRole } from '../types';

interface RoomsProps {
  userRoles: UserRole[];
}

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">' +
      '<rect width="100%" height="100%" fill="#efe7da"/>' +
      '<text x="50%" y="50%" fill="#7a6f66" font-family="sans-serif" font-size="24" ' +
      'text-anchor="middle" dominant-baseline="middle">Sin imagen</text></svg>'
  );

export const RoomsView: React.FC<RoomsProps> = ({ userRoles }) => {
  const isAdmin = userRoles.includes('ADMIN');

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const getErrorMessage = (error: unknown) => {
    if (isAxiosError(error)) {
      return `HTTP ${error.response?.status ?? 'sin respuesta'}: ${typeof error.response?.data === 'string' ? error.response.data : error.message}`;
    }
    return error instanceof Error ? error.message : 'Error desconocido';
  };

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await axiosInstance.get<Room[]>('/api/v1/rooms');
        setRooms(response.data);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    void loadRooms();
  }, []);

  // Estados para el modal y el formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Room>>({});
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const openModal = (room?: Room) => {
    if (room) {
      setFormData(room); // Modo edición
    } else {
      setFormData({ isAvailable: true, roomType: 'SINGLE' }); // Modo creación
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : name === 'pricePerNight'
          ? value === '' ? undefined : parseFloat(value)
          : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    const request = {
      roomNumber: formData.roomNumber ?? '',
      roomType: formData.roomType ?? 'SINGLE',
      pricePerNight: formData.pricePerNight ?? 0,
      isAvailable: formData.isAvailable ?? true,
      description: formData.description,
      imageUrl: formData.imageUrl,
    };

    try {
      if (formData.id) {
        const response = await axiosInstance.put<Room>(`/api/v1/rooms/${formData.id}`, request);
        setRooms((previous) => previous.map((room) => (room.id === response.data.id ? response.data : room)));
      } else {
        const response = await axiosInstance.post<Room>('/api/v1/rooms', request);
        setRooms((previous) => [...previous, response.data]);
      }
      closeModal();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    const { id } = roomToDelete;
    setRoomToDelete(null);
    setErrorMessage('');
    try {
      await axiosInstance.delete(`/api/v1/rooms/${id}`);
      setRooms((previous) => previous.filter((room) => room.id !== id));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h2 className="mb-0">Catálogo de Habitaciones</h2>
        {isAdmin && (
          <Button variant="primary" onClick={() => openModal()}>
            + Nueva habitación
          </Button>
        )}
      </div>

      {errorMessage && (
        <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-secondary mt-2 mb-0">Cargando habitaciones...</p>
        </div>
      )}

      {!isLoading && rooms.length === 0 && !errorMessage && (
        <Alert variant="secondary">No hay habitaciones registradas todavía.</Alert>
      )}

      {/* Grid de habitaciones */}
      {!isLoading && (
        <Row xs={1} md={2} xl={3} className="g-4">
          {rooms.map((room) => (
            <Col key={room.id}>
              <Card className="h-100 overflow-hidden">
                <Card.Img
                  variant="top"
                  className="hb-room-img"
                  src={room.imageUrl || PLACEHOLDER_IMAGE}
                  alt={`Habitación ${room.roomNumber}`}
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <Card.Title className="hb-serif mb-0">Hab. {room.roomNumber}</Card.Title>
                    <Badge bg={room.isAvailable ? 'success' : 'warning'} text={room.isAvailable ? undefined : 'dark'}>
                      {room.isAvailable ? 'Disponible' : 'Ocupada'}
                    </Badge>
                  </div>
                  <Card.Subtitle className="text-secondary mt-2">
                    Tipo: <strong>{room.roomType}</strong>
                  </Card.Subtitle>
                  {room.description && <Card.Text className="small mt-2 mb-0">{room.description}</Card.Text>}
                  <p className="fs-4 fw-semibold mt-3 mb-0 hb-accent">
                    ${room.pricePerNight} <small className="fs-6 fw-normal text-secondary">USD / noche</small>
                  </p>

                  <div className="d-flex gap-2 mt-auto pt-3">
                    {isAdmin ? (
                      <>
                        <Button variant="outline-primary" className="flex-fill" onClick={() => openModal(room)}>
                          Editar
                        </Button>
                        <Button variant="danger" className="flex-fill" onClick={() => setRoomToDelete(room)}>
                          Eliminar
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" className="flex-fill" disabled={!room.isAvailable}>
                        {room.isAvailable ? 'Reservar ahora' : 'No disponible'}
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal CRUD */}
      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Form onSubmit={(e) => void handleSave(e)}>
          <Modal.Header closeButton>
            <Modal.Title className="hb-serif">
              {formData.id ? 'Editar habitación' : 'Nueva habitación'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group controlId="roomNumber">
              <Form.Label>N° de habitación</Form.Label>
              <Form.Control
                required
                type="text"
                name="roomNumber"
                value={formData.roomNumber ?? ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="roomType">
              <Form.Label>Tipo</Form.Label>
              <Form.Select name="roomType" value={formData.roomType ?? 'SINGLE'} onChange={handleChange}>
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="SUITE">Suite</option>
                <option value="PRESIDENCIAL">Presidencial</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="pricePerNight">
              <Form.Label>Precio por noche (USD)</Form.Label>
              <Form.Control
                required
                type="number"
                min="0"
                step="0.01"
                name="pricePerNight"
                value={formData.pricePerNight ?? ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description ?? ''}
                onChange={handleChange}
                placeholder="Describe la habitación, sus servicios o características"
              />
            </Form.Group>

            <Form.Group controlId="imageUrl">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl ?? ''}
                onChange={handleChange}
                placeholder="https://..."
              />
            </Form.Group>

            <Form.Check
              type="switch"
              id="isAvailable"
              name="isAvailable"
              label="Marcar como disponible"
              checked={formData.isAvailable ?? false}
              onChange={handleChange}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Confirmación de eliminación */}
      <Modal show={roomToDelete !== null} onHide={() => setRoomToDelete(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="hb-serif">Eliminar habitación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la habitación <strong>{roomToDelete?.roomNumber}</strong>? Esta acción no se
          puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setRoomToDelete(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => void confirmDelete()}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
