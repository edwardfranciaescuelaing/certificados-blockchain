import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Certificado
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const certificadoAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'instructor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'CertificadoAutorizado',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'estudiante',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'curso', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'CertificadoEmitido',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'usuario',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'nombre',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'esInstructor',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'UsuarioRegistrado',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    name: 'autorizarCertificado',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'certificados',
    outputs: [
      { name: 'estudiante', internalType: 'address', type: 'address' },
      { name: 'curso', internalType: 'string', type: 'string' },
      { name: 'fecha', internalType: 'string', type: 'string' },
      { name: 'hashContenido', internalType: 'string', type: 'string' },
      { name: 'autorizado', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'estudiante', internalType: 'address', type: 'address' },
      { name: 'curso', internalType: 'string', type: 'string' },
      { name: 'fecha', internalType: 'string', type: 'string' },
      { name: 'hashContenido', internalType: 'string', type: 'string' },
    ],
    name: 'emitirCertificado',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nombre', internalType: 'string', type: 'string' },
      { name: 'esInstructor', internalType: 'bool', type: 'bool' },
    ],
    name: 'registrarUsuario',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'usuarios',
    outputs: [
      { name: 'nombre', internalType: 'string', type: 'string' },
      { name: 'esInstructor', internalType: 'bool', type: 'bool' },
      { name: 'verificado', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    name: 'verificarCertificado',
    outputs: [
      { name: 'estudiante', internalType: 'address', type: 'address' },
      { name: 'curso', internalType: 'string', type: 'string' },
      { name: 'fecha', internalType: 'string', type: 'string' },
      { name: 'hashContenido', internalType: 'string', type: 'string' },
      { name: 'autorizado', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lockAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_unlockTime', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'when',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdrawal',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlockTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link certificadoAbi}__
 */
export const useReadCertificado = /*#__PURE__*/ createUseReadContract({
  abi: certificadoAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link certificadoAbi}__ and `functionName` set to `"certificados"`
 */
export const useReadCertificadoCertificados =
  /*#__PURE__*/ createUseReadContract({
    abi: certificadoAbi,
    functionName: 'certificados',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link certificadoAbi}__ and `functionName` set to `"usuarios"`
 */
export const useReadCertificadoUsuarios = /*#__PURE__*/ createUseReadContract({
  abi: certificadoAbi,
  functionName: 'usuarios',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link certificadoAbi}__ and `functionName` set to `"verificarCertificado"`
 */
export const useReadCertificadoVerificarCertificado =
  /*#__PURE__*/ createUseReadContract({
    abi: certificadoAbi,
    functionName: 'verificarCertificado',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link certificadoAbi}__
 */
export const useWriteCertificado = /*#__PURE__*/ createUseWriteContract({
  abi: certificadoAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link certificadoAbi}__ and `functionName` set to `"autorizarCertificado"`
 */
export const useWriteCertificadoAutorizarCertificado =
  /*#__PURE__*/ createUseWriteContract({
    abi: certificadoAbi,
    functionName: 'autorizarCertificado',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link certificadoAbi}__ and `functionName` set to `"emitirCertificado"`
 */
export const useWriteCertificadoEmitirCertificado =
  /*#__PURE__*/ createUseWriteContract({
    abi: certificadoAbi,
    functionName: 'emitirCertificado',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link certificadoAbi}__ and `functionName` set to `"registrarUsuario"`
 */
export const useWriteCertificadoRegistrarUsuario =
  /*#__PURE__*/ createUseWriteContract({
    abi: certificadoAbi,
    functionName: 'registrarUsuario',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link certificadoAbi}__
 */
export const useSimulateCertificado = /*#__PURE__*/ createUseSimulateContract({
  abi: certificadoAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link certificadoAbi}__ and `functionName` set to `"autorizarCertificado"`
 */
export const useSimulateCertificadoAutorizarCertificado =
  /*#__PURE__*/ createUseSimulateContract({
    abi: certificadoAbi,
    functionName: 'autorizarCertificado',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link certificadoAbi}__ and `functionName` set to `"emitirCertificado"`
 */
export const useSimulateCertificadoEmitirCertificado =
  /*#__PURE__*/ createUseSimulateContract({
    abi: certificadoAbi,
    functionName: 'emitirCertificado',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link certificadoAbi}__ and `functionName` set to `"registrarUsuario"`
 */
export const useSimulateCertificadoRegistrarUsuario =
  /*#__PURE__*/ createUseSimulateContract({
    abi: certificadoAbi,
    functionName: 'registrarUsuario',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link certificadoAbi}__
 */
export const useWatchCertificadoEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: certificadoAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link certificadoAbi}__ and `eventName` set to `"CertificadoAutorizado"`
 */
export const useWatchCertificadoCertificadoAutorizadoEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: certificadoAbi,
    eventName: 'CertificadoAutorizado',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link certificadoAbi}__ and `eventName` set to `"CertificadoEmitido"`
 */
export const useWatchCertificadoCertificadoEmitidoEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: certificadoAbi,
    eventName: 'CertificadoEmitido',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link certificadoAbi}__ and `eventName` set to `"UsuarioRegistrado"`
 */
export const useWatchCertificadoUsuarioRegistradoEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: certificadoAbi,
    eventName: 'UsuarioRegistrado',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lockAbi}__
 */
export const useReadLock = /*#__PURE__*/ createUseReadContract({ abi: lockAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"owner"`
 */
export const useReadLockOwner = /*#__PURE__*/ createUseReadContract({
  abi: lockAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"unlockTime"`
 */
export const useReadLockUnlockTime = /*#__PURE__*/ createUseReadContract({
  abi: lockAbi,
  functionName: 'unlockTime',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lockAbi}__
 */
export const useWriteLock = /*#__PURE__*/ createUseWriteContract({
  abi: lockAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteLockWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: lockAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lockAbi}__
 */
export const useSimulateLock = /*#__PURE__*/ createUseSimulateContract({
  abi: lockAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateLockWithdraw = /*#__PURE__*/ createUseSimulateContract({
  abi: lockAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lockAbi}__
 */
export const useWatchLockEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: lockAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lockAbi}__ and `eventName` set to `"Withdrawal"`
 */
export const useWatchLockWithdrawalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lockAbi,
    eventName: 'Withdrawal',
  })
