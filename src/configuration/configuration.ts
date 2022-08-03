export interface Configuration {
  pseudo?: string;
  room?: string;
  silent?: boolean;
  load(): void;
}
