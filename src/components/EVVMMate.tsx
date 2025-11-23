import { useState } from 'react';
import { FileText, CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';

interface EVVMMateProps {
  onNavigate: (screen: string) => void;
}

const API_URL = import.meta.env.VITE_EVVM_API_URL || 'http://localhost:3002';

export function EVVMMate({ onNavigate }: EVVMMateProps) {
  const [lotId, setLotId] = useState('');
  const [eventType, setEventType] = useState<'HARVEST' | 'SHIPPED' | 'STORAGE'>('HARVEST');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EVVM MATE Fisher</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Registra eventos agrícolas en el MATE EVVM Metaprotocol en Polygon
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Registrar Evento Agrícola
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Los eventos se registran directamente en blockchain usando el protocolo MATE EVVM (EVVM ID: 2)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lot ID Input */}
          <div>
            <label htmlFor="lotId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lot ID <span className="text-red-500">*</span>
            </label>
            <input
              id="lotId"
              type="text"
              value={lotId}
              onChange={(e) => setLotId(e.target.value)}
              placeholder="Ej: LOT-001"
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Event Type Select */}
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Evento <span className="text-red-500">*</span>
            </label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as 'HARVEST' | 'SHIPPED' | 'STORAGE')}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="HARVEST">🌾 HARVEST - Cosecha</option>
              <option value="SHIPPED">🚚 SHIPPED - Enviado</option>
              <option value="STORAGE">📦 STORAGE - Almacenamiento</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !lotId}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registrando en blockchain...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Registrar Evento en MATE EVVM</span>
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                  Error al registrar evento
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {result && (
          <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
                  ✅ Evento Registrado Exitosamente
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  El evento ha sido registrado en el protocolo MATE EVVM en Polygon
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-white dark:bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lot ID:</span>
                <span className="text-sm text-gray-900 dark:text-white font-mono">{result.data.lotId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Evento:</span>
                <span className="text-sm text-gray-900 dark:text-white">{result.data.eventType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">EVVM ID:</span>
                <span className="text-sm text-gray-900 dark:text-white font-mono">{result.data.evvmId} (MATE)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(result.data.timestamp * 1000).toLocaleString()}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Hash:</span>
                  <a
                    href={result.data.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-mono flex items-center gap-1 break-all"
                  >
                    {result.data.txHash.slice(0, 10)}...{result.data.txHash.slice(-8)}
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </a>
                </div>
                <a
                  href={result.data.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Ver en Polygonscan
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Polygon Network</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Los eventos se registran directamente en Polygon Mainnet
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">EVVM ID: 2</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Protocolo MATE EVVM para eventos agrícolas
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Inmutable</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Los eventos quedan registrados permanentemente en blockchain
          </p>
        </div>
      </div>
    </div>
  );
}

