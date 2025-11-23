import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WagmiProviderWrapper } from "./providers/WagmiProvider.tsx";
import { ErrorBoundary } from "./ErrorBoundary.tsx";

// Verificar que el root existe
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <ErrorBoundary>
    <WagmiProviderWrapper>
      <App />
    </WagmiProviderWrapper>
  </ErrorBoundary>
);