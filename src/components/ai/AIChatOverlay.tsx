/**
 * AI Chat overlay – appears on top of current screen (Figma styles).
 * Full width, zero margin; border-radius 12px top; border 1.5px solid #FF46A3; background #FFF.
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

const OVERLAY_HEIGHT = 194 * scaleX;

interface AIChatOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export default function AIChatOverlay({ visible, onClose }: AIChatOverlayProps) {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    // TODO: Send to AI
    setInputText('');
  };

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
                style={styles.hestiaIcon}
                resizeMode="contain"
              />
              <View style={styles.headerSpacer} />
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={12}>
                <Ionicons name="close" size={22} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            {/* Input bar – pill with +, "Ask anything....", mic */}
            <View style={styles.inputRow}>
              <TouchableOpacity style={styles.attachBtn} onPress={() => {}} activeOpacity={0.7}>
                <Ionicons name="add" size={24} color={colors.primary.main} />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Ask anything...."
                placeholderTextColor={colors.primary.main}
                value={inputText}
                onChangeText={setInputText}
                multiline={false}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
              <TouchableOpacity style={styles.micBtn} onPress={() => {}} activeOpacity={0.7}>
                <Ionicons name="mic-outline" size={22} color={colors.primary.main} />
              </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hestiaIcon: {
    width: 120 * scaleX,
    height: 32 * scaleX,
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
});
