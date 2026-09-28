interface Window {
  turnstile?: {
    getResponse(): string;
    reset(): void;
  };
}