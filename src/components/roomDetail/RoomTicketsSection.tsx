import React from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { scaleX, CONTENT_AREA } from '../../constants/roomDetailStyles';
import TicketForm from '../tickets/TicketForm';

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

  const handleSubmitSuccess = () => {
    // Navigate back to the room details or refresh the tickets list
    // For now, we'll just show a success message via the toast in TicketForm
    console.log('Ticket submitted successfully');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        nestedScrollEnabled
      >
        <TicketForm
          roomNumber={roomNumber}
          roomId={roomId}
          departmentName={departmentName}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    // Match the content area start position (like ChecklistSection).
    marginTop: CONTENT_AREA.top * scaleX,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 0,
    // Extra space so the bottom of the form can scroll above keyboard.
    paddingBottom: 320 * scaleX,
  },
});
