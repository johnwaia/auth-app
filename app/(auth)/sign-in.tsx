// app/(auth)/sign-in.tsx
import bcrypt from 'bcryptjs';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { supabase } from '../../lib/supabase';
import { SignInInput, signInSchema } from '../../lib/validation';
import { useAuth } from '../auth-context';

export default function SignIn() {
  const router = useRouter();
  const { setEmail } = useAuth();

  const [values, setValues] = useState<SignInInput>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof SignInInput, string>>>({});
  const [busy, setBusy] = useState(false);

  const onChange = (key: keyof SignInInput) => (v: string) => {
    setValues((s) => ({ ...s, [key]: v }));
    // Efface l'erreur du champ modifié pour améliorer l'UX
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async () => {
    // Validation zod
    const parsed = signInSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof SignInInput, string>> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as keyof SignInInput] = i.message));
      setErrors(fieldErrors);
      return;
    }

    try {
      setBusy(true);

      const email = values.email.trim().toLowerCase();

      // Récupère l'utilisateur
      const { data, error } = await supabase
        .from('users')
        .select('id, email, password_hash')
        .eq('email', email)
        .single();

      if (error || !data) {
        Alert.alert('Connexion impossible', 'Email ou mot de passe incorrect.');
        return;
      }

      // Compare le mot de passe
      const ok = await bcrypt.compare(values.password, data.password_hash);
      if (!ok) {
        Alert.alert('Connexion impossible', 'Email ou mot de passe incorrect.');
        return;
      }

      // (Optionnel) récupérer un profil si besoin
      await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('email', data.email)
        .maybeSingle();

      // ✅ Enregistre l'email dans l'AuthContext pour filtrer les contacts par créateur
      setEmail(email);

      // Redirection vers les tabs
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Se connecter</Text>

        <FormInput
          label="Email"
          value={values.email}
          onChangeText={onChange('email')}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
        />

        <FormInput
          label="Mot de passe"
          value={values.password}
          onChangeText={onChange('password')}
          secureTextEntry
          error={errors.password}
        />

        <Button
            title="Connexion"
            onPress={() => { if (!busy) submit(); }} // évite l'async direct
            loading={busy}
        />


        <Text style={{ textAlign: 'center', marginTop: 12 }}>
          Nouveau ? <Link href="/(auth)/sign-up">Créer un compte</Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
});
