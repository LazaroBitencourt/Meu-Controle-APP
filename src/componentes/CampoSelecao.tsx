import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores } from '../estilos/tema';

interface Opcao {
  rotulo: string;
  valor: string;
}

interface CampoSelecaoProps {
  rotulo: string;
  valor: string;
  opcoes: Opcao[];
  aoMudar: (valor: string) => void;
  erro?: string;
}

export default function CampoSelecao({ rotulo, valor, opcoes, aoMudar, erro }: CampoSelecaoProps) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <View style={estilos.opcoes}>
        {opcoes.map((opcao) => {
          const selecionada = valor === opcao.valor;
          return (
            <Pressable
              key={opcao.valor}
              onPress={() => aoMudar(opcao.valor)}
              style={[estilos.opcao, selecionada && estilos.selecionada]}
            >
              <Text style={[estilos.textoOpcao, selecionada && estilos.textoSelecionado]}>
                {opcao.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: 8 },
  rotulo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcao: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: cores.superficie,
  },
  selecionada: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  textoOpcao: { color: cores.texto, fontWeight: '600' },
  textoSelecionado: { color: cores.branco },
  erro: { color: cores.perigo, fontSize: 12 },
});
