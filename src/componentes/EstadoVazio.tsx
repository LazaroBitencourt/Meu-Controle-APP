import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../estilos/tema';

export default function EstadoVazio({ mensagem }: { mensagem: string }) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.icone}>∅</Text>
      <Text style={estilos.texto}>{mensagem}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { padding: 28, alignItems: 'center', gap: 8 },
  icone: { fontSize: 32, color: cores.suave },
  texto: { color: cores.suave, textAlign: 'center' },
});
