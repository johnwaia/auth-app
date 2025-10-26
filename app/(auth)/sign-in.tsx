import bcrypt from 'bcryptjs';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { supabase } from '../../lib/supabase';
import { SignInInput, signInSchema } from '../../lib/validation';


export default function SignIn() {
const router = useRouter();
const [values, setValues] = useState<SignInInput>({ email: '', password: '' });
const [errors, setErrors] = useState<Partial<Record<keyof SignInInput, string>>>({});
const [busy, setBusy] = useState(false);


const onChange = (key: keyof SignInInput) => (v: string) => setValues((s) => ({ ...s, [key]: v }));


const submit = async () => {
    
const parsed = signInSchema.safeParse(values);
if (!parsed.success) {
const fieldErrors: any = {};
parsed.error.issues.forEach((i) => (fieldErrors[i.path[0]] = i.message));
setErrors(fieldErrors);
return;
}
try {
setBusy(true);
const { data, error } = await supabase
.from('users')
.select('id, email, password_hash')
.eq('email', values.email.trim().toLowerCase())
.single();
if (error || !data) return Alert.alert('Connexion impossible', 'Email ou mot de passe incorrect.');


const ok = await bcrypt.compare(values.password, data.password_hash);
if (!ok) return Alert.alert('Connexion impossible', 'Email ou mot de passe incorrect.');


// Optionnel: récupérer le profil associé
const { data: profile } = await supabase
.from('profiles')
.select('first_name, last_name, phone')
.eq('email', data.email)
.maybeSingle();


// Ici on irait plutôt dans un contexte. Pour la démo, simple redirection vers les tabs.
router.replace('/(tabs)');
} catch (e: any) {
Alert.alert('Erreur', e.message ?? String(e));
} finally {
setBusy(false);
}
};


return (
<View style={styles.container}>
<Text style={styles.title}>Se connecter</Text>
<FormInput label="Email" value={values.email} onChangeText={onChange('email')} autoCapitalize="none" keyboardType="email-address" error={errors.email} />
<FormInput label="Mot de passe" value={values.password} onChangeText={onChange('password')} secureTextEntry error={errors.password} />
<Button title="Connexion" onPress={submit} loading={busy} />
<Text style={{ textAlign: 'center', marginTop: 12 }}>Nouveau ? <Link href="/(auth)/sign-up">Créer un compte</Link></Text>
</View>
);
}
const styles = StyleSheet.create({
container: { flex: 1, padding: 24, justifyContent: 'center' },
title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
});