import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { typography } from '../../theme';
import { REGISTER_FORM, scaleX, LOST_AND_FOUND_COLORS } from '../../constants/lostAndFoundStyles';
import DatePickerModal from './DatePickerModal';
import TimePickerModal from './TimePickerModal';
import StaffSelectorModal from './StaffSelectorModal';
import StatusDropdown, { StatusOption } from './StatusDropdown';
import StoredLocationDropdown, { StoredLocationOption } from './StoredLocationDropdown';

interface RegisterLostAndFoundModalProps {
  visible: boolean;
  onClose: () => void;
  onNext?: (data: {
    trackingNumber: string;
    itemImage?: string;
    itemData: {
      notes: string;
      selectedLocation: 'room' | 'publicArea';
      selectedRoom?: any;
      foundedBy: string;
      registeredBy: string;
      status: StatusOption;
      storedLocation: StoredLocationOption;
      selectedDate: Date;
      selectedHour: number;
      selectedMinute: number;
      pictures: string[];
    };
  }) => void;
}

export default function RegisterLostAndFoundModal({
  visible,
  onClose,
  onNext,
}: RegisterLostAndFoundModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<'room' | 'publicArea'>('room');
  // Default to current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now,
      hour: now.getHours(),
      minute: now.getMinutes(),
    };
  };
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    return now;
  });
  const [selectedHour, setSelectedHour] = useState(() => {
    const now = new Date();
    return now.getHours();
  });
  const [selectedMinute, setSelectedMinute] = useState(() => {
    const now = new Date();
    return now.getMinutes();
  });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Mock room data with guest names
  const mockRooms = [
    { number: '201', guestName: 'Mohamed B', badgeCount: 11 },
    { number: '202', guestName: 'Sarah Johnson', badgeCount: 3 },
    { number: '203', guestName: 'Ahmed Al-Mansouri', badgeCount: 7 },
    { number: '204', guestName: 'Emma Williams', badgeCount: 2 },
    { number: '205', guestName: 'John Smith', badgeCount: 5 },
    { number: '301', guestName: 'Maria Garcia', badgeCount: 9 },
    { number: '302', guestName: 'David Chen', badgeCount: 4 },
    { number: '303', guestName: 'Fatima Ali', badgeCount: 6 },
  ];

  // Select a random default room
  const getRandomRoom = () => {
    return mockRooms[Math.floor(Math.random() * mockRooms.length)];
  };

  const [selectedRoom, setSelectedRoom] = useState(() => getRandomRoom());
  
  // Step 2 state
  const [showFoundedByModal, setShowFoundedByModal] = useState(false);
  const [showRegisteredByModal, setShowRegisteredByModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showStoredLocationDropdown, setShowStoredLocationDropdown] = useState(false);
  const [foundedBy, setFoundedBy] = useState<string>('2'); // Default to Stella Kitou
  const [registeredBy, setRegisteredBy] = useState<string>('2'); // Default to Stella Kitou
  const [status, setStatus] = useState<StatusOption>('stored');
  const [storedLocation, setStoredLocation] = useState<StoredLocationOption>('hskOffice');
  
  // Pictures state
  const [pictures, setPictures] = useState<string[]>([]);
  
  // Step 3 state
  const [sendEmailToGuest, setSendEmailToGuest] = useState(true);
  
  // Validation state
  const [showPictureError, setShowPictureError] = useState(false);
  
  // Reset to step 1 when modal opens
  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      setSendEmailToGuest(true); // Reset email checkbox
      setPictures([]); // Reset pictures
      setShowPictureError(false); // Reset error state
    }
  }, [visible]);

  // Handle adding pictures
  const handleAddPicture = async () => {
    setShowPictureError(false); // Clear error when user tries to add picture
    try {
      // Show action sheet to choose camera or gallery
      Alert.alert(
        'Add Picture',
        'Choose an option',
        [
          {
            text: 'Camera',
            onPress: async () => {
              try {
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
                  allowsEditing: false, // No cropping - use full picture
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
      console.error('Error showing picture options:', error);
    }
  };

  // Handle removing a picture
  const handleRemovePicture = (index: number) => {
    Alert.alert(
      'Remove Picture',
      'Are you sure you want to remove this picture?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPictures(pictures.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };
  
  // Refs for measuring input field positions
  const scrollViewRef = useRef<ScrollView>(null);
  const foundedByFieldRef = useRef<View>(null);
  const registeredByFieldRef = useRef<View>(null);
  const statusFieldRef = useRef<View>(null);
  const storedLocationFieldRef = useRef<View>(null);
  
  // Input field positions for dropdown positioning
  const [foundedByFieldPosition, setFoundedByFieldPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [registeredByFieldPosition, setRegisteredByFieldPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [statusFieldPosition, setStatusFieldPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [storedLocationFieldPosition, setStoredLocationFieldPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  // Helper function to measure field position and scroll if needed
  const measureFieldPosition = (
    ref: React.RefObject<View | null>,
    setPosition: (pos: { x: number; y: number; width: number; height: number }) => void,
    onComplete?: () => void
  ) => {
    if (ref.current) {
      ref.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        const fieldBottom = y + height;
        const screenHeight = Dimensions.get('window').height;
        const headerHeight = REGISTER_FORM.header.height * scaleX;
        // Use actual modal maxHeight from constants (200px scaled)
        const modalHeight = REGISTER_FORM.step2.locationDropdown.modal.maxHeight * scaleX;
        const spacing = 10 * scaleX; // Gap between field and modal
        const bottomPadding = 20 * scaleX; // Extra padding at bottom to ensure modal is fully visible
        
        // Calculate if modal would be off-screen
        const modalTop = fieldBottom + spacing;
        const modalBottom = modalTop + modalHeight;
        // Available space is from header to bottom of screen, minus padding
        const availableSpace = screenHeight - bottomPadding;
        
        // If modal would extend beyond visible area, scroll to position field higher
        if (modalBottom > availableSpace && scrollViewRef.current) {
          // Calculate how much we need to scroll
          // We want the modal to fit fully on screen with padding
          const overflow = modalBottom - availableSpace;
          // Calculate desired position: field should be high enough that modal fits
          // desiredFieldBottom + spacing + modalHeight <= availableSpace
          // desiredFieldBottom <= availableSpace - spacing - modalHeight
          const maxAllowedFieldBottom = availableSpace - spacing - modalHeight;
          const desiredFieldY = maxAllowedFieldBottom - height - 50 * scaleX; // Extra padding from top
          const scrollY = Math.max(0, y - desiredFieldY);
          
          scrollViewRef.current.scrollTo({
            y: scrollY,
            animated: true,
          });
          
          // Wait for scroll animation, then measure again
          setTimeout(() => {
            if (ref.current) {
              ref.current.measureInWindow((newX: number, newY: number, newWidth: number, newHeight: number) => {
                setPosition({ x: newX, y: newY, width: newWidth, height: newHeight });
                if (onComplete) onComplete();
              });
            }
          }, 350); // Wait for scroll animation (slightly longer for smoother transition)
        } else {
          setPosition({ x, y, width, height });
          if (onComplete) onComplete();
        }
      });
    }
  };

  // Format date as "11 November 2025"
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Format time as "15:00"
  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeConfirm = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
  };

  // Generate tracking number
  const generateTrackingNumber = (): string => {
    const prefix = 'FH';
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    return `${prefix}${randomNumber}`;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validation is handled by disabled state - button won't be clickable if invalid
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Generate tracking number and submit
      const trackingNumber = generateTrackingNumber();
      if (onNext) {
        onNext({
          trackingNumber,
          itemImage: pictures.length > 0 ? pictures[0] : undefined,
          itemData: {
            notes,
            selectedLocation,
            selectedRoom: selectedLocation === 'room' ? selectedRoom : undefined,
            foundedBy,
            registeredBy,
            status,
            storedLocation,
            selectedDate,
            selectedHour,
            selectedMinute,
            pictures,
          },
        });
      }
      onClose();
    }
  };

  // Get staff member name by ID
  const getStaffName = (staffId: string): string => {
    const staffMap: { [key: string]: string } = {
      '1': 'Etleva Hoxha',
      '2': 'Stella Kitou',
      '3': 'Zoe Tsakeri',
      '4': 'Felix F',
    };
    return staffMap[staffId] || 'Unknown';
  };

  // Get staff department by ID
  const getStaffDepartment = (staffId: string): string => {
    const departmentMap: { [key: string]: string } = {
      '1': 'HSK',
      '2': 'HSK',
      '3': 'HSK',
      '4': 'F&B',
    };
    return departmentMap[staffId] || 'HSK';
  };

  // Get staff avatar by ID
  const getStaffAvatar = (staffId: string) => {
    const avatarMap: { [key: string]: any } = {
      '1': require('../../../assets/images/Etleva_Hoxha.png'),
      '2': require('../../../assets/images/Stella_Kitou.png'),
      '4': require('../../../assets/images/Felix_F.png'),
    };
    return avatarMap[staffId];
  };

  // Get first letter for initial
  const getInitial = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Generate color for initial circle
  const getInitialColor = (name: string): string => {
    const colors = ['#ff4dd8', '#5a759d', '#607aa1', '#f0be1b'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get status label
  const getStatusLabel = (status: StatusOption): string => {
    const labels: { [key: string]: string } = {
      stored: 'Stored',
      shipped: 'Shipped',
      discarded: 'Discarded',
    };
    return labels[status] || 'Stored';
  };

  // Get stored location label
  const getLocationLabel = (location: StoredLocationOption): string => {
    const labels: { [key: string]: string } = {
      hskOffice: 'HSK Office',
      frontDesk: 'Front Desk',
      securityOffice: 'Security Office',
      lostAndFoundRoom: 'Lost & Found Room',
    };
    return labels[location] || 'HSK Office';
  };

  return (
    <Modal
      transparent={false}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/icons/back-arrow.png')}
              style={styles.backArrow}
              resizeMode="contain"
              tintColor="#607AA1"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lost & Found</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>Register</Text>

          {/* Step Indicator */}
          <Text style={styles.stepIndicator}>Step {currentStep}</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, currentStep >= 1 ? styles.progressBarActive : styles.progressBarInactive]} />
            <View style={[styles.progressBar, currentStep >= 2 ? styles.progressBarActive : styles.progressBarInactive]} />
            <View style={[styles.progressBar, currentStep >= 3 ? styles.progressBarActive : styles.progressBarInactive]} />
          </View>

          {/* Step 1 Content */}
          {currentStep === 1 && (
            <>
              {/* Date and Time Section */}
              <Text style={styles.sectionLabel}>Date and time</Text>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  style={styles.dateInput}
                  activeOpacity={0.7}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeInput}
                  activeOpacity={0.7}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.dateTimeText}>{formatTime(selectedHour, selectedMinute)}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Step 1 Content - Location Section */}
          {currentStep === 1 && (
            <>
              {/* Location Section */}
              <Text style={[styles.sectionLabel, styles.locationLabel]}>Location</Text>
              <View style={styles.locationContainer}>
            <TouchableOpacity
              style={styles.locationOption}
              onPress={() => setSelectedLocation('room')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedLocation === 'room' && styles.checkboxSelected,
                ]}
              >
                {selectedLocation === 'room' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.locationText,
                  selectedLocation === 'room' && styles.locationTextSelected,
                ]}
              >
                Room
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locationOption}
              onPress={() => setSelectedLocation('publicArea')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedLocation === 'publicArea' && styles.checkboxSelected,
                ]}
              >
                {selectedLocation === 'publicArea' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.locationText,
                  selectedLocation === 'publicArea' && styles.locationTextSelected,
                ]}
              >
                Public Area
              </Text>
            </TouchableOpacity>
          </View>

          {/* Room Number Section */}
          {selectedLocation === 'room' && currentStep === 1 && (
            <>
              <Text style={styles.sectionLabelLight}>Room Number</Text>
              <View style={styles.roomSelectorWrapper}>
                <TouchableOpacity
                  style={styles.roomSelector}
                  activeOpacity={0.7}
                  onPress={() => setShowRoomDropdown(!showRoomDropdown)}
                >
                  <View style={styles.roomSelectorContent}>
                    <Text style={styles.roomText}>Room {selectedRoom.number}</Text>
                    <View style={styles.roomDivider} />
                    <View style={styles.guestNameContainer}>
                      <Text style={styles.guestText}>{selectedRoom.guestName}</Text>
                      <Image
                        source={require('../../../assets/icons/spinner.png')}
                        style={styles.spinnerIcon}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{selectedRoom.badgeCount}</Text>
                  </View>
                </TouchableOpacity>

                {/* Room Dropdown */}
                {showRoomDropdown && (
                  <>
                    <TouchableOpacity
                      style={styles.dropdownBackdrop}
                      activeOpacity={1}
                      onPress={() => setShowRoomDropdown(false)}
                    />
                    <ScrollView
                      style={styles.roomDropdown}
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={false}
                    >
                      {mockRooms.map((room) => (
                        <TouchableOpacity
                          key={room.number}
                          style={[
                            styles.roomDropdownItem,
                            selectedRoom.number === room.number && styles.roomDropdownItemSelected,
                          ]}
                          onPress={() => {
                            setSelectedRoom(room);
                            setShowRoomDropdown(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.roomDropdownItemContent}>
                            <Text style={styles.roomDropdownRoomText}>Room {room.number}</Text>
                            <View style={styles.roomDropdownDivider} />
                            <Text style={styles.roomDropdownGuestText}>{room.guestName}</Text>
                          </View>
                          {selectedRoom.number === room.number && (
                            <Text style={styles.roomDropdownCheckmark}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </>
                )}
              </View>
            </>
          )}
            </>
          )}

          {/* Pictures Section */}
          {currentStep === 1 && (
            <>
              <Text style={[styles.sectionLabel, styles.picturesLabel]}>Pictures</Text>
              <View
                style={[
                  styles.picturesContainer,
                  {
                    minHeight:
                      pictures.length === 0
                        ? REGISTER_FORM.pictures.image2.height * scaleX
                        : Math.ceil((pictures.length + 1) / 2) *
                            (REGISTER_FORM.pictures.image1.height * scaleX + 12 * scaleX), // Always use grid calculation, +1 accounts for add button
                  },
                ]}
              >
                {pictures.length === 0 ? (
                  <TouchableOpacity
                    style={[
                      styles.picture2FullWidth,
                      showPictureError && styles.picture2Error,
                    ]}
                    activeOpacity={0.7}
                    onPress={handleAddPicture}
                  >
                    <Image
                      source={require('../../../assets/icons/add-photos.png')}
                      style={styles.addIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : (
                  <>
                    {/* Always use 2-column grid layout for all pictures - centered */}
                    {(() => {
                      const screenWidth = Dimensions.get('window').width;
                      const containerPadding = 27 * scaleX;
                      const gap = 12 * scaleX;
                      const containerWidth = screenWidth - (containerPadding * 2);
                      
                      // Calculate picture width and total grid width
                      const pictureWidth = (containerWidth - gap) / 2;
                      const totalGridWidth = 2 * pictureWidth + gap;
                      
                      // Calculate center offset to ensure equal margins on both sides
                      const centerOffset = (containerWidth - totalGridWidth) / 2;
                      
                      // Starting position: container padding + center offset
                      const gridStartLeft = containerPadding + centerOffset;
                      
                      return (
                        <>
                          {pictures.map((uri, index) => {
                            const row = Math.floor(index / 2);
                            const col = index % 2;
                            const left = gridStartLeft + col * (pictureWidth + gap);
                            const top = row * (REGISTER_FORM.pictures.image1.height * scaleX + gap);
                            return (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.picture1Grid,
                                  {
                                    left,
                                    top,
                                    width: pictureWidth, // Use calculated width for centering
                                  },
                                ]}
                                activeOpacity={0.7}
                                onPress={() => handleRemovePicture(index)}
                              >
                                <Image
                                  source={{ uri }}
                                  style={[styles.picture1Grid, { width: pictureWidth }]}
                                  resizeMode="cover"
                                />
                                <View style={styles.pictureRemoveOverlay}>
                                  <Text style={styles.pictureRemoveText}>×</Text>
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                          {/* Add more button in next grid position - centered */}
                          <TouchableOpacity
                            style={[
                              styles.picture2,
                              {
                                left: gridStartLeft + (pictures.length % 2) * (pictureWidth + gap),
                                top: Math.floor(pictures.length / 2) * (REGISTER_FORM.pictures.image1.height * scaleX + gap),
                                width: pictureWidth, // Use calculated width to match grid
                              },
                            ]}
                            activeOpacity={0.7}
                            onPress={handleAddPicture}
                          >
                            <Image
                              source={require('../../../assets/icons/add-photos.png')}
                              style={styles.addIcon}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </>
                      );
                    })()}
                  </>
                )}
              </View>
            </>
          )}

          {/* Step 1 Content - End */}
          {currentStep === 1 && (
            <>
              {/* Notes Section */}
              <View style={styles.notesContainer}>
                <View style={styles.notesLabelContainer}>
                  <Image
                    source={require('../../../assets/icons/notes-icon.png')}
                    style={styles.notesIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.notesLabel}>Notes</Text>
                </View>
                <TextInput
                  style={styles.notesInput}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  placeholder="Wrist watch found in guest bathroom whole cleaning"
                  placeholderTextColor="#999999"
                />
                <View style={styles.notesDivider} />
              </View>
            </>
          )}

          {/* Step 2 Content */}
          {currentStep === 2 && (
            <>
              {/* Founded By Section */}
              <Text style={styles.sectionLabelLight}>Founded by</Text>
              <TouchableOpacity
                ref={foundedByFieldRef}
                style={styles.step2Field}
                activeOpacity={0.7}
                onPress={() => {
                  measureFieldPosition(foundedByFieldRef, setFoundedByFieldPosition, () => {
                    setShowFoundedByModal(true);
                  });
                }}
              >
                <View style={styles.step2FieldContent}>
                  {getStaffAvatar(foundedBy) ? (
                    <Image
                      source={getStaffAvatar(foundedBy)}
                      style={styles.step2Avatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.step2InitialsCircle,
                        { backgroundColor: getInitialColor(getStaffName(foundedBy)) },
                      ]}
                    >
                      <Text style={styles.step2InitialsText}>
                        {getInitial(getStaffName(foundedBy))}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.step2FieldText}>{getStaffName(foundedBy)}</Text>
                </View>
                <Image
                  source={require('../../../assets/icons/search-icon.png')}
                  style={styles.step2SearchIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Registered By Section */}
              <Text style={styles.sectionLabelLight}>Registered by</Text>
              <TouchableOpacity
                ref={registeredByFieldRef}
                style={styles.step2Field}
                activeOpacity={0.7}
                onPress={() => {
                  measureFieldPosition(registeredByFieldRef, setRegisteredByFieldPosition, () => {
                    setShowRegisteredByModal(true);
                  });
                }}
              >
                <View style={styles.step2FieldContent}>
                  {getStaffAvatar(registeredBy) ? (
                    <Image
                      source={getStaffAvatar(registeredBy)}
                      style={styles.step2Avatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.step2InitialsCircle,
                        { backgroundColor: getInitialColor(getStaffName(registeredBy)) },
                      ]}
                    >
                      <Text style={styles.step2InitialsText}>
                        {getInitial(getStaffName(registeredBy))}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.step2FieldText}>{getStaffName(registeredBy)}</Text>
                </View>
                <Image
                  source={require('../../../assets/icons/search-icon.png')}
                  style={styles.step2SearchIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Status Section */}
              <Text style={styles.sectionLabelLight}>Status</Text>
              <TouchableOpacity
                ref={statusFieldRef}
                style={styles.step2Field}
                activeOpacity={0.7}
                onPress={() => {
                  measureFieldPosition(statusFieldRef, setStatusFieldPosition, () => {
                    setShowStatusDropdown(true);
                  });
                }}
              >
                <View style={styles.step2FieldContent}>
                  <View
                    style={[
                      styles.step2StatusCircle,
                      {
                        backgroundColor:
                          status === 'stored'
                            ? '#f0be1b'
                            : status === 'shipped'
                            ? '#41d541'
                            : '#f0be1b',
                      },
                    ]}
                  />
                  <Text style={styles.step2FieldText}>{getStatusLabel(status)}</Text>
                </View>
                <Image
                  source={require('../../../assets/icons/down-arrow.png')}
                  style={styles.step2Chevron}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Stored Location Section */}
              <Text style={styles.sectionLabelLight}>Stored location</Text>
              <TouchableOpacity
                ref={storedLocationFieldRef}
                style={styles.step2Field}
                activeOpacity={0.7}
                onPress={() => {
                  measureFieldPosition(storedLocationFieldRef, setStoredLocationFieldPosition, () => {
                    setShowStoredLocationDropdown(true);
                  });
                }}
              >
                <Text style={styles.step2FieldText}>{getLocationLabel(storedLocation)}</Text>
                <Image
                  source={require('../../../assets/icons/down-arrow.png')}
                  style={styles.step2Chevron}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </>
          )}

          {/* Step 3 Content */}
          {currentStep === 3 && (
            <>
              {/* Item Images */}
              {pictures.length > 0 ? (
                <View style={styles.step3PicturesContainer}>
                  {pictures.length === 1 ? (
                    <View style={styles.step3PictureSingleContainer}>
                      <Image
                        source={{ uri: pictures[0] }}
                        style={styles.step3PictureImage}
                        resizeMode="cover"
                      />
                    </View>
                  ) : (
                    pictures.map((uri, index) => {
                      const row = Math.floor(index / 2);
                      const col = index % 2;
                      const pictureWidth = ((Dimensions.get('window').width - (27 * 2 * scaleX) - (12 * scaleX)) / 2);
                      const left = 27 * scaleX + col * (pictureWidth + 12 * scaleX);
                      const top = row * (REGISTER_FORM.pictures.image1.height * scaleX + 12 * scaleX);
                      return (
                        <View
                          key={index}
                          style={[
                            styles.step3PictureGridContainer,
                            {
                              left,
                              top,
                            },
                          ]}
                        >
                          <Image
                            source={{ uri }}
                            style={styles.step3PictureImage}
                            resizeMode="cover"
                          />
                        </View>
                      );
                    })
                  )}
                </View>
              ) : (
                <View style={styles.step3ItemImageContainer}>
                  <Image
                    source={require('../../../assets/images/wrist-watch.png')}
                    style={styles.step3ItemImage}
                    resizeMode="cover"
                  />
                </View>
              )}

              {/* Item Description */}
              <View
                style={[
                  styles.step3ItemDescriptionContainer,
                  {
                    marginTop:
                      pictures.length > 0
                        ? pictures.length === 1
                          ? (REGISTER_FORM.step3.itemDescription.top - REGISTER_FORM.step3.itemImage.top - REGISTER_FORM.step3.itemImage.height) * scaleX * 0.7
                          : (REGISTER_FORM.step3.itemDescription.top - REGISTER_FORM.step3.itemImage.top - REGISTER_FORM.step3.itemImage.height) * scaleX * 0.7 +
                            (Math.ceil(pictures.length / 2) - 1) * (REGISTER_FORM.pictures.image1.height * scaleX + 12 * scaleX - REGISTER_FORM.step3.itemImage.height * scaleX)
                        : (REGISTER_FORM.step3.itemDescription.top - REGISTER_FORM.step3.itemImage.top - REGISTER_FORM.step3.itemImage.height) * scaleX * 0.7,
                  },
                ]}
              >
                <Text style={styles.step3ItemDescription}>{notes}</Text>
                <TouchableOpacity
                  style={styles.step3EditIcon}
                  onPress={() => setCurrentStep(1)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={require('../../../assets/icons/notes-icon.png')}
                    style={styles.step3EditIconImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Found In Section */}
              <Text style={styles.step3FoundInLabel}>Found in</Text>
              <View style={styles.step3FoundInContent}>
                <View style={styles.step3CheckboxContainer}>
                  <View style={[styles.step3Checkbox, selectedLocation === 'room' && styles.step3CheckboxChecked]}>
                    {selectedLocation === 'room' && (
                      <Text style={styles.step3Checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.step3CheckboxLabel}>Room</Text>
                </View>
                {selectedLocation === 'room' && selectedRoom && (
                  <View style={styles.step3GuestInfo}>
                    <Image
                      source={require('../../../assets/icons/guest-departure-icon.png')}
                      style={styles.step3GuestIcon}
                      resizeMode="contain"
                    />
                    <View style={styles.step3GuestDetails}>
                      <Text style={styles.step3GuestName}>Mr {selectedRoom.guestName}</Text>
                      <Text style={styles.step3RoomNumber}>Room {selectedRoom.number}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.step3EditIcon}
                      onPress={() => setCurrentStep(1)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={require('../../../assets/icons/notes-icon.png')}
                        style={styles.step3EditIconImage}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Email Checkbox */}
              <TouchableOpacity
                style={styles.step3EmailContainer}
                onPress={() => setSendEmailToGuest(!sendEmailToGuest)}
                activeOpacity={0.7}
              >
                <View style={[styles.step3Checkbox, sendEmailToGuest && styles.step3CheckboxChecked]}>
                  {sendEmailToGuest && (
                    <Text style={styles.step3Checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.step3EmailLabel}>Send Email to Guest for reclamation?</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={[styles.step3Divider, { marginTop: (716 - REGISTER_FORM.step3.emailCheckbox.top) * scaleX * 0.5, marginBottom: 0 }]} />

              {/* Date and Time Section */}
              <Text style={styles.step3DateTimeLabel}>Date and time</Text>
              <View style={styles.step3DateTimeContainer}>
                <Text style={styles.step3Date}>{formatDate(selectedDate)}</Text>
                <Text style={styles.step3Time}>{formatTime(selectedHour, selectedMinute)}</Text>
                <TouchableOpacity
                  style={styles.step3EditIcon}
                  onPress={() => {
                    setCurrentStep(1);
                    setTimeout(() => {
                      setShowDatePicker(true);
                    }, 100);
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={require('../../../assets/icons/notes-icon.png')}
                    style={styles.step3EditIconImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={[styles.step3Divider, { marginTop: (804 - REGISTER_FORM.step3.dateTime.date.top) * scaleX * 0.7, marginBottom: 0 }]} />

              {/* Founded By Section */}
              <Text style={styles.step3FoundedByLabel}>Founded by</Text>
              <View style={styles.step3StaffInfo}>
                {getStaffAvatar(foundedBy) ? (
                  <Image
                    source={getStaffAvatar(foundedBy)}
                    style={styles.step3Avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.step3Avatar,
                      styles.step3InitialsCircle,
                      { backgroundColor: getInitialColor(getStaffName(foundedBy)) },
                    ]}
                  >
                    <Text style={styles.step3InitialsText}>
                      {getInitial(getStaffName(foundedBy))}
                    </Text>
                  </View>
                )}
                <View style={styles.step3StaffDetails}>
                  <Text style={styles.step3StaffName}>{getStaffName(foundedBy)}</Text>
                  <Text style={styles.step3StaffDepartment}>{getStaffDepartment(foundedBy)}</Text>
                </View>
              </View>

              {/* Registered By Section */}
              <Text style={styles.step3RegisteredByLabel}>Registered by</Text>
              <View style={styles.step3RegisteredByStaffInfo}>
                {getStaffAvatar(registeredBy) ? (
                  <Image
                    source={getStaffAvatar(registeredBy)}
                    style={styles.step3Avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.step3Avatar,
                      styles.step3InitialsCircle,
                      { backgroundColor: getInitialColor(getStaffName(registeredBy)) },
                    ]}
                  >
                    <Text style={styles.step3InitialsText}>
                      {getInitial(getStaffName(registeredBy))}
                    </Text>
                  </View>
                )}
                <View style={styles.step3StaffDetails}>
                  <Text style={styles.step3StaffName}>{getStaffName(registeredBy)}</Text>
                  <Text style={styles.step3StaffDepartment}>{getStaffDepartment(registeredBy)}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={[styles.step3Divider, { marginTop: (1021 - REGISTER_FORM.step3.registeredBy.department.top) * scaleX * 0.5, marginBottom: 0 }]} />

              {/* Status Section */}
              <Text style={styles.step3StatusLabel}>Status</Text>
              <View style={styles.step3StatusContainer}>
                <View
                  style={[
                    styles.step3StatusCircle,
                    {
                      backgroundColor:
                        status === 'stored'
                          ? '#f0be1b'
                          : status === 'shipped'
                          ? '#41d541'
                          : '#f0be1b',
                    },
                  ]}
                />
                <Text style={styles.step3StatusValue}>{getStatusLabel(status)}</Text>
              </View>

              {/* Stored Location Section */}
              <Text style={styles.step3StoredLocationLabel}>Stored Location</Text>
              <Text style={styles.step3StoredLocationValue}>{getLocationLabel(storedLocation)}</Text>
            </>
          )}

          {/* Next/Done Button */}
          <TouchableOpacity
            style={[
              styles.nextButton,
              (currentStep === 1 && (pictures.length === 0 || notes.trim() === '')) && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            activeOpacity={0.7}
            disabled={currentStep === 1 && (pictures.length === 0 || notes.trim() === '')}
          >
            <Text
              style={[
                styles.nextButtonText,
                (currentStep === 1 && (pictures.length === 0 || notes.trim() === '')) && styles.nextButtonTextDisabled,
              ]}
            >
              {currentStep === 3 ? 'Done' : 'Next'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Date Picker Modal */}
        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onConfirm={handleDateConfirm}
          initialDate={selectedDate}
        />

        {/* Time Picker Modal */}
        <TimePickerModal
          visible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          onConfirm={handleTimeConfirm}
          initialHour={selectedHour}
          initialMinute={selectedMinute}
        />

        {/* Step 2 Modals */}
        <StaffSelectorModal
          visible={showFoundedByModal}
          onClose={() => setShowFoundedByModal(false)}
          onSelect={setFoundedBy}
          selectedStaffId={foundedBy}
          title="Founded by"
          showMeOption={true}
          currentUserId="1"
          inputFieldPosition={foundedByFieldPosition}
        />
        <StaffSelectorModal
          visible={showRegisteredByModal}
          onClose={() => setShowRegisteredByModal(false)}
          onSelect={setRegisteredBy}
          selectedStaffId={registeredBy}
          title="Registered by"
          showMeOption={false}
          inputFieldPosition={registeredByFieldPosition}
        />
        <StatusDropdown
          visible={showStatusDropdown}
          onClose={() => setShowStatusDropdown(false)}
          onSelect={setStatus}
          selectedStatus={status}
          inputFieldPosition={statusFieldPosition}
        />
        <StoredLocationDropdown
          visible={showStoredLocationDropdown}
          onClose={() => setShowStoredLocationDropdown(false)}
          onSelect={setStoredLocation}
          selectedLocation={storedLocation}
          inputFieldPosition={storedLocationFieldPosition}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    position: 'relative',
    height: REGISTER_FORM.header.height * scaleX,
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: REGISTER_FORM.header.height * scaleX,
    backgroundColor: REGISTER_FORM.header.backgroundColor,
  },
  backButton: {
    position: 'absolute',
    left: REGISTER_FORM.header.backButton.left * scaleX,
    top: REGISTER_FORM.header.backButton.top * scaleX,
    width: REGISTER_FORM.header.backButton.width * scaleX,
    height: REGISTER_FORM.header.backButton.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
  },
  backArrow: {
    width: REGISTER_FORM.header.backButton.width * scaleX,
    height: REGISTER_FORM.header.backButton.height * scaleX,
  },
  headerTitle: {
    position: 'absolute',
    left: REGISTER_FORM.header.title.left * scaleX,
    top: REGISTER_FORM.header.title.top * scaleX,
    fontSize: REGISTER_FORM.header.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.header.title.fontWeight as any,
    color: REGISTER_FORM.header.title.color,
    zIndex: 11,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: (REGISTER_FORM.title.top - REGISTER_FORM.header.height) * scaleX,
    paddingHorizontal: 27 * scaleX,
    paddingBottom: 50 * scaleX,
  },
  title: {
    fontSize: REGISTER_FORM.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.title.fontWeight as any,
    color: REGISTER_FORM.title.color,
    marginBottom: 9 * scaleX,
  },
  stepIndicator: {
    fontSize: REGISTER_FORM.stepIndicator.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.stepIndicator.fontWeight as any,
    color: REGISTER_FORM.stepIndicator.color,
    marginBottom: 19 * scaleX,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: REGISTER_FORM.progressBar.height * scaleX,
    marginBottom: 16 * scaleX, // Relative spacing
  },
  progressBar: {
    height: REGISTER_FORM.progressBar.height * scaleX,
    borderRadius: 3 * scaleX,
  },
  progressBarActive: {
    width: REGISTER_FORM.progressBar.bars[0].width * scaleX,
    backgroundColor: REGISTER_FORM.progressBar.activeColor,
    marginRight: 9 * scaleX,
  },
  progressBarInactive: {
    width: REGISTER_FORM.progressBar.bars[1].width * scaleX,
    backgroundColor: REGISTER_FORM.progressBar.inactiveColor,
    marginRight: 9 * scaleX,
  },
  sectionLabel: {
    fontSize: REGISTER_FORM.dateTime.label.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.dateTime.label.fontWeight as any,
    color: REGISTER_FORM.dateTime.label.color,
    marginBottom: 16 * scaleX, // Relative spacing from label to input
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 24 * scaleX, // Relative spacing to next section
  },
  dateInput: {
    width: REGISTER_FORM.dateTime.dateInput.width * scaleX,
    height: REGISTER_FORM.dateTime.dateInput.height * scaleX,
    borderRadius: REGISTER_FORM.dateTime.dateInput.borderRadius * scaleX,
    borderWidth: REGISTER_FORM.dateTime.dateInput.borderWidth,
    borderColor: REGISTER_FORM.dateTime.dateInput.borderColor,
    justifyContent: 'center',
    paddingLeft: 15 * scaleX,
    marginRight: 14 * scaleX,
  },
  timeInput: {
    width: REGISTER_FORM.dateTime.timeInput.width * scaleX,
    height: REGISTER_FORM.dateTime.timeInput.height * scaleX,
    borderRadius: REGISTER_FORM.dateTime.timeInput.borderRadius * scaleX,
    borderWidth: REGISTER_FORM.dateTime.timeInput.borderWidth,
    borderColor: REGISTER_FORM.dateTime.timeInput.borderColor,
    justifyContent: 'center',
    paddingLeft: 15 * scaleX,
  },
  dateTimeText: {
    fontSize: REGISTER_FORM.dateTime.dateText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.dateTime.dateText.fontWeight as any,
    color: REGISTER_FORM.dateTime.dateText.color,
  },
  locationLabel: {
    marginTop: 0, // Already accounted in dateTimeContainer marginBottom
    marginBottom: 16 * scaleX, // Relative spacing from label to checkboxes
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 24 * scaleX, // Relative spacing to next section
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 74 * scaleX,
  },
  checkbox: {
    width: REGISTER_FORM.location.roomOption.checkboxSize * scaleX,
    height: REGISTER_FORM.location.roomOption.checkboxSize * scaleX,
    borderRadius: (REGISTER_FORM.location.roomOption.checkboxSize / 2) * scaleX,
    borderWidth: REGISTER_FORM.location.roomOption.checkboxBorderWidth,
    borderColor: REGISTER_FORM.location.roomOption.checkboxBorderColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10 * scaleX,
  },
  checkboxSelected: {
    backgroundColor: REGISTER_FORM.location.roomOption.checkboxBorderColor,
  },
  checkmark: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 16 * scaleX,
    fontWeight: 'bold' as any,
  },
  locationText: {
    fontSize: REGISTER_FORM.location.roomOption.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.location.roomOption.fontWeight as any,
    color: '#5a759d',
  },
  locationTextSelected: {
    color: REGISTER_FORM.location.roomOption.checkboxBorderColor,
  },
  sectionLabelLight: {
    fontSize: REGISTER_FORM.roomNumber.label.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.roomNumber.label.fontWeight as any,
    color: REGISTER_FORM.roomNumber.label.color,
    marginTop: 0, // Already accounted in locationContainer marginBottom
    marginBottom: 12 * scaleX, // Relative spacing from label to selector
  },
  roomSelectorWrapper: {
    position: 'relative',
    marginBottom: 24 * scaleX, // Relative spacing to next section
    zIndex: 100, // Ensure dropdown appears above other elements
  },
  roomSelector: {
    width: '100%',
    maxWidth: REGISTER_FORM.roomNumber.selector.width * scaleX,
    height: REGISTER_FORM.roomNumber.selector.height * scaleX,
    borderRadius: REGISTER_FORM.roomNumber.selector.borderRadius * scaleX,
    borderWidth: REGISTER_FORM.roomNumber.selector.borderWidth,
    borderColor: REGISTER_FORM.roomNumber.selector.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * scaleX,
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  roomSelectorContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomText: {
    fontSize: REGISTER_FORM.roomNumber.roomText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.roomNumber.roomText.fontWeight as any,
    color: REGISTER_FORM.roomNumber.roomText.color,
  },
  roomDivider: {
    width: REGISTER_FORM.roomNumber.divider.width,
    height: REGISTER_FORM.roomNumber.divider.height * scaleX,
    backgroundColor: REGISTER_FORM.roomNumber.divider.color,
    marginHorizontal: 20 * scaleX,
  },
  guestNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestText: {
    fontSize: REGISTER_FORM.roomNumber.guestText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.roomNumber.guestText.fontWeight as any,
    color: REGISTER_FORM.roomNumber.guestText.color,
  },
  spinnerIcon: {
    width: 16 * scaleX,
    height: 16 * scaleX,
    marginLeft: 24 * scaleX, // Increased spacing to match Figma - positioned further right
  },
  avatar: {
    marginLeft: 20 * scaleX,
  },
  avatarCircle: {
    width: REGISTER_FORM.roomNumber.avatar.size * scaleX,
    height: REGISTER_FORM.roomNumber.avatar.size * scaleX,
    borderRadius: (REGISTER_FORM.roomNumber.avatar.size / 2) * scaleX,
    backgroundColor: '#5a759d',
  },
  badge: {
    position: 'absolute',
    right: -10 * scaleX,
    top: -10 * scaleX,
    width: REGISTER_FORM.roomNumber.badge.size * scaleX,
    height: REGISTER_FORM.roomNumber.badge.size * scaleX,
    borderRadius: (REGISTER_FORM.roomNumber.badge.size / 2) * scaleX,
    backgroundColor: REGISTER_FORM.roomNumber.badge.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: REGISTER_FORM.roomNumber.badge.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.roomNumber.badge.fontWeight as any,
    color: REGISTER_FORM.roomNumber.badge.textColor,
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: -1000 * scaleX,
    right: -1000 * scaleX,
    bottom: -1000 * scaleX,
    backgroundColor: 'transparent',
    zIndex: 99,
  },
  roomDropdown: {
    position: 'absolute',
    top: REGISTER_FORM.roomNumber.selector.height * scaleX + 4 * scaleX,
    left: 0,
    right: 0,
    maxWidth: REGISTER_FORM.roomNumber.selector.width * scaleX,
    backgroundColor: '#ffffff',
    borderRadius: 8 * scaleX,
    borderWidth: 1,
    borderColor: '#afa9ad',
    maxHeight: 200 * scaleX,
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  roomDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * scaleX,
    paddingVertical: 12 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  roomDropdownItemSelected: {
    backgroundColor: '#f5f5f5',
  },
  roomDropdownItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomDropdownRoomText: {
    fontSize: REGISTER_FORM.roomNumber.roomText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.roomNumber.roomText.fontWeight as any,
    color: REGISTER_FORM.roomNumber.roomText.color,
  },
  roomDropdownDivider: {
    width: 0,
    height: 20 * scaleX,
    backgroundColor: REGISTER_FORM.roomNumber.divider.color,
    marginHorizontal: 20 * scaleX,
  },
  roomDropdownGuestText: {
    fontSize: REGISTER_FORM.roomNumber.guestText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.roomNumber.guestText.fontWeight as any,
    color: REGISTER_FORM.roomNumber.guestText.color,
  },
  roomDropdownCheckmark: {
    fontSize: 18 * scaleX,
    color: '#5a759d',
    fontWeight: 'bold' as any,
    marginLeft: 12 * scaleX,
  },
  picturesLabel: {
    marginTop: 0, // Already accounted in roomSelector marginBottom
    marginBottom: 16 * scaleX, // Relative spacing from label to images
  },
  picturesContainer: {
    position: 'relative',
    marginBottom: 24 * scaleX, // Relative spacing to next section
  },
  picture1Grid: {
    position: 'absolute',
    width: ((Dimensions.get('window').width - (27 * 2 * scaleX) - (12 * scaleX)) / 2), // Two columns: (container width - padding - margin) / 2
    height: REGISTER_FORM.pictures.image1.height * scaleX,
    borderRadius: REGISTER_FORM.pictures.image1.borderRadius * scaleX,
    overflow: 'hidden',
  },
  picture2: {
    position: 'absolute',
    width: ((Dimensions.get('window').width - (27 * 2 * scaleX) - (12 * scaleX)) / 2), // Same width as picture1 for two-column layout
    height: REGISTER_FORM.pictures.image2.height * scaleX,
    borderRadius: REGISTER_FORM.pictures.image2.borderRadius * scaleX,
    backgroundColor: REGISTER_FORM.pictures.image2.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture2FullWidth: {
    width: Dimensions.get('window').width - (27 * 2 * scaleX), // Full width when no pictures
    height: REGISTER_FORM.pictures.image2.height * scaleX,
    borderRadius: REGISTER_FORM.pictures.image2.borderRadius * scaleX,
    backgroundColor: REGISTER_FORM.pictures.image2.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture2Error: {
    borderWidth: 2,
    borderColor: '#ff0000', // Red border for error
  },
  addIcon: {
    width: REGISTER_FORM.pictures.addIcon.width * scaleX,
    height: REGISTER_FORM.pictures.addIcon.height * scaleX,
  },
  pictureRemoveOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24 * scaleX,
    height: 24 * scaleX,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4 * scaleX,
  },
  pictureRemoveText: {
    color: '#ffffff',
    fontSize: 18 * scaleX,
    fontWeight: 'bold' as any,
    lineHeight: 18 * scaleX,
  },
  notesContainer: {
    marginTop: 0, // Already accounted in picturesContainer marginBottom
    marginBottom: 45 * scaleX, // Space to next button (from Notes to Next button)
  },
  notesLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10 * scaleX,
  },
  notesIcon: {
    width: REGISTER_FORM.notes.icon.width * scaleX,
    height: REGISTER_FORM.notes.icon.height * scaleX,
    marginRight: 10 * scaleX,
  },
  notesLabel: {
    fontSize: REGISTER_FORM.notes.label.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.notes.label.fontWeight as any,
    color: REGISTER_FORM.notes.label.color,
  },
  notesInput: {
    width: '100%',
    maxWidth: REGISTER_FORM.notes.text.width * scaleX,
    fontSize: REGISTER_FORM.notes.text.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.notes.text.fontWeight as any,
    color: REGISTER_FORM.notes.text.color,
    minHeight: 60 * scaleX,
    textAlignVertical: 'top',
    marginBottom: 39 * scaleX,
  },
  notesDivider: {
    width: REGISTER_FORM.notes.divider.width * scaleX,
    height: REGISTER_FORM.notes.divider.height,
    backgroundColor: REGISTER_FORM.notes.divider.color,
  },
  nextButton: {
    width: REGISTER_FORM.nextButton.width * scaleX,
    height: REGISTER_FORM.nextButton.height * scaleX,
    borderRadius: REGISTER_FORM.nextButton.borderRadius * scaleX,
    backgroundColor: REGISTER_FORM.nextButton.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40 * scaleX, // Increased margin top for Done button
  },
  nextButtonDisabled: {
    backgroundColor: '#d3d3d3', // Gray background when disabled
    opacity: 0.5, // Blur effect
  },
  nextButtonText: {
    fontSize: REGISTER_FORM.nextButton.text.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.nextButton.text.fontWeight as any,
    color: REGISTER_FORM.nextButton.text.color,
  },
  nextButtonTextDisabled: {
    color: '#999999', // Gray text when disabled
  },
  // Step 2 Styles
  step2Field: {
    width: '100%',
    maxWidth: REGISTER_FORM.step2.foundedBy.field.width * scaleX,
    height: REGISTER_FORM.step2.foundedBy.field.height * scaleX,
    borderRadius: REGISTER_FORM.step2.foundedBy.field.borderRadius * scaleX,
    borderWidth: REGISTER_FORM.step2.foundedBy.field.borderWidth,
    borderColor: REGISTER_FORM.step2.foundedBy.field.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: REGISTER_FORM.step2.foundedBy.field.paddingHorizontal * scaleX,
    marginBottom: 24 * scaleX, // Relative spacing to next section
  },
  step2FieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  step2Avatar: {
    width: REGISTER_FORM.step2.foundedBy.avatar.size * scaleX,
    height: REGISTER_FORM.step2.foundedBy.avatar.size * scaleX,
    borderRadius: (REGISTER_FORM.step2.foundedBy.avatar.size / 2) * scaleX,
    marginRight: 12 * scaleX,
  },
  step2InitialsCircle: {
    width: REGISTER_FORM.step2.foundedBy.avatar.size * scaleX,
    height: REGISTER_FORM.step2.foundedBy.avatar.size * scaleX,
    borderRadius: (REGISTER_FORM.step2.foundedBy.avatar.size / 2) * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12 * scaleX,
  },
  step2InitialsText: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'bold' as any,
    color: '#ffffff',
  },
  step2FieldText: {
    fontSize: REGISTER_FORM.step2.foundedBy.name.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step2.foundedBy.name.fontWeight as any,
    color: REGISTER_FORM.step2.foundedBy.name.color,
  },
  step2SearchIcon: {
    width: REGISTER_FORM.step2.foundedBy.searchIcon.width * scaleX,
    height: REGISTER_FORM.step2.foundedBy.searchIcon.height * scaleX,
    tintColor: '#5a759d',
    marginLeft: 'auto', // Push to the right
  },
  step2StatusIcon: {
    width: REGISTER_FORM.step2.status.icon.size * scaleX,
    height: REGISTER_FORM.step2.status.icon.size * scaleX,
    marginRight: 12 * scaleX,
  },
  step2StatusCircle: {
    width: REGISTER_FORM.step2.status.icon.size * scaleX,
    height: REGISTER_FORM.step2.status.icon.size * scaleX,
    borderRadius: (REGISTER_FORM.step2.status.icon.size / 2) * scaleX,
    marginRight: 12 * scaleX,
  },
  step2Chevron: {
    width: REGISTER_FORM.step2.status.chevron.width * scaleX,
    height: REGISTER_FORM.step2.status.chevron.height * scaleX,
    tintColor: '#5a759d',
    transform: [{ rotate: '270deg' }],
  },
  // Step 3 Styles
  step3ItemImageContainer: {
    marginTop: (REGISTER_FORM.step3.itemImage.top - REGISTER_FORM.progressBar.top - REGISTER_FORM.progressBar.height - 10) * scaleX,
    marginLeft: REGISTER_FORM.step3.itemImage.left * scaleX,
    width: REGISTER_FORM.step3.itemImage.width * scaleX,
    height: REGISTER_FORM.step3.itemImage.height * scaleX,
    borderRadius: REGISTER_FORM.step3.itemImage.borderRadius * scaleX,
    overflow: 'hidden',
  },
  step3ItemImage: {
    width: '100%',
    height: '100%',
  },
  step3PicturesContainer: {
    position: 'relative',
    marginTop: (REGISTER_FORM.step3.itemImage.top - REGISTER_FORM.progressBar.top - REGISTER_FORM.progressBar.height - 10) * scaleX,
    marginLeft: 0, // No left margin, container padding handles it
    minHeight: REGISTER_FORM.pictures.image1.height * scaleX,
    marginBottom: 24 * scaleX,
  },
  step3PictureSingleContainer: {
    width: Dimensions.get('window').width - (27 * 2 * scaleX), // Full width minus container padding
    height: REGISTER_FORM.step3.itemImage.height * scaleX,
    borderRadius: REGISTER_FORM.step3.itemImage.borderRadius * scaleX,
    overflow: 'hidden',
  },
  step3PictureGridContainer: {
    position: 'absolute',
    width: ((Dimensions.get('window').width - (27 * 2 * scaleX) - (12 * scaleX)) / 2),
    height: REGISTER_FORM.pictures.image1.height * scaleX,
    borderRadius: REGISTER_FORM.pictures.image1.borderRadius * scaleX,
    overflow: 'hidden',
  },
  step3PictureImage: {
    width: '100%',
    height: '100%',
  },
  step3ItemDescriptionContainer: {
    marginTop: (REGISTER_FORM.step3.itemDescription.top - REGISTER_FORM.step3.itemImage.top - REGISTER_FORM.step3.itemImage.height) * scaleX * 0.7,
    marginLeft: REGISTER_FORM.step3.itemDescription.left * scaleX,
    width: '100%',
    paddingRight: 20 * scaleX,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  step3ItemDescription: {
    flex: 1,
    fontSize: REGISTER_FORM.step3.itemDescription.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.itemDescription.fontWeight as any,
    color: REGISTER_FORM.step3.itemDescription.color,
    marginRight: 8 * scaleX,
  },
  step3EditIcon: {
    width: REGISTER_FORM.step3.editIcon.size * scaleX,
    height: REGISTER_FORM.step3.editIcon.size * scaleX,
    marginLeft: 8 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  step3EditIconImage: {
    width: REGISTER_FORM.step3.editIcon.size * scaleX,
    height: REGISTER_FORM.step3.editIcon.size * scaleX,
  },
  step3FoundInLabel: {
    marginTop: (REGISTER_FORM.step3.foundIn.label.top - REGISTER_FORM.step3.itemDescription.top) * scaleX * 0.7,
    marginLeft: REGISTER_FORM.step3.foundIn.label.left * scaleX,
    fontSize: REGISTER_FORM.step3.foundIn.label.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.foundIn.label.fontWeight as any,
    color: REGISTER_FORM.step3.foundIn.label.color,
    marginBottom: 0,
  },
  step3FoundInContent: {
    marginTop: (REGISTER_FORM.step3.foundIn.checkbox.top - REGISTER_FORM.step3.foundIn.label.top) * scaleX * 0.5,
    marginLeft: REGISTER_FORM.step3.foundIn.checkbox.left * scaleX,
    width: '100%',
    paddingRight: 20 * scaleX,
    marginBottom: 0,
  },
  step3CheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step3Checkbox: {
    width: REGISTER_FORM.step3.foundIn.checkbox.size * scaleX,
    height: REGISTER_FORM.step3.foundIn.checkbox.size * scaleX,
    borderWidth: 2,
    borderColor: '#5a759d',
    borderRadius: 4 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8 * scaleX,
  },
  step3CheckboxChecked: {
    backgroundColor: '#5a759d',
  },
  step3Checkmark: {
    fontSize: 18 * scaleX,
    color: '#ffffff',
    fontWeight: 'bold' as any,
  },
  step3CheckboxLabel: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: '#5a759d',
  },
  step3GuestInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: (REGISTER_FORM.step3.foundIn.guestInfo.top - REGISTER_FORM.step3.foundIn.checkbox.top) * scaleX * 0.5,
    marginLeft: (REGISTER_FORM.step3.foundIn.guestInfo.left - REGISTER_FORM.step3.foundIn.checkbox.left) * scaleX,
    width: '100%',
    paddingRight: 20 * scaleX,
    marginBottom: 0,
  },
  step3GuestIcon: {
    width: 28.371 * scaleX,
    height: 29.919 * scaleX,
    marginRight: 8 * scaleX,
    marginTop: 0, // Align icon with name baseline
  },
  step3GuestDetails: {
    flex: 1,
  },
  step3GuestName: {
    fontSize: REGISTER_FORM.step3.foundIn.guestName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.foundIn.guestName.fontWeight as any,
    color: REGISTER_FORM.step3.foundIn.guestName.color,
  },
  step3RoomNumber: {
    fontSize: REGISTER_FORM.step3.foundIn.roomNumber.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.foundIn.roomNumber.fontWeight as any,
    color: REGISTER_FORM.step3.foundIn.roomNumber.color,
    marginTop: 4 * scaleX, // Reduced gap between name and room
  },
  step3EmailContainer: {
    marginTop: (REGISTER_FORM.step3.emailCheckbox.top - REGISTER_FORM.step3.foundIn.roomNumber.top) * scaleX * 0.7,
    marginLeft: REGISTER_FORM.step3.emailCheckbox.left * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
  },
  step3EmailLabel: {
    fontSize: REGISTER_FORM.step3.emailCheckbox.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: REGISTER_FORM.step3.emailCheckbox.color,
  },
  step3Divider: {
    width: '100%',
    height: REGISTER_FORM.step3.divider.height * scaleX,
    backgroundColor: REGISTER_FORM.step3.divider.backgroundColor,
    marginBottom: 0,
  },
  step3DateTimeLabel: {
    marginTop: (REGISTER_FORM.step3.dateTime.label.top - 716) * scaleX * 0.7, // Divider is at 716px
    marginLeft: REGISTER_FORM.step3.dateTime.label.left * scaleX,
    fontSize: REGISTER_FORM.step3.dateTime.label.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.dateTime.label.fontWeight as any,
    color: REGISTER_FORM.step3.dateTime.label.color,
    marginBottom: 0,
  },
  step3DateTimeContainer: {
    marginTop: (REGISTER_FORM.step3.dateTime.date.top - REGISTER_FORM.step3.dateTime.label.top) * scaleX * 0.5,
    marginLeft: REGISTER_FORM.step3.dateTime.date.left * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingRight: 20 * scaleX,
    marginBottom: 0,
  },
  step3Date: {
    fontSize: REGISTER_FORM.step3.dateTime.date.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: REGISTER_FORM.step3.dateTime.date.color,
    marginRight: 16 * scaleX,
  },
  step3Time: {
    fontSize: REGISTER_FORM.step3.dateTime.time.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'regular' as any,
    color: REGISTER_FORM.step3.dateTime.time.color,
    marginRight: 16 * scaleX,
  },
  step3FoundedByLabel: {
    marginTop: (REGISTER_FORM.step3.foundedBy.label.top - 804) * scaleX * 0.7, // Divider is at 804px
    marginLeft: REGISTER_FORM.step3.foundedBy.label.left * scaleX,
    fontSize: REGISTER_FORM.step3.foundedBy.label.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.foundedBy.label.fontWeight as any,
    color: REGISTER_FORM.step3.foundedBy.label.color,
    marginBottom: 0,
  },
  step3RegisteredByLabel: {
    marginTop: (REGISTER_FORM.step3.registeredBy.label.top - REGISTER_FORM.step3.foundedBy.department.top) * scaleX * 0.7,
    marginLeft: REGISTER_FORM.step3.registeredBy.label.left * scaleX,
    fontSize: REGISTER_FORM.step3.registeredBy.label.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.registeredBy.label.fontWeight as any,
    color: REGISTER_FORM.step3.registeredBy.label.color,
    marginBottom: 0,
  },
  step3StaffInfo: {
    marginTop: (REGISTER_FORM.step3.foundedBy.avatar.top - REGISTER_FORM.step3.foundedBy.label.top) * scaleX * 0.5,
    marginLeft: REGISTER_FORM.step3.foundedBy.avatar.left * scaleX,
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 0,
  },
  step3RegisteredByStaffInfo: {
    marginTop: (REGISTER_FORM.step3.registeredBy.avatar.top - REGISTER_FORM.step3.registeredBy.label.top) * scaleX * 0.5,
    marginLeft: REGISTER_FORM.step3.registeredBy.avatar.left * scaleX,
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 0,
  },
  step3Avatar: {
    width: REGISTER_FORM.step3.foundedBy.avatar.size * scaleX,
    height: REGISTER_FORM.step3.foundedBy.avatar.size * scaleX,
    borderRadius: (REGISTER_FORM.step3.foundedBy.avatar.size / 2) * scaleX,
    marginRight: 12 * scaleX,
    marginTop: 0, // Align avatar with name baseline
  },
  step3InitialsCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  step3InitialsText: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: 'bold' as any,
    color: '#ffffff',
  },
  step3StaffDetails: {
    flex: 1,
  },
  step3StaffName: {
    fontSize: REGISTER_FORM.step3.foundedBy.name.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.foundedBy.name.fontWeight as any,
    color: REGISTER_FORM.step3.foundedBy.name.color,
  },
  step3StaffDepartment: {
    fontSize: REGISTER_FORM.step3.foundedBy.department.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.foundedBy.department.fontWeight as any,
    color: REGISTER_FORM.step3.foundedBy.department.color,
    marginTop: 4 * scaleX, // Reduced gap between name and department
  },
  step3StatusLabel: {
    marginTop: (REGISTER_FORM.step3.status.label.top - 1021) * scaleX * 0.7, // Divider is at 1021px
    marginLeft: REGISTER_FORM.step3.status.label.left * scaleX,
    fontSize: REGISTER_FORM.step3.status.label.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.status.label.fontWeight as any,
    color: REGISTER_FORM.step3.status.label.color,
    marginBottom: 0,
  },
  step3StatusContainer: {
    marginTop: (REGISTER_FORM.step3.status.icon.top - REGISTER_FORM.step3.status.label.top) * scaleX * 0.5,
    marginLeft: REGISTER_FORM.step3.status.icon.left * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
  },
  step3StatusCircle: {
    width: REGISTER_FORM.step3.status.icon.size * scaleX,
    height: REGISTER_FORM.step3.status.icon.size * scaleX,
    borderRadius: (REGISTER_FORM.step3.status.icon.size / 2) * scaleX,
    marginRight: 8 * scaleX,
  },
  step3StatusValue: {
    fontSize: REGISTER_FORM.step3.status.value.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.status.value.fontWeight as any,
    color: REGISTER_FORM.step3.status.value.color,
  },
  step3StoredLocationLabel: {
    marginTop: (REGISTER_FORM.step3.storedLocation.label.top - REGISTER_FORM.step3.status.value.top) * scaleX * 0.5,
    marginLeft: REGISTER_FORM.step3.storedLocation.label.left * scaleX,
    fontSize: REGISTER_FORM.step3.storedLocation.label.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.storedLocation.label.fontWeight as any,
    color: REGISTER_FORM.step3.storedLocation.label.color,
    marginBottom: 0,
  },
  step3StoredLocationValue: {
    marginTop: (REGISTER_FORM.step3.storedLocation.value.top - REGISTER_FORM.step3.storedLocation.label.top) * scaleX * 0.5,
    marginLeft: REGISTER_FORM.step3.storedLocation.value.left * scaleX,
    fontSize: REGISTER_FORM.step3.storedLocation.value.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.step3.storedLocation.value.fontWeight as any,
    color: REGISTER_FORM.step3.storedLocation.value.color,
    width: '100%',
  },
});

