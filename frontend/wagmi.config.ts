import { defineConfig } from '@wagmi/cli'
import { hardhat, react } from '@wagmi/cli/plugins'

export default defineConfig({
  plugins: [
    hardhat({
      project: '../',
    }),
    react(),
  ],
  out: 'generated/wagmi.ts',
})
