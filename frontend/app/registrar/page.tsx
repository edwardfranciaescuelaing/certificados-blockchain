"use client";

import { useState, useEffect } from "react";
import {
  TextInput,
  Checkbox,
  Button,
  Notification,
  Stack,
  Title,
} from "@mantine/core";
import { useAccount } from "wagmi";
import { useWriteCertificadoRegistrarUsuario } from "@/generated/wagmi";

// ⚠️ IMPORTANTE: Agrega aquí la dirección de tu contrato
const CONTRATO_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Reemplaza con la dirección real de tu contrato

export default function RegistrarPage() {
  const [nombre, setNombre] = useState("");
  const [esInstructor, setEsInstructor] = useState(false);
  const { address, isConnected } = useAccount();

  const {
    writeContract,
    isPending,
    isSuccess,
    error,
  } = useWriteCertificadoRegistrarUsuario();

  // Función para manejar el envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado");
    
    if (!writeContract) {
      console.log("writeContract no disponible");
      return;
    }

    try {
      console.log("Ejecutando writeContract con:", {
        address: CONTRATO_ADDRESS,
        args: [nombre, esInstructor]
      });
      
      await writeContract({
        address: CONTRATO_ADDRESS,
        args: [nombre, esInstructor],
      });
    } catch (err) {
      console.error("Error al ejecutar transacción:", err);
    }
  };

  return (
    <div>
      <Title order={2} mb="md">Registrar Usuario</Title>

      {!isConnected && (
        <Notification color="yellow" mt="md">
          Conecta tu wallet para registrar un usuario.
        </Notification>
      )}

      <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#555" }}>
        <p>Estado del formulario:</p>
        <p>Nombre: <strong>{nombre}</strong></p>
        <p>Es instructor: <strong>{esInstructor ? "Sí" : "No"}</strong></p>
        <p>Wallet conectada: <strong>{isConnected ? "Sí" : "No"}</strong></p>
        <p>Función writeContract disponible: <strong>{writeContract ? "Sí" : "No"}</strong></p>
      </div>

      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.currentTarget.value)}
            required
          />

          <Checkbox
            label="¿Es instructor?"
            checked={esInstructor}
            onChange={(e) => setEsInstructor(e.currentTarget.checked)}
          />

          <Button 
            type="submit" 
            loading={isPending}
            disabled={!isConnected || nombre.length < 3}
          >
            Registrar
          </Button>
        </Stack>
      </form>

      {isSuccess && (
        <Notification color="green" mt="md">
          Usuario registrado correctamente.
        </Notification>
      )}

      {error && (
        <Notification color="red" mt="md">
          Error: {error.message}
        </Notification>
      )}
    </div>
  );
}