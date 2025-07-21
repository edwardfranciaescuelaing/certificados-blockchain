"use client"; 
// Indica que este archivo es un componente React que se ejecuta en el cliente (no en el servidor).

import { useAccount } from "wagmi";
// Importa el hook `useAccount` de la librería `wagmi`, que se utiliza para obtener información sobre la cuenta conectada.

import { useReadCertificadoUsuarios } from "@/generated/wagmi";
// Importa un hook generado automáticamente para interactuar con un contrato inteligente relacionado con "CertificadoUsuarios".

export default function HomePage() {
// Define el componente principal de la página, llamado `HomePage`.

  const { address } = useAccount();
  // Obtiene la dirección de la cuenta conectada desde el hook `useAccount`.

  console.log("📍 Dirección conectada:", address);
  // Muestra en la consola la dirección de la cuenta conectada.

  const { data: usuario, isLoading, error } = useReadCertificadoUsuarios({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    // Dirección del contrato inteligente al que se está llamando.

    args: [address ?? "0x0000000000000000000000000000000000000000"],
    // Argumentos para la función del contrato. Si `address` es `null`, usa una dirección por defecto.

    watch: true,
    // Activa la observación de cambios en los datos del contrato.
  });

  console.log("🔎 Resultado del contrato para 'usuarios':", usuario);
  // Muestra en la consola los datos obtenidos del contrato inteligente.

  console.log("⛔ Error al leer usuario:", error?.message);
  // Muestra en la consola cualquier error que ocurra al leer los datos del contrato.

  // ✅ Procesar los datos correctamente como array
  let usuarioData = null;
  // Inicializa una variable `usuarioData` como `null`.

  if (usuario && Array.isArray(usuario) && usuario.length >= 3) {
    // Verifica si `usuario` existe, es un array y tiene al menos 3 elementos.

    const [nombre, esInstructor, verificado] = usuario;
    // Desestructura los tres primeros elementos del array `usuario`.

    usuarioData = {
      nombre,
      esInstructor,
      verificado
    };
    // Asigna los valores desestructurados a un objeto `usuarioData`.
  }

  return (
    <main style={{ padding: "2rem" }}>
   

      <h1>Certificación Académica</h1>
   

      <p>
        Bienvenido al sistema de emisión, autorización y verificación de certificados académicos en blockchain.
      </p>
 

      {address && (
      // Renderiza contenido adicional si hay una dirección conectada.
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