import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores, espacamento } from '../estilos/tema';

interface TelaProps {
  rolagem?: boolean;
  comCabecalho?: boolean;
}

export default function Tela({
  children,
  rolagem = true,
  comCabecalho = false,
}: React.PropsWithChildren<TelaProps>) {
  const conteudo = <View style={estilos.conteudo}>{children}</View>;
  const bordas = comCabecalho ? (['left', 'right', 'bottom'] as const) : (['top', 'left', 'right'] as const);

  return (
    <SafeAreaView style={estilos.seguro} edges={bordas}>
      {rolagem ? (
        <ScrollView contentContainerStyle={estilos.rolagem} keyboardShouldPersistTaps="handled">
          {conteudo}
        </ScrollView>
      ) : (
        conteudo
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  seguro: { flex: 1, backgroundColor: cores.fundo },
  rolagem: { flexGrow: 1 },
  conteudo: { flex: 1, padding: espacamento.lg, gap: espacamento.lg },
});
