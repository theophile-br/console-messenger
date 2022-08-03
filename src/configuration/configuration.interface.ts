export interface IConfiguration {
  pseudo?: string;
  room?: string;
  silent?: boolean;
  load(): void;
}
