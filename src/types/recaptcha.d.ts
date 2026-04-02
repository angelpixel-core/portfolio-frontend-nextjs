declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    grecaptcha?: {
      ready: (_callback: () => void) => void;
      execute: (
        _siteKey: string,
        _options: {
          action: string;
        }
      ) => Promise<string>;
    };
  }
}

export {};
