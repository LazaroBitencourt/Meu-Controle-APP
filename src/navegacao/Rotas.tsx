import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSessao } from '../contextos/SessaoContexto';
import { cores } from '../estilos/tema';
import TelaLogin from '../telas/TelaLogin';
import TelaCadastro from '../telas/TelaCadastro';
import TelaInicio from '../telas/TelaInicio';
import TelaTransacoes from '../telas/TelaTransacoes';
import TelaMetas from '../telas/TelaMetas';
import TelaTransacao from '../telas/TelaTransacao';
import TelaCategorias from '../telas/TelaCategorias';
import { ParametrosAbas, ParametrosPilha } from './tipos';

const Pilha = createNativeStackNavigator<ParametrosPilha>();
const Abas = createBottomTabNavigator<ParametrosAbas>();

type NomeIcone = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function icone(nome: NomeIcone) {
  return ({ color, size }: { color: string; size: number }) => (
    <MaterialCommunityIcons name={nome} color={color} size={size} />
  );
}

function NavegacaoAbas() {
  return (
    <Abas.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.suave,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      }}
    >
      <Abas.Screen name="Inicio" component={TelaInicio} options={{ title: 'Início', tabBarIcon: icone('home-variant-outline') }} />
      <Abas.Screen name="Transacoes" component={TelaTransacoes} options={{ title: 'Transações', tabBarIcon: icone('swap-horizontal') }} />
      <Abas.Screen name="Metas" component={TelaMetas} options={{ title: 'Metas', tabBarIcon: icone('target') }} />
    </Abas.Navigator>
  );
}

export default function Rotas() {
  const { usuario, carregando } = useSessao();

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.fundo }}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Pilha.Navigator>
        {usuario ? (
          <>
            <Pilha.Screen name="Principal" component={NavegacaoAbas} options={{ headerShown: false }} />
            <Pilha.Screen
              name="Transacao"
              component={TelaTransacao}
              options={({ route }) => ({ title: route.params?.id ? 'Editar transação' : 'Nova transação' })}
            />
            <Pilha.Screen name="Categorias" component={TelaCategorias} options={{ title: 'Categorias' }} />
          </>
        ) : (
          <>
            <Pilha.Screen name="Login" component={TelaLogin} options={{ headerShown: false }} />
            <Pilha.Screen name="Cadastro" component={TelaCadastro} options={{ headerShown: false }} />
          </>
        )}
      </Pilha.Navigator>
    </NavigationContainer>
  );
}
