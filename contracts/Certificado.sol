// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Certificado
 * @dev Contrato para emitir, autorizar y verificar certificados académicos.
 */
contract Certificado {
    // Estructura que representa un certificado emitido
    struct CertificadoData {
        address estudiante;
        string curso;
        string fecha;
        string hashContenido; // Hash del PDF o JSON del certificado
        bool autorizado;
    }

    // Estructura que representa un usuario registrado
    struct Usuario {
        string nombre;
        bool esInstructor;
        bool verificado;
    }

    // Mapeo de direcciones a usuarios registrados
    mapping(address => Usuario) public usuarios;

    // Mapeo de IDs únicos de certificado a la estructura CertificadoData
    mapping(bytes32 => CertificadoData) public certificados;

    // Eventos emitidos por el contrato
    event UsuarioRegistrado(address indexed usuario, string nombre, bool esInstructor);
    event CertificadoEmitido(bytes32 indexed id, address indexed estudiante, string curso);
    event CertificadoAutorizado(bytes32 indexed id, address indexed instructor);

    // Modificador para restringir acceso a usuarios verificados
    modifier soloVerificado() {
        require(usuarios[msg.sender].verificado, "Usuario no verificado");
        _;
    }

    // Modificador para restringir a instructores
    modifier soloInstructor() {
        require(usuarios[msg.sender].esInstructor, "No es instructor");
        _;
    }

    /**
     * @notice Permite a un usuario registrarse con un nombre y rol (estudiante o instructor)
     */
    function registrarUsuario(string memory nombre, bool esInstructor) external {
        require(!usuarios[msg.sender].verificado, "Ya registrado");

        usuarios[msg.sender] = Usuario(nombre, esInstructor, true);
        emit UsuarioRegistrado(msg.sender, nombre, esInstructor);
    }

    /**
     * @notice Permite a un instructor emitir un certificado a un estudiante
     */
    function emitirCertificado(
        address estudiante,
        string memory curso,
        string memory fecha,
        string memory hashContenido
    ) external soloVerificado soloInstructor {
        require(usuarios[estudiante].verificado, "Estudiante no verificado");

        bytes32 id = keccak256(abi.encodePacked(estudiante, curso, fecha, block.timestamp));
        certificados[id] = CertificadoData(estudiante, curso, fecha, hashContenido, false);

        emit CertificadoEmitido(id, estudiante, curso);
    }

    /**
     * @notice Permite a un instructor autorizar un certificado previamente emitido
     */
    function autorizarCertificado(bytes32 id) external soloVerificado soloInstructor {
        require(certificados[id].estudiante != address(0), "Certificado no existe");
        certificados[id].autorizado = true;

        emit CertificadoAutorizado(id, msg.sender);
    }

    /**
     * @notice Consulta pública: permite verificar si un certificado está autorizado
     */
    function verificarCertificado(bytes32 id) external view returns (
        address estudiante,
        string memory curso,
        string memory fecha,
        string memory hashContenido,
        bool autorizado
    ) {
        CertificadoData memory c = certificados[id];
        require(c.estudiante != address(0), "Certificado no encontrado");
        return (c.estudiante, c.curso, c.fecha, c.hashContenido, c.autorizado);
    }
}
