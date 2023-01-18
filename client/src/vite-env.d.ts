/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOT_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
