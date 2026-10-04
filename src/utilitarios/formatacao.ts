export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function doisDigitos(numero: number): string {
  return String(numero).padStart(2, '0');
}

export function dataParaIso(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

export function isoParaBR(iso?: string): string {
  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  if (!partes) return '';
  return `${partes[3]}/${partes[2]}/${partes[1]}`;
}

export function hojeBR(): string {
  return isoParaBR(dataParaIso(new Date()));
}

export function formatarData(iso: string): string {
  return isoParaBR(iso) || '-';
}

export function brParaIso(texto: string): string | null {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim());
  if (!partes) return null;
  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);
  const data = new Date(ano, mes - 1, dia);
  const valida =
    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
  return valida ? dataParaIso(data) : null;
}

export function chaveMes(iso: string): string {
  return iso.slice(0, 7);
}

export function chaveMesAtual(): string {
  return chaveMes(dataParaIso(new Date()));
}

export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function converterValor(texto: string, permitirZero = false): number | null {
  const limpo = texto.trim().replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
  if (!limpo) return null;
  const numero = Number(limpo);
  if (!Number.isFinite(numero)) return null;
  return (permitirZero ? numero >= 0 : numero > 0) ? numero : null;
}

export function valorParaTexto(valor: number): string {
  return valor.toFixed(2).replace('.', ',');
}

export function criarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
