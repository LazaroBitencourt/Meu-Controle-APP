import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessaoProvedor } from './src/contextos/SessaoContexto';
import { DadosProvedor } from './src/contextos/DadosContexto';
import Rotas from './src/navegacao/Rotas';

export default function App() {
  return (
    <SafeAreaProvider>
      <SessaoProvedor>
        <DadosProvedor>
          <StatusBar style="dark" />
          <Rotas />
        </DadosProvedor>
      </SessaoProvedor>
    </SafeAreaProvider>
  );
}
