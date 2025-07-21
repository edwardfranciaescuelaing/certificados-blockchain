"use client";

import {
  useWatchCertificadoCertificadoEmitidoEvent,
  useWatchCertificadoCertificadoAutorizadoEvent,
  useReadCertificadoCertificados,
  useWriteCertificadoAutorizarCertificado,
} from "@/generated/wagmi";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import {
  Table,
  Button,
  Title,
  Notification,
  Loader,
  Group,
  Text,
} from "@mantine/core";
import { certificadoAbi } from "@/generated/wagmi";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as const;

interface CertificadoDetalle {
  id: string;
  estudiante: string;
  curso: string;
  fecha: string;
  hashContenido: string;
  autorizado: boolean;
}

export default function AutorizarCertificados() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [certificadoIds, setCertificadoIds] = useState<string[]>([]);
  const [autorizando, setAutorizando] = useState<string | null>(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  // Cargar eventos históricos de certificados emitidos
  const cargarEventosHistoricos = async () => {
    if (!publicClient || !isConnected) return;

    setCargandoHistorial(true);
    console.log("Cargando eventos históricos...");

    try {
      // Obtener todos los eventos CertificadoEmitido desde el bloque 0
      const eventos = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: {
          type: 'event',
          anonymous: false,
          inputs: [
            { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
            { name: 'estudiante', internalType: 'address', type: 'address', indexed: true },
            { name: 'curso', internalType: 'string', type: 'string', indexed: false },
          ],
          name: 'CertificadoEmitido',
        },
        fromBlock: 0n,
        toBlock: 'latest',
      });

      console.log("Eventos encontrados:", eventos);

      // Extraer los IDs de los eventos
      const idsHistoricos = eventos.map((evento) => evento.args.id as string);
      
      // Agregar IDs únicos
      setCertificadoIds((prev) => {
        const todosLosIds = Array.from(new Set([...prev, ...idsHistoricos]));
        console.log("Total de certificados cargados:", todosLosIds.length);
        return todosLosIds;
      });

    } catch (error) {
      console.error("Error al cargar eventos históricos:", error);
    } finally {
      setCargandoHistorial(false);
    }
  };

  // Cargar historial cuando se conecta
  useEffect(() => {
    if (isConnected && publicClient) {
      cargarEventosHistoricos();
    }
  }, [isConnected, publicClient]);

  // Escuchar nuevos certificados emitidos
  useWatchCertificadoCertificadoEmitidoEvent({
    address: CONTRACT_ADDRESS,
    onLogs(logs) {
      console.log("Nuevos certificados emitidos:", logs);
      const nuevosIds = logs.map((log) => log.args.id as string);
      setCertificadoIds((prev) => {
        const updated = Array.from(new Set([...prev, ...nuevosIds]));
        console.log("IDs de certificados actualizados:", updated);
        return updated;
      });
    },
  });

  // Escuchar certificados autorizados para actualizar estado
  useWatchCertificadoCertificadoAutorizadoEvent({
    address: CONTRACT_ADDRESS,
    onLogs(logs) {
      console.log("Certificados autorizados:", logs);
      // Forzar re-render de los componentes afectados
      // (Los hooks individuales se actualizarán automáticamente)
    },
  });

  const { writeContractAsync } = useWriteCertificadoAutorizarCertificado();

  // Componente para cargar un certificado individual
  function CertificadoRow({ id }: { id: string }) {
    const { data, isLoading, error, refetch } = useReadCertificadoCertificados({
      address: CONTRACT_ADDRESS,
      args: [id as `0x${string}`],
    });

    const autorizar = async () => {
      if (!isConnected || !address) {
        alert("❌ Debes conectar tu wallet primero");
        return;
      }

      setAutorizando(id);
      console.log("Intentando autorizar certificado:", id);

      try {
        const tx = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          args: [id as `0x${string}`],
        });
        
        console.log("Transacción enviada:", tx);
        alert("✅ Certificado autorizado exitosamente!");
        
        // Refrescar los datos del certificado
        setTimeout(() => {
          refetch();
        }, 2000);
        
      } catch (error) {
        console.error("❌ Error al autorizar certificado:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        alert(`❌ Error al autorizar certificado: ${errorMessage}`);
      } finally {
        setAutorizando(null);
      }
    };

    if (isLoading) {
      return (
        <tr>
          <td colSpan={6}>
            <Group>
              <Loader size="xs" />
              <Text size="sm">Cargando certificado {id.slice(0, 10)}...</Text>
            </Group>
          </td>
        </tr>
      );
    }

    if (error || !data) {
      return (
        <tr>
          <td colSpan={6}>
            <Text color="red" size="sm">
              Error al cargar certificado {id.slice(0, 10)}...
              <Button size="xs" variant="subtle" onClick={() => refetch()} ml="sm">
                Reintentar
              </Button>
            </Text>
          </td>
        </tr>
      );
    }

    const [estudiante, curso, fecha, hashContenido, autorizado] = data;

    return (
      <tr key={id}>
        <td>
          <Text size="xs" style={{ fontFamily: "monospace" }}>
            {id.slice(0, 10)}...
          </Text>
        </td>
        <td>
          <Text weight={500}>{curso}</Text>
        </td>
        <td>{fecha}</td>
        <td>
          <Text size="xs" style={{ fontFamily: "monospace" }}>
            {estudiante.slice(0, 6)}...{estudiante.slice(-4)}
          </Text>
        </td>
        <td>
          <Text color={autorizado ? "green" : "orange"}>
            {autorizado ? "✅ Autorizado" : "⏳ Pendiente"}
          </Text>
        </td>
        <td>
          {!autorizado ? (
            <Button
              size="xs"
              onClick={autorizar}
              variant="outline"
              loading={autorizando === id}
              disabled={autorizando !== null}
            >
              {autorizando === id ? "Autorizando..." : "Autorizar"}
            </Button>
          ) : (
            <Text size="xs" color="green" weight={500}>
              Completado
            </Text>
          )}
        </td>
      </tr>
    );
  }

  // Mostrar mensaje si no está conectado
  if (!isConnected) {
    return (
      <div>
        <Title order={2}>📜 Autorizar Certificados</Title>
        <Notification color="yellow" mt="md">
          Debes conectar tu wallet para ver y autorizar certificados.
        </Notification>
      </div>
    );
  }

  return (
    <div>
      <Title order={2}>📜 Certificados para Autorizar</Title>
      
      <Group mt="md" justify="space-between">
        <Group>
          <Text size="sm" color="dimmed">
            Total de certificados: {certificadoIds.length}
          </Text>
          {cargandoHistorial && (
            <Group gap="xs">
              <Loader size="xs" />
              <Text size="sm" color="blue">Cargando historial...</Text>
            </Group>
          )}
        </Group>
        
        <Button
          size="xs"
          variant="light"
          onClick={cargarEventosHistoricos}
          loading={cargandoHistorial}
        >
          Refrescar
        </Button>
      </Group>

      {certificadoIds.length === 0 && !cargandoHistorial ? (
        <Notification color="blue" mt="md">
          No hay certificados registrados en el contrato. 
          {!cargandoHistorial && (
            <Button size="xs" variant="subtle" onClick={cargarEventosHistoricos} ml="sm">
              Cargar historial
            </Button>
          )}
        </Notification>
      ) : (
        <Table highlightOnHover style={{ border: "1px solid #ddd" }} mt="md">
          <thead>
            <tr>
              <th>ID</th>
              <th>Curso</th>
              <th>Fecha</th>
              <th>Estudiante</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {certificadoIds.map((id) => (
              <CertificadoRow key={id} id={id} />
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}