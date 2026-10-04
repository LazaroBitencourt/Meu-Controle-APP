import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { cores } from '../estilos/tema';

interface CampoTextoProps extends TextInputProps {
  rotulo: string;
  erro?: string;
}

export default function CampoTexto({ rotulo, erro, ...resto }: CampoTextoProps) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        {...resto}
        placeholderTextColor={cores.suave}
        style={[estilos.campo, erro ? estilos.campoErro : null]}
      />
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: 6 },
  rotulo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  campo: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    backgroundColor: cores.superficie,
    paddingHorizontal: 14,
    color: cores.texto,
    fontSize: 16,
  },
  campoErro: { borderColor: cores.perigo },
  erro: { color: cores.perigo, fontSize: 12 },
});
