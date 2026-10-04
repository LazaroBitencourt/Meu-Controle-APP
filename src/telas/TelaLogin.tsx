import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Tela from '../componentes/Tela';
import Cabecalho from '../componentes/Cabecalho';
import CampoTexto from '../componentes/CampoTexto';
import BotaoPrincipal from '../componentes/BotaoPrincipal';
import { useSessao } from '../contextos/SessaoContexto';
import { estilosAutenticacao as estilos } from '../estilos/estilosAutenticacao';
import { Navegacao } from '../navegacao/tipos';
import { avisar } from '../utilitarios/alertas';

export default function TelaLogin() {
  const navegacao = useNavigation<Navegacao>();
  const { entrar } = useSessao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});
  const [carregando, setCarregando] = useState(false);

  const enviar = async () => {
    const novosErros = {
      email: email.trim() ? undefined : 'Informe o e-mail.',
      senha: senha ? undefined : 'Informe a senha.',
    };
    setErros(novosErros);
    if (novosErros.email || novosErros.senha) return;

    setCarregando(true);
    try {
      const erro = await entrar(email, senha);
      if (erro) avisar('Não foi possível entrar', erro);
    } catch {
      avisar('Erro', 'Ocorreu um erro ao entrar.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Tela>
      <View style={estilos.heroi}>
        <Text style={estilos.logo}>MeuControle</Text>
        <Text style={estilos.slogan}>Seu dinheiro organizado de forma simples.</Text>
      </View>
      <Cabecalho titulo="Entrar" subtitulo="Acesse seu controle financeiro." />
      <CampoTexto
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        erro={erros.email}
      />
      <CampoTexto rotulo="Senha" value={senha} onChangeText={setSenha} secureTextEntry erro={erros.senha} />
      <BotaoPrincipal titulo="Entrar" aoPressionar={enviar} carregando={carregando} />
      <View style={estilos.rodape}>
        <Text style={estilos.textoRodape}>Ainda não possui conta?</Text>
        <Pressable onPress={() => navegacao.navigate('Cadastro')}>
          <Text style={estilos.link}>Criar cadastro</Text>
        </Pressable>
      </View>
    </Tela>
  );
}
