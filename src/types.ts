export interface Event {
  apelido?: string
  bracket: string
  cidade: string
  fb: string
  id: string
  inscricao: string
  jogos: {
    melee: boolean
    mq: boolean
    out: boolean
    pm: boolean
    ult: boolean
  }
  limite: number
  org: string
  regras: string
  sobre: string
  stagelist: string
  tempo: number
  titulo: string
  uf: string
  url: string
  inscritos?: {
    foto?: string
    id?: string
    fidelidash?: string
    nome?: string
  }[]
}

export interface AditionalUserData {
  apelido: string;
  email: string;
  foto: string;
  nome: string;
  org?: string[];
  fidelidash?: string;
}