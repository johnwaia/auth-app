// app/(tabs)/contacts/index.tsx
import { Link, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth-context';

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  created_by?: string | null;
};

export default function ContactsList() {
  const router = useRouter();
  const { email } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!email) {
      setContacts([]);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('id, first_name, last_name, phone, email, created_by, created_at')
        .eq('created_by', email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [email])
  );

  const confirmDelete = (id: string) => {
    Alert.alert('Supprimer', 'Confirmer la suppression de ce contact ?', [
      { text: 'Annuler' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => del(id),
      },
    ]);
  };

  const del = async (id: string) => {
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? String(e));
    }
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/(tabs)/contacts/form', params: { id: item.id } })}
      style={styles.row}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.last_name?.toUpperCase()} {item.first_name}</Text>
        <Text style={styles.sub}>
          {item.phone}{item.email ? `  ·  ${item.email}` : ''}
        </Text>
      </View>
      <Pressable onPress={() => confirmDelete(item.id)} style={styles.deleteBtn}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Suppr.</Text>
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Contacts</Text>
        <Link href="/(tabs)/contacts/form" asChild>
          <Pressable style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Nouveau</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={!loading ? <Text>Aucun contact.</Text> : null}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  addBtn: { backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: '700' },
  sub: { color: '#555', marginTop: 2 },
  deleteBtn: { backgroundColor: '#e11d48', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginLeft: 10 },
});
