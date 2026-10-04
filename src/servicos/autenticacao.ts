import { CHAVES } from '../armazenamento/chaves';
import { lerJson, lerTexto, removerChave, salvarJson, salvarTexto } from '../armazenamento/armazenamento';
import { Usuario } from '../tipos/modelos';
import { criarId, normalizarEmail } from '../utilitarios/formatacao';

interface Resultado {
  usuario?: Usuario;
  erro?: string;
}

export async function restaurarSessao(): Promise<Usuario | null> {
  const [usuario, idSessao] = await Promise.all([
    lerJson<Usuario | null>(CHAVES.USUARIO, null),
    lerTexto(CHAVES.SESSAO),
  ]);
  if (usuario && idSessao === usuario.id) return usuario;
  if (idSessao) await removerChave(CHAVES.SESSAO);
  return null;
}

export async function cadastrarUsuario(nome: string, email: string, senha: string): Promise<Resultado> {
  const nomeLimpo = nome.trim();
  const emailLimpo = normalizarEmail(email);

  if (nomeLimpo.length < 2) return { erro: 'Informe seu nome completo.' };
  if (!emailLimpo.includes('@') || !emailLimpo.includes('.')) return { erro: 'Informe um e-mail válido.' };
  if (senha.length < 6) return { erro: 'A senha deve ter pelo menos 6 caracteres.' };

  const existente = await lerJson<Usuario | null>(CHAVES.USUARIO, null);
  if (existente) {
    if (existente.email === emailLimpo) return { erro: 'Este e-mail já está cadastrado.' };
    return { erro: 'Já existe uma conta neste dispositivo. Entre com ela para continuar.' };
  }

  const usuario: Usuario = { id: criarId(), nome: nomeLimpo, email: emailLimpo, senha };
  await salvarJson(CHAVES.USUARIO, usuario);
  await salvarTexto(CHAVES.SESSAO, usuario.id);
  return { usuario };
}

export async function autenticar(email: string, senha: string): Promise<Resultado> {
  const usuario = await lerJson<Usuario | null>(CHAVES.USUARIO, null);
  if (!usuario) return { erro: 'Nenhum usuário cadastrado. Faça seu cadastro primeiro.' };
  if (usuario.email !== normalizarEmail(email) || usuario.senha !== senha) {
    return { erro: 'E-mail ou senha incorretos.' };
  }
  await salvarTexto(CHAVES.SESSAO, usuario.id);
  return { usuario };
}

export async function encerrarSessao(): Promise<void> {
  await removerChave(CHAVES.SESSAO);
}
