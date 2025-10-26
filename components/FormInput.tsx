import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';


export default function FormInput({
label,
value,
onChangeText,
placeholder,
secureTextEntry,
keyboardType,
autoCapitalize,
error,
}: {
label: string;
value: string;
onChangeText: (t: string) => void;
placeholder?: string;
secureTextEntry?: boolean;
keyboardType?: KeyboardTypeOptions;
autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
error?: string;
}) {
return (
<View style={{ marginBottom: 12 }}>
<Text style={styles.label}>{label}</Text>
<TextInput
style={[styles.input, !!error && { borderColor: '#e11d48' }]}
placeholder={placeholder}
value={value}
onChangeText={onChangeText}
secureTextEntry={secureTextEntry}
keyboardType={keyboardType}
autoCapitalize={autoCapitalize}
/>
{!!error && <Text style={styles.error}>{error}</Text>}
</View>
);
}
const styles = StyleSheet.create({
label: { marginBottom: 6, fontWeight: '600' },
input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12 },
error: { color: '#e11d48', marginTop: 4 },
});