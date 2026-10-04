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

export default function TelaCadastro() {
  const navegacao = useNavigation<Navegacao>();
  const { cadastrar } = useSessao();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erroConfirmacao, setErroConfirmacao] = useState<string | undefined>();
  const [carregando, setCarregando] = useState(false);

  const enviar = async () => {
    if (senha !== confirmacao) {
      setErroConfirmacao('As senhas não conferem.');
      return;
    }
    setErroConfirmacao(undefined);

    setCarregando(true);
    try {
      const erro = await cadastrar(nome, email, senha);
      if (erro) avisar('Não foi possível cadastrar', erro);
    } catch {
      avisar('Erro', 'Ocorreu um erro ao criar a conta.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Tela>
      <Cabecalho titulo="Criar conta" subtitulo="Cadastre seus dados para começar." />
      <CampoTexto rotulo="Nome" value={nome} onChangeText={setNome} autoCapitalize="words" />
      <CampoTexto
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <CampoTexto rotulo="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <CampoTexto
        rotulo="Confirmar senha"
        value={confirmacao}
        onChangeText={setConfirmacao}
        secureTextEntry
        erro={erroConfirmacao}
      />
      <BotaoPrincipal titulo="Criar conta" aoPressionar={enviar} carregando={carregando} />
      <View style={estilos.rodape}>
        <Text style={estilos.textoRodape}>Já possui conta?</Text>
        <Pressable onPress={() => navegacao.navigate('Login')}>
          <Text style={estilos.link}>Voltar para login</Text>
        </Pressable>
      </View>
    </Tela>
  );
}
