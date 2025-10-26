import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';


export default function Button({ title, onPress, loading, style }: { title: string; onPress: () => void; loading?: boolean; style?: ViewStyle }) {
return (
<Pressable disabled={loading} style={[styles.btn, loading && { opacity: 0.6 }, style]} onPress={onPress}>
{loading ? <ActivityIndicator /> : <Text style={styles.btnText}>{title}</Text>}
</Pressable>
);
}
const styles = StyleSheet.create({
btn: { backgroundColor: '#222', padding: 14, borderRadius: 12, alignItems: 'center' },
btnText: { color: 'white', fontWeight: '700' },
});