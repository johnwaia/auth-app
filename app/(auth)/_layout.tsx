// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerTitle: 'Authentification' }}>
      <Stack.Screen name="sign-in" options={{ title: 'Se connecter' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Créer un compte' }} />
    </Stack>
  );
}
