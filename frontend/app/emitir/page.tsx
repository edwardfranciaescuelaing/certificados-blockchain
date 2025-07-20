
"use client";
import '@mantine/dates/styles.css';

import { useState } from "react";
import {
  TextInput,
  Button,
  Notification,
  Stack,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useAccount } from "wagmi";
import { useWriteCertificadoEmitirCertificado } from "@/generated/wagmi";

const CONTRATO_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function EmitirPage() {
  const [estudiante, setEstudiante] = useState("");
  const [curso, setCurso] = useState("");
  const [fecha, setFecha] = useState("");
  const [hashContenido, setHashContenido] = useState("");

  const { address, isConnected } = useAccount();

  const {
    writeContract,
    isPending,
    isSuccess,
    error,
  } = useWriteCertificadoEmitirCertificado();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Intentando emitir:", estudiante, curso, fecha, hashContenido);

    if (!writeContract) {
      console.log("writeContract no disponible");
      return;
    }

    try {
      await writeContract({
        address: CONTRATO_ADDRESS,
        args: [estudiante, curso, fecha, hashContenido],
      });
    } catch (err) {
      console.error("Error al emitir certificado:", err);
    }
  };

  const conectarWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (err) {
        console.error("Usuario rechazó la conexión", err);
      }
    } else {
      alert("MetaMask no está instalado");
    }
  };

  return (
    <div>
      <Title order={2} mb="md">Emitir Certificado</Title>

      {!isConnected && (
        <>
          <Notification color="yellow" mt="md">
            Conecta tu wallet para emitir un certificado.
          </Notification>
          <Button mt="md" onClick={conectarWallet}>
            Conectar Wallet
          </Button>
        </>
      )}

      <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#555" }}>
        <p>Estado del formulario:</p>
        <p>Estudiante: <strong>{estudiante}</strong></p>
        <p>Curso: <strong>{curso}</strong></p>
        <p>Fecha: <strong>{fecha}</strong></p>
        <p>Hash: <strong>{hashContenido}</strong></p>
        <p>Wallet conectada: <strong>{isConnected ? "Sí" : "No"}</strong></p>
        <p>Función writeContract disponible: <strong>{writeContract ? "Sí" : "No"}</strong></p>
      </div>

      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Dirección del estudiante"
            value={estudiante}
            onChange={(e) => setEstudiante(e.currentTarget.value)}
            required
            disabled={!isConnected}
          />
          {estudiante && !estudiante.startsWith("0x") && (
            <div style={{ color: "red", fontSize: "0.9em" }}>
              Ingresa una dirección Ethereum válida que comience con "0x"
            </div>
          )}

          <TextInput
            label="Nombre del curso"
            value={curso}
            onChange={(e) => setCurso(e.currentTarget.value)}
            required
            disabled={!isConnected}
          />

         <DateInput
  label="Fecha"
  placeholder="Selecciona la fecha"
  value={fecha ? new Date(fecha + "T00:00:00") : null}
  onChange={(value) => {
    if (value) {
      // Guarda la fecha en formato YYYY-MM-DD
      const fechaISO = value.toString().split("T")[0];
      setFecha(fechaISO);
    }
  }}
  required
  disabled={!isConnected}
          />

          <TextInput
            label="Hash del contenido"
            value={hashContenido}
            onChange={(e) => setHashContenido(e.currentTarget.value)}
            required
            disabled={!isConnected}
          />

          <Button
            type="submit"
            loading={isPending}
            disabled={
              !isConnected ||
              !estudiante.startsWith("0x") ||
              !curso ||
              !fecha ||
              !hashContenido
            }
          >
            Emitir
          </Button>
        </Stack>
      </form>

      {isSuccess && (
        <Notification color="green" mt="md">
          Certificado emitido correctamente.
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
