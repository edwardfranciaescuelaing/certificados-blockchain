"use client";
import "@mantine/core/styles.css";
import "leaflet/dist/leaflet.css";
import React from "react";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "../theme";
import { WagmiProvider } from "wagmi";
import { config } from "../config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Shell from "@/components/Shell";


const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>

        <MantineProvider theme={theme}>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <Shell>{children}</Shell>
              
            </QueryClientProvider>
          </WagmiProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
