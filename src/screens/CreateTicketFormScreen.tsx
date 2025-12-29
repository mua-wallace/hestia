import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

type CreateTicketFormScreenRouteProp = RouteProp<RootStackParamList, 'CreateTicketForm'>;
type CreateTicketFormScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateTicketForm'
>;

type DepartmentId =
  | 'engineering'
  | 'hskPortier'
  | 'inRoomDining'
  | 'laundry'
  | 'concierge'
  | 'reception'
  | 'it';

const DEPARTMENT_NAMES: Record<DepartmentId, string> = {
  engineering: 'Engineering Department',
  hskPortier: 'HSK Portier Department',
  inRoomDining: 'In Room Dining Department',
  laundry: 'Laundry Department',
  concierge: 'Concierge Department',
  reception: 'Reception Department',
  it: 'IT Department',
};

const DEPARTMENT_ICONS: Record<DepartmentId, any> = {
  engineering: require('../../assets/icons/engineering.png'),
  hskPortier: require('../../assets/icons/hsk-portier.png'),
  inRoomDining: require('../../assets/icons/in-room-dining.png'),
  laundry: require('../../assets/icons/laundry-icon.png'),
  concierge: require('../../assets/icons/concierge.png'),
  reception: require('../../assets/icons/reception.png'),
  it: require('../../assets/icons/it.png'),
};

const ALL_DEPARTMENTS: DepartmentId[] = [
  'engineering',
  'hskPortier',
  'inRoomDining',
  'laundry',
  'concierge',
  'reception',
  'it',
];

type Priority = 'urgent' | 'medium' | 'notUrgent';

export default function CreateTicketFormScreen() {
  const navigation = useNavigation<CreateTicketFormScreenNavigationProp>();
  const route = useRoute<CreateTicketFormScreenRouteProp>();
  const departmentId = route.params?.departmentId || 'engineering';

  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority | null>(null);
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [pictures, setPictures] = useState<string[]>([]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePriorityPress = (selectedPriority: Priority) => {
    setPriority(selectedPriority === priority ? null : selectedPriority);
  };

  const handleAssignPress = () => {
    // TODO: Open assign to modal/selector
    console.log('Assign to pressed');
  };

  const handleAddPicture = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to add pictures.');
      return;
    }

    // Show action sheet to choose camera or gallery
    Alert.alert(
      'Add Picture',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus.status !== 'granted') {
              Alert.alert('Permission needed', 'We need camera permissions to take photos.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: false, // No cropping - use full picture
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              setPictures([...pictures, result.assets[0].uri]);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: false, // No cropping - use full picture
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              setPictures([...pictures, result.assets[0].uri]);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemovePicture = (index: number) => {
    const newPictures = pictures.filter((_, i) => i !== index);
    setPictures(newPictures);
  };

  const handleSubmit = () => {
    // TODO: Submit ticket
    console.log('Submit ticket', {
      departmentId,
      issue,
      location,
      description,
      priority,
      assignedTo,
    });
  };

  const selectedDepartmentName = DEPARTMENT_NAMES[departmentId];
  const selectedDepartmentIcon = DEPARTMENT_ICONS[departmentId];

  // Calculate the bottom position of description field dynamically
  const getDescriptionBottom = () => {
    let descriptionTop: number;
    
    if (pictures.length === 0) {
      // No pictures: description starts at 796 (after add-photo card at 620 + 156 + 20 margin)
      descriptionTop = 796;
    } else {
      // With pictures: calculate based on pictures section
      const picturesBottom = pictures.length === 1
        ? 620 + 156 + 30 + 80 // Below add-photo button (30px margin + 80px for button height)
        : 620 + Math.ceil(pictures.length / 2) * (156 + 14) + 30 + 80;
      descriptionTop = Math.max(796, picturesBottom + 20);
    }
    
    // Description label is at descriptionTop, text container is at descriptionTop + 26
    // Estimate description height (min 32px, but can be more with multiline)
    // Use a reasonable estimate: 32px minimum + some padding
    const descriptionHeight = 32 + 20; // minHeight + padding
    return descriptionTop + 26 + descriptionHeight; // label top + label-to-text gap + text height
  };

  const descriptionBottom = getDescriptionBottom();
  const assignToTop = descriptionBottom + 20; // 20px margin after description
  const assignButtonTop = assignToTop + 45.084; // Button center aligned (1012.084 - 967 = 45.084)
  const assignHintTop = assignToTop + 53; // Hint text (1020 - 967 = 53)
  const priorityTop = assignToTop + 110; // 110px after Assign to label (1077 - 967 = 110)
  const priorityOptionsTop = priorityTop + 41; // Options below label (1118 - 1077 = 41)

  return (
    <View style={styles.container}>
      {/* Header Background */}
      <View style={styles.headerBackground} />

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
          <Text style={styles.headerTitle}>Back</Text>
        </View>

        {/* Department Title */}
        <Text style={styles.departmentTitle}>{selectedDepartmentName}</Text>

        {/* Selected Department Icon */}
        <View style={styles.selectedIconContainer}>
          <Image
            source={selectedDepartmentIcon}
            style={styles.selectedIcon}
            resizeMode="contain"
          />
        </View>

        {/* Other Department Icons (Inactive) */}
        <View style={styles.otherIconsContainer}>
          {ALL_DEPARTMENTS.filter(id => id !== departmentId).slice(0, 4).map((id, index) => (
            <View key={id} style={[styles.otherIconContainer, { left: 130 + index * 80 }]}>
              <View style={styles.otherIconBackground}>
                <Image
                  source={DEPARTMENT_ICONS[id]}
                  style={styles.otherIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Curved Background Shape - From Figma: Union at left=12, top=280.08, width=416, height=900.918 */}
        <View style={styles.curvedBackground} />

        {/* Form Fields - Using absolute positioning to match Figma */}
        {/* Issue Field */}
        <Text style={styles.issueLabel}>Issue</Text>
        <View style={styles.issueInputContainer}>
          <TextInput
            style={styles.issueInput}
            placeholder="What's the issue? (e.g., Broken Shower)"
            placeholderTextColor="#5a759d"
            value={issue}
            onChangeText={setIssue}
          />
        </View>

        {/* Location Field */}
        <Text style={styles.locationLabel}>Location</Text>
        <View style={styles.locationInputContainer}>
          <TextInput
            style={styles.locationInput}
            placeholder="Where is it located? (e.g., Room 201)"
            placeholderTextColor="#5a759d"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Description Field */}
        <Text
          style={[
            styles.descriptionLabel,
            {
              top: (() => {
                if (pictures.length === 0) {
                  return 796 * scaleX; // After add-photo card
                }
                const picturesBottom = pictures.length === 1
                  ? 620 + 156 + 30 + 80
                  : 620 + Math.ceil(pictures.length / 2) * (156 + 14) + 30 + 80;
                return Math.max(796, picturesBottom + 20) * scaleX;
              })(),
            },
          ]}
        >
          Description
        </Text>
        <View
          style={[
            styles.descriptionTextContainer,
            {
              top: (() => {
                if (pictures.length === 0) {
                  return 822 * scaleX; // 796 + 26
                }
                const picturesBottom = pictures.length === 1
                  ? 620 + 156 + 30 + 80
                  : 620 + Math.ceil(pictures.length / 2) * (156 + 14) + 30 + 80;
                return (Math.max(796, picturesBottom + 20) + 26) * scaleX;
              })(),
            },
          ]}
        >
          <TextInput
            style={styles.descriptionText}
            placeholder="Add more details about the issue... (e.g., Guest unable to use shower normally)"
            placeholderTextColor="#494747"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Pictures Section */}
        <Text style={styles.picturesLabel}>Pictures</Text>
        {pictures.length === 0 ? (
          // No pictures - show full-width card with add-photo icon and description
          <TouchableOpacity
            style={styles.addPhotoCardEmpty}
            onPress={handleAddPicture}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/icons/add-photos.png')}
              style={styles.addPhotoIcon}
              resizeMode="contain"
            />
            <Text style={styles.addPhotoDescription}>
              Tap to add photos from camera or gallery
            </Text>
          </TouchableOpacity>
        ) : pictures.length === 1 ? (
          // One picture - full width
          <View style={styles.pictureSingleContainer}>
            <Image source={{ uri: pictures[0] }} style={styles.pictureImageFull} resizeMode="cover" />
            <TouchableOpacity
              style={styles.removePictureButton}
              onPress={() => handleRemovePicture(0)}
              activeOpacity={0.7}
            >
              <Text style={styles.removePictureText}>×</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Two or more pictures - 2-column grid
          <>
            {pictures.map((picture, index) => {
              const row = Math.floor(index / 2);
              const col = index % 2;
              const top = 620 * scaleX + row * (156 + 14) * scaleX; // 156px height + 14px gap
              const left = 26 * scaleX + col * (183 + 14) * scaleX; // 183px width + 14px gap
              return (
                <View key={index} style={[styles.pictureGridContainer, { top, left }]}>
                  <Image source={{ uri: picture }} style={styles.pictureImage} resizeMode="cover" />
                  <TouchableOpacity
                    style={styles.removePictureButton}
                    onPress={() => handleRemovePicture(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.removePictureText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}
        {/* Add photo button below pictures when there are pictures */}
        {pictures.length > 0 && (
          <TouchableOpacity
            style={[
              styles.addPhotoButtonBelow,
              {
                top: (() => {
                  // Calculate position below pictures with 30px margin
                  return (pictures.length === 1
                    ? 620 + 156 + 30 // Below single full-width picture with margin (30px)
                    : 620 + Math.ceil(pictures.length / 2) * (156 + 14) + 30) * scaleX; // Below grid with margin (30px)
                })(),
              },
            ]}
            onPress={handleAddPicture}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/icons/add-photos.png')}
              style={styles.addPhotoIcon}
              resizeMode="contain"
            />
            <Text style={styles.addMorePhotosText}>Add more pictures/photos</Text>
          </TouchableOpacity>
        )}

        {/* Assign To Section - Dynamically positioned after description */}
        <Text
          style={[
            styles.assignToLabel,
            { top: assignToTop * scaleX },
          ]}
        >
          Assign to (Optional)
        </Text>
        <TouchableOpacity
          style={[
            styles.assignButton,
            { top: assignButtonTop * scaleX },
          ]}
          onPress={handleAssignPress}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../assets/icons/plus.png')}
            style={styles.assignButtonIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.assignHint,
            { top: assignHintTop * scaleX },
          ]}
        >
          Tag people to the ticket
        </Text>

        {/* Priority Section - Dynamically positioned after Assign to */}
        <Text
          style={[
            styles.priorityLabel,
            { top: priorityTop * scaleX },
          ]}
        >
          Priority
        </Text>
        <TouchableOpacity
          style={[
            styles.priorityUrgent,
            { top: priorityOptionsTop * scaleX },
          ]}
          onPress={() => handlePriorityPress('urgent')}
          activeOpacity={0.7}
        >
          <View style={[styles.priorityIndicator, styles.priorityIndicatorUrgent]} />
          <Text
            style={[
              styles.priorityText,
              priority === 'urgent' && styles.priorityTextSelected,
            ]}
          >
            Urgent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.priorityMedium,
            { top: priorityOptionsTop * scaleX },
          ]}
          onPress={() => handlePriorityPress('medium')}
          activeOpacity={0.7}
        >
          <View style={[styles.priorityIndicator, styles.priorityIndicatorMedium]} />
          <Text
            style={[
              styles.priorityText,
              priority === 'medium' && styles.priorityTextSelected,
            ]}
          >
            Medium
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.priorityNotUrgent,
            { top: priorityOptionsTop * scaleX },
          ]}
          onPress={() => handlePriorityPress('notUrgent')}
          activeOpacity={0.7}
        >
          <View style={[styles.priorityIndicator, styles.priorityIndicatorNotUrgent]} />
          <Text
            style={[
              styles.priorityText,
              priority === 'notUrgent' && styles.priorityTextSelected,
            ]}
          >
            Not Urgent
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerBackground: {
    position: 'absolute',
    top: -6 * scaleX,
    left: 0,
    right: 0,
    height: 133 * scaleX,
    backgroundColor: '#e4eefe',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 1500 * scaleX, // Increased to accommodate dynamic picture layouts
  },
  header: {
    height: 133 * scaleX,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 28 * scaleX,
    top: 63 * scaleX,
    width: 28 * scaleX,
    height: 28 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backArrow: {
    width: 14 * scaleX,
    height: 14 * scaleX,
    transform: [{ rotate: '270deg' }],
  },
  headerTitle: {
    position: 'absolute',
    left: (SCREEN_WIDTH / 2) - (158 * scaleX),
    top: 63 * scaleX,
    fontSize: 24 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700' as any,
    color: '#607aa1',
  },
  departmentTitle: {
    position: 'absolute',
    left: (SCREEN_WIDTH / 2) - (196 * scaleX),
    top: 160 * scaleX,
    fontSize: 17 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '400' as any,
    color: '#f92424',
  },
  selectedIconContainer: {
    position: 'absolute',
    left: 50 * scaleX,
    top: 208 * scaleX,
    width: 55.482 * scaleX,
    height: 55.482 * scaleX,
    borderRadius: 37 * scaleX,
    backgroundColor: '#ffebeb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    width: (55.482 * 0.65) * scaleX,
    height: (55.482 * 0.65) * scaleX,
    tintColor: '#F92424',
  },
  otherIconsContainer: {
    position: 'absolute',
    top: 208 * scaleX,
  },
  otherIconContainer: {
    position: 'absolute',
    width: 55.482 * scaleX,
    height: 55.482 * scaleX,
  },
  otherIconBackground: {
    width: 55.482 * scaleX,
    height: 55.482 * scaleX,
    borderRadius: 37 * scaleX,
    backgroundColor: '#ffebeb',
    opacity: 0.29,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherIcon: {
    width: (55.482 * 0.65) * scaleX,
    height: (55.482 * 0.65) * scaleX,
    opacity: 0.29,
  },
  // Curved Background Shape - From Figma: Union at left=12, top=280.08, width=416, height=900.918
  curvedBackground: {
    position: 'absolute',
    left: 12 * scaleX,
    top: 280.08 * scaleX,
    width: 416 * scaleX,
    height: 900.918 * scaleX,
    backgroundColor: '#ffffff',
    borderRadius: 20 * scaleX, // Approximate rounded corners
    borderTopLeftRadius: 40 * scaleX, // More curved top-left
    borderTopRightRadius: 40 * scaleX, // More curved top-right
    transform: [{ rotate: '180deg' }, { scaleY: -1 }], // Rotate 180deg and flip vertically
  },
  // Issue Field - From Figma: label at x=26, y=325; input at x=26, y=355, width=388, height=68
  issueLabel: {
    position: 'absolute',
    left: 26 * scaleX,
    top: 325 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.secondary,
    fontWeight: '300' as any,
    color: '#000000',
  },
  issueInputContainer: {
    position: 'absolute',
    left: (SCREEN_WIDTH / 2) - (194 * scaleX), // Centered: 388/2 = 194
    top: 355 * scaleX,
    width: 388 * scaleX,
    height: 68 * scaleX,
    borderWidth: 1,
    borderColor: '#afa9ad',
    borderRadius: 8 * scaleX,
    justifyContent: 'center',
    paddingHorizontal: 16 * scaleX,
  },
  issueInput: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '400' as any,
    color: '#5a759d',
    textAlign: 'left',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  // Location Field - From Figma: label at x=26, y=457; input at x=26, y=492, width=388, height=68
  locationLabel: {
    position: 'absolute',
    left: 26 * scaleX,
    top: 457 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.secondary,
    fontWeight: '300' as any,
    color: '#000000',
  },
  locationInputContainer: {
    position: 'absolute',
    left: (SCREEN_WIDTH / 2) - (194 * scaleX), // Centered: 388/2 = 194
    top: 492 * scaleX,
    width: 388 * scaleX,
    height: 68 * scaleX,
    borderWidth: 1,
    borderColor: '#afa9ad',
    borderRadius: 8 * scaleX,
    justifyContent: 'center',
    paddingHorizontal: 16 * scaleX,
  },
  locationInput: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '400' as any,
    color: '#5a759d',
    textAlign: 'left',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  // Description Field - From Figma: label at x=26, y=862; text at x=26, y=888, width=332
  // When no pictures, position closer to pictures section (620 + 156 + 20 = 796)
  descriptionLabel: {
    position: 'absolute',
    left: 26 * scaleX,
    top: 796 * scaleX, // Reduced from 862 when no pictures (620 + 156 + 20 margin)
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700' as any,
    color: '#1e1e1e',
  },
  descriptionTextContainer: {
    position: 'absolute',
    left: 26 * scaleX,
    top: 822 * scaleX, // Reduced from 888 when no pictures (796 + 26 for label spacing)
    width: 332 * scaleX,
    minHeight: 32 * scaleX,
  },
  descriptionText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300' as any,
    color: '#494747',
    textAlignVertical: 'top',
  },
  // Pictures Section - From Figma: label at x=26, y=591; images at x=26, y=620 and x=223, y=620, width=183, height=156
  picturesLabel: {
    position: 'absolute',
    left: 26 * scaleX,
    top: 591 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.secondary,
    fontWeight: '300' as any,
    color: '#000000',
  },
  // Pictures Section - Dynamic layout
  addPhotoCardEmpty: {
    position: 'absolute',
    left: (SCREEN_WIDTH / 2) - (194 * scaleX), // Centered: 388/2 = 194
    top: 620 * scaleX,
    width: 388 * scaleX,
    minHeight: 156 * scaleX,
    borderRadius: 11 * scaleX,
    backgroundColor: '#e3e3e3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24 * scaleX,
    paddingHorizontal: 16 * scaleX,
  },
  addPhotoDescription: {
    marginTop: 12 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300' as any,
    color: '#494747',
    textAlign: 'center',
  },
  pictureSingleContainer: {
    position: 'absolute',
    left: (SCREEN_WIDTH / 2) - (194 * scaleX), // Centered: 388/2 = 194
    top: 620 * scaleX,
    width: 388 * scaleX,
    height: 156 * scaleX,
    borderRadius: 11 * scaleX,
    overflow: 'hidden',
  },
  pictureImageFull: {
    width: '100%',
    height: '100%',
  },
  pictureGridContainer: {
    position: 'absolute',
    width: 183 * scaleX,
    height: 156 * scaleX,
    borderRadius: 11 * scaleX,
    overflow: 'hidden',
  },
  pictureImage: {
    width: '100%',
    height: '100%',
  },
  removePictureButton: {
    position: 'absolute',
    top: 8 * scaleX,
    right: 8 * scaleX,
    width: 24 * scaleX,
    height: 24 * scaleX,
    borderRadius: 12 * scaleX,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePictureText: {
    color: '#ffffff',
    fontSize: 18 * scaleX,
    fontWeight: '700' as any,
    lineHeight: 20 * scaleX,
  },
  addPhotoButtonBelow: {
    position: 'absolute',
    left: 26 * scaleX,
    width: 200 * scaleX, // Wider to accommodate text
    justifyContent: 'center',
    alignItems: 'center',
    // No background, just the icon and text
  },
  addMorePhotosText: {
    marginTop: 8 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300' as any,
    color: '#494747',
    textAlign: 'center',
  },
  addPhotoIcon: {
    width: 40 * scaleX,
    height: 40 * scaleX,
  },
  // Assign To Section - From Figma: label at x=26, y=967; button at x=33, y=1011; hint at x=68, y=1020
  assignToLabel: {
    position: 'absolute',
    left: 26 * scaleX,
    top: 967 * scaleX,
    fontSize: 17 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700' as any,
    color: '#1e1e1e',
  },
  // Assign To Section - From Figma: label at x=26, y=967; button Group 328 at x=33, y=799.61, w=33, h=32.832; + text at x=33, y=1011, fontSize=25, color=white; hint at x=68, y=1020
  assignToLabel: {
    position: 'absolute',
    left: 26 * scaleX,
    top: 967 * scaleX,
    fontSize: 17 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700' as any,
    color: '#1e1e1e',
  },
  assignButton: {
    position: 'absolute',
    left: 33 * scaleX,
    top: 1012.084 * scaleX, // Centered to align with "Tag people" text center (1020 + 17/2 - 32.832/2)
    width: 32.999549865722656 * scaleX,
    height: 32.832305908203125 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3', // Light grey background from Figma
    borderRadius: 16.5 * scaleX,
  },
  assignButtonIcon: {
    width: 15 * scaleX, // From Figma + text width
    height: 29 * scaleX, // From Figma + text height
    tintColor: '#ffffff', // White icon as per Figma
  },
  assignHint: {
    position: 'absolute',
    left: 80 * scaleX, // Increased from 68 to add more spacing between icon and text
    top: 1020 * scaleX,
    fontSize: 15 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300' as any,
    color: '#494747',
    lineHeight: 17 * scaleX, // Match text height from Figma
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  // Priority Section - From Figma: label at x=26, y=1077, fontSize=17, fontWeight=700; options at y=1118, x=55, 167, 285, fontSize=15, fontWeight=300
  priorityLabel: {
    position: 'absolute',
    left: 26 * scaleX,
    top: 1077 * scaleX,
    fontSize: 17 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700' as any,
    color: '#1e1e1e',
  },
  priorityUrgent: {
    position: 'absolute',
    left: 23 * scaleX, // Text at x=55, circle (24px) + margin (8px) = 32px, so container at 55-32=23
    top: 1118 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityMedium: {
    position: 'absolute',
    left: 135 * scaleX, // Text at x=167, so 167 - 32 (circle + margin) = 135
    top: 1118 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityNotUrgent: {
    position: 'absolute',
    left: 253 * scaleX, // Text at x=285, so 285 - 32 (circle + margin) = 253
    top: 1118 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 24 * scaleX, // Doubled from 12px
    height: 24 * scaleX, // Doubled from 12px
    borderRadius: 12 * scaleX, // Doubled from 6px
    marginRight: 8 * scaleX,
  },
  priorityIndicatorUrgent: {
    backgroundColor: '#f92424', // Red - matches Figma
  },
  priorityIndicatorMedium: {
    backgroundColor: '#ffc107', // Yellow/Amber - matches Figma
  },
  priorityIndicatorNotUrgent: {
    backgroundColor: '#d3d3d3', // Light grey - matches Figma
  },
  priorityText: {
    fontSize: 15 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300' as any,
    color: '#494747',
  },
  priorityTextSelected: {
    fontSize: 15 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700' as any,
    color: '#f92424',
  },
});

