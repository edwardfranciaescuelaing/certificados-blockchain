"use client";

import { useState } from "react";
import { TextInput, Button, Notification, Stack, Title } from "@mantine/core";
import { useWriteCertificadoEmitirCertificado } from "@/generated/wagmi";

export default function EmitirPage() {
  const [estudiante, setEstudiante] = useState("");
  const [curso, setCurso] = useState("");
  const [fecha, setFecha] = useState("");
  const [hashContenido, setHashContenido] = useState("");

  const { write, isPending, isSuccess, data, error } = useWriteCertificadoEmitirCertificado({
    args: [estudiante, curso, fecha, hashContenido],
    enabled: estudiante.startsWith("0x") && curso && fecha && hashContenido,
  });

  return (
    <div>
      <Title order={2} mb="md">Emitir Certificado</Title>
      <form onSubmit={(e) => {
        e.preventDefault();
        write?.();
      }}>
        <Stack>
          <TextInput label="Dirección del estudiante" value={estudiante} onChange={(e) => setEstudiante(e.currentTarget.value)} />
          <TextInput label="Nombre del curso" value={curso} onChange={(e) => setCurso(e.currentTarget.value)} />
          <TextInput label="Fecha" value={fecha} onChange={(e) => setFecha(e.currentTarget.value)} />
          <TextInput label="Hash del contenido" value={hashContenido} onChange={(e) => setHashContenido(e.currentTarget.value)} />
          <Button type="submit" loading={isPending}>Emitir</Button>
        </Stack>
      </form>
      {isSuccess && data && <Notification color="green" mt="md">Certificado emitido. Tx: {data.hash}</Notification>}
      {error && <Notification color="red" mt="md">{error.message}</Notification>}
    </div>
  );
}
