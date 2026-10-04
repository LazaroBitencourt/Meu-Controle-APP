import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Tela from '../componentes/Tela';
import Cabecalho from '../componentes/Cabecalho';
import CartaoTransacao from '../componentes/CartaoTransacao';
import EstadoVazio from '../componentes/EstadoVazio';
import CampoSelecao from '../componentes/CampoSelecao';
import { useDados } from '../contextos/DadosContexto';
import { estilosLista as estilos } from '../estilos/estilosLista';
import { Navegacao } from '../navegacao/tipos';

type Filtro = 'todos' | 'receita' | 'despesa';

export default function TelaTransacoes() {
  const navegacao = useNavigation<Navegacao>();
  const { transacoes, categorias } = useDados();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const filtradas = useMemo(
    () =>
      transacoes
        .filter((item) => filtro === 'todos' || item.tipo === filtro)
        .sort((a, b) => b.data.localeCompare(a.data)),
    [transacoes, filtro],
  );

  return (
    <Tela>
      <View style={estilos.linhaTopo}>
        <Cabecalho titulo="Transações" subtitulo={`${filtradas.length} movimentação(ões)`} />
        <Pressable style={estilos.botaoAdicionar} onPress={() => navegacao.navigate('Transacao')}>
          <Text style={estilos.textoAdicionar}>+ Adicionar</Text>
        </Pressable>
      </View>

      <CampoSelecao
        rotulo="Filtrar por tipo"
        valor={filtro}
        aoMudar={(valor) => setFiltro(valor as Filtro)}
        opcoes={[
          { rotulo: 'Todas', valor: 'todos' },
          { rotulo: 'Receitas', valor: 'receita' },
          { rotulo: 'Despesas', valor: 'despesa' },
        ]}
      />

      {filtradas.length === 0 ? (
        <EstadoVazio mensagem="Nenhuma movimentação encontrada para este filtro." />
      ) : (
        filtradas.map((item) => (
          <CartaoTransacao
            key={item.id}
            transacao={item}
            categoria={categorias.find((categoria) => categoria.id === item.categoriaId)}
            aoPressionar={() => navegacao.navigate('Transacao', { id: item.id })}
          />
        ))
      )}
    </Tela>
  );
}
