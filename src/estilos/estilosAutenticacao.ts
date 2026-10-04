import { StyleSheet } from 'react-native';
import { cores } from './tema';

export const estilosAutenticacao = StyleSheet.create({
  heroi: { marginTop: 40, marginBottom: 20 },
  logo: { color: cores.primaria, fontSize: 34, fontWeight: '900' },
  slogan: { color: cores.suave, marginTop: 6, fontSize: 15 },
  rodape: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 },
  textoRodape: { color: cores.suave },
  link: { color: cores.primaria, fontWeight: '800' },
});
