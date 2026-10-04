import { StyleSheet } from 'react-native';
import { cores, espacamento } from './tema';

export const estilosPainel = StyleSheet.create({
  linhaTopo: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  sair: { color: cores.perigo, fontWeight: '800', paddingTop: 8 },
  saldo: { backgroundColor: cores.primaria, borderRadius: 20, padding: espacamento.xl },
  rotuloSaldo: { color: '#DBEAFE', fontSize: 14 },
  valorSaldo: { color: cores.branco, fontSize: 30, fontWeight: '900', marginTop: 8 },
  linhaResumo: { flexDirection: 'row', gap: 10 },
  acoes: { gap: 10 },
  acaoPrincipal: { backgroundColor: cores.primaria, borderRadius: 14, padding: 16, alignItems: 'center' },
  textoAcaoPrincipal: { color: cores.branco, fontSize: 16, fontWeight: '800' },
  linhaAcoes: { flexDirection: 'row', gap: 10 },
  acaoSecundaria: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  textoAcaoSecundaria: { color: cores.texto, fontWeight: '700' },
  secao: { gap: 10 },
  cabecalhoSecao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tituloSecao: { fontSize: 19, fontWeight: '800', color: cores.texto },
  link: { color: cores.primaria, fontWeight: '800' },
});
