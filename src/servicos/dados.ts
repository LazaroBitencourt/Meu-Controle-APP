import { CHAVES } from '../armazenamento/chaves';
import { lerJson, salvarJson } from '../armazenamento/armazenamento';
import { Categoria, DadosUsuario, Meta, Transacao } from '../tipos/modelos';
import { criarCategoriasPadrao } from './categoriasPadrao';

type ComUsuario = { usuarioId: string };

export async function salvarLista<T extends ComUsuario>(
  chave: string,
  usuarioId: string,
  lista: T[],
): Promise<void> {
  const todos = await lerJson<T[]>(chave, []);
  const deOutros = todos.filter((item) => item.usuarioId !== usuarioId);
  await salvarJson(chave, [...deOutros, ...lista]);
}

async function lerListaDoUsuario<T extends ComUsuario>(chave: string, usuarioId: string): Promise<T[]> {
  const todos = await lerJson<T[]>(chave, []);
  return todos.filter((item) => item.usuarioId === usuarioId);
}

export async function carregarDados(usuarioId: string): Promise<DadosUsuario> {
  const [categoriasSalvas, transacoes, metas] = await Promise.all([
    lerListaDoUsuario<Categoria>(CHAVES.CATEGORIAS, usuarioId),
    lerListaDoUsuario<Transacao>(CHAVES.TRANSACOES, usuarioId),
    lerListaDoUsuario<Meta>(CHAVES.METAS, usuarioId),
  ]);

  if (categoriasSalvas.length > 0) return { categorias: categoriasSalvas, transacoes, metas };

  const categorias = criarCategoriasPadrao(usuarioId);
  await salvarLista(CHAVES.CATEGORIAS, usuarioId, categorias);
  return { categorias, transacoes, metas };
}
