import { http, createConfig } from "wagmi";
import { base, mainnet, optimism, hardhat } from "wagmi/chains";
import { metaMask, safe } from "wagmi/connectors";

// const projectId = "3fbb6bba6f1de962d911bb5b5c9dba88";

export const config = createConfig({
  chains: [hardhat],
  connectors: [metaMask(), safe()],
  transports: {
    [hardhat.id]: http(),
  },
  ssr: true,
});
