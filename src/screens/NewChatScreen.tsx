/**
 * New Chat – pick a user to start a direct chat (Supabase).
 * Creates or reuses a direct chat and navigates to ChatDetail.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { User } from '../types';
import { getUsers } from '../services/user';
import { getOrCreateDirectChat, getCurrentUserId } from '../services/chat';
import { colors } from '../theme';
import { scaleX } from '../constants/chatStyles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'NewChat'>;

export default function NewChatScreen() {
  const navigation = useNavigation<Nav>();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [uid, res] = await Promise.all([getCurrentUserId(), getUsers({ limit: 50 })]);
      setCurrentUserId(uid);
      const list = uid ? res.data.filter((u) => u.id !== uid) : res.data;
      setUsers(list);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelectUser = async (user: User) => {
    if (!user.id || startingChat) return;
    setStartingChat(user.id);
    try {
      const chatId = await getOrCreateDirectChat(user.id);
      if (chatId) {
        navigation.replace('ChatDetail', {
          chatId,
          chat: {
            id: chatId,
            name: user.name,
            lastMessage: '',
            avatar: user.avatar ? { uri: user.avatar } : undefined,
            isGroup: false,
          },
        });
      } else {
        Alert.alert('Could not start chat', 'Please try again. If it keeps failing, check your connection.');
      }
    } catch (e) {
      console.warn('Failed to start chat', e);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setStartingChat(null);
    }
  };

  const renderItem = ({ item }: { item: User }) => {
    const isStarting = startingChat === item.id;
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => handleSelectUser(item)}
        disabled={!!startingChat}
        activeOpacity={0.7}
      >
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{(item.name || '?').charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {isStarting && <ActivityIndicator size="small" color={colors.primary?.main ?? '#5A759D'} style={styles.loader} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New chat</Text>
      </View>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary?.main ?? '#5A759D'} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No users to chat with</Text>}
          contentContainerStyle={users.length === 0 ? styles.emptyList : undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16 * scaleX,
    paddingTop: 56,
    paddingBottom: 16 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backBtn: {
    marginRight: 12,
  },
  backText: {
    fontSize: 16,
    color: '#5A759D',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12 * scaleX,
    paddingHorizontal: 16 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 44 * scaleX,
    height: 44 * scaleX,
    borderRadius: 22 * scaleX,
  },
  avatarPlaceholder: {
    width: 44 * scaleX,
    height: 44 * scaleX,
    borderRadius: 22 * scaleX,
    backgroundColor: '#E3ECF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5A759D',
  },
  name: {
    flex: 1,
    marginLeft: 12 * scaleX,
    fontSize: 16,
    color: '#1E1E1E',
  },
  loader: {
    marginLeft: 8,
  },
  empty: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
  },
  emptyList: {
    flexGrow: 1,
  },
});
