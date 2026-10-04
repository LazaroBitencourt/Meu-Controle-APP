import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores } from '../estilos/tema';
import { Categoria, Transacao } from '../tipos/modelos';
import { formatarData, formatarMoeda } from '../utilitarios/formatacao';

interface CartaoTransacaoProps {
  transacao: Transacao;
  categoria?: Categoria;
  aoPressionar?: () => void;
}

export default function CartaoTransacao({ transacao, categoria, aoPressionar }: CartaoTransacaoProps) {
  const receita = transacao.tipo === 'receita';

  return (
    <Pressable
      onPress={aoPressionar}
      style={({ pressed }) => [estilos.cartao, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={estilos.info}>
        <Text style={estilos.descricao} numberOfLines={1}>
          {transacao.descricao}
        </Text>
        <Text style={estilos.detalhe}>
          {categoria?.nome ?? 'Sem categoria'} • {formatarData(transacao.data)}
        </Text>
      </View>
      <Text style={[estilos.valor, { color: receita ? cores.sucesso : cores.perigo }]}>
        {receita ? '+' : '-'} {formatarMoeda(transacao.valor)}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: { flex: 1 },
  descricao: { color: cores.texto, fontSize: 15, fontWeight: '700' },
  detalhe: { marginTop: 5, color: cores.suave, fontSize: 12 },
  valor: { fontSize: 14, fontWeight: '800' },
});
