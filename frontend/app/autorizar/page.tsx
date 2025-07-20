"use client";

import { useState } from "react";
import { TextInput, Button, Notification, Stack, Title } from "@mantine/core";
import { useWriteCertificadoAutorizarCertificado } from "@/generated/wagmi";

export default function AutorizarPage() {
  const [id, setId] = useState("");

  const { write, isPending, isSuccess, data, error } = useWriteCertificadoAutorizarCertificado({
    args: [id],
    enabled: id.startsWith("0x") && id.length === 66,
  });

  return (
    <div>
      <Title order={2} mb="md">Autorizar Certificado</Title>
      <form onSubmit={(e) => {
        e.preventDefault();
        write?.();
      }}>
        <Stack>
          <TextInput label="ID del certificado (bytes32)" value={id} onChange={(e) => setId(e.currentTarget.value)} />
          <Button type="submit" loading={isPending}>Autorizar</Button>
        </Stack>
      </form>
      {isSuccess && data && <Notification color="green" mt="md">Certificado autorizado. Tx: {data.hash}</Notification>}
      {error && <Notification color="red" mt="md">{error.message}</Notification>}
    </div>
  );
}
