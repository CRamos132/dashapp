import { FidelidashRanks } from "./User";

export interface IEventSubscriber {
  foto?: string;
  id: string;
  fidelidash?: FidelidashRanks;
  nome?: string;
}

export interface IEvent {
  apelido?: string;
  bracket: string;
  cidade: string;
  fb: string;
  id: string;
  inscricao: string;
  jogos: {
    melee: boolean;
    mq: boolean;
    out: boolean;
    pm: boolean;
    ult: boolean;
  };
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
