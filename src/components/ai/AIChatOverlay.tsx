/**
 * AI Chat overlay – voice note, transcription, and AI response.
 * Full width, zero margin; border-radius 12px top; border 1.5px solid #FF46A3; background #FFF.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
} from 'expo-audio';
import { colors, typography } from '../../theme';
import { normalizedScaleX } from '../../utils/responsive';
import { useToast } from '../../contexts/ToastContext';
import { transcribeAndRespond, sendTextToAgent } from '../../services/aiAgent';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// Pixel-perfect icon size (rounded) to avoid blur – match Figma
const HESTIA_ICON_WIDTH = Math.round(120 * normalizedScaleX);
const HESTIA_ICON_HEIGHT = Math.round(32 * normalizedScaleX);

const OVERLAY_HEIGHT = 280 * scaleX;

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'voice';
}

interface AIChatOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export default function AIChatOverlay({ visible, onClose }: AIChatOverlayProps) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const toast = useToast();

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const isRecording = recorderState.isRecording;
  const recordingSeconds = Math.floor(recorderState.durationMillis / 1000);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setInputText('');
  }, []);

  const handleSendText = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isProcessing) return;
    setMessages((prev) => [...prev, { role: 'user', content: text, type: 'text' }]);
    setInputText('');
    setIsProcessing(true);
    try {
      const response = await sendTextToAgent(text);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) {
      console.warn('AI text error', e);
      toast.show('Could not get a response. Try again.', { type: 'error', title: 'Error' });
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, isProcessing, toast]);

  const processVoiceNote = useCallback(
    async (audioUri: string) => {
      setIsProcessing(true);
      try {
        const { transcript, response } = await transcribeAndRespond(audioUri);
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: transcript || '🎤 Voice note', type: 'voice' },
          { role: 'assistant', content: response },
        ]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      } catch (e) {
        console.warn('AI voice note error', e);
        toast.show('Could not process voice note. Try again.', { type: 'error', title: 'Error' });
      } finally {
        setIsProcessing(false);
      }
    },
    [toast]
  );

  const handleMicPress = useCallback(async () => {
    if (isRecording) {
      try {
        const durationSec = Math.round(recorderState.durationMillis / 1000) || 0;
        await audioRecorder.stop();
        const uri = audioRecorder.uri;
        if (uri && durationSec > 0) {
          await processVoiceNote(uri);
        } else {
          toast.show('Record at least 1 second.', { type: 'error', title: 'Too short' });
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
        toast.show('Failed to save recording.', { type: 'error', title: 'Error' });
      }
      return;
    }

    try {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        toast.show('Microphone access is needed for voice notes.', { type: 'error', title: 'Permission needed' });
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.show('Failed to start recording.', { type: 'error', title: 'Error' });
    }
  }, [
    isRecording,
    recorderState.durationMillis,
    audioRecorder,
    processVoiceNote,
    toast,
  ]);

  // Zero margin from tab bar: overlay sits flush with tab bar top
  const tabBarHeight = 152 * scaleX;
  const bottomOffset = tabBarHeight;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.overlay,
            {
              width: SCREEN_WIDTH,
              height: OVERLAY_HEIGHT,
              left: 0,
              bottom: bottomOffset,
            },
          ]}
        >
          <View style={styles.overlayContent}>
            {/* Header row: Hestia AI icon top left, close top right (as in Figma) */}
            <View style={styles.header}>
              <Image
                source={require('../../../assets/icons/ai-chat-icon.png')}
                style={[styles.hestiaIcon, { width: HESTIA_ICON_WIDTH, height: HESTIA_ICON_HEIGHT }]}
                resizeMode="contain"
              />
              <View style={styles.headerSpacer} />
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={12}>
                <Ionicons name="close" size={22} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            {/* Messages: transcript + AI response */}
            <ScrollView
              ref={scrollRef}
              style={styles.messagesScroll}
              contentContainerStyle={styles.messagesContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg, i) => (
                <View
                  key={i}
                  style={[styles.messageBubble, msg.role === 'user' ? styles.messageUser : styles.messageAssistant]}
                >
                  <Text
                    style={[styles.messageText, msg.role === 'assistant' && styles.messageTextAssistant]}
                    numberOfLines={10}
                  >
                    {msg.content}
                  </Text>
                </View>
              ))}
              {isProcessing && (
                <View style={[styles.messageBubble, styles.messageAssistant]}>
                  <ActivityIndicator size="small" color={colors.primary.main} />
                  <Text style={[styles.messageText, styles.processingText]}>Transcribing and responding…</Text>
                </View>
              )}
            </ScrollView>
            {/* Input bar – pill with +, "Ask anything....", mic (voice note) */}
            <View style={styles.inputRow}>
              <TouchableOpacity style={styles.attachBtn} onPress={handleNewChat} activeOpacity={0.7}>
                <Ionicons name="add" size={24} color={colors.primary.main} />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder={isRecording ? `Recording ${recordingSeconds}s…` : 'Ask anything....'}
                placeholderTextColor={colors.primary.main}
                value={inputText}
                onChangeText={setInputText}
                multiline={false}
                returnKeyType="send"
                onSubmitEditing={handleSendText}
                blurOnSubmit={false}
                editable={!isRecording && !isProcessing}
              />
              {inputText.trim().length > 0 ? (
                <TouchableOpacity
                  style={styles.sendBtn}
                  onPress={handleSendText}
                  disabled={isProcessing}
                  activeOpacity={0.7}
                >
                  <Ionicons name="send" size={22} color={colors.primary.main} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.micBtn}
                  onPress={handleMicPress}
                  disabled={isProcessing}
                  activeOpacity={0.7}
                >
                  {isRecording ? (
                    <Ionicons name="stop-circle" size={26} color={colors.status?.dirty ?? '#f92424'} />
                  ) : (
                    <Ionicons name="mic-outline" size={22} color={colors.primary.main} />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#FF46A3',
    justifyContent: 'space-between',
  },
  overlayContent: {
    flex: 1,
    paddingHorizontal: 16 * scaleX,
    paddingTop: 12 * scaleX,
    paddingBottom: 14 * scaleX,
    justifyContent: 'space-between',
  },
  messagesScroll: {
    flex: 1,
    maxHeight: 120 * scaleX,
    marginVertical: 8 * scaleX,
  },
  messagesContent: {
    paddingVertical: 4,
    gap: 8 * scaleX,
  },
  messageBubble: {
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 8 * scaleX,
    borderRadius: 12,
    maxWidth: '90%',
  },
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.background.tertiary ?? '#f1f6fc',
  },
  messageAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * scaleX,
  },
  messageText: {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as string,
    fontSize: 13 * scaleX,
    color: colors.text.primary,
  },
  messageTextAssistant: {
    color: colors.text.white,
  },
  processingText: {
    color: colors.text.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hestiaIcon: {
    // Rounded dimensions set inline (HESTIA_ICON_WIDTH/HEIGHT) for sharp, non-blurred rendering as in Figma
  },
  headerSpacer: {
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary ?? '#f1f6fc',
    borderRadius: 50,
    paddingVertical: 10 * scaleX,
    paddingLeft: 14 * scaleX,
    paddingRight: 14 * scaleX,
    minHeight: 48 * scaleX,
  },
  attachBtn: {
    marginRight: 10 * scaleX,
    padding: 2,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as string,
    fontSize: 15 * scaleX,
    color: colors.text.primary,
    paddingVertical: 2,
  },
  micBtn: {
    marginLeft: 6 * scaleX,
    padding: 2,
  },
  sendBtn: {
    marginLeft: 6 * scaleX,
    padding: 2,
  },
});
