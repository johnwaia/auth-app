import bcrypt from 'bcryptjs';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { supabase } from '../../lib/supabase';
import { SignUpInput, signUpSchema } from '../../lib/validation';

export default function SignUp() {
  const router = useRouter();
  const [values, setValues] = useState<SignUpInput>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] =
    useState<Partial<Record<keyof SignUpInput, string>>>({});
  const [busy, setBusy] = useState(false);

  const onChange = (key: keyof SignUpInput) => (v: string) =>
    setValues((s) => ({ ...s, [key]: v }));

  const submit = async () => {
    const parsed = signUpSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: any = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0]] = i.message));
      setErrors(fieldErrors);
      return;
    }
    try {
      setBusy(true);
      const password_hash = await bcrypt.hash(values.password, 10);

      const { error } = await supabase.from('users').insert({
        email: values.email.trim().toLowerCase(),
        password_hash,
      });
      if (error) {
        if ((error as any).code === '23505') {
          Alert.alert('Email déjà utilisé', 'Un compte existe déjà avec cet email.');
          return;
        }
        Alert.alert('Erreur', error.message);
        return;
      }

      const { error: pErr } = await supabase.from('profiles').upsert(
        {
          email: values.email.trim().toLowerCase(),
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          phone: values.phone.trim(),
        },
        { onConflict: 'email' }
      );
      if (pErr) console.warn(pErr.message);

      Alert.alert('Compte créé', 'Tu peux maintenant te connecter.');
      // Redirection vers l'écran de connexion du groupe (auth)
      router.replace('/(auth)/sign-in');
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <FormInput
        label="Prénom"
        value={values.firstName}
        onChangeText={onChange('firstName')}
        autoCapitalize="words"
        error={errors.firstName}
      />
      <FormInput
        label="Nom"
        value={values.lastName}
        onChangeText={onChange('lastName')}
        autoCapitalize="words"
        error={errors.lastName}
      />
      <FormInput
        label="Email"
        value={values.email}
        onChangeText={onChange('email')}
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.email}
      />
      <FormInput
        label="Téléphone"
        value={values.phone}
        onChangeText={onChange('phone')}
        keyboardType="phone-pad"
        error={errors.phone}
      />
      <FormInput
        label="Mot de passe"
        value={values.password}
        onChangeText={onChange('password')}
        secureTextEntry
        error={errors.password}
      />
      <Button title="Créer mon compte" onPress={submit} loading={busy} />
      <Text style={{ textAlign: 'center', marginTop: 12 }}>
        Déjà inscrit ? <Link href="/(auth)/sign-in">Se connecter</Link>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
});
