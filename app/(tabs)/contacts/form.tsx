// app/(tabs)/contacts/form.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';
import Button from '../../../components/Button';
import FormInput from '../../../components/FormInput';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth-context';

type Values = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
};

export default function ContactForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { email: currentUserEmail } = useAuth();

  const [values, setValues] = useState<Values>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [busy, setBusy] = useState(false);

  const onChange = (key: keyof Values) => (v: string) =>
    setValues((s) => ({ ...s, [key]: v }));

  const load = async () => {
    if (!id) return;
    try {
      setBusy(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('first_name, last_name, phone, email')
        .eq('id', id)
        .single();

      if (error) throw error;

      setValues({
        firstName: data?.first_name ?? '',
        lastName: data?.last_name ?? '',
        phone: data?.phone ?? '',
        email: data?.email ?? '',
      });
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validate = () => {
    if (!values.firstName.trim() || !values.lastName.trim() || !values.phone.trim()) {
      Alert.alert('Champs requis', 'Nom, Prénom et Téléphone sont obligatoires.');
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!validate()) return;

    if (!currentUserEmail) {
      Alert.alert(
        'Session requise',
        "Aucun utilisateur connecté. Merci de vous reconnecter avant d'ajouter un contact."
      );
      return;
    }

    try {
      setBusy(true);

      if (id) {
        // Édition : ne change pas created_by
        const { error } = await supabase
          .from('contacts')
          .update({
            first_name: values.firstName.trim(),
            last_name: values.lastName.trim(),
            phone: values.phone.trim(),
            email: values.email?.trim() || null,
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        // Création : on renseigne created_by
        const { error } = await supabase.from('contacts').insert({
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          phone: values.phone.trim(),
          email: values.email?.trim() || null,
          created_by: currentUserEmail,
        });

        if (error) throw error;
      }

      router.back();
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
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{id ? 'Modifier le contact' : 'Nouveau contact'}</Text>

        <FormInput
          label="Prénom"
          value={values.firstName}
          onChangeText={onChange('firstName')}
          autoCapitalize="words"
        />
        <FormInput
          label="Nom"
          value={values.lastName}
          onChangeText={onChange('lastName')}
          autoCapitalize="words"
        />
        <FormInput
          label="Téléphone"
          value={values.phone}
          onChangeText={onChange('phone')}
          keyboardType="phone-pad"
        />
        <FormInput
          label="Email (facultatif)"
          value={values.email ?? ''}
          onChangeText={onChange('email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Pas de prop disabled pour éviter l'erreur de typage si ton Button ne la gère pas */}
        <Button
          title={id ? 'Enregistrer' : 'Créer'}
          onPress={() => { if (!busy) save(); }} // wrapper non-async
          loading={busy}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
});
