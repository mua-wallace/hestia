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
import * as ImagePicker from 'expo-image-picker';
import { typography } from '../../theme';
import { CONTENT_AREA, scaleX } from '../../constants/roomDetailStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;

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
  engineering: require('../../../assets/icons/engineering.png'),
  hskPortier: require('../../../assets/icons/hsk-portier.png'),
  inRoomDining: require('../../../assets/icons/in-room-dining.png'),
  laundry: require('../../../assets/icons/laundry-icon.png'),
  concierge: require('../../../assets/icons/concierge.png'),
  reception: require('../../../assets/icons/reception.png'),
  it: require('../../../assets/icons/it.png'),
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

interface RoomTicketsSectionProps {
  roomNumber: string;
  onSubmit?: (ticketData: {
    departmentId: DepartmentId;
    issue: string;
    location: string;
    description: string;
    priority: Priority | null;
    pictures: string[];
  }) => void;
}

export default function RoomTicketsSection({
  roomNumber,
  onSubmit,
}: RoomTicketsSectionProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentId>('engineering');
  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState(roomNumber);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority | null>(null);
  const [pictures, setPictures] = useState<string[]>([]);

  const handleDepartmentPress = (departmentId: DepartmentId) => {
    setSelectedDepartment(departmentId);
  };

  const handlePriorityPress = (selectedPriority: Priority) => {
    setPriority(selectedPriority === priority ? null : selectedPriority);
  };

  const handleAddPicture = async () => {
    try {
      Alert.alert(
        'Add Picture',
        'Choose an option',
        [
          {
            text: 'Camera',
            onPress: async () => {
              try {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Permission needed', 'We need camera permissions to take pictures.');
                  return;
                }
                const result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: false,
                  quality: 0.8,
                });
                if (!result.canceled && result.assets && result.assets[0]) {
                  setPictures([...pictures, result.assets[0].uri]);
                }
              } catch (error) {
                console.error('Camera error:', error);
                Alert.alert('Error', 'Failed to open camera. Please try again.');
              }
            },
          },
          {
            text: 'Gallery',
            onPress: async () => {
              try {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Permission needed', 'We need camera roll permissions to add pictures.');
                  return;
                }
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: false,
                  quality: 0.8,
                });
                if (!result.canceled && result.assets && result.assets[0]) {
                  setPictures([...pictures, result.assets[0].uri]);
                }
              } catch (error) {
                console.error('Gallery error:', error);
                Alert.alert('Error', 'Failed to open gallery. Please try again.');
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
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open image picker. Please try again.');
    }
  };

  const handleRemovePicture = (index: number) => {
    const newPictures = pictures.filter((_, i) => i !== index);
    setPictures(newPictures);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        departmentId: selectedDepartment,
        issue,
        location,
        description,
        priority,
        pictures,
      });
    }
    console.log('Submit ticket', {
      departmentId: selectedDepartment,
      issue,
      location,
      description,
      priority,
      pictures,
    });
  };

  const selectedDepartmentName = DEPARTMENT_NAMES[selectedDepartment];
  const selectedDepartmentIcon = DEPARTMENT_ICONS[selectedDepartment];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Department Title */}
        <Text style={styles.departmentTitle}>{selectedDepartmentName}</Text>

        {/* Department Icons - Horizontal Scrollable */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.departmentsContainer}
        >
          {ALL_DEPARTMENTS.map((deptId) => {
            const isSelected = deptId === selectedDepartment;
            return (
              <TouchableOpacity
                key={deptId}
                style={[styles.departmentIconContainer, isSelected && styles.departmentIconSelected]}
                onPress={() => handleDepartmentPress(deptId)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.departmentIconBackground,
                    isSelected && styles.departmentIconBackgroundSelected,
                  ]}
                >
                  <Image
                    source={DEPARTMENT_ICONS[deptId]}
                    style={[
                      styles.departmentIcon,
                      // Some icons don't need tint (like hskPortier, inRoomDining)
                      (deptId === 'hskPortier' || deptId === 'inRoomDining')
                        ? {}
                        : { tintColor: isSelected ? '#F92424' : '#F92424', opacity: isSelected ? 1 : 0.29 },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Issue Field */}
        <Text style={styles.label}>Issue</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="What's the issue? (e.g., Broken Shower)"
            placeholderTextColor="#5a759d"
            value={issue}
            onChangeText={setIssue}
          />
        </View>

        {/* Location Field */}
        <Text style={styles.label}>Location</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Where is it located? (e.g., Room 201)"
            placeholderTextColor="#5a759d"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Pictures Section */}
        <Text style={styles.label}>Pictures</Text>
        {pictures.length === 0 ? (
          <TouchableOpacity
            style={styles.addPhotoCard}
            onPress={handleAddPicture}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/icons/add-photos.png')}
              style={styles.addPhotoIcon}
              resizeMode="contain"
            />
            <Text style={styles.addPhotoText}>Add photos</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.picturesContainer}>
            {pictures.map((uri, index) => (
              <View key={index} style={styles.pictureWrapper}>
                <Image source={{ uri }} style={styles.picture} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removePictureButton}
                  onPress={() => handleRemovePicture(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removePictureText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {pictures.length < 10 && (
              <TouchableOpacity
                style={styles.addMorePhotoButton}
                onPress={handleAddPicture}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../../../assets/icons/add-photos.png')}
                  style={styles.addMorePhotoIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Description Field */}
        <Text style={styles.label}>Description</Text>
        <View style={styles.descriptionContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Add more details about the issue... (e.g., Guest unable to use shower normally)"
            placeholderTextColor="#494747"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Assign to (Optional) */}
        <Text style={styles.label}>Assign to (Optional)</Text>
        <TouchableOpacity
          style={styles.assignToButton}
          onPress={() => {
            // TODO: Open assign to modal
            console.log('Assign to pressed');
          }}
          activeOpacity={0.7}
        >
          <View style={styles.assignToIconContainer}>
            <Text style={styles.assignToIconText}>+</Text>
          </View>
          <Text style={styles.assignToText}>Tag people to the ticket</Text>
        </TouchableOpacity>

        {/* Priority */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          <TouchableOpacity
            style={[styles.priorityOption, priority === 'urgent' && styles.priorityOptionSelected]}
            onPress={() => handlePriorityPress('urgent')}
            activeOpacity={0.7}
          >
            <View style={[styles.priorityIndicator, styles.priorityUrgent]} />
            <Text style={styles.priorityText}>Urgent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priorityOption, priority === 'medium' && styles.priorityOptionSelected]}
            onPress={() => handlePriorityPress('medium')}
            activeOpacity={0.7}
          >
            <View style={[styles.priorityIndicator, styles.priorityMedium]} />
            <Text style={styles.priorityText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priorityOption, priority === 'notUrgent' && styles.priorityOptionSelected]}
            onPress={() => handlePriorityPress('notUrgent')}
            activeOpacity={0.7}
          >
            <View style={[styles.priorityIndicator, styles.priorityNotUrgent]} />
            <Text style={styles.priorityText}>Not Urgent</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, (!issue || !location) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!issue || !location}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: CONTENT_AREA.top * scaleX,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20 * scaleX,
    paddingTop: 20 * scaleX,
    paddingBottom: 40 * scaleX,
  },
  departmentTitle: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'bold' as any,
    color: '#F92424',
    marginBottom: 16 * scaleX,
  },
  departmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12 * scaleX,
    marginBottom: 24 * scaleX,
  },
  departmentIconContainer: {
    marginRight: 16 * scaleX,
  },
  departmentIconSelected: {
    // Selected state styling
  },
  departmentIconBackground: {
    width: 56 * scaleX,
    height: 56 * scaleX,
    borderRadius: 28 * scaleX,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F92424',
    opacity: 0.29,
  },
  departmentIconBackgroundSelected: {
    backgroundColor: '#F92424',
    opacity: 1,
    borderColor: '#F92424',
  },
  departmentIcon: {
    width: 28 * scaleX,
    height: 28 * scaleX,
  },
  label: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'bold' as any,
    color: '#000000',
    marginTop: 20 * scaleX,
    marginBottom: 8 * scaleX,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8 * scaleX,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 12 * scaleX,
    minHeight: 44 * scaleX,
  },
  input: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: '#000000',
  },
  addPhotoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8 * scaleX,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    padding: 24 * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120 * scaleX,
  },
  addPhotoIcon: {
    width: 32 * scaleX,
    height: 32 * scaleX,
    marginBottom: 8 * scaleX,
  },
  addPhotoText: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: '#666666',
  },
  picturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12 * scaleX,
    justifyContent: 'flex-start',
  },
  pictureWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: 100 * scaleX,
    maxWidth: '48%', // Allow 2 per row with spacing
    aspectRatio: 1,
    borderRadius: 8 * scaleX,
    overflow: 'hidden',
    marginRight: 12 * scaleX,
    marginBottom: 12 * scaleX,
  },
  picture: {
    width: '100%',
    height: '100%',
  },
  removePictureButton: {
    position: 'absolute',
    top: 4 * scaleX,
    right: 4 * scaleX,
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
    fontWeight: 'bold' as any,
  },
  addMorePhotoButton: {
    flex: 1,
    minWidth: 100 * scaleX,
    maxWidth: '48%', // Allow 2 per row with spacing
    aspectRatio: 1,
    borderRadius: 8 * scaleX,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12 * scaleX,
  },
  addMorePhotoIcon: {
    width: 24 * scaleX,
    height: 24 * scaleX,
    tintColor: '#5a759d',
  },
  descriptionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8 * scaleX,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 12 * scaleX,
    minHeight: 100 * scaleX,
  },
  descriptionInput: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: '#000000',
    minHeight: 80 * scaleX,
  },
  assignToButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8 * scaleX,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 12 * scaleX,
    minHeight: 44 * scaleX,
  },
  assignToIconContainer: {
    width: 24 * scaleX,
    height: 24 * scaleX,
    borderRadius: 12 * scaleX,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12 * scaleX,
  },
  assignToIconText: {
    fontSize: 18 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'bold' as any,
    color: '#666666',
  },
  assignToText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: '#666666',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 16 * scaleX,
    marginBottom: 24 * scaleX,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8 * scaleX,
  },
  priorityOptionSelected: {
    // Selected state styling
  },
  priorityIndicator: {
    width: 20 * scaleX,
    height: 20 * scaleX,
    borderRadius: 10 * scaleX,
    marginRight: 8 * scaleX,
  },
  priorityUrgent: {
    backgroundColor: '#F92424',
  },
  priorityMedium: {
    backgroundColor: '#F0BE1B',
  },
  priorityNotUrgent: {
    backgroundColor: '#999999',
  },
  priorityText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: '#000000',
  },
  submitButton: {
    width: '100%',
    height: 50 * scaleX,
    backgroundColor: '#5a759d',
    borderRadius: 8 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24 * scaleX,
  },
  submitButtonDisabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'bold' as any,
    color: '#ffffff',
  },
});
