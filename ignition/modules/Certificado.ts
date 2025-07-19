import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/// @title Módulo de despliegue de Certificado
/// @notice Define cómo se despliega el contrato Certificado con Ignition
const CertificadoModule = buildModule("CertificadoModule", (m) => {
  // Desplegamos el contrato Certificado sin parámetros
  const contrato = m.contract("Certificado", []);

  // Retornamos el contrato para usarlo luego
  return { contrato };
});

export default CertificadoModule;
