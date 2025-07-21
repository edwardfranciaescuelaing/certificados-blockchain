"use client";

import {
  useWatchCertificadoCertificadoEmitidoEvent,
  useReadCertificadoCertificados,
  useWriteCertificadoAutorizarCertificado,
} from "@/generated/wagmi";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  Table,
  Button,
  Title,
  Notification,
  Loader,
  Group,
} from "@mantine/core";

export default function AutorizarCertificados() {
  const { address, isConnected } = useAccount();
  const [certificados, setCertificados] = useState<string[]>([]);

  // Escuchar eventos de emisión de certificados
  useWatchCertificadoCertificadoEmitidoEvent({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    onLogs(logs) {
      const nuevos = logs.map((log) => log.args.id as string);
      setCertificados((prev) => Array.from(new Set([...prev, ...nuevos])));
    },
  });

  const [detalleCerts, setDetalleCerts] = useState<
    {
      id: string;
      estudiante: string;
      curso: string;
      fecha: string;
      autorizado: boolean;
    }[]
  >([]);

  const { writeContractAsync } = useWriteCertificadoAutorizarCertificado();

  // Cargar detalles de todos los certificados
  useEffect(() => {
    const cargarDetalles = async () => {
      const results = await Promise.allSettled(
        certificados.map((id) =>
          useReadCertificadoCertificados.getFetch({
            address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            args: [id as `0x${string}`],
          })
        )
      );

      const nuevos = results
        .map((res, i) =>
          res.status === "fulfilled"
            ? {
                id: certificados[i],
                estudiante: res.value.result.estudiante,
                curso: res.value.result.curso,
                fecha: res.value.result.fecha,
                autorizado: res.value.result.autorizado,
              }
            : null
        )
        .filter(Boolean) as typeof detalleCerts;

      setDetalleCerts(nuevos);
    };

    if (certificados.length > 0) cargarDetalles();
  }, [certificados]);

  const autorizar = async (id: string) => {
    try {
      await writeContractAsync({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        args: [id as `0x${string}`],
      });
      alert("✅ Certificado autorizado.");
    } catch (e) {
      console.error("❌ Error al autorizar", e);
      alert("❌ Error al autorizar: " + (e as Error).message);
    }
  };

  return (
    <div>
      <Title order={2}>📜 Certificados emitidos</Title>

      {!isConnected && (
        <Notification color="yellow" mt="md">
          Debes conectar tu wallet para ver y autorizar certificados.
        </Notification>
      )}

      {detalleCerts.length === 0 ? (
        <Loader mt="lg" />
      ) : (
        <Table highlightOnHover withBorder mt="md">
          <thead>
            <tr>
              <th>ID</th>
              <th>Curso</th>
              <th>Fecha</th>
              <th>Estudiante</th>
              <th>¿Autorizado?</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {detalleCerts.map((cert) => (
              <tr key={cert.id}>
                <td style={{ fontSize: "0.7rem" }}>{cert.id}</td>
                <td>{cert.curso}</td>
                <td>{cert.fecha}</td>
                <td>
                  <code>{cert.estudiante}</code>
                </td>
                <td>{cert.autorizado ? "✅ Sí" : "❌ No"}</td>
                <td>
                  {!cert.autorizado && (
                    <Button
                      size="xs"
                      onClick={() => autorizar(cert.id)}
                      variant="outline"
                    >
                      Autorizar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
