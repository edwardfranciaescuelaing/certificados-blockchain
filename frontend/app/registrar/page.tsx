"use client";

import { useState } from "react";
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

const CONTRATO_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function RegistrarPage() {
  const [nombre, setNombre] = useState("");
  const [esInstructor, setEsInstructor] = useState(false);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const { address, isConnected } = useAccount();

  const {
    writeContract,
    isPending,
    isSuccess,
    error,
  } = useWriteCertificadoRegistrarUsuario();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado");

    if (!writeContract || !address) {
      console.log("writeContract o address no disponible");
      return;
    }

    try {

      console.log("Registrando usuario desde:", address);
      await writeContract({
        address: CONTRATO_ADDRESS,
        args: [nombre, esInstructor],
      });

      setUsuarioId(address); // ✅ se guarda el ID del usuario (la dirección Ethereum)
    } catch (err) {
      console.error("Error al ejecutar transacción:", err);
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
      <Title order={2} mb="md">Registrar Usuario</Title>

      {!isConnected && (
        <>
          <Notification color="yellow" mt="md">
            Conecta tu wallet para registrar un usuario.
          </Notification>
          <Button mt="md" onClick={conectarWallet}>
            Conectar Wallet
          </Button>
        </>
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

      {isSuccess && usuarioId && (
        <Notification color="green" mt="md">
          ✅ Usuario registrado correctamente.<br />
          <strong>ID:</strong> <code>{usuarioId}</code>
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
