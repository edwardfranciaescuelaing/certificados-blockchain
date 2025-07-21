"use client";

import { useState } from "react";
import { TextInput, Button, Stack, Title, Notification } from "@mantine/core";
import { useReadCertificadoVerificarCertificado } from "@/generated/wagmi";
import { stringToHex, padHex, isHex } from "viem";

// ✅ Dirección del contrato (basada en tu error)
const CERTIFICADO_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`;

export default function VerificarPage() {
  const [id, setId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ✅ Función para convertir a bytes32 usando Viem
  const convertToBytes32 = (input: string): `0x${string}` => {
    if (!input.trim()) {
      return '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
    
    // Si ya es hex válido
    if (isHex(input)) {
      // Si ya tiene 66 caracteres (0x + 64), devolverlo
      if (input.length === 66) {
        return input as `0x${string}`;
      }
      // Si es más corto, rellenarlo
      return padHex(input as `0x${string}`, { size: 32 });
    }
    
    // Si es un string, convertir a hex y luego a bytes32
    const hex = stringToHex(input);
    return padHex(hex, { size: 32 });
  };

  const bytes32Id = convertToBytes32(id);

  const { data, error, refetch, isFetching } = useReadCertificadoVerificarCertificado({
    address: CERTIFICADO_CONTRACT_ADDRESS,
    args: [bytes32Id],
    enabled: submitted && id.trim().length > 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) return;
    
    setSubmitted(true);
    // Reset previous error state
    refetch();
  };

  // ✅ Detectar si el error es "Certificado no encontrado"
  const isNotFoundError = error?.message?.includes("Certificado no encontrado");
  const hasOtherError = error && !isNotFoundError;

  // ✅ Procesar los datos correctamente como array
  let certificadoData = null;
  if (data && Array.isArray(data) && data.length >= 5) {
    const [estudiante, curso, fecha, hashContenido, autorizado] = data;
    certificadoData = {
      estudiante,
      curso,
      fecha,
      hashContenido,
      autorizado
    };
  }

  return (
    <div>
      <Title order={2} mb="md">Verificar Certificado</Title>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput 
            label="ID del certificado" 
            placeholder="Ej: 0x123abc... o texto cualquiera"
            value={id} 
            onChange={(e) => setId(e.currentTarget.value)} 
            required
          />
          {id && (
            <div style={{ fontSize: '0.8em', color: '#666', fontFamily: 'monospace', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
              <strong>Bytes32:</strong> {bytes32Id}
            </div>
          )}
          <Button type="submit" loading={isFetching} disabled={!id.trim()}>
            Verificar
          </Button>
        </Stack>
      </form>

      {certificadoData && (
        <Notification title="✅ Certificado encontrado" color="green" mt="md">
          <div style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
            <strong>Estudiante:</strong> {certificadoData.estudiante}<br />
            <strong>Curso:</strong> {certificadoData.curso}<br />
            <strong>Fecha:</strong> {certificadoData.fecha}<br />
            <strong>Hash:</strong> {certificadoData.hashContenido}<br />
            <strong>Autorizado:</strong> {certificadoData.autorizado ? "✅ Sí" : "⏳ Pendiente"}
          </div>
        </Notification>
      )}

      {isNotFoundError && (
        <Notification title="❌ Certificado no encontrado" color="yellow" mt="md">
          <div>
            No existe un certificado con el ID proporcionado.
            <br />
            <small style={{ color: '#666' }}>
              Verifica que el ID sea correcto o que el certificado haya sido emitido.
            </small>
          </div>
        </Notification>
      )}

      {hasOtherError && (
        <Notification color="red" title="Error" mt="md">
          <div style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
            {error?.message}
          </div>
        </Notification>
      )}

      {submitted && isFetching && (
        <Notification title="Buscando..." color="blue" mt="md">
          Consultando información del certificado...
        </Notification>
      )}

      {submitted && !certificadoData && !error && !isFetching && (
        <Notification title="🔍 Búsqueda completada" color="blue" mt="md">
          La búsqueda se completó sin encontrar resultados.
        </Notification>
      )}

      {/* Debug: Mostrar estructura de datos raw (opcional, para desarrollo) */}
      {process.env.NODE_ENV === 'development' && data && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#f0f0f0', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.8em'
        }}>
         
        </div>
      )}
    </div>
  );
}