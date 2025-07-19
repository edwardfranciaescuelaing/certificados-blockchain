import { expect } from "chai";
import { ethers } from "hardhat";

describe("Certificado", function () {
  let contrato: any;
  let owner: any, instructor: any, estudiante: any;
  let idCertificado: string;

  beforeEach(async () => {
    // Obtenemos cuentas simuladas
    [owner, instructor, estudiante] = await ethers.getSigners();

    // Desplegamos el contrato
    const CertificadoFactory = await ethers.getContractFactory("Certificado");
    contrato = await CertificadoFactory.deploy();
    await contrato.waitForDeployment();
  });

  it("debería registrar un instructor correctamente", async () => {
    await expect(contrato.connect(instructor).registrarUsuario("Juan", true))
      .to.emit(contrato, "UsuarioRegistrado")
      .withArgs(instructor.address, "Juan", true);

    const usuario = await contrato.usuarios(instructor.address);
    expect(usuario.nombre).to.equal("Juan");
    expect(usuario.esInstructor).to.equal(true);
    expect(usuario.verificado).to.equal(true);
  });

  it("debería registrar un estudiante correctamente", async () => {
    await contrato.connect(estudiante).registrarUsuario("Ana", false);

    const usuario = await contrato.usuarios(estudiante.address);
    expect(usuario.nombre).to.equal("Ana");
    expect(usuario.esInstructor).to.equal(false);
    expect(usuario.verificado).to.equal(true);
  });

  it("instructor debería emitir un certificado a estudiante verificado", async () => {
    // Registrar instructor y estudiante
    await contrato.connect(instructor).registrarUsuario("Juan", true);
    await contrato.connect(estudiante).registrarUsuario("Ana", false);

    const curso = "Blockchain 101";
    const fecha = "2025-07-19";
    const hashContenido = "Qm123...ABC";

    // Emitir el certificado
    const tx = await contrato
      .connect(instructor)
      .emitirCertificado(estudiante.address, curso, fecha, hashContenido);

    // Extraemos el ID del certificado desde el evento
    const receipt = await tx.wait();
    const evento = receipt.logs.find((log: any) =>
      log.fragment.name === "CertificadoEmitido"
    );
    idCertificado = evento.args[0];

    expect(evento.args.estudiante).to.equal(estudiante.address);
    expect(evento.args.curso).to.equal(curso);

    const certData = await contrato.certificados(idCertificado);
    expect(certData.autorizado).to.equal(false);
  });

  it("instructor debería autorizar un certificado", async () => {
    // Registrar ambos
    await contrato.connect(instructor).registrarUsuario("Juan", true);
    await contrato.connect(estudiante).registrarUsuario("Ana", false);

    const curso = "Blockchain 101";
    const fecha = "2025-07-19";
    const hashContenido = "Qm123...ABC";

    const tx = await contrato
      .connect(instructor)
      .emitirCertificado(estudiante.address, curso, fecha, hashContenido);

    const receipt = await tx.wait();
    const evento = receipt.logs.find((log: any) =>
      log.fragment.name === "CertificadoEmitido"
    );
    idCertificado = evento.args[0];

    // Autoriza el certificado
    await expect(
      contrato.connect(instructor).autorizarCertificado(idCertificado)
    )
      .to.emit(contrato, "CertificadoAutorizado")
      .withArgs(idCertificado, instructor.address);

    const certData = await contrato.certificados(idCertificado);
    expect(certData.autorizado).to.equal(true);
  });

  it("debería verificar el contenido del certificado", async () => {
    await contrato.connect(instructor).registrarUsuario("Juan", true);
    await contrato.connect(estudiante).registrarUsuario("Ana", false);

    const curso = "Blockchain 101";
    const fecha = "2025-07-19";
    const hashContenido = "Qm123...ABC";

    const tx = await contrato
      .connect(instructor)
      .emitirCertificado(estudiante.address, curso, fecha, hashContenido);
    const receipt = await tx.wait();
    const evento = receipt.logs.find((log: any) =>
      log.fragment.name === "CertificadoEmitido"
    );
    idCertificado = evento.args[0];

    // Verificar datos del certificado
    const resultado = await contrato.verificarCertificado(idCertificado);
    expect(resultado.estudiante).to.equal(estudiante.address);
    expect(resultado.curso).to.equal(curso);
    expect(resultado.fecha).to.equal(fecha);
    expect(resultado.hashContenido).to.equal(hashContenido);
    expect(resultado.autorizado).to.equal(false);
  });
});
