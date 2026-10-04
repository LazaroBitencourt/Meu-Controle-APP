import { StyleSheet } from 'react-native';
import { cores } from './tema';

export const estilosFormulario = StyleSheet.create({
  link: { color: cores.primaria, fontWeight: '800', textAlign: 'center' },
  botaoExcluir: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.perigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoExcluir: { color: cores.perigo, fontWeight: '800' },
  botaoCancelar: { alignItems: 'center', paddingVertical: 10 },
  textoCancelar: { color: cores.suave, fontWeight: '700' },
});
