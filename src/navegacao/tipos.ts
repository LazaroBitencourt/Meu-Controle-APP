import { NavigationProp } from '@react-navigation/native';

export type ParametrosPilha = {
  Login: undefined;
  Cadastro: undefined;
  Principal: undefined;
  Transacao: { id?: string } | undefined;
  Categorias: undefined;
};

export type ParametrosAbas = {
  Inicio: undefined;
  Transacoes: undefined;
  Metas: undefined;
};

export type ParametrosRotas = ParametrosPilha & ParametrosAbas;

export type Navegacao = NavigationProp<ParametrosRotas>;
