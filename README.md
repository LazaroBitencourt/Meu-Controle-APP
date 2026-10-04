# MeuControle

Aplicativo de controle financeiro pessoal desenvolvido em React Native com Expo e TypeScript, como Projeto Final da disciplina de Desenvolvimento de Sistemas para Dispositivos Móveis (Técnico em Desenvolvimento de Sistemas - Unimontes).

## Objetivo

Permitir que o usuário registre receitas e despesas, organize os gastos por categorias, acompanhe o saldo do mês e defina metas financeiras, tudo armazenado no próprio dispositivo.

## Funcionalidades

- Cadastro e login locais, com sessão persistente e opção de sair
- Painel inicial com saldo atual, receitas e despesas do mês e últimas movimentações
- Cadastro, edição, exclusão e filtro de transações (receita ou despesa)
- Categorias padrão e categorias criadas pelo usuário
- Metas financeiras com barra de progresso, edição e exclusão
- Validação de todos os formulários com mensagens claras
- Dados salvos com AsyncStorage

## Tecnologias

- React Native 0.81 e Expo SDK 54
- TypeScript
- React Navigation (pilha e abas inferiores)
- AsyncStorage
- Context API

## Como executar

```
npm install
npx expo start --tunnel
```

Para executar no navegador:

```
npx expo start --web
```

Para verificar os tipos do projeto:

```
npm run typecheck
```

## Estrutura de pastas

```
MeuControle/
├── assets/
├── src/
│   ├── armazenamento/   leitura e gravação no AsyncStorage
│   ├── componentes/     componentes reutilizáveis
│   ├── contextos/       sessão do usuário e dados do aplicativo
│   ├── estilos/         tema e estilos das telas
│   ├── navegacao/       rotas e tipos de navegação
│   ├── servicos/        regras de autenticação e carregamento de dados
│   ├── telas/           telas do aplicativo
│   ├── tipos/           modelos de dados
│   └── utilitarios/     formatação, conversão e alertas
├── App.tsx
└── README.md
```

## Telas

| Tela | Rota | Descrição |
| --- | --- | --- |
| TelaLogin | Login | Entrada do usuário |
| TelaCadastro | Cadastro | Criação de conta |
| TelaInicio | Inicio | Resumo financeiro |
| TelaTransacoes | Transacoes | Lista e filtro de movimentações |
| TelaTransacao | Transacao | Formulário para criar ou editar transação |
| TelaCategorias | Categorias | Lista e cadastro de categorias |
| TelaMetas | Metas | Cadastro e acompanhamento de metas |

## Componentes reutilizáveis

Tela, Cabecalho, CampoTexto, CampoSelecao, BotaoPrincipal, EstadoVazio, CartaoResumo e CartaoTransacao.

## Observação

Projeto acadêmico: a senha é guardada localmente no dispositivo e existe uma conta por aparelho. Em um sistema real seria necessário um servidor e armazenamento seguro de credenciais.
"# Meu-Controle-APP" 
