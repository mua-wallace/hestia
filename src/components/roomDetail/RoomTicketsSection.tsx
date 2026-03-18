import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, typography } from '../../theme';
import { scaleX } from '../../constants/roomDetailStyles';

interface RoomTicketsSectionProps {
  roomNumber: string;
  departmentName?: string;
  roomId?: string;
  onSubmit?: (ticketData: any) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RoomTicketsSection({
  roomNumber,
  departmentName,
  roomId,
}: RoomTicketsSectionProps) {
  const navigation = useNavigation<NavigationProp>();

  const handleCreateTicket = () => {
    navigation.navigate('CreateTicketForm', {
      roomId,
      roomNumber,
      departmentName,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createTicketButton}
        onPress={handleCreateTicket}
        activeOpacity={0.7}
      >
        <Text style={styles.createTicketButtonText}>+ Create Ticket</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.noTicketsText}>No tickets yet. Create one to get started.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  createTicketButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 12 * scaleX,
    paddingHorizontal: 24 * scaleX,
    borderRadius: 8 * scaleX,
    alignItems: 'center',
    marginHorizontal: 16 * scaleX,
    marginTop: 16 * scaleX,
    marginBottom: 8 * scaleX,
  },
  createTicketButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16 * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  noTicketsText: {
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 14,
  },
});
