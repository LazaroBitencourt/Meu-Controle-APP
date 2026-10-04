import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Tela from '../componentes/Tela';
import Cabecalho from '../componentes/Cabecalho';
import CampoTexto from '../componentes/CampoTexto';
import CampoSelecao from '../componentes/CampoSelecao';
import BotaoPrincipal from '../componentes/BotaoPrincipal';
import EstadoVazio from '../componentes/EstadoVazio';
import { useDados } from '../contextos/DadosContexto';
import { estilosLista as estilos } from '../estilos/estilosLista';
import { TipoCategoria } from '../tipos/modelos';
import { avisar, confirmarExclusao } from '../utilitarios/alertas';

export default function TelaCategorias() {
  const { categorias, adicionarCategoria, excluirCategoria } = useDados();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TipoCategoria>('despesa');
  const [erroNome, setErroNome] = useState<string | undefined>();
  const [carregando, setCarregando] = useState(false);

  const adicionar = async () => {
    if (!nome.trim()) {
      setErroNome('O nome da categoria é obrigatório.');
      return;
    }
    setErroNome(undefined);

    setCarregando(true);
    try {
      await adicionarCategoria(nome, tipo);
      setNome('');
      avisar('Sucesso', 'Categoria criada.');
    } catch (erro) {
      avisar('Erro', erro instanceof Error ? erro.message : 'Não foi possível criar a categoria.');
    } finally {
      setCarregando(false);
    }
  };

  const excluir = (id: string) => {
    confirmarExclusao('Excluir categoria', 'Deseja excluir esta categoria?', async () => {
      const erro = await excluirCategoria(id);
      if (erro) avisar('Não foi possível excluir', erro);
    });
  };

  return (
    <Tela comCabecalho>
      <Cabecalho titulo="Categorias" subtitulo="Organize suas movimentações." />
      <CampoTexto
        rotulo="Nova categoria"
        value={nome}
        onChangeText={setNome}
        placeholder="Ex.: Estudos"
        erro={erroNome}
      />
      <CampoSelecao
        rotulo="Tipo"
        valor={tipo}
        aoMudar={(valor) => setTipo(valor as TipoCategoria)}
        opcoes={[
          { rotulo: 'Despesa', valor: 'despesa' },
          { rotulo: 'Receita', valor: 'receita' },
          { rotulo: 'Ambos', valor: 'ambos' },
        ]}
      />
      <BotaoPrincipal titulo="Adicionar categoria" aoPressionar={adicionar} carregando={carregando} />
      <View style={estilos.lista}>
        {categorias.length === 0 ? (
          <EstadoVazio mensagem="Nenhuma categoria cadastrada." />
        ) : (
          categorias.map((item) => (
            <View key={item.id} style={estilos.cartaoCategoria}>
              <View style={estilos.info}>
                <Text style={estilos.nome}>{item.nome}</Text>
                <Text style={estilos.tipo}>{item.tipo === 'ambos' ? 'Receita ou despesa' : item.tipo}</Text>
              </View>
              <Pressable onPress={() => excluir(item.id)}>
                <Text style={estilos.excluir}>Excluir</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </Tela>
  );
}
