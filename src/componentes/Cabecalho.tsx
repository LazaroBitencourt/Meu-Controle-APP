import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../estilos/tema';

interface CabecalhoProps {
  titulo: string;
  subtitulo?: string;
}

export default function Cabecalho({ titulo, subtitulo }: CabecalhoProps) {
  return (
    <View>
      <Text style={estilos.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: 28, fontWeight: '800', color: cores.texto },
  subtitulo: { marginTop: 4, fontSize: 14, color: cores.suave },
});
