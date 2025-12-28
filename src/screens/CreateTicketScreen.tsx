import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { typography } from '../theme';
import {
  CREATE_TICKET_HEADER,
  CREATE_TICKET_CONTENT,
  DEPARTMENT_GRID,
  CREATE_TICKET_AI_BUTTON,
  CREATE_TICKET_DIVIDER,
  CREATE_TICKET_COLORS,
  CREATE_TICKET_TYPOGRAPHY,
  scaleX,
} from '../constants/createTicketStyles';
import type { RootStackParamList } from '../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CreateTicketScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateTicket'
>;

type DepartmentId =
  | 'engineering'
  | 'hskPortier'
  | 'inRoomDining'
  | 'laundry'
  | 'concierge'
  | 'reception'
  | 'it';

interface Department {
  id: DepartmentId;
  name: string;
  icon: any;
}

// Department icons - all downloaded from Figma and saved locally
const DEPARTMENTS: Department[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    icon: require('../../assets/icons/engineering.png'),
  },
  {
    id: 'hskPortier',
    name: 'HSK Portier',
    icon: require('../../assets/icons/hsk-portier.png'),
  },
  {
    id: 'inRoomDining',
    name: 'In Room Dining',
    icon: require('../../assets/icons/in-room-dining.png'),
  },
  {
    id: 'laundry',
    name: 'Laundry',
    icon: require('../../assets/icons/laundry-icon.png'),
  },
  {
    id: 'concierge',
    name: 'Concierge',
    icon: require('../../assets/icons/concierge.png'),
  },
  {
    id: 'reception',
    name: 'Reception',
    icon: require('../../assets/icons/reception.png'),
  },
  {
    id: 'it',
    name: 'IT',
    icon: require('../../assets/icons/it.png'),
  },
];

export default function CreateTicketScreen() {
  const navigation = useNavigation<CreateTicketScreenNavigationProp>();
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentId | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDepartmentPress = (departmentId: DepartmentId) => {
    setSelectedDepartment(departmentId);
    // TODO: Navigate to ticket creation form or handle department selection
    console.log('Selected department:', departmentId);
  };

  const handleAICreatePress = () => {
    // TODO: Implement AI ticket creation
    console.log('AI Create Ticket pressed');
  };

  const getDepartmentStyle = (deptId: DepartmentId) => {
    return DEPARTMENT_GRID.departments[deptId];
  };

  return (
    <View style={styles.container}>
      {/* Header Background */}
      <View style={styles.headerBackground} />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/icons/back-arrow.png')}
              style={styles.backArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.headerTitle}>
            {CREATE_TICKET_HEADER.title.text}
          </Text>
        </View>

        {/* Main Content */}
        {/* Heading */}
        <Text style={styles.heading}>
          {CREATE_TICKET_CONTENT.heading.text}
        </Text>

        {/* Select Department Label */}
        <Text style={styles.selectDepartmentLabel}>
          {CREATE_TICKET_CONTENT.selectDepartmentLabel.text}
        </Text>

        {/* Department Grid */}
        {DEPARTMENTS.map((department) => {
          const deptStyle = getDepartmentStyle(department.id);
          const isSelected = selectedDepartment === department.id;

          return (
            <View key={department.id} style={styles.departmentContainer}>
              {/* Department Icon */}
              <TouchableOpacity
                style={[
                  styles.departmentIcon,
                  {
                    left: deptStyle.left * scaleX,
                    top: deptStyle.top * scaleX,
                    backgroundColor: CREATE_TICKET_COLORS.departmentIconBg,
                  },
                ]}
                onPress={() => handleDepartmentPress(department.id)}
                activeOpacity={0.7}
              >
                <Image
                  source={department.icon}
                  style={[
                    styles.departmentIconImage,
                    // Apply tintColor for icons that need it, but some icons are already colored
                    // Remove tintColor for icons that are not visible with it
                    (department.id === 'hskPortier' || department.id === 'inRoomDining')
                      ? {} // No tintColor - icons are already colored
                      : { tintColor: '#F92424' }, // Red color from Figma design
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Department Label */}
              <Text
                style={[
                  styles.departmentLabel,
                  {
                    left: deptStyle.labelLeft * scaleX,
                    top: deptStyle.labelTop * scaleX,
                    width: deptStyle.labelWidth * scaleX,
                  },
                ]}
              >
                {deptStyle.labelText}
              </Text>
            </View>
          );
        })}

        {/* Divider */}
        <View
          style={[
            styles.divider,
            {
              left: (SCREEN_WIDTH / 2) + (CREATE_TICKET_DIVIDER.leftOffset * scaleX),
              top: CREATE_TICKET_DIVIDER.top * scaleX,
              width: CREATE_TICKET_DIVIDER.width * scaleX,
            },
          ]}
        />

        {/* AI Create Ticket Button Section */}
        <View style={styles.aiButtonSection}>
          {/* Button Container */}
          <TouchableOpacity
            style={[
              styles.aiButtonContainer,
              {
                left: (SCREEN_WIDTH / 2) - (CREATE_TICKET_AI_BUTTON.container.width * scaleX / 2),
                top: CREATE_TICKET_AI_BUTTON.container.top * scaleX,
              },
            ]}
            onPress={handleAICreatePress}
            activeOpacity={0.7}
          >
            {/* Button */}
            <View style={styles.aiButton}>
              {/* Button Text */}
              <Text style={styles.aiButtonText}>
                {CREATE_TICKET_AI_BUTTON.text.text}
              </Text>

              {/* AI Badge */}
              <View style={styles.aiBadge}>
                {/* Note: For true gradient text, would need react-native-svg or mask approach */}
                {/* Using gradient start color as fallback for now */}
                <Text style={styles.aiBadgeText}>
                  {CREATE_TICKET_AI_BUTTON.aiText.text}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Beta Label */}
          <Text
            style={[
              styles.betaLabel,
              {
                left: (SCREEN_WIDTH / 2) + (CREATE_TICKET_AI_BUTTON.betaLabel.leftOffset * scaleX),
                top: CREATE_TICKET_AI_BUTTON.betaLabel.top * scaleX,
              },
            ]}
          >
            {CREATE_TICKET_AI_BUTTON.betaLabel.text}
          </Text>

          {/* Description */}
          <Text
            style={[
              styles.description,
              {
                left: CREATE_TICKET_AI_BUTTON.description.left * scaleX,
                top: CREATE_TICKET_AI_BUTTON.description.top * scaleX,
                width: CREATE_TICKET_AI_BUTTON.description.width * scaleX,
              },
            ]}
          >
            {CREATE_TICKET_AI_BUTTON.description.text}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREATE_TICKET_COLORS.background,
  },
  headerBackground: {
    position: 'absolute',
    top: CREATE_TICKET_HEADER.background.top * scaleX,
    left: 0,
    right: 0,
    height: CREATE_TICKET_HEADER.background.height * scaleX,
    backgroundColor: CREATE_TICKET_COLORS.headerBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    minHeight: 900 * scaleX, // Ensure enough height for all content including description
    paddingBottom: 100 * scaleX, // Extra padding for scroll
  },
  header: {
    height: CREATE_TICKET_HEADER.height * scaleX,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: CREATE_TICKET_HEADER.backButton.left * scaleX,
    top: CREATE_TICKET_HEADER.backButton.top * scaleX,
    width: CREATE_TICKET_HEADER.backButton.width * scaleX,
    height: CREATE_TICKET_HEADER.backButton.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backArrow: {
    width: CREATE_TICKET_HEADER.backButton.width * scaleX,
    height: CREATE_TICKET_HEADER.backButton.height * scaleX,
    transform: [{ rotate: `${CREATE_TICKET_HEADER.backButton.rotation}deg` }],
  },
  headerTitle: {
    position: 'absolute',
    left: (SCREEN_WIDTH / 2) + (CREATE_TICKET_HEADER.title.leftOffset * scaleX), // Centered with offset from Figma
    top: CREATE_TICKET_HEADER.title.top * scaleX,
    fontSize: CREATE_TICKET_HEADER.title.fontSize * scaleX, // 24px from Figma
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '700', // Helvetica Bold
    color: CREATE_TICKET_HEADER.title.color,
  },
  heading: {
    position: 'absolute',
    left: (SCREEN_WIDTH / 2) + (CREATE_TICKET_CONTENT.heading.leftOffset * scaleX), // leftOffset is negative, so this centers correctly
    top: CREATE_TICKET_CONTENT.heading.top * scaleX,
    fontSize: CREATE_TICKET_TYPOGRAPHY.heading.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '700', // Helvetica Bold
    color: CREATE_TICKET_TYPOGRAPHY.heading.color,
  },
  selectDepartmentLabel: {
    position: 'absolute',
    left: CREATE_TICKET_CONTENT.selectDepartmentLabel.left * scaleX,
    top: CREATE_TICKET_CONTENT.selectDepartmentLabel.top * scaleX,
    fontSize: CREATE_TICKET_TYPOGRAPHY.selectDepartmentLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300', // Inter Light
    color: CREATE_TICKET_TYPOGRAPHY.selectDepartmentLabel.color,
  },
  departmentContainer: {
    position: 'absolute',
  },
  departmentIcon: {
    position: 'absolute',
    width: DEPARTMENT_GRID.item.size * scaleX,
    height: DEPARTMENT_GRID.item.size * scaleX,
    borderRadius: DEPARTMENT_GRID.item.borderRadius * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  departmentIconImage: {
    // Icons should fill most of the circular container, leaving some padding
    // From Figma: icons are positioned with inset values that center them
    width: (DEPARTMENT_GRID.item.size * 0.65) * scaleX, // Slightly larger for better visibility
    height: (DEPARTMENT_GRID.item.size * 0.65) * scaleX,
  },
  departmentLabel: {
    position: 'absolute',
    fontSize: CREATE_TICKET_TYPOGRAPHY.departmentLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300', // Inter Light
    color: CREATE_TICKET_TYPOGRAPHY.departmentLabel.color,
    textAlign: CREATE_TICKET_TYPOGRAPHY.departmentLabel.textAlign as any,
  },
  divider: {
    position: 'absolute',
    height: CREATE_TICKET_DIVIDER.height,
    backgroundColor: CREATE_TICKET_DIVIDER.color,
    transform: [{ translateX: -CREATE_TICKET_DIVIDER.width * scaleX / 2 }],
  },
  aiButtonSection: {
    position: 'relative',
  },
  aiButtonContainer: {
    position: 'absolute',
    width: CREATE_TICKET_AI_BUTTON.container.width * scaleX,
    height: CREATE_TICKET_AI_BUTTON.container.height * scaleX,
    transform: [{ translateX: -CREATE_TICKET_AI_BUTTON.container.width * scaleX / 2 }],
  },
  aiButton: {
    position: 'absolute',
    left: CREATE_TICKET_AI_BUTTON.button.left,
    top: CREATE_TICKET_AI_BUTTON.button.top,
    width: CREATE_TICKET_AI_BUTTON.button.width * scaleX,
    height: CREATE_TICKET_AI_BUTTON.button.height * scaleX,
    borderRadius: CREATE_TICKET_AI_BUTTON.button.borderRadius * scaleX,
    borderWidth: CREATE_TICKET_AI_BUTTON.button.borderWidth,
    borderColor: CREATE_TICKET_AI_BUTTON.button.borderColor,
    backgroundColor: CREATE_TICKET_AI_BUTTON.button.backgroundColor,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  aiButtonText: {
    position: 'absolute',
    left: CREATE_TICKET_AI_BUTTON.text.left * scaleX,
    top: CREATE_TICKET_AI_BUTTON.text.top * scaleX,
    fontSize: CREATE_TICKET_TYPOGRAPHY.aiButtonText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '700', // Helvetica Bold
    color: CREATE_TICKET_TYPOGRAPHY.aiButtonText.color,
    width: CREATE_TICKET_AI_BUTTON.text.width * scaleX,
  },
  aiBadge: {
    position: 'absolute',
    left: CREATE_TICKET_AI_BUTTON.aiBadge.left * scaleX,
    top: CREATE_TICKET_AI_BUTTON.aiBadge.top * scaleX,
    width: CREATE_TICKET_AI_BUTTON.aiBadge.width * scaleX,
    height: CREATE_TICKET_AI_BUTTON.aiBadge.height * scaleX,
    borderRadius: CREATE_TICKET_AI_BUTTON.aiBadge.borderRadius * scaleX,
    backgroundColor: CREATE_TICKET_AI_BUTTON.aiBadge.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  aiBadgeText: {
    fontSize: CREATE_TICKET_AI_BUTTON.aiText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '700', // Helvetica Bold
    color: CREATE_TICKET_AI_BUTTON.aiText.gradientStart, // Using gradient start color (full gradient requires react-native-svg)
    textAlign: 'center',
    width: CREATE_TICKET_AI_BUTTON.aiText.width * scaleX,
  },
  betaLabel: {
    position: 'absolute',
    fontSize: CREATE_TICKET_TYPOGRAPHY.betaLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '700', // Helvetica Bold
    color: CREATE_TICKET_TYPOGRAPHY.betaLabel.color,
    width: CREATE_TICKET_AI_BUTTON.betaLabel.width * scaleX,
    textAlign: 'center',
    transform: [{ translateX: -CREATE_TICKET_AI_BUTTON.betaLabel.width * scaleX / 2 }],
  },
  description: {
    position: 'absolute',
    fontSize: CREATE_TICKET_TYPOGRAPHY.description.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary, // Helvetica Light
    fontWeight: '300', // Helvetica Light (not Inter Light)
    color: CREATE_TICKET_TYPOGRAPHY.description.color,
    textAlign: CREATE_TICKET_AI_BUTTON.description.textAlign as any,
    lineHeight: CREATE_TICKET_TYPOGRAPHY.description.lineHeight === 'normal'
      ? undefined
      : (CREATE_TICKET_TYPOGRAPHY.description.fontSize * 1.2) * scaleX,
    transform: [{ translateX: -CREATE_TICKET_AI_BUTTON.description.width * scaleX / 2 }],
  },
});

