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

export default function RegistrarPage() {
  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [esInstructor, setEsInstructor] = useState(false);

  // Conexión con la wallet
  const { address, isConnected } = useAccount();

  // Hook para llamar al contrato inteligente
  const {
    write,
    isPending,
    isSuccess,
    error,
  } = useWriteCertificadoRegistrarUsuario({
    args: [nombre, esInstructor],
    enabled: nombre.length > 2 && isConnected,
  });

  // Logs de depuración
  console.log("Nombre:", nombre);
  console.log("Es instructor:", esInstructor);
  console.log("Hook habilitado:", nombre.length > 2 && isConnected);
  console.log("write disponible:", !!write);
  console.log("isPending:", isPending);
  console.log("isSuccess:", isSuccess);
  console.log("Error:", error);

  useEffect(() => {
    console.log("write cambió:", write);
  }, [write]);

  return (
    <div>
      <Title order={2} mb="md">Registrar Usuario</Title>

      {/* Estado de conexión */}
      {!isConnected && (
        <Notification color="yellow" mt="md">
          Conecta tu wallet para registrar un usuario.
        </Notification>
      )}

      {/* Estado actual del formulario */}
      <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#555" }}>
        <p>Estado del formulario:</p>
        <p>Nombre: <strong>{nombre}</strong></p>
        <p>Es instructor: <strong>{esInstructor ? "Sí" : "No"}</strong></p>
        <p>Wallet conectada: <strong>{isConnected ? "Sí" : "No"}</strong></p>
        <p>Hook habilitado: <strong>{nombre.length > 2 && isConnected ? "Sí" : "No"}</strong></p>
        <p>Función write disponible: <strong>{write ? "Sí" : "No"}</strong></p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Formulario enviado");
          if (write) {
            console.log("Ejecutando write con:", nombre, esInstructor);
            write();
          } else {
            console.log("La función write no está disponible aún.");
          }
        }}
      >
        <Stack>
          <TextInput
            label="Nombre"
            value={nombre}
            onChange={(e) => {
              const value = e.currentTarget.value;
              console.log("Nombre actualizado a:", value);
              setNombre(value);
            }}
            required
          />

          <Checkbox
            label="¿Es instructor?"
            checked={esInstructor}
            onChange={(e) => {
              const checked = e.currentTarget.checked;
              console.log("Es instructor actualizado a:", checked);
              setEsInstructor(checked);
            }}
          />

          <Button type="submit" loading={isPending}>
            Registrar
          </Button>
        </Stack>
      </form>

      {/* Notificaciones de resultado */}
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
