import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '../estilos/tema';

interface BotaoPrincipalProps {
  titulo: string;
  aoPressionar: () => void;
  carregando?: boolean;
  desabilitado?: boolean;
  variante?: 'primario' | 'perigo' | 'secundario';
}

export default function BotaoPrincipal({
  titulo,
  aoPressionar,
  carregando = false,
  desabilitado = false,
  variante = 'primario',
}: BotaoPrincipalProps) {
  const fundo =
    variante === 'perigo' ? cores.perigo : variante === 'secundario' ? cores.campo : cores.primaria;
  const corTexto = variante === 'secundario' ? cores.texto : cores.branco;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={aoPressionar}
      disabled={desabilitado || carregando}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: fundo, opacity: pressed || desabilitado ? 0.7 : 1 },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <Text style={[estilos.texto, { color: corTexto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  texto: { fontSize: 16, fontWeight: '700' },
});
