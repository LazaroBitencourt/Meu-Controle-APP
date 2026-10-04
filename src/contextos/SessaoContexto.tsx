import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Usuario } from '../tipos/modelos';
import {
  autenticar,
  cadastrarUsuario,
  encerrarSessao,
  restaurarSessao,
} from '../servicos/autenticacao';

interface ValorSessao {
  usuario: Usuario | null;
  carregando: boolean;
  cadastrar: (nome: string, email: string, senha: string) => Promise<string | null>;
  entrar: (email: string, senha: string) => Promise<string | null>;
  sair: () => Promise<void>;
}

const SessaoContexto = createContext<ValorSessao | undefined>(undefined);

export function SessaoProvedor({ children }: React.PropsWithChildren) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    restaurarSessao()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false));
  }, []);

  const valor = useMemo<ValorSessao>(() => {
    const aplicarResultado = (resultado: { usuario?: Usuario; erro?: string }) => {
      if (resultado.usuario) setUsuario(resultado.usuario);
      return resultado.erro ?? null;
    };

    return {
      usuario,
      carregando,
      cadastrar: async (nome, email, senha) => aplicarResultado(await cadastrarUsuario(nome, email, senha)),
      entrar: async (email, senha) => aplicarResultado(await autenticar(email, senha)),
      sair: async () => {
        await encerrarSessao();
        setUsuario(null);
      },
    };
  }, [usuario, carregando]);

  return <SessaoContexto.Provider value={valor}>{children}</SessaoContexto.Provider>;
}

export function useSessao(): ValorSessao {
  const contexto = useContext(SessaoContexto);
  if (!contexto) throw new Error('useSessao deve ser usado dentro de SessaoProvedor.');
  return contexto;
}
