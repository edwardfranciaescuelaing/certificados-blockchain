"use client";

import { useState, useEffect } from "react";
import {
  TextInput,
  Checkbox,
  Button,
  Notification,
  Stack,
  Title,
  Table,
  Group,
  Text,
  Loader,
  Badge,
  Divider,
} from "@mantine/core";
import { useAccount, usePublicClient } from "wagmi";
import { 
  useWriteCertificadoRegistrarUsuario,
  useWatchCertificadoUsuarioRegistradoEvent,
  useReadCertificadoUsuarios,
  certificadoAbi 
} from "@/generated/wagmi";

const CONTRATO_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as const;

interface UsuarioRegistrado {
  address: string;
  nombre: string;
  esInstructor: boolean;
}

export default function RegistrarPage() {
  const [nombre, setNombre] = useState("");
  const [esInstructor, setEsInstructor] = useState(false);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState<string[]>([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);

  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const {
    writeContract,
    isPending,
    isSuccess,
    error,
  } = useWriteCertificadoRegistrarUsuario();

  // Cargar usuarios históricos desde eventos
  const cargarUsuariosHistoricos = async () => {
    if (!publicClient || !isConnected) return;

    setCargandoUsuarios(true);
    console.log("Cargando usuarios registrados...");

    try {
      // Obtener todos los eventos UsuarioRegistrado
      const eventos = await publicClient.getLogs({
        address: CONTRATO_ADDRESS,
        event: {
          type: 'event',
          anonymous: false,
          inputs: [
            { name: 'usuario', internalType: 'address', type: 'address', indexed: true },
            { name: 'nombre', internalType: 'string', type: 'string', indexed: false },
            { name: 'esInstructor', internalType: 'bool', type: 'bool', indexed: false },
          ],
          name: 'UsuarioRegistrado',
        },
        fromBlock: 0n,
        toBlock: 'latest',
      });

      console.log("Eventos de usuarios encontrados:", eventos);

      // Extraer las direcciones de los usuarios
      const direccionesUsuarios = eventos.map((evento) => evento.args.usuario as string);
      
      // Agregar direcciones únicas
      setUsuariosRegistrados((prev) => {
        const todasLasDirecciones = Array.from(new Set([...prev, ...direccionesUsuarios]));
        console.log("Total de usuarios cargados:", todasLasDirecciones.length);
        return todasLasDirecciones;
      });

    } catch (error) {
      console.error("Error al cargar usuarios históricos:", error);
    } finally {
      setCargandoUsuarios(false);
    }
  };

  // Cargar usuarios cuando se conecta
  useEffect(() => {
    if (isConnected && publicClient) {
      cargarUsuariosHistoricos();
    }
  }, [isConnected, publicClient]);

  // Escuchar nuevos usuarios registrados
  useWatchCertificadoUsuarioRegistradoEvent({
    address: CONTRATO_ADDRESS,
    onLogs(logs) {
      console.log("Nuevos usuarios registrados:", logs);
      const nuevasDirecciones = logs.map((log) => log.args.usuario as string);
      setUsuariosRegistrados((prev) => {
        const updated = Array.from(new Set([...prev, ...nuevasDirecciones]));
        console.log("Direcciones de usuarios actualizadas:", updated);
        return updated;
      });
    },
  });

  // Componente para mostrar un usuario individual
  function UsuarioRow({ userAddress }: { userAddress: string }) {
    const { data, isLoading, error, refetch } = useReadCertificadoUsuarios({
      address: CONTRATO_ADDRESS,
      args: [userAddress as `0x${string}`],
    });

    if (isLoading) {
      return (
        <tr>
          <td colSpan={4}>
            <Group>
              <Loader size="xs" />
              <Text size="sm">Cargando usuario {userAddress.slice(0, 10)}...</Text>
            </Group>
          </td>
        </tr>
      );
    }

    if (error || !data) {
      return (
        <tr>
          <td colSpan={4}>
            <Text color="red" size="sm">
              Error al cargar usuario {userAddress.slice(0, 10)}...
              <Button size="xs" variant="subtle" onClick={() => refetch()} ml="sm">
                Reintentar
              </Button>
            </Text>
          </td>
        </tr>
      );
    }

    const [nombre, esInstructor, verificado] = data;

    return (
      <tr key={userAddress}>
        <td>
          <Text size="xs" style={{ fontFamily: "monospace" }}>
            {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </Text>
        </td>
        <td>
          <Text weight={500}>{nombre || "Sin nombre"}</Text>
        </td>
        <td>
          <Badge color={esInstructor ? "blue" : "gray"} variant="light">
            {esInstructor ? "Instructor" : "Estudiante"}
          </Badge>
        </td>
        <td>
          <Badge color={verificado ? "green" : "orange"} variant="light">
            {verificado ? "✅ Verificado" : "⏳ Pendiente"}
          </Badge>
        </td>
      </tr>
    );
  }

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

      setUsuarioId(address);
      
      // Limpiar formulario después de registro exitoso
      setTimeout(() => {
        setNombre("");
        setEsInstructor(false);
        setUsuarioId(null);
      }, 3000);

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
      <Title order={2} mb="md">👥 Gestión de Usuarios</Title>

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

      {isConnected && (
        <>
          <Title order={3} size="h4" mb="md">📝 Registrar Nuevo Usuario</Title>
          
          <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#555" }}>
            <Group>
              <Text size="sm">Wallet: <strong>{address?.slice(0, 6)}...{address?.slice(-4)}</strong></Text>
              <Text size="sm">Nombre: <strong>{nombre || "Sin especificar"}</strong></Text>
              <Text size="sm">Tipo: <strong>{esInstructor ? "Instructor" : "Estudiante"}</strong></Text>
            </Group>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Nombre"
                placeholder="Ingresa tu nombre completo"
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
                {isPending ? "Registrando..." : "Registrar Usuario"}
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

          <Divider my="xl" />

          <Title order={3} size="h4" mb="md">📋 Usuarios Registrados</Title>
          
          <Group mb="md" justify="space-between">
            <Group>
              <Text size="sm" color="dimmed">
                Total de usuarios: {usuariosRegistrados.length}
              </Text>
              {cargandoUsuarios && (
                <Group gap="xs">
                  <Loader size="xs" />
                  <Text size="sm" color="blue">Cargando...</Text>
                </Group>
              )}
            </Group>
            
            <Button
              size="xs"
              variant="light"
              onClick={cargarUsuariosHistoricos}
              loading={cargandoUsuarios}
            >
              Refrescar
            </Button>
          </Group>

          {usuariosRegistrados.length === 0 && !cargandoUsuarios ? (
            <Notification color="blue">
              No hay usuarios registrados aún.
              {!cargandoUsuarios && (
                <Button size="xs" variant="subtle" onClick={cargarUsuariosHistoricos} ml="sm">
                  Cargar historial
                </Button>
              )}
            </Notification>
          ) : (
            <Table highlightOnHover style={{ border: "1px solid #ddd" }}>

              <thead>
                <tr>
                  <th>Dirección</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuariosRegistrados.map((userAddress) => (
                  <UsuarioRow key={userAddress} userAddress={userAddress} />
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}