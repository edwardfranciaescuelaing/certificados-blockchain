"use client";

import { useState } from "react";
import { TextInput, Checkbox, Button, Notification, Stack, Title } from "@mantine/core";
import { useWriteCertificadoRegistrarUsuario } from "@/generated/wagmi";

export default function RegistrarPage() {
  const [nombre, setNombre] = useState("");
  const [esInstructor, setEsInstructor] = useState(false);

  const { write, isPending, isSuccess, error } = useWriteCertificadoRegistrarUsuario({
    args: [nombre, esInstructor],
    enabled: nombre.length > 2,
  });

  return (
    <div>
      <Title order={2} mb="md">Registrar Usuario</Title>
      <form onSubmit={(e) => {
        e.preventDefault();
        write?.();
      }}>
        <Stack>
          <TextInput label="Nombre" value={nombre} onChange={(e) => setNombre(e.currentTarget.value)} required />
          <Checkbox label="¿Es instructor?" checked={esInstructor} onChange={(e) => setEsInstructor(e.currentTarget.checked)} />
          <Button type="submit" loading={isPending}>Registrar</Button>
        </Stack>
      </form>
      {isSuccess && <Notification color="green" mt="md">Usuario registrado correctamente.</Notification>}
      {error && <Notification color="red" mt="md">{error.message}</Notification>}
    </div>
  );
}
