import { ethers } from 'ethers';

/**
 * Construye el payload para enviar al executor de MATE EVVM
 * @param {string} lotId - ID del lote
 * @param {string} eventType - Tipo de evento
 * @returns {string} - Payload en formato bytes (hex string con 0x)
 */
export function buildPayload(lotId, eventType) {
  // Construir el objeto JSON del evento
  const eventData = {
    lotId: lotId.toString(),
    eventType: eventType,
    timestamp: Date.now()
  };

  // Convertir a JSON string
  const jsonString = JSON.stringify(eventData);
  console.log(`📄 JSON payload: ${jsonString}`);

  // Convertir a bytes (UTF-8)
  // El executor espera bytes, así que convertimos el string JSON a bytes
  const payloadBytes = ethers.toUtf8Bytes(jsonString);
  
  // Retornar como hex string con prefijo 0x
  return ethers.hexlify(payloadBytes);
}

/**
 * Alternativa: Construir payload usando ABI encoding si el executor lo requiere
 * Esta función está disponible pero no se usa por defecto
 */
export function buildPayloadABI(lotId, eventType) {
  // Si el executor requiere un formato específico con ABI encoding
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  
  // Codificar como tupla (string, string, uint256)
  const encoded = abiCoder.encode(
    ['string', 'string', 'uint256'],
    [lotId, eventType, Date.now()]
  );

  return encoded;
}

