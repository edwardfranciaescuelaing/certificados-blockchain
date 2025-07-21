"use client";
import "@mantine/dates/styles.css";

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
  const [certificadoId, setCertificadoId] = useState<string | null>(null);

  const { isConnected } = useAccount();

  const {
    writeContractAsync,
    isPending,
    error,
  } = useWriteCertificadoEmitirCertificado();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!writeContractAsync) return;

    try {
      const id = await writeContractAsync({
        address: CONTRATO_ADDRESS,
        args: [estudiante, curso, fecha, hashContenido],
      });

      console.log("✅ ID del certificado emitido:", id);
      setCertificadoId(id as string);
    } catch (err) {
      console.error("❌ Error al emitir certificado:", err);
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

      {certificadoId && (
        <Notification color="green" mt="md">
          ✅ Certificado emitido con ID:<br />
          <code>{certificadoId}</code>
        </Notification>
      )}

      {error && (
        <Notification color="red" mt="md">
          ❌ Error: {error.message}
        </Notification>
      )}
    </div>
  );
}
