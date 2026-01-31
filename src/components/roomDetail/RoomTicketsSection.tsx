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
  const [showTicketTagDropdown, setShowTicketTagDropdown] = useState(false);
  const [selectedTicketTag, setSelectedTicketTag] = useState<string>('');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [taggedStaff, setTaggedStaff] = useState<Array<{ id: string; name: string; avatar?: any }>>([
    { id: '1', name: 'Dimotia. M' },
    { id: '2', name: 'Dimotia. M' },
  ]);

  // Ticket Tag options - can be customized based on requirements
  const ticketTagOptions = [
    'Broken Shower',
    'No Hot Water',
    'TV Not Working',
    'WiFi Issue',
    'Room Service',
    'Cleaning Request',
    'Maintenance',
    'Other',
  ];

  // Priority options
  const priorityOptions = [
    { value: 'urgent', label: 'High Priority', flags: 3, flagColor: '#F92424', bgColor: '#FEE8EC' },
    { value: 'medium', label: 'High Priority', flags: 3, flagColor: '#ffc107', bgColor: '#FFF8DD' },
    { value: 'notUrgent', label: 'Low Priority', flags: 1, flagColor: '#999999', bgColor: '#F3F3F3' },
  ];

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
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
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

        {/* Divider */}
        <View style={styles.divider} />

        {/* Select Department Section */}
        <Text style={styles.departmentSubtitle}>Select Department</Text>

        {/* Department Icons - 3-column Grid Layout - Second Instance */}
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
                key={`second-${deptId}`}
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
                    {/* Department icon - always visible */}
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
                  {/* Checkmark badge overlay when selected - positioned relative to container, overlapping top-right */}
                  {isSelected && (
                    <Image
                      source={require('../../../assets/icons/tick-department.png')}
                      style={styles.departmentCheckmarkBadge}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
                {/* Department Label */}
                <Text style={styles.departmentLabelText}>
                  {departmentLabels[deptId]}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Ticket Tag Field - Dropdown */}
        <Text style={styles.label}>Ticket Tag</Text>
        <TouchableOpacity
          style={[
            styles.inputContainer,
            showTicketTagDropdown && styles.inputContainerFocused,
          ]}
          onPress={() => setShowTicketTagDropdown(!showTicketTagDropdown)}
          activeOpacity={0.7}
        >
          <View style={styles.ticketTagContent}>
            {selectedTicketTag ? (
              <>
                <Image
                  source={require('../../../assets/icons/flag.png')}
                  style={styles.flagIcon}
                  resizeMode="contain"
                />
                <Text style={styles.ticketTagText}>{selectedTicketTag}</Text>
              </>
            ) : (
              <Text style={styles.ticketTagPlaceholder}>Add ticket tag (e.g., Broken Shower)</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Ticket Tag Dropdown Menu */}
        {showTicketTagDropdown && (
          <>
            {/* Backdrop to close dropdown when clicking outside */}
            <TouchableOpacity
              style={styles.dropdownBackdrop}
              activeOpacity={1}
              onPress={() => setShowTicketTagDropdown(false)}
            />
            <View style={styles.ticketTagDropdownMenu}>
              {ticketTagOptions.map((tag, index) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.ticketTagDropdownItem,
                    index === ticketTagOptions.length - 1 && styles.ticketTagDropdownItemLast, // Remove border from last item
                  ]}
                  onPress={() => {
                    setSelectedTicketTag(tag);
                    setIssue(tag); // Keep issue state for compatibility
                    setShowTicketTagDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={require('../../../assets/icons/flag.png')}
                    style={styles.flagIconSmall}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.ticketTagDropdownText,
                      selectedTicketTag === tag && styles.ticketTagDropdownTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>
                  {selectedTicketTag === tag && (
                    <Image
                      source={require('../../../assets/icons/tick.png')}
                      style={styles.checkmarkIcon}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

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
            <View style={styles.addPhotoIconContainer}>
              <Image
                source={require('../../../assets/icons/add-photos.png')}
                style={styles.addPhotoIcon}
                resizeMode="contain"
              />
              <View style={styles.addPhotoPlusIcon}>
                <Image
                  source={require('../../../assets/icons/plus.png')}
                  style={styles.addPhotoPlusIconImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text style={styles.addPhotoText}>Add Photo</Text>
            <Text style={styles.addPhotoSubtext}>Add photos of the item and our AI will do the rest.</Text>
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
                <View style={styles.addMorePhotoIconContainer}>
                  <Image
                    source={require('../../../assets/icons/add-photos.png')}
                    style={styles.addMorePhotoIcon}
                    resizeMode="contain"
                  />
                  <View style={styles.addMorePhotoPlusIcon}>
                    <Image
                      source={require('../../../assets/icons/plus.png')}
                      style={styles.addMorePhotoPlusIconImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <Text style={styles.addMorePhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Description Field */}
        <Text style={styles.descriptionLabel}>Description</Text>
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

        {/* Tag Staff */}
        <View style={styles.tagStaffSection}>
          <View style={styles.tagStaffCardWrapper}>
            <View style={styles.tagStaffCard}>
              <Text style={styles.tagStaffLabel}>Tag Staff</Text>
              <Text style={styles.tagStaffSubtitle}>Tag people to the ticket</Text>
              <View style={styles.tagStaffDivider} />
              <View style={styles.tagStaffContentContainer}>
                <View style={styles.tagStaffMembersContainer}>
                  {taggedStaff.map((staff) => (
                    <View key={staff.id} style={styles.tagStaffMember}>
                      <Image
                        source={require('../../../assets/icons/profile-avatar.png')}
                        style={styles.tagStaffAvatar}
                        resizeMode="cover"
                      />
                      <Text style={styles.tagStaffMemberName} numberOfLines={1}>
                        {staff.name}
                      </Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.tagStaffAddButton}
                  onPress={() => {
                    // TODO: Open tag staff modal
                    console.log('Add staff pressed');
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={require('../../../assets/icons/plus.png')}
                    style={styles.tagStaffAddIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Priority Field - Dropdown */}
        <Text style={styles.label}>Priority</Text>
        <TouchableOpacity
          style={[
            styles.inputContainer,
            showPriorityDropdown && styles.inputContainerFocused,
          ]}
          onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
          activeOpacity={0.7}
        >
          <View style={styles.priorityInputContent}>
            {selectedPriority ? (
              <>
                {(() => {
                  const selectedOption = priorityOptions.find(opt => opt.value === selectedPriority);
                  if (selectedOption) {
                    return (
                      <>
                        <View style={styles.priorityFlagsContainer}>
                          {Array.from({ length: selectedOption.flags }).map((_, index) => (
                            <Image
                              key={index}
                              source={require('../../../assets/icons/flag.png')}
                              style={[styles.priorityFlagIcon, { tintColor: selectedOption.flagColor }]}
                              resizeMode="contain"
                            />
                          ))}
                        </View>
                        <Text style={styles.priorityInputText}>{selectedOption.label}</Text>
                      </>
                    );
                  }
                  return null;
                })()}
              </>
            ) : (
              <Text style={styles.priorityInputPlaceholder}>Select priority</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Priority Dropdown Menu */}
        {showPriorityDropdown && (
          <>
            {/* Backdrop to close dropdown when clicking outside */}
            <TouchableOpacity
              style={styles.dropdownBackdrop}
              activeOpacity={1}
              onPress={() => setShowPriorityDropdown(false)}
            />
            <View style={styles.priorityDropdownMenu}>
              {priorityOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.priorityDropdownItem,
                    { backgroundColor: option.bgColor },
                    selectedPriority === option.value && styles.priorityDropdownItemSelected,
                    index === priorityOptions.length - 1 && styles.priorityDropdownItemLast, // Remove border from last item
                  ]}
                  onPress={() => {
                    setSelectedPriority(option.value);
                    setPriority(option.value as Priority);
                    setShowPriorityDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.priorityFlagsContainer}>
                    {Array.from({ length: option.flags }).map((_, flagIndex) => (
                      <Image
                        key={flagIndex}
                        source={require('../../../assets/icons/flag.png')}
                        style={[styles.priorityFlagIcon, { tintColor: option.flagColor }]}
                        resizeMode="contain"
                      />
                    ))}
                  </View>
                  <Text
                    style={[
                      styles.priorityDropdownText,
                      selectedPriority === option.value && styles.priorityDropdownTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selectedPriority === option.value && (
                    <Image
                      source={require('../../../assets/icons/tick.png')}
                      style={styles.priorityCheckmark}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

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
    flexGrow: 1, // Allow content to grow and be scrollable
  },
  sectionTitle: {
    fontSize: 20 * scaleX, // From Figma: 20px
    fontFamily: 'Helvetica', // Helvetica Bold
    fontWeight: '700' as any, // Bold
    color: '#607aa1', // From Figma: #607aa1 (not black)
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
  departmentSubtitleFirst: {
    fontSize: 14 * scaleX, // From Figma: 14px (first one under Current ticket)
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Light (300)
    color: '#000000', // From Figma: #000
    lineHeight: undefined, // Normal line height
    marginBottom: 16 * scaleX,
  },
  departmentSubtitle: {
    fontSize: 20 * scaleX, // From Figma: 20px (second one after AI description)
    fontFamily: 'Helvetica', // Helvetica
    fontWeight: '700' as any, // Bold (700)
    color: '#607AA1', // From Figma: #607AA1
    lineHeight: undefined, // Normal line height
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
    position: 'relative', // Allow absolute positioning of badge
    overflow: 'visible', // Allow badge to overflow outside container
  },
  departmentIconBackground: {
    width: 55.482 * scaleX, // From Figma: 55.482px
    height: 55.482 * scaleX,
    borderRadius: 37 * scaleX, // From Figma: 37px
    backgroundColor: '#ffebeb', // Light pink/red background
    borderWidth: 0, // No border
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Allow absolute positioning of badge
    overflow: 'visible', // Allow badge to overflow outside the circle
  },
  departmentIconBackgroundSelected: {
    backgroundColor: '#ffebeb', // Same background when selected
    borderWidth: 0, // No border when selected
  },
  departmentIcon: {
    width: (55.482 * 0.65) * scaleX, // 65% of background circle size
    height: (55.482 * 0.65) * scaleX,
  },
  departmentCheckmarkBadge: {
    position: 'absolute',
    width: 24 * scaleX, // Smaller badge size - from Figma
    height: 24 * scaleX,
    // Position badge relative to iconContainer to overlap bottom-right of the 55.482px circle
    // Icon background is 55.482px, badge is 24px
    // Position badge so it overlaps the bottom-right corner
    bottom: -2 * scaleX, // Position badge bottom edge slightly below circle bottom
    right: -2 * scaleX, // Position badge right edge slightly to the right of circle right
    // The tick-department.png already includes the white circle background with red glow
    zIndex: 10, // Ensure badge appears on top
  },
  departmentLabelText: {
    fontSize: 14 * scaleX, // From Figma: 14px
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Inter Light (300)
    color: '#000000', // From Figma: #000000
    textAlign: 'center',
    marginTop: 4 * scaleX,
  },
  label: {
    fontSize: 14 * scaleX, // From Figma: 14px (for Issue, Location, Pictures labels)
    fontFamily: typography.fontFamily.secondary, // Inter Light
    fontWeight: '300' as any, // Inter Light (300)
    color: '#000000',
    marginTop: 20 * scaleX,
    marginBottom: 8 * scaleX,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8 * scaleX,
    borderWidth: 1,
    borderColor: '#afa9ad', // Match Figma border color
    paddingHorizontal: 16 * scaleX,
    paddingVertical: 16 * scaleX,
    height: 70 * scaleX, // From Figma: 70px (standard input height)
    justifyContent: 'center',
  },
  inputContainerFocused: {
    borderWidth: 2 * scaleX, // Prominent border when focused (from Figma: ~2px)
    borderColor: '#5a759d', // Light blue border when focused
  },
  input: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Inter Light
    color: '#000000',
  },
  ticketTagContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    width: 20 * scaleX,
    height: 20 * scaleX,
    marginRight: 8 * scaleX,
  },
  flagIconSmall: {
    width: 16 * scaleX,
    height: 16 * scaleX,
    marginRight: 8 * scaleX,
  },
  checkmarkIcon: {
    width: 16 * scaleX,
    height: 16 * scaleX,
    tintColor: '#5a759d', // Blue checkmark (same as Priority)
    marginLeft: 'auto', // Push to the right
  },
  ticketTagText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Inter Light
    color: '#000000',
    flex: 1,
  },
  ticketTagPlaceholder: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Inter Light
    color: '#5a759d',
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
  ticketTagDropdownMenu: {
    marginTop: 8 * scaleX, // Small gap below input container
    marginBottom: 12 * scaleX,
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e3e3', // Light grey border (from Figma: thin, light grey border ~1px)
    borderRadius: 8 * scaleX,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
    maxHeight: 2268 * scaleX, // From Figma: 2268px
    overflow: 'hidden', // Ensure border radius is applied
  },
  ticketTagDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16 * scaleX,
    paddingVertical: 14 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    minHeight: 49 * scaleX, // Match Priority dropdown item height
  },
  ticketTagDropdownItemLast: {
    borderBottomWidth: 0, // Remove border from last item
  },
  ticketTagDropdownText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Inter Light
    color: '#000000', // Dark grey for both selected and unselected (from Figma)
    flex: 1,
  },
  ticketTagDropdownTextSelected: {
    // Same styling as unselected - checkmark icon indicates selection
    fontWeight: '300' as any,
    color: '#000000',
  },
  addPhotoCard: {
    backgroundColor: '#F9FAFC', // From Figma: #F9FAFC
    borderRadius: 12 * scaleX, // From Figma: 12px
    borderWidth: 1 * scaleX,
    borderColor: 'rgba(90, 117, 157, 0.23)', // From Figma: rgba(90, 117, 157, 0.23)
    borderStyle: 'dashed',
    padding: 32 * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200 * scaleX, // Larger height for better visual
    width: '100%',
  },
  addPhotoIconContainer: {
    position: 'relative',
    marginBottom: 16 * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoIcon: {
    width: 80 * scaleX, // Large icon size
    height: 80 * scaleX,
  },
  addPhotoPlusIcon: {
    position: 'absolute',
    top: -8 * scaleX, // Position on top-right
    right: -8 * scaleX,
    width: 32 * scaleX,
    height: 32 * scaleX,
    borderRadius: 16 * scaleX,
    backgroundColor: '#5a759d', // Blue background for plus
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoPlusIconImage: {
    width: 20 * scaleX,
    height: 20 * scaleX,
    tintColor: '#ffffff', // White plus icon
  },
  addPhotoText: {
    fontSize: 16 * scaleX, // Larger, bold text
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '700' as any, // Bold
    color: '#5a759d', // Blue color
    marginBottom: 8 * scaleX,
  },
  addPhotoSubtext: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Light
    color: '#666666', // Grey color
    textAlign: 'center',
    maxWidth: 300 * scaleX,
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
    borderColor: 'rgba(90, 117, 157, 0.23)', // Match card border color
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFC', // Match card background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12 * scaleX,
    width: '48%', // Always 2-column grid - appears in next grid position
    paddingVertical: 16 * scaleX,
  },
  addMorePhotoIconContainer: {
    position: 'relative',
    marginBottom: 8 * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMorePhotoIcon: {
    width: 40 * scaleX, // Smaller icon for grid item
    height: 40 * scaleX,
  },
  addMorePhotoPlusIcon: {
    position: 'absolute',
    top: -4 * scaleX, // Position on top-right
    right: -4 * scaleX,
    width: 24 * scaleX,
    height: 24 * scaleX,
    borderRadius: 12 * scaleX,
    backgroundColor: '#5a759d', // Blue background for plus
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMorePhotoPlusIconImage: {
    width: 16 * scaleX,
    height: 16 * scaleX,
    tintColor: '#ffffff', // White plus icon
  },
  addMorePhotoText: {
    marginTop: 4 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '700' as any, // Bold
    color: '#5a759d', // Blue color
    textAlign: 'center',
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
    fontWeight: '300' as any, // Helvetica Light
    color: '#000000',
    minHeight: 80 * scaleX,
  },
  descriptionLabel: {
    fontSize: 12 * scaleX, // From Figma: 12px
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '700' as any, // Bold
    color: '#1e1e1e', // From Figma: #1e1e1e
    marginTop: 20 * scaleX,
    marginBottom: 8 * scaleX,
  },
  tagStaffSection: {
    marginTop: 20 * scaleX,
    marginBottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  tagStaffCardWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -20 * scaleX, // Negative margin to offset parent padding (same as ticketCardWrapper)
    marginRight: -20 * scaleX, // Negative margin to offset parent padding
  },
  tagStaffLabel: {
    fontSize: 17 * scaleX, // From Figma: bold, dark grey
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '700' as any, // Bold
    color: '#1e1e1e', // Dark grey
    marginBottom: 4 * scaleX,
    marginTop: 0, // Inside card, no top margin needed
  },
  tagStaffSubtitle: {
    fontSize: 14 * scaleX, // From Figma: smaller, lighter grey
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Inter Light
    color: '#666666', // Lighter grey
    marginBottom: 16 * scaleX, // Spacing before staff avatars
  },
  tagStaffCard: {
    backgroundColor: '#F9FAFC', // From Figma: #F9FAFC
    borderRadius: 12 * scaleX, // From Figma: 12px
    borderWidth: 1 * scaleX,
    borderColor: 'rgba(90, 117, 157, 0.23)', // From Figma: rgba(90, 117, 157, 0.23)
    width: '100%', // Same as current ticket card
    height: 183 * scaleX, // From Figma: 183px
    paddingHorizontal: 16 * scaleX,
    paddingTop: 16 * scaleX,
    paddingBottom: 16 * scaleX,
    position: 'relative',
  },
  tagStaffDivider: {
    width: '100%',
    height: 1 * scaleX,
    backgroundColor: '#e3e3e3',
    marginTop: 0,
    marginBottom: 16 * scaleX,
    marginLeft: -16 * scaleX, // Offset padding to span full width
    marginRight: -16 * scaleX,
  },
  tagStaffContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Staff members on left, add button on right
  },
  tagStaffMembersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Take available space
  },
  tagStaffMember: {
    flexDirection: 'row', // Horizontal layout: avatar next to name
    alignItems: 'center',
    marginRight: 20 * scaleX,
    marginBottom: 0,
  },
  tagStaffAvatar: {
    width: 30 * scaleX, // From Figma: 30px
    height: 31 * scaleX, // From Figma: 31px
    borderRadius: 15.5 * scaleX, // Half of height for circular shape
    backgroundColor: '#ffffff',
    marginRight: 8 * scaleX, // Spacing between avatar and name
  },
  tagStaffMemberName: {
    fontSize: 18 * scaleX, // From Figma: 18px
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '300' as any, // Light (300)
    color: '#5A759D', // From Figma: #5A759D
    textAlign: 'left', // Left align when next to avatar
    lineHeight: undefined, // Normal line height
    maxWidth: 120 * scaleX,
  },
  tagStaffAddButton: {
    width: 53 * scaleX, // From Figma: 53px
    height: 49 * scaleX, // From Figma: 49px
    borderRadius: 41 * scaleX, // From Figma: 41px
    backgroundColor: '#F1F6FC', // From Figma: #F1F6FC (light blue)
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  tagStaffAddIcon: {
    width: 20 * scaleX, // Proportionally sized
    height: 20 * scaleX,
    tintColor: '#5a759d', // Blue plus icon (to match text color)
  },
  priorityInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityInputText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Inter Light
    color: '#000000',
    flex: 1,
  },
  priorityInputPlaceholder: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.secondary, // Inter
    fontWeight: '300' as any, // Inter Light
    color: '#5a759d',
  },
  priorityDropdownMenu: {
    marginTop: 8 * scaleX,
    marginBottom: 12 * scaleX,
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e3e3', // Light grey border
    borderRadius: 8 * scaleX,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
    overflow: 'hidden',
  },
  priorityDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16 * scaleX,
    paddingVertical: 14 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    minHeight: 49 * scaleX, // From Figma: ~49px
  },
  priorityDropdownItemLast: {
    borderBottomWidth: 0, // Remove border from last item
  },
  priorityDropdownItemSelected: {
    borderWidth: 1 * scaleX,
    borderColor: '#EB5757', // Red border when selected
    borderRadius: 4 * scaleX,
  },
  priorityFlagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8 * scaleX,
    gap: 4 * scaleX,
  },
  priorityFlagIcon: {
    width: 16 * scaleX,
    height: 16 * scaleX,
  },
  priorityDropdownText: {
    fontSize: 15 * scaleX, // From Figma: 15px
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: '300' as any, // Light (300)
    color: '#000000', // Dark grey/black
    flex: 1,
  },
  priorityDropdownTextSelected: {
    fontWeight: '300' as any,
    color: '#000000',
  },
  priorityCheckmark: {
    width: 16 * scaleX,
    height: 16 * scaleX,
    tintColor: '#5a759d', // Blue checkmark
    marginLeft: 'auto',
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
    marginTop: 24 * scaleX, // Same top padding
    marginBottom: 24 * scaleX, // Same bottom padding
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
