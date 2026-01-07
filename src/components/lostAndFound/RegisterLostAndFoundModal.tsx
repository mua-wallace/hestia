import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import { typography } from '../../theme';
import { REGISTER_FORM, scaleX, LOST_AND_FOUND_COLORS } from '../../constants/lostAndFoundStyles';
import DatePickerModal from './DatePickerModal';
import TimePickerModal from './TimePickerModal';

interface RegisterLostAndFoundModalProps {
  visible: boolean;
  onClose: () => void;
  onNext?: () => void;
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [notes, setNotes] = useState('Wrist watch found in guest bathroom whole cleaning');

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

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
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
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>Register</Text>

          {/* Step Indicator */}
          <Text style={styles.stepIndicator}>Step 1</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={[styles.progressBar, styles.progressBarInactive]} />
            <View style={[styles.progressBar, styles.progressBarInactive]} />
          </View>

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
          {selectedLocation === 'room' && (
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

          {/* Pictures Section */}
          <Text style={[styles.sectionLabel, styles.picturesLabel]}>Pictures</Text>
          <View style={styles.picturesContainer}>
            <Image
              source={require('../../../assets/images/wrist-watch.png')}
              style={styles.picture1}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.picture2} activeOpacity={0.7}>
              <Image
                source={require('../../../assets/icons/clip-board.png')}
                style={styles.addIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

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
              placeholder="Enter notes..."
              placeholderTextColor="#999999"
            />
            <View style={styles.notesDivider} />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>Next</Text>
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
    flexDirection: 'row',
    marginBottom: 24 * scaleX, // Relative spacing to next section
  },
  picture1: {
    width: REGISTER_FORM.pictures.image1.width * scaleX,
    height: REGISTER_FORM.pictures.image1.height * scaleX,
    borderRadius: REGISTER_FORM.pictures.image1.borderRadius * scaleX,
    marginRight: 12 * scaleX,
  },
  picture2: {
    width: REGISTER_FORM.pictures.image2.width * scaleX,
    height: REGISTER_FORM.pictures.image2.height * scaleX,
    borderRadius: REGISTER_FORM.pictures.image2.borderRadius * scaleX,
    backgroundColor: REGISTER_FORM.pictures.image2.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: REGISTER_FORM.pictures.addIcon.width * scaleX,
    height: REGISTER_FORM.pictures.addIcon.height * scaleX,
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
  },
  nextButtonText: {
    fontSize: REGISTER_FORM.nextButton.text.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: REGISTER_FORM.nextButton.text.fontWeight as any,
    color: REGISTER_FORM.nextButton.text.color,
  },
});

