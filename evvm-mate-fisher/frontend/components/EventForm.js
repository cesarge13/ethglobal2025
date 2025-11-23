import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function EventForm() {
  const [lotId, setLotId] = useState('');
  const [eventType, setEventType] = useState('HARVEST');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/registerEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lotId,
          eventType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error al registrar evento');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="lotId" style={styles.label}>
            Lot ID
          </label>
          <input
            id="lotId"
            type="text"
            value={lotId}
            onChange={(e) => setLotId(e.target.value)}
            placeholder="Ej: LOT-001"
            required
            style={styles.input}
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="eventType" style={styles.label}>
            Tipo de Evento
          </label>
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
            style={styles.select}
            disabled={loading}
          >
            <option value="HARVEST">HARVEST - Cosecha</option>
            <option value="SHIPPED">SHIPPED - Enviado</option>
            <option value="STORAGE">STORAGE - Almacenamiento</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !lotId}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? '⏳ Registrando...' : '📝 Registrar Evento'}
        </button>
      </form>

      {error && (
        <div style={styles.error}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={styles.success}>
          <h3 style={styles.successTitle}>✅ Evento Registrado Exitosamente</h3>
          <div style={styles.resultDetails}>
            <div style={styles.resultRow}>
              <strong>Lot ID:</strong> {result.data.lotId}
            </div>
            <div style={styles.resultRow}>
              <strong>Tipo de Evento:</strong> {result.data.eventType}
            </div>
            <div style={styles.resultRow}>
              <strong>EVVM ID:</strong> {result.data.evvmId} (MATE)
            </div>
            <div style={styles.resultRow}>
              <strong>Transaction Hash:</strong>
              <a
                href={result.data.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                {result.data.txHash}
              </a>
            </div>
            <div style={styles.resultRow}>
              <strong>Timestamp:</strong>{' '}
              {new Date(result.data.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    border: '2px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    padding: '12px',
    fontSize: '1rem',
    border: '2px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  button: {
    padding: '14px 24px',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  error: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#ffebee',
    border: '2px solid #f44336',
    borderRadius: '8px',
    color: '#c62828',
  },
  success: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#e8f5e9',
    border: '2px solid #4CAF50',
    borderRadius: '8px',
  },
  successTitle: {
    marginTop: '0',
    marginBottom: '16px',
    color: '#2e7d32',
  },
  resultDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  resultRow: {
    fontSize: '0.95rem',
    color: '#333',
    wordBreak: 'break-word',
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
    marginLeft: '8px',
    wordBreak: 'break-all',
  },
};

