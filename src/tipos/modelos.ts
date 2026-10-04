export type TipoTransacao = 'receita' | 'despesa';

export type TipoCategoria = TipoTransacao | 'ambos';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: TipoCategoria;
  usuarioId: string;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  data: string;
  categoriaId: string;
  usuarioId: string;
}

export interface Meta {
  id: string;
  titulo: string;
  valorObjetivo: number;
  valorAtual: number;
  prazo?: string;
  usuarioId: string;
}

export type DadosTransacao = Omit<Transacao, 'id' | 'usuarioId'>;

export type DadosMeta = Omit<Meta, 'id' | 'usuarioId'>;

export interface DadosUsuario {
  categorias: Categoria[];
  transacoes: Transacao[];
  metas: Meta[];
}
