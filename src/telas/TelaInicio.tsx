import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Tela from '../componentes/Tela';
import Cabecalho from '../componentes/Cabecalho';
import CartaoResumo from '../componentes/CartaoResumo';
import CartaoTransacao from '../componentes/CartaoTransacao';
import EstadoVazio from '../componentes/EstadoVazio';
import { useSessao } from '../contextos/SessaoContexto';
import { useDados } from '../contextos/DadosContexto';
import { estilosPainel as estilos } from '../estilos/estilosPainel';
import { Navegacao } from '../navegacao/tipos';
import { chaveMes, chaveMesAtual, formatarMoeda } from '../utilitarios/formatacao';

export default function TelaInicio() {
  const navegacao = useNavigation<Navegacao>();
  const { usuario, sair } = useSessao();
  const { transacoes, categorias, metas } = useDados();

  const saldo = useMemo(
    () => transacoes.reduce((total, item) => total + (item.tipo === 'receita' ? item.valor : -item.valor), 0),
    [transacoes],
  );

  const mensal = useMemo(() => {
    const mes = chaveMesAtual();
    let receitas = 0;
    let despesas = 0;
    transacoes
      .filter((item) => chaveMes(item.data) === mes)
      .forEach((item) => {
        if (item.tipo === 'receita') receitas += item.valor;
        else despesas += item.valor;
      });
    return { receitas, despesas };
  }, [transacoes]);

  const recentes = useMemo(
    () => [...transacoes].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 5),
    [transacoes],
  );

  const primeiroNome = usuario?.nome.split(' ')[0] ?? 'usuário';

  return (
    <Tela>
      <View style={estilos.linhaTopo}>
        <Cabecalho titulo={`Olá, ${primeiroNome}!`} subtitulo="Aqui está seu resumo financeiro." />
        <Pressable onPress={sair}>
          <Text style={estilos.sair}>Sair</Text>
        </Pressable>
      </View>

      <View style={estilos.saldo}>
        <Text style={estilos.rotuloSaldo}>Saldo atual</Text>
        <Text style={estilos.valorSaldo}>{formatarMoeda(saldo)}</Text>
      </View>

      <View style={estilos.linhaResumo}>
        <CartaoResumo titulo="Receitas do mês" valor={mensal.receitas} tom="positivo" />
        <CartaoResumo titulo="Despesas do mês" valor={mensal.despesas} tom="negativo" />
      </View>

      <View style={estilos.acoes}>
        <Pressable style={estilos.acaoPrincipal} onPress={() => navegacao.navigate('Transacao')}>
          <Text style={estilos.textoAcaoPrincipal}>+ Nova transação</Text>
        </Pressable>
        <View style={estilos.linhaAcoes}>
          <Pressable style={estilos.acaoSecundaria} onPress={() => navegacao.navigate('Categorias')}>
            <Text style={estilos.textoAcaoSecundaria}>Categorias</Text>
          </Pressable>
          <Pressable style={estilos.acaoSecundaria} onPress={() => navegacao.navigate('Metas')}>
            <Text style={estilos.textoAcaoSecundaria}>Metas ({metas.length})</Text>
          </Pressable>
        </View>
      </View>

      <View style={estilos.secao}>
        <View style={estilos.cabecalhoSecao}>
          <Text style={estilos.tituloSecao}>Últimas movimentações</Text>
          <Pressable onPress={() => navegacao.navigate('Transacoes')}>
            <Text style={estilos.link}>Ver todas</Text>
          </Pressable>
        </View>
        {recentes.length === 0 ? (
          <EstadoVazio mensagem="Você ainda não possui movimentações." />
        ) : (
          recentes.map((item) => (
            <CartaoTransacao
              key={item.id}
              transacao={item}
              categoria={categorias.find((categoria) => categoria.id === item.categoriaId)}
              aoPressionar={() => navegacao.navigate('Transacao', { id: item.id })}
            />
          ))
        )}
      </View>
    </Tela>
  );
}
