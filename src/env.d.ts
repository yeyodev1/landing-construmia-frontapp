/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_META_PIXEL_ID: string
  readonly VITE_LOGO_DEV_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Cajita de Pagos de Payphone: la expone su script al cargarse. */
declare class PPaymentButtonBox {
  constructor(config: Record<string, unknown>)
  render(containerId: string): void
}
