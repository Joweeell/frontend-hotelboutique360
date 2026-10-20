import { useState } from 'react'
import { isAxiosError } from 'axios'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
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
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        const data = e.response?.data
        setError(typeof data === 'string' ? data : data?.message ?? e.message)
      } else {
        setError(e instanceof Error ? e.message : 'Error desconocido')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Card className="mb-4">
      <Card.Header className="hb-serif fs-5">Solicitar informe</Card.Header>
      <Card.Body>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <Form.Select
            aria-label="Tipo de informe"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={enviando}
          >
            {REPORT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Form.Select>
          <Button variant="primary" onClick={() => void solicitar()} disabled={enviando} className="text-nowrap">
            {enviando ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Solicitando...
              </>
            ) : (
              'Solicitar informe'
            )}
          </Button>
        </div>
        {resultado && (
          <pre className="bg-light border rounded p-3 mt-3 mb-0 small">{JSON.stringify(resultado, null, 2)}</pre>
        )}
        {error && <Alert variant="danger" className="mt-3 mb-0">Error: {error}</Alert>}
      </Card.Body>
    </Card>
  )
}
