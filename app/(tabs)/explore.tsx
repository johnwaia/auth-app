import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function Explore() {
return (
<View style={styles.container}>
<Text style={styles.title}>Explore</Text>
<Text>Ici, mets ton contenu.</Text>
</View>
);
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 24 }, title: { fontSize: 24, fontWeight: '700', marginBottom: 8 } });

