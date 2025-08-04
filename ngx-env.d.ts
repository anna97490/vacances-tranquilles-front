declare global {
  interface ImportMetaEnv {
    readonly URL_API: string;
    readonly NODE_ENV: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {}; 