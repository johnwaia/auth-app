import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function Home() {
return (
<View style={styles.container}>
<Text style={styles.title}>Bienvenue 👋</Text>
<Text>Tu es connecté. Cette page sera ton tableau de bord.</Text>
</View>
);
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 24 }, title: { fontSize: 24, fontWeight: '700', marginBottom: 8 } });

