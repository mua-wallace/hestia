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
import TicketCard from '../tickets/TicketCard';
import { TicketData } from '../../types/tickets.types';

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

  // Mock current ticket for the room - in real app, this would come from props or API
  const currentTicket: TicketData = {
    id: 'current-ticket-1',
    title: 'TV not working',
    description: 'Guess could not connect the TV with chrome cast, kindly assist',
    roomNumber: roomNumber,
    dueTime: '10 mins',
    createdBy: {
      name: 'Stella Kitou',
      avatar: require('../../../assets/icons/profile-avatar.png'),
    },
    status: 'unsolved',
    locationIcon: require('../../../assets/icons/location.png'),
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Ticket Section */}
        <Text style={[styles.sectionTitle, styles.firstSectionTitle]}>Current Ticket</Text>
        <View style={styles.currentTicketContainer}>
          <View style={styles.ticketCardWrapper}>
            <TicketCard
              ticket={currentTicket}
              onPress={() => {
                // TODO: Navigate to ticket detail
                console.log('Current ticket pressed');
              }}
              onStatusPress={() => {
                // TODO: Handle status change
                console.log('Current ticket status pressed');
              }}
            />
          </View>
        </View>

        {/* Create a ticket Section */}
        <Text style={styles.sectionTitle}>Create a ticket</Text>
        <View style={styles.createTicketContent}>
          <Text style={styles.departmentSubtitle}>Select Department</Text>

        {/* Department Icons - 3-column Grid Layout */}
        <View style={styles.departmentsGridContainer}>
          {ALL_DEPARTMENTS.map((deptId) => {
            const isSelected = deptId === selectedDepartment;
            // Calculate grid position: 3 columns
            const index = ALL_DEPARTMENTS.indexOf(deptId);
            const row = Math.floor(index / 3);
            const col = index % 3;
            
            // Department names for labels
            const departmentLabels: Record<DepartmentId, string> = {
              engineering: 'Engineering',
              hskPortier: 'HSK Portier',
              inRoomDining: 'In Room Dining',
              laundry: 'Laundry',
              concierge: 'Concierge',
              reception: 'Reception',
              it: 'IT',
            };
            
            return (
              <View
                key={deptId}
                style={[
                  styles.departmentGridItem,
                  {
                    marginRight: col < 2 ? 16 * scaleX : 0, // Margin between columns
                    marginBottom: 24 * scaleX, // Margin between rows
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.departmentIconContainer}
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
                          : { tintColor: '#F92424' },
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
                {/* Department Label */}
                <Text style={styles.departmentLabelText}>
                  {departmentLabels[deptId]}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* AI Create Ticket Button Section */}
        <View style={styles.aiButtonSection}>
          {/* Button Container */}
          <TouchableOpacity
            style={styles.aiButtonContainer}
            onPress={() => {
              // TODO: Implement AI ticket creation
              console.log('AI Create Ticket pressed');
            }}
            activeOpacity={0.7}
          >
            {/* Button */}
            <View style={styles.aiButton}>
              {/* Button Text */}
              <Text style={styles.aiButtonText}>Create Ticket</Text>

              {/* AI Badge */}
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Beta Label */}
          <Text style={styles.betaLabel}>BETA</Text>

          {/* Description */}
          <Text style={styles.aiDescription}>
            AI detects issues and auto-creates tickets for the right department no manual reporting needed.
          </Text>
        </View>

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
            {pictures.map((uri, index) => {
              // Always use 2-column grid layout
              const row = Math.floor(index / 2);
              const col = index % 2;
              return (
                <View 
                  key={index} 
                  style={[
                    styles.pictureWrapperGrid,
                    {
                      marginRight: col === 0 ? 12 * scaleX : 0, // Add margin only to left column
                    }
                  ]}
                >
                  <Image source={{ uri }} style={styles.picture} resizeMode="cover" />
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
            {pictures.length < 10 && (
              <TouchableOpacity
                style={[
                  styles.addMorePhotoButtonGrid,
                  {
                    marginRight: (pictures.length % 2) === 0 ? 12 * scaleX : 0, // Add margin only to left column
                  }
                ]}
                onPress={handleAddPicture}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../../../assets/icons/add-photos.png')}
                  style={styles.addMorePhotoIcon}
                  resizeMode="contain"
                />
                <Text style={styles.addMorePhotoText}>Add more</Text>
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
        </View>
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
  sectionTitle: {
    fontSize: 20 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'bold' as any,
    color: '#000000',
    marginTop: 24 * scaleX,
    marginBottom: 16 * scaleX,
  },
  firstSectionTitle: {
    marginTop: 0, // No top margin for first section
  },
  currentTicketContainer: {
    marginBottom: 32 * scaleX,
    width: '100%',
    alignItems: 'center',
  },
  ticketCardWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -20 * scaleX, // Negative margin to offset parent padding
    marginRight: -20 * scaleX, // Negative margin to offset parent padding
  },
  noTicketContainer: {
    backgroundColor: '#f9fafc',
    borderRadius: 9 * scaleX,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    padding: 24 * scaleX,
    alignItems: 'center',
    marginBottom: 32 * scaleX,
  },
  noTicketText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: '#666666',
  },
  createTicketContent: {
    // No extra padding needed, scrollContent already has padding
  },
  departmentSubtitle: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'bold' as any,
    color: '#000000',
    marginBottom: 16 * scaleX,
  },
  departmentTitle: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'bold' as any,
    color: '#F92424',
    marginBottom: 16 * scaleX,
  },
  departmentsGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32 * scaleX,
    justifyContent: 'flex-start',
  },
  departmentGridItem: {
    width: (SCREEN_WIDTH - 40 * scaleX - 32 * scaleX) / 3, // Screen width - padding - margins / 3 columns
    alignItems: 'center',
  },
  departmentIconContainer: {
    marginBottom: 8 * scaleX,
  },
  departmentIconBackground: {
    width: 55.482 * scaleX, // From Figma: 55.482px
    height: 55.482 * scaleX,
    borderRadius: 37 * scaleX, // From Figma: 37px
    backgroundColor: '#ffebeb', // Light pink/red background
    borderWidth: 1 * scaleX,
    borderColor: '#F92424', // Red outline
    justifyContent: 'center',
    alignItems: 'center',
  },
  departmentIconBackgroundSelected: {
    backgroundColor: '#ffebeb', // Same background when selected
    borderWidth: 2 * scaleX, // Thicker border when selected
  },
  departmentIcon: {
    width: (55.482 * 0.65) * scaleX, // 65% of background circle size
    height: (55.482 * 0.65) * scaleX,
  },
  departmentLabelText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Inter Light
    color: '#000000',
    textAlign: 'center',
    marginTop: 4 * scaleX,
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
  pictureWrapperGrid: {
    position: 'relative',
    aspectRatio: 1,
    borderRadius: 8 * scaleX,
    overflow: 'hidden',
    marginBottom: 12 * scaleX,
    width: '48%', // Always 2-column grid
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
  addMorePhotoButtonGrid: {
    aspectRatio: 1,
    borderRadius: 8 * scaleX,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12 * scaleX,
    width: '48%', // Always 2-column grid - appears in next grid position
    paddingVertical: 16 * scaleX,
  },
  addMorePhotoText: {
    marginTop: 8 * scaleX,
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: '#666666',
    textAlign: 'center',
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
  divider: {
    width: '100%',
    height: 1 * scaleX,
    backgroundColor: '#e3e3e3',
    marginVertical: 24 * scaleX,
    marginLeft: -20 * scaleX, // Offset parent padding
    marginRight: -20 * scaleX,
  },
  aiButtonSection: {
    alignItems: 'center',
    marginBottom: 32 * scaleX,
  },
  aiButtonContainer: {
    alignItems: 'center',
    marginBottom: 8 * scaleX,
  },
  aiButton: {
    width: 152 * scaleX,
    height: 60 * scaleX,
    borderRadius: 45 * scaleX,
    borderWidth: 1 * scaleX,
    borderColor: '#ff4dd8', // Pink border
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 24 * scaleX,
    position: 'relative',
  },
  aiButtonText: {
    fontSize: 16 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700' as any,
    color: '#5a759d',
    marginTop: 22 * scaleX,
  },
  aiBadge: {
    position: 'absolute',
    left: 99 * scaleX,
    top: 44 * scaleX,
    width: 29 * scaleX,
    height: 30 * scaleX,
    borderRadius: 14.5 * scaleX,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBadgeText: {
    fontSize: 12 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700' as any,
    color: '#ff46a3', // Gradient start color (full gradient requires react-native-svg)
  },
  betaLabel: {
    fontSize: 9 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700' as any,
    color: '#ff4dd8',
    textAlign: 'center',
    marginBottom: 16 * scaleX,
  },
  aiDescription: {
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '300' as any,
    color: '#000000',
    textAlign: 'center',
    width: 318 * scaleX,
    lineHeight: undefined, // Normal line height
  },
});
