"use client";

import { useState } from "react";
import { TextInput, Button, Stack, Title, Notification } from "@mantine/core";
import { useReadCertificadoVerificarCertificado } from "@/generated/wagmi";

export default function VerificarPage() {
  const [id, setId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data, error, refetch, isFetching } = useReadCertificadoVerificarCertificado({
    args: [id],
    enabled: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    refetch();
  };

  return (
    <div>
      <Title order={2} mb="md">Verificar Certificado</Title>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput label="ID del certificado (bytes32)" value={id} onChange={(e) => setId(e.currentTarget.value)} />
          <Button type="submit" loading={isFetching}>Verificar</Button>
        </Stack>
      </form>

      {data && (
        <Notification title="Certificado encontrado" color="green" mt="md">
          Estudiante: {data.estudiante} <br />
          Curso: {data.curso} <br />
          Fecha: {data.fecha} <br />
          Hash: {data.hashContenido} <br />
          Autorizado: {data.autorizado ? "Sí" : "No"}
        </Notification>
      )}

      {error && (
        <Notification color="red" title="Error" mt="md">
          {error.message}
        </Notification>
      )}

      {submitted && !data && !error && (
        <Notification title="Buscando..." color="blue" mt="md">
          Consultando información del certificado...
        </Notification>
      )}
    </div>
  );
}
