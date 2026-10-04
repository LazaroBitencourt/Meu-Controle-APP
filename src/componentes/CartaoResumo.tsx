import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../estilos/tema';
import { formatarMoeda } from '../utilitarios/formatacao';

interface CartaoResumoProps {
  titulo: string;
  valor: number;
  tom?: 'neutro' | 'positivo' | 'negativo';
}

export default function CartaoResumo({ titulo, valor, tom = 'neutro' }: CartaoResumoProps) {
  const corValor = tom === 'positivo' ? cores.sucesso : tom === 'negativo' ? cores.perigo : cores.texto;

  return (
    <View style={estilos.cartao}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={[estilos.valor, { color: corValor }]}>{formatarMoeda(valor)}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  titulo: { color: cores.suave, fontSize: 13, fontWeight: '600' },
  valor: { marginTop: 8, fontSize: 19, fontWeight: '800' },
});
