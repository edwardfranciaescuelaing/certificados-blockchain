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

  // ✅ Procesar los datos correctamente como array
  let usuarioData = null;
  if (usuario && Array.isArray(usuario) && usuario.length >= 3) {
    const [nombre, esInstructor, verificado] = usuario;
    usuarioData = {
      nombre,
      esInstructor,
      verificado
    };
  }

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
          ) : usuarioData && usuarioData.verificado ? (
            <ul>
              <li><strong>Dirección:</strong> {address}</li>
              <li><strong>Nombre:</strong> {usuarioData.nombre}</li>
              <li><strong>Instructor:</strong> {usuarioData.esInstructor ? "Sí" : "No"}</li>
              <li><strong>Verificado:</strong> {usuarioData.verificado ? "Sí" : "No"}</li>
            </ul>
          ) : (
            <p style={{ color: "orange" }}>⚠️ Este usuario aún no está registrado.</p>
          )}

          {/* Debug: Mostrar estructura de datos raw (opcional, para desarrollo) */}
          {process.env.NODE_ENV === 'development' && usuario && (
            <div style={{ 
              marginTop: '20px', 
              padding: '10px', 
              background: '#f0f0f0', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.8em'
            }}>
             
            </div>
          )}
        </>
      )}
    </main>
  );
}