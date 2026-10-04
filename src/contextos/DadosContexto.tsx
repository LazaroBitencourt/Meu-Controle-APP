import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CHAVES } from '../armazenamento/chaves';
import { carregarDados, salvarLista } from '../servicos/dados';
import {
  Categoria,
  DadosMeta,
  DadosTransacao,
  Meta,
  TipoCategoria,
  Transacao,
} from '../tipos/modelos';
import { criarId } from '../utilitarios/formatacao';
import { useSessao } from './SessaoContexto';

interface ValorDados {
  categorias: Categoria[];
  transacoes: Transacao[];
  metas: Meta[];
  carregando: boolean;
  adicionarTransacao: (dados: DadosTransacao) => Promise<void>;
  atualizarTransacao: (id: string, dados: DadosTransacao) => Promise<void>;
  excluirTransacao: (id: string) => Promise<void>;
  adicionarCategoria: (nome: string, tipo: TipoCategoria) => Promise<void>;
  excluirCategoria: (id: string) => Promise<string | null>;
  adicionarMeta: (dados: DadosMeta) => Promise<void>;
  atualizarMeta: (id: string, dados: DadosMeta) => Promise<void>;
  excluirMeta: (id: string) => Promise<void>;
}

const DadosContexto = createContext<ValorDados | undefined>(undefined);

export function DadosProvedor({ children }: React.PropsWithChildren) {
  const { usuario } = useSessao();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!usuario) {
      setCategorias([]);
      setTransacoes([]);
      setMetas([]);
      setCarregando(false);
      return;
    }

    let ativo = true;
    setCarregando(true);
    carregarDados(usuario.id)
      .then((dados) => {
        if (!ativo) return;
        setCategorias(dados.categorias);
        setTransacoes(dados.transacoes);
        setMetas(dados.metas);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuario]);

  const valor = useMemo<ValorDados>(() => {
    const usuarioId = usuario?.id ?? '';

    const salvarCategorias = async (proximas: Categoria[]) => {
      await salvarLista(CHAVES.CATEGORIAS, usuarioId, proximas);
      setCategorias(proximas);
    };

    const salvarTransacoes = async (proximas: Transacao[]) => {
      await salvarLista(CHAVES.TRANSACOES, usuarioId, proximas);
      setTransacoes(proximas);
    };

    const salvarMetas = async (proximas: Meta[]) => {
      await salvarLista(CHAVES.METAS, usuarioId, proximas);
      setMetas(proximas);
    };

    return {
      categorias,
      transacoes,
      metas,
      carregando,

      adicionarTransacao: (dados) =>
        salvarTransacoes([...transacoes, { ...dados, id: criarId(), usuarioId }]),

      atualizarTransacao: (id, dados) =>
        salvarTransacoes(
          transacoes.map((item) => (item.id === id ? { ...dados, id, usuarioId } : item)),
        ),

      excluirTransacao: (id) => salvarTransacoes(transacoes.filter((item) => item.id !== id)),

      adicionarCategoria: async (nome, tipo) => {
        const nomeLimpo = nome.trim();
        if (!nomeLimpo) throw new Error('Informe o nome da categoria.');
        if (categorias.some((item) => item.nome.toLowerCase() === nomeLimpo.toLowerCase())) {
          throw new Error('Esta categoria já existe.');
        }
        await salvarCategorias([...categorias, { id: criarId(), nome: nomeLimpo, tipo, usuarioId }]);
      },

      excluirCategoria: async (id) => {
        if (transacoes.some((item) => item.categoriaId === id)) {
          return 'Não é possível excluir uma categoria usada por uma transação.';
        }
        await salvarCategorias(categorias.filter((item) => item.id !== id));
        return null;
      },

      adicionarMeta: (dados) => salvarMetas([...metas, { ...dados, id: criarId(), usuarioId }]),

      atualizarMeta: (id, dados) =>
        salvarMetas(metas.map((item) => (item.id === id ? { ...dados, id, usuarioId } : item))),

      excluirMeta: (id) => salvarMetas(metas.filter((item) => item.id !== id)),
    };
  }, [usuario, categorias, transacoes, metas, carregando]);

  return <DadosContexto.Provider value={valor}>{children}</DadosContexto.Provider>;
}

export function useDados(): ValorDados {
  const contexto = useContext(DadosContexto);
  if (!contexto) throw new Error('useDados deve ser usado dentro de DadosProvedor.');
  return contexto;
}
