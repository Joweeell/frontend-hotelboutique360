import { useState } from 'react'
import axiosInstance from '../api/axiosInstance'

const REPORT_TYPES = [
  { value: 'INVENTORY', label: 'Inventario' },
  { value: 'PRODUCT_CATALOG', label: 'Catálogo de productos' },
]

type ReportResponse = {
  requestId: string
  type: string
  requester: string
  requestedAt: string
  status: string
}

export default function ReportRequestPanel() {
  const [type, setType] = useState(REPORT_TYPES[0].value)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<ReportResponse | null>(null)
  const [error, setError] = useState('')

  async function solicitar() {
    setEnviando(true)
    setResultado(null)
    setError('')
    try {
      const res = await axiosInstance.post('/api/reports', { type, params: {} })
      setResultado(res.data)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.response?.data || e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <h3>Solicitar informe</h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select value={type} onChange={(e) => setType(e.target.value)} disabled={enviando}>
          {REPORT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <button className="btn-primary" onClick={solicitar} disabled={enviando}>
          {enviando ? 'Solicitando...' : 'Solicitar informe'}
        </button>
      </div>
      {resultado && <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(resultado, null, 2)}</pre>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  )
}
