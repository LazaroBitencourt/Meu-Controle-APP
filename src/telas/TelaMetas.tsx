import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Tela from '../componentes/Tela';
import Cabecalho from '../componentes/Cabecalho';
import CampoTexto from '../componentes/CampoTexto';
import BotaoPrincipal from '../componentes/BotaoPrincipal';
import EstadoVazio from '../componentes/EstadoVazio';
import { useDados } from '../contextos/DadosContexto';
import { estilosLista as estilos } from '../estilos/estilosLista';
import { estilosFormulario } from '../estilos/estilosFormulario';
import { avisar, confirmarExclusao } from '../utilitarios/alertas';
import { brParaIso, converterValor, formatarMoeda, isoParaBR, valorParaTexto } from '../utilitarios/formatacao';

interface Erros {
  titulo?: string;
  objetivo?: string;
  atual?: string;
  prazo?: string;
}

const VALOR_INCREMENTO = 50;

export default function TelaMetas() {
  const { metas, adicionarMeta, atualizarMeta, excluirMeta } = useDados();
  const [titulo, setTitulo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [atual, setAtual] = useState('0');
  const [prazo, setPrazo] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const limpar = () => {
    setTitulo('');
    setObjetivo('');
    setAtual('0');
    setPrazo('');
    setErros({});
    setEditandoId(null);
  };

  const salvar = async () => {
    const valorObjetivo = converterValor(objetivo);
    const valorAtual = atual.trim() ? converterValor(atual, true) : 0;
    const prazoIso = prazo.trim() ? brParaIso(prazo) : null;

    const novosErros: Erros = {
      titulo: titulo.trim() ? undefined : 'O título da meta é obrigatório.',
      objetivo: valorObjetivo === null ? 'Informe um valor objetivo maior que zero.' : undefined,
      atual: valorAtual === null ? 'Informe um valor atual válido.' : undefined,
      prazo: prazo.trim() && !prazoIso ? 'Informe um prazo válido no formato DD/MM/AAAA.' : undefined,
    };
    if (valorObjetivo !== null && valorAtual !== null && valorAtual > valorObjetivo) {
      novosErros.atual = 'O valor atual não pode ser maior que o objetivo.';
    }
    setErros(novosErros);
    if (Object.values(novosErros).some(Boolean) || valorObjetivo === null || valorAtual === null) return;

    setCarregando(true);
    try {
      const dados = {
        titulo: titulo.trim(),
        valorObjetivo,
        valorAtual,
        prazo: prazoIso ?? undefined,
      };
      if (editandoId) await atualizarMeta(editandoId, dados);
      else await adicionarMeta(dados);
      avisar('Sucesso', editandoId ? 'Meta atualizada.' : 'Meta criada.');
      limpar();
    } catch {
      avisar('Erro', 'Não foi possível salvar a meta.');
    } finally {
      setCarregando(false);
    }
  };

  const editar = (id: string) => {
    const meta = metas.find((item) => item.id === id);
    if (!meta) return;
    setEditandoId(meta.id);
    setTitulo(meta.titulo);
    setObjetivo(valorParaTexto(meta.valorObjetivo));
    setAtual(valorParaTexto(meta.valorAtual));
    setPrazo(isoParaBR(meta.prazo));
    setErros({});
  };

  const somarProgresso = async (id: string) => {
    const meta = metas.find((item) => item.id === id);
    if (!meta) return;
    if (meta.valorAtual >= meta.valorObjetivo) {
      avisar('Meta concluída', 'Esta meta já atingiu o valor objetivo.');
      return;
    }
    const proximo = Math.min(meta.valorObjetivo, meta.valorAtual + VALOR_INCREMENTO);
    try {
      await atualizarMeta(id, {
        titulo: meta.titulo,
        valorObjetivo: meta.valorObjetivo,
        valorAtual: proximo,
        prazo: meta.prazo,
      });
    } catch {
      avisar('Erro', 'Não foi possível atualizar o progresso da meta.');
    }
  };

  const excluir = (id: string) => {
    confirmarExclusao('Excluir meta', 'Deseja excluir esta meta?', async () => {
      try {
        await excluirMeta(id);
        if (editandoId === id) limpar();
      } catch {
        avisar('Erro', 'Não foi possível excluir a meta.');
      }
    });
  };

  return (
    <Tela>
      <Cabecalho titulo="Metas financeiras" subtitulo="Defina objetivos e acompanhe seu progresso." />
      <CampoTexto rotulo="Título" value={titulo} onChangeText={setTitulo} placeholder="Ex.: Viagem" erro={erros.titulo} />
      <CampoTexto
        rotulo="Valor objetivo"
        value={objetivo}
        onChangeText={setObjetivo}
        placeholder="Ex.: 3000,00"
        keyboardType="decimal-pad"
        erro={erros.objetivo}
      />
      <CampoTexto
        rotulo="Valor atual"
        value={atual}
        onChangeText={setAtual}
        placeholder="Ex.: 500,00"
        keyboardType="decimal-pad"
        erro={erros.atual}
      />
      <CampoTexto
        rotulo="Prazo (opcional)"
        value={prazo}
        onChangeText={setPrazo}
        placeholder="DD/MM/AAAA"
        keyboardType="numbers-and-punctuation"
        erro={erros.prazo}
      />
      <BotaoPrincipal
        titulo={editandoId ? 'Salvar alterações' : 'Criar meta'}
        aoPressionar={salvar}
        carregando={carregando}
      />
      {editandoId ? (
        <Pressable style={estilosFormulario.botaoCancelar} onPress={limpar} disabled={carregando}>
          <Text style={estilosFormulario.textoCancelar}>Cancelar edição</Text>
        </Pressable>
      ) : null}

      {metas.length === 0 ? (
        <EstadoVazio mensagem="Nenhuma meta cadastrada." />
      ) : (
        metas.map((meta) => {
          const percentual = Math.min(100, Math.round((meta.valorAtual / meta.valorObjetivo) * 100));
          const concluida = meta.valorAtual >= meta.valorObjetivo;
          return (
            <View key={meta.id} style={estilos.cartaoMeta}>
              <View style={estilos.linhaMeta}>
                <Text style={estilos.tituloMeta}>{meta.titulo}</Text>
                <Text style={estilos.percentual}>{percentual}%</Text>
              </View>
              <Text style={estilos.valorMeta}>
                {formatarMoeda(meta.valorAtual)} de {formatarMoeda(meta.valorObjetivo)}
              </Text>
              <View style={estilos.trilha}>
                <View style={[estilos.progresso, { width: `${percentual}%` }]} />
              </View>
              {meta.prazo ? <Text style={estilos.prazo}>Prazo: {isoParaBR(meta.prazo)}</Text> : null}
              <View style={estilos.acoesMeta}>
                <Pressable style={estilos.botaoProgresso} onPress={() => somarProgresso(meta.id)} disabled={concluida}>
                  <Text style={estilos.textoProgresso}>{concluida ? 'Concluída' : '+ R$ 50'}</Text>
                </Pressable>
                <View style={estilos.grupoAcoes}>
                  <Pressable onPress={() => editar(meta.id)}>
                    <Text style={estilos.editar}>Editar</Text>
                  </Pressable>
                  <Pressable onPress={() => excluir(meta.id)}>
                    <Text style={estilos.excluir}>Excluir</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })
      )}
    </Tela>
  );
}
