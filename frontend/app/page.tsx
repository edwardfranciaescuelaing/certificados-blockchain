"use client";
import { useAccount } from "wagmi";
import { useReadCertificadoUsuarios } from "@/generated/wagmi";

export default function HomePage() {
  const { address } = useAccount();
  console.log("📍 Dirección conectada:", address);

  const { data: usuario, isLoading, error } = useReadCertificadoUsuarios({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    watch: true,
  });

  console.log("🔎 Resultado del contrato para 'usuarios':", usuario);
  console.log("⛔ Error al leer usuario:", error?.message);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Certificación Académica</h1>
      <p>
        Bienvenido al sistema de emisión, autorización y verificación de certificados académicos en blockchain.
      </p>

      {address && (
        <>
          <h2>👤 Información del usuario</h2>
          {isLoading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p style={{ color: "red" }}>❌ Error: {error.message}</p>
          ) : usuario && usuario.verificado ? (
            <ul>
              <li><strong>Dirección:</strong> {address}</li>
              <li><strong>Nombre:</strong> {usuario.nombre}</li>
              <li><strong>Instructor:</strong> {usuario.esInstructor ? "Sí" : "No"}</li>
              <li><strong>Verificado:</strong> {usuario.verificado ? "Sí" : "No"}</li>
            </ul>
          ) : (
            <p style={{ color: "orange" }}>⚠️ Este usuario aún no está registrado.</p>
          )}
        </>
      )}
    </main>
  );
}
