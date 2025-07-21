"use client";
// Indica que este archivo es un componente React que se ejecuta en el cliente (no en el servidor).

import { useState } from "react";
// Importa el hook `useState` de React para manejar el estado del componente.

import { TextInput, Button, Stack, Title, Notification } from "@mantine/core";
// Importa componentes de la librería `@mantine/core` para construir la interfaz de usuario.

import { useReadCertificadoVerificarCertificado } from "@/generated/wagmi";
// Importa un hook generado automáticamente para interactuar con el contrato inteligente relacionado con la verificación de certificados.

import { stringToHex, padHex, isHex } from "viem";
// Importa funciones de la librería `viem` para trabajar con cadenas y convertirlas a formato hexadecimal.

const CERTIFICADO_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`;
// Define la dirección del contrato inteligente como una constante. El tipo `0x${string}` asegura que sea una cadena hexadecimal válida.

export default function VerificarPage() {
// Define el componente principal de la página, llamado `VerificarPage`.

  const [id, setId] = useState("");
  // Estado para almacenar el ID del certificado ingresado por el usuario.

  const [submitted, setSubmitted] = useState(false);
  // Estado para rastrear si el formulario ha sido enviado.

  const convertToBytes32 = (input: string): `0x${string}` => {
    // Función para convertir una cadena a formato `bytes32`.

    if (!input.trim()) {
      return '0x0000000000000000000000000000000000000000000000000000000000000000';
      // Si la entrada está vacía, devuelve un valor hexadecimal de 32 bytes con ceros.
    }

    if (isHex(input)) {
      // Verifica si la entrada ya es un valor hexadecimal válido.
      if (input.length === 66) {
        return input as `0x${string}`;
        // Si ya tiene 66 caracteres (0x + 64), devuelve el valor tal cual.
      }
      return padHex(input as `0x${string}`, { size: 32 });
      // Si es más corto, lo rellena hasta 32 bytes.
    }

    const hex = stringToHex(input);
    // Convierte la cadena a formato hexadecimal.

    return padHex(hex, { size: 32 });
    // Rellena el valor hexadecimal hasta 32 bytes.
  };

  const bytes32Id = convertToBytes32(id);
  // Convierte el ID ingresado por el usuario a formato `bytes32`.

  const { data, error, refetch, isFetching } = useReadCertificadoVerificarCertificado({
    // Usa el hook para llamar al contrato inteligente y verificar el certificado.
    address: CERTIFICADO_CONTRACT_ADDRESS,
    // Dirección del contrato inteligente.

    args: [bytes32Id],
    // Argumentos para la función del contrato (en este caso, el ID en formato `bytes32`).

    enabled: submitted && id.trim().length > 0,
    // Habilita la consulta solo si el formulario ha sido enviado y el ID no está vacío.
  });

  const handleSubmit = (e: React.FormEvent) => {
    // Maneja el envío del formulario.
    e.preventDefault();
    // Previene el comportamiento predeterminado del formulario (recargar la página).

    if (!id.trim()) return;
    // Si el ID está vacío, no hace nada.

    setSubmitted(true);
    // Marca el formulario como enviado.

    refetch();
    // Vuelve a ejecutar la consulta al contrato inteligente.
  };

  const isNotFoundError = error?.message?.includes("Certificado no encontrado");
  // Verifica si el error recibido indica que el certificado no fue encontrado.

  const hasOtherError = error && !isNotFoundError;
  // Verifica si hay otro tipo de error distinto al de "Certificado no encontrado".

  let certificadoData = null;
  // Inicializa una variable para almacenar los datos del certificado.

  if (data && Array.isArray(data) && data.length >= 5) {
    // Verifica si los datos recibidos son un array con al menos 5 elementos.

    const [estudiante, curso, fecha, hashContenido, autorizado] = data;
    // Desestructura los datos del certificado.

    certificadoData = {
      estudiante,
      curso,
      fecha,
      hashContenido,
      autorizado
    };
    // Asigna los datos desestructurados a un objeto.
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

      {process.env.NODE_ENV === 'development' && data && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#f0f0f0', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.8em'
        }}>
          {/* Debug: Mostrar estructura de datos raw (opcional, para desarrollo) */}
        </div>
      )}
    </div>
  );
}