import AsyncStorage from '@react-native-async-storage/async-storage';

export async function lerJson<T>(chave: string, padrao: T): Promise<T> {
  try {
    const texto = await AsyncStorage.getItem(chave);
    return texto ? (JSON.parse(texto) as T) : padrao;
  } catch {
    return padrao;
  }
}

export async function salvarJson<T>(chave: string, valor: T): Promise<void> {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

export async function lerTexto(chave: string): Promise<string | null> {
  return AsyncStorage.getItem(chave);
}

export async function salvarTexto(chave: string, valor: string): Promise<void> {
  await AsyncStorage.setItem(chave, valor);
}

export async function removerChave(chave: string): Promise<void> {
  await AsyncStorage.removeItem(chave);
}
