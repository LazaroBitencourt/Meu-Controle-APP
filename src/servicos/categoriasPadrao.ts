import { Categoria } from '../tipos/modelos';

export function criarCategoriasPadrao(usuarioId: string): Categoria[] {
  return [
    { id: `${usuarioId}-alimentacao`, nome: 'Alimentação', tipo: 'despesa', usuarioId },
    { id: `${usuarioId}-transporte`, nome: 'Transporte', tipo: 'despesa', usuarioId },
    { id: `${usuarioId}-moradia`, nome: 'Moradia', tipo: 'despesa', usuarioId },
    { id: `${usuarioId}-lazer`, nome: 'Lazer', tipo: 'despesa', usuarioId },
    { id: `${usuarioId}-salario`, nome: 'Salário', tipo: 'receita', usuarioId },
    { id: `${usuarioId}-outros`, nome: 'Outros', tipo: 'ambos', usuarioId },
  ];
}
