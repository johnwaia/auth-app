// app/(tabs)/_layout.tsx
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useAuth } from '../auth-context';

export default function TabsLayout() {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerTitle: 'My Contacts Mobile App',
        headerShown: true,
        headerRight: () => (
          <Pressable
            onPress={() => {
              signOut();
              router.replace('/(auth)/sign-in');
            }}
            style={{ paddingHorizontal: 12, paddingVertical: 6 }}
          >
            <Text style={{ fontWeight: '600' }}>Déconnexion</Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explorer' }} />
      <Tabs.Screen name="contacts/index" options={{ title: 'Contacts' }} />
    </Tabs>
  );
}
