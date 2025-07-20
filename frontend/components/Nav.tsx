"use client";

import { Stack, NavLink } from "@mantine/core";
import Link from "next/link";

export default function Nav() {
  return (
    <Stack>
      <NavLink label="Inicio" component={Link} href="/" />
      <NavLink label="Registrar" component={Link} href="/registrar" />
      <NavLink label="Emitir" component={Link} href="/emitir" />
      <NavLink label="Autorizar" component={Link} href="/autorizar" />
      <NavLink label="Verificar" component={Link} href="/verificar" />
    </Stack>
  );
}
