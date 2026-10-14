import React from 'react';
import type { UserRole } from '../types';

interface DashboardProps {
  userRoles: UserRole[];
}

import ReportRequestPanel from '../components/ReportRequestPanel';

export const DashboardView: React.FC<DashboardProps> = ({ userRoles }) => {
  const role = userRoles[0] || 'GUEST';

  // 1. ADMIN: MÃ©tricas globales (Sin el botÃ³n al CRUD)
  if (role === 'ADMIN') {
    return (
      <div style={{ width: '100%' }}>
        <h2 style={{ color: '#3b0764', fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: '0 0 5px 0' }}>Panel de AdministraciÃ³n</h2>
        <p style={{ color: '#6b21a8', marginBottom: '20px' }}>MÃ©tricas globales e ingresos del Hotel Boutique.</p>
        {userRoles.includes('ADMIN') && <ReportRequestPanel />}

        {/* CSS Grid adaptativo: las tarjetas se acomodan solas segÃºn el ancho de la pantalla */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px' 
        }}>
          <div className="card">
            <h4 style={{ margin: '0', color: '#6b21a8', textTransform: 'uppercase', fontSize: '0.85rem' }}>OcupaciÃ³n Total</h4>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b0764', margin: '10px 0 0 0' }}>88%</p>
          </div>
          <div className="card">
            <h4 style={{ margin: '0', color: '#6b21a8', textTransform: 'uppercase', fontSize: '0.85rem' }}>Ingresos del Mes</h4>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6', margin: '10px 0 0 0' }}>$12,450</p>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
            <h4 style={{ margin: '0', color: '#6b21a8', textTransform: 'uppercase', fontSize: '0.85rem' }}>Check-Ins Hoy</h4>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', margin: '10px 0 0 0' }}>12</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. RECEPCIONISTA: Operaciones y Tabla Responsive
  if (role === 'RECEPCIONISTA') {
    return (
      <div style={{ width: '100%' }}>
        <h2 style={{ color: '#3b0764', fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: '0 0 5px 0' }}>RecepciÃ³n y Operaciones</h2>
        <p style={{ color: '#6b21a8', marginBottom: '20px' }}>Accesos rÃ¡pidos para gestiÃ³n de huÃ©spedes.</p>

        {/* Botones Flexbox con wrap para que se apilen en mÃ³viles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
          <button className="btn-primary" style={{ flex: '1 1 200px' }}>Registrar Check-In</button>
          <button className="btn-secondary" style={{ flex: '1 1 200px' }}>Registrar Check-Out</button>
        </div>

        {/* Contenedor overflowX para evitar que la tabla rompa el diseÃ±o en mÃ³viles */}
        <div className="card" style={{ overflowX: 'auto', padding: '20px' }}>
          <h4 style={{ color: '#3b0764', marginTop: 0, marginBottom: '15px' }}>Reservas de Hoy</h4>
          <table className="table-custom" style={{ minWidth: '500px', width: '100%' }}>
            <thead>
              <tr>
                <th>HuÃ©sped</th>
                <th>HabitaciÃ³n</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold' }}>MarÃ­a LÃ³pez</td>
                <td>102 (DOUBLE)</td>
                <td><span className="badge badge-warning">PENDIENTE</span></td>
                <td><button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Hacer Check-In</button></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Roberto GÃ³mez</td>
                <td>205 (SUITE)</td>
                <td><span className="badge badge-success">CONFIRMADA</span></td>
                <td><button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Hacer Check-In</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. HUESPED: Responsive Flex Column
  if (role === 'HUESPED') {
    return (
      <div style={{ width: '100%' }}>
        <h2 style={{ color: '#3b0764', fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: '0 0 20px 0' }}>Mi Estancia</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h4 style={{ color: '#3b0764', marginTop: 0, marginBottom: '15px' }}>Tu Reserva Activa</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: '1 1 200px' }}>
                <p style={{ margin: '5px 0' }}><strong>HabitaciÃ³n:</strong> Suite 101</p>
                <p style={{ margin: '5px 0' }}><strong>Check-In:</strong> 15 Octubre 2026</p>
              </div>
              <div style={{ flex: '0 0 auto' }}>
                <span className="badge badge-success" style={{ fontSize: '1rem', padding: '8px 16px' }}>CONFIRMADA</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: '#faf5ff' }}>
            <h4 style={{ color: '#3b0764', marginTop: 0, marginBottom: '10px' }}>Â¿Buscas otra experiencia?</h4>
            <p style={{ color: '#6b21a8', marginBottom: '20px' }}>Explora nuestras habitaciones y reserva tu prÃ³xima visita.</p>
            {/* El botÃ³n ocupa el 100% pero mÃ¡ximo 300px, centrado/alineado idealmente para mÃ³viles */}
            <button className="btn-primary" style={{ width: '100%', maxWidth: '300px' }}>Ver CatÃ¡logo</button>
          </div>
        </div>
      </div>
    );
  }

  // 4. GUEST (Sin Login) - Centrado absoluto y responsivo
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      textAlign: 'center', 
      padding: '10% 5%', 
      minHeight: '60vh' 
    }}>
      <h2 style={{ color: '#3b0764', fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '0 0 15px 0' }}>Hotel Boutique 360</h2>
      <p style={{ color: '#6b21a8', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', maxWidth: '600px', margin: '0 0 40px 0', lineHeight: 1.6 }}>
        Descubre el confort y la elegancia. Inicia sesiÃ³n para reservar habitaciones o gestionar tus estadÃ­as.
      </p>
      
      <div className="card" style={{ textAlign: 'left', width: '100%', maxWidth: '400px' }}>
        <h4 style={{ color: '#3b0764', marginTop: 0, marginBottom: '10px' }}>Acceso de Invitado</h4>
        <p style={{ color: '#6b21a8', margin: 0 }}>Por favor, utiliza el botÃ³n superior de "Login" para ingresar con tu cuenta y acceder a todas las funciones.</p>
      </div>
    </div>
  );
};
