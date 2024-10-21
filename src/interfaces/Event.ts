import { FidelidashRanks } from "./User";

export interface IEventSubscriber {
  foto?: string;
  id: string;
  fidelidash?: FidelidashRanks;
  nome?: string;
}

export type GamesTypes =
  | "ult"
  | "mq"
  | "melee"
  | "pm"
  | "mk"
  | "sf"
  | "tekken"
  | "rivals";

export interface IEvent {
  apelido?: string;
  bracket: string;
  cidade: string;
  fb: string;
  id: string;
  inscricao: string;
  jogos: Record<GamesTypes, boolean>;
  limite: number;
  org: string;
  regras: string;
  local?: string;
  sobre: string;
  stagelist: string;
  tempo: number;
  titulo: string;
  uf: string;
  url: string;
  inscritos?: IEventSubscriber[];
  socialMediaText?: string;
}
