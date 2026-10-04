import React, { useMemo, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Tela from '../componentes/Tela';
import Cabecalho from '../componentes/Cabecalho';
import CampoTexto from '../componentes/CampoTexto';
import CampoSelecao from '../componentes/CampoSelecao';
import BotaoPrincipal from '../componentes/BotaoPrincipal';
import { useDados } from '../contextos/DadosContexto';
import { estilosFormulario as estilos } from '../estilos/estilosFormulario';
import { Navegacao, ParametrosRotas } from '../navegacao/tipos';
import { TipoTransacao } from '../tipos/modelos';
import { avisar, confirmarExclusao } from '../utilitarios/alertas';
import {
  brParaIso,
  converterValor,
  hojeBR,
  isoParaBR,
  valorParaTexto,
} from '../utilitarios/formatacao';

interface Erros {
  descricao?: string;
  valor?: string;
  data?: string;
  categoria?: string;
}

export default function TelaTransacao() {
  const navegacao = useNavigation<Navegacao>();
  const rota = useRoute<RouteProp<ParametrosRotas, 'Transacao'>>();
  const id = rota.params?.id;
  const { transacoes, categorias, adicionarTransacao, atualizarTransacao, excluirTransacao } = useDados();
  const transacao = transacoes.find((item) => item.id === id);

  const [tipo, setTipo] = useState<TipoTransacao>(transacao?.tipo ?? 'despesa');
  const [descricao, setDescricao] = useState(transacao?.descricao ?? '');
  const [valor, setValor] = useState(transacao ? valorParaTexto(transacao.valor) : '');
  const [data, setData] = useState(transacao ? isoParaBR(transacao.data) : hojeBR());
  const [categoriaId, setCategoriaId] = useState(transacao?.categoriaId ?? '');
  const [erros, setErros] = useState<Erros>({});
  const [carregando, setCarregando] = useState(false);

  const categoriasDisponiveis = useMemo(
    () => categorias.filter((item) => item.tipo === tipo || item.tipo === 'ambos'),
    [categorias, tipo],
  );

  if (id && !transacao) {
    return (
      <Tela comCabecalho>
        <Cabecalho titulo="Transação não encontrada" />
        <BotaoPrincipal titulo="Voltar" aoPressionar={() => navegacao.goBack()} />
      </Tela>
    );
  }

  const salvar = async () => {
    const valorNumerico = converterValor(valor);
    const dataIso = brParaIso(data);
    const categoriaValida = categoriasDisponiveis.some((item) => item.id === categoriaId);

    const novosErros: Erros = {
      descricao: descricao.trim() ? undefined : 'A descrição é obrigatória.',
      valor: valorNumerico === null ? 'Informe um valor maior que zero.' : undefined,
      data: dataIso ? undefined : 'Informe uma data válida no formato DD/MM/AAAA.',
      categoria: categoriaValida ? undefined : 'Selecione uma categoria.',
    };
    setErros(novosErros);
    if (Object.values(novosErros).some(Boolean) || valorNumerico === null || !dataIso) return;

    setCarregando(true);
    try {
      const dados = { descricao: descricao.trim(), valor: valorNumerico, tipo, data: dataIso, categoriaId };
      if (transacao) await atualizarTransacao(transacao.id, dados);
      else await adicionarTransacao(dados);
      avisar('Sucesso', transacao ? 'Transação atualizada.' : 'Movimentação cadastrada.');
      navegacao.goBack();
    } catch {
      avisar('Erro', 'Não foi possível salvar a transação.');
    } finally {
      setCarregando(false);
    }
  };

  const excluir = () => {
    if (!transacao) return;
    confirmarExclusao('Excluir transação', 'Deseja realmente excluir esta movimentação?', async () => {
      await excluirTransacao(transacao.id);
      navegacao.goBack();
    });
  };

  return (
    <Tela comCabecalho>
      <Cabecalho
        titulo={transacao ? 'Editar transação' : 'Nova transação'}
        subtitulo={transacao ? 'Altere os dados ou exclua o registro.' : 'Registre uma receita ou despesa.'}
      />
      <CampoSelecao
        rotulo="Tipo"
        valor={tipo}
        aoMudar={(novoTipo) => {
          setTipo(novoTipo as TipoTransacao);
          setCategoriaId('');
        }}
        opcoes={[
          { rotulo: 'Despesa', valor: 'despesa' },
          { rotulo: 'Receita', valor: 'receita' },
        ]}
      />
      <CampoTexto
        rotulo="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex.: Mercado"
        erro={erros.descricao}
      />
      <CampoTexto
        rotulo="Valor"
        value={valor}
        onChangeText={setValor}
        placeholder="Ex.: 150,00"
        keyboardType="decimal-pad"
        erro={erros.valor}
      />
      <CampoTexto
        rotulo="Data"
        value={data}
        onChangeText={setData}
        placeholder="DD/MM/AAAA"
        keyboardType="numbers-and-punctuation"
        erro={erros.data}
      />
      <CampoSelecao
        rotulo="Categoria"
        valor={categoriaId}
        aoMudar={setCategoriaId}
        opcoes={categoriasDisponiveis.map((item) => ({ rotulo: item.nome, valor: item.id }))}
        erro={erros.categoria}
      />
      {categoriasDisponiveis.length === 0 ? (
        <Pressable onPress={() => navegacao.navigate('Categorias')}>
          <Text style={estilos.link}>Criar uma categoria</Text>
        </Pressable>
      ) : null}
      <BotaoPrincipal
        titulo={transacao ? 'Salvar alterações' : 'Salvar transação'}
        aoPressionar={salvar}
        carregando={carregando}
      />
      {transacao ? (
        <Pressable style={estilos.botaoExcluir} onPress={excluir}>
          <Text style={estilos.textoExcluir}>Excluir transação</Text>
        </Pressable>
      ) : null}
    </Tela>
  );
}
