import { Slot, Tabs } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "./storage/tokenCache";
import React, { useEffect, useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoadingScreen from '../components/loading/loadinScreen';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionProvider } from '../components/SubscriptionContext';

const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

function InitialLayout({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      // Load saved responses from AsyncStorage
      const savedData = await AsyncStorage.getItem('chatGPTResponses');
      // Load favorites from AsyncStorage
      const favoriteData = await AsyncStorage.getItem('favorites');

      // Simula um tempo de carregamento para demonstrar a tela de carregamento
      setTimeout(() => {
        setLoading(false);
      }, 2000); // Ajuste o tempo conforme necessário
    })();
  }, []);

  // Verifica se os dados estão carregados e se o usuário está autenticado
  if (!isLoaded || loading) {
    return <LoadingScreen />;
  }

  return children;
}

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <SubscriptionProvider>
        <InitialLayout>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
              headerShown: true,
              headerStyle: {
                backgroundColor: '#000', // Fundo preto
              },
              headerTintColor: '#fff', // Letras brancas
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitle: 'CityHopper', // Título do aplicativo
            }}>
            <Tabs.Screen
              name="saves"
              options={{
                title: 'Save',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'save' : 'save-outline'} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="index"
              options={{
                title: 'Home',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profileScreen"
              options={{
                title: 'Perfil',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                ),
              }}
            />
          </Tabs>
        </InitialLayout>
      </SubscriptionProvider>
    </ClerkProvider>
  );
}
