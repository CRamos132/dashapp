export interface IUser {
  id: string;
  aditionalUserData?: IAditionalUserData;
  firebaseData?: IFirebaseUserData;
}

export interface IFirebaseUserData {
  nome: string;
  email: string;
  apelido: string;
  cidade?: string;
  discord?: string;
  foto?: string;
  id?: string;
  sobre?: string;
  tel?: string;
  twitch?: string;
  twitter?: string;
  uf?: string;
  fidelidash?: FidelidashRanks;
}

export interface IAditionalUserData {
  apelido: string;
  email: string;
  foto: string;
  nome: string;
  org?: string[];
  fidelidash?: FidelidashRanks;
}

export type FidelidashRanks = "bronze" | "prata" | "ouro" | "platina";
