// App.js
// Expo + React Native — Auth très simple sans vérification d'email
// Stocke email + mot de passe (haché) dans une table Supabase "users"
// ⚠️ Démo pédagogique seulement. Pour un vrai projet, ajoute vérification email, règles RLS strictes, etc.

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-url-polyfill/auto';

// 🔐 ENV — définis ces variables (voir README / instructions)
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export default function App() {
  const [loading, setLoading] = useState(false); // pas de session Supabase ici
  const [session, setSession] = useState(null); // { id, email } quand connecté

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Chargement…</Text>
      </View>
    );
  }

  return session ? (
    <HomeScreen email={session.email} onSignOut={() => setSession(null)} />
  ) : (
    <AuthScreen onSignedIn={(user) => setSession(user)} />
  );
}

function AuthScreen({ onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  // Inscription sans vérification email : on crée une ligne dans la table users
  const signUp = async () => {
    if (!email || !password) return Alert.alert('Champs requis', 'Email et mot de passe obligatoires.');
    try {
      setBusy(true);
      // Hachage côté client (démo). En prod, préfère le faire côté serveur.
      const password_hash = await bcrypt.hash(password, 10);

      const { error } = await supabase.from('users').insert({ email: email.trim().toLowerCase(), password_hash });
      if (error) {
        if (error.code === '23505') return Alert.alert('Email déjà utilisé', "Un compte existe déjà avec cet email.");
        return Alert.alert("Erreur d'inscription", error.message);
      }
      Alert.alert('Compte créé', 'Tu peux maintenant te connecter.');
    } catch (e) {
      Alert.alert('Erreur', e.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  // Connexion manuelle : on récupère l'utilisateur par email et on compare le hash
  const signIn = async () => {
    if (!email || !password) return Alert.alert('Champs requis', 'Email et mot de passe obligatoires.');
    try {
      setBusy(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, email, password_hash')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (error || !data) {
        return Alert.alert('Connexion impossible', 'Email ou mot de passe incorrect.');
      }

      const ok = await bcrypt.compare(password, data.password_hash);
      if (!ok) return Alert.alert('Connexion impossible', 'Email ou mot de passe incorrect.');

      onSignedIn({ id: data.id, email: data.email });
    } catch (e) {
      Alert.alert('Erreur', e.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue 👋</Text>
      <Text style={styles.subtitle}>Créer un compte ou connecte-toi</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="email@exemple.com"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable disabled={busy} style={[styles.btn, busy && { opacity: 0.6 }]} onPress={signIn}>
        <Text style={styles.btnText}>Se connecter</Text>
      </Pressable>
      <Pressable disabled={busy} style={[styles.btnOutline, busy && { opacity: 0.6 }]} onPress={signUp}>
        <Text style={styles.btnOutlineText}>Créer un compte</Text>
      </Pressable>
    </View>
  );
}

function HomeScreen({ email, onSignOut }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bonjour 👋</Text>
      <Text style={{ marginBottom: 24 }}>Connecté en tant que {email}</Text>

      <Pressable style={[styles.btn, { marginTop: 24 }]} onPress={onSignOut}>
        <Text style={styles.btnText}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'stretch', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, opacity: 0.7, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#222', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '700' },
  btnOutline: { borderWidth: 1, borderColor: '#222', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnOutlineText: { color: '#222', fontWeight: '700' }
});
