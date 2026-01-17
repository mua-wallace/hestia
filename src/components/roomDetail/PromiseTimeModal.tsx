import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { typography } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scaleX = SCREEN_WIDTH / 430;

interface PromiseTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (promiseTime: string, period: 'AM' | 'PM') => void;
  roomNumber?: string;
}

export default function PromiseTimeModal({
  visible,
  onClose,
  onConfirm,
  roomNumber,
}: PromiseTimeModalProps) {
  // Date and Time picker state - Initialize with current date/time
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedHour, setSelectedHour] = useState(() => {
    const now = new Date();
    const hour24 = now.getHours();
    return hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  });
  const [selectedMinute, setSelectedMinute] = useState(() => new Date().getMinutes());
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(() => {
    const now = new Date();
    return now.getHours() >= 12 ? 'PM' : 'AM';
  });

  // State to track if time has been set
  const [promiseTime, setPromiseTime] = useState<string>('');

  // Refs for ScrollViews to control scrolling
  const dateScrollRef = useRef<ScrollView>(null);
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const periodScrollRef = useRef<ScrollView>(null);

  const ITEM_HEIGHT = 50 * scaleX;

  // Reset to current time and scroll to selected items when modal opens
  useEffect(() => {
    if (visible) {
      // Reset to current date/time
      const now = new Date();
      setSelectedDate(now);
      
      const hour24 = now.getHours();
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      setSelectedHour(hour12);
      setSelectedMinute(now.getMinutes());
      setSelectedPeriod(now.getHours() >= 12 ? 'PM' : 'AM');
      
      setPromiseTime(''); // Reset when modal opens
      
      setTimeout(() => {
        // Scroll date to index 6 (center of the 14-day range)
        dateScrollRef.current?.scrollTo({ y: 6 * ITEM_HEIGHT, animated: false });
        
        // Scroll hour to current hour (index is hour - 1)
        hourScrollRef.current?.scrollTo({ y: (hour12 - 1) * ITEM_HEIGHT, animated: false });
        
        // Scroll minute to current minute
        minuteScrollRef.current?.scrollTo({ y: now.getMinutes() * ITEM_HEIGHT, animated: false });
        
        // Scroll period to current period (0 for AM, 1 for PM)
        const periodIndex = now.getHours() >= 12 ? 1 : 0;
        periodScrollRef.current?.scrollTo({ y: periodIndex * ITEM_HEIGHT, animated: false });
      }, 100);
    }
  }, [visible]);

  const getDayName = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  // Check if we're at the current date
  const isCurrentDate = () => {
    const now = new Date();
    const selected = new Date(selectedDate);
    return now.toDateString() === selected.toDateString();
  };

  const changeDay = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    
    // Don't allow going to past dates
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const checkDate = new Date(newDate);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() < now.getTime()) {
      return; // Don't allow past dates
    }
    
    setSelectedDate(newDate);
    
    // Scroll to center the selected date (always at index 6 in the 14-day range)
    setTimeout(() => {
      dateScrollRef.current?.scrollTo({ y: 6 * ITEM_HEIGHT, animated: true });
    }, 100);
  };

  // Handle scroll events to update selected values
  const handleDateScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    // Index 6 is the center (selected date), calculate the actual date relative to current selectedDate
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() + index - 6);
    
    // Check if date is in the past
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const isPast = checkDate.getTime() < now.getTime();
    
    // Only update if the date actually changed and is not in the past
    if (date.toDateString() !== selectedDate.toDateString() && !isPast) {
      setSelectedDate(date);
    }
  };
  
  const handleDateScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    // Ensure we're at index 6 (center) and update selectedDate
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() + index - 6);
    
    // Check if date is in the past
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const isPast = checkDate.getTime() < now.getTime();
    
    if (!isPast) {
      setSelectedDate(date);
      // Scroll to center to ensure selected date is always between dividers
      dateScrollRef.current?.scrollTo({ y: 6 * ITEM_HEIGHT, animated: true });
    } else {
      // If scrolled to past date, scroll back to current date
      const currentDate = new Date();
      const selected = new Date(selectedDate);
      const daysDiff = Math.floor((currentDate.getTime() - selected.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff !== 0) {
        setSelectedDate(currentDate);
        dateScrollRef.current?.scrollTo({ y: 6 * ITEM_HEIGHT, animated: true });
      }
    }
  };

  const handleHourScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const hour = index + 1;
    if (hour >= 1 && hour <= 12) {
      setSelectedHour(hour);
    }
  };

  const handleHourScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const hour = index + 1;
    if (hour >= 1 && hour <= 12) {
      // Check if this hour is in the past (only when on current date)
      let isPast = false;
      if (isCurrentDate()) {
        const now = new Date();
        const currentHour24 = now.getHours();
        const currentHour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24;
        const currentPeriod = currentHour24 >= 12 ? 'PM' : 'AM';
        
        if (selectedPeriod === currentPeriod) {
          isPast = hour < currentHour12;
        } else if (selectedPeriod === 'AM' && currentPeriod === 'PM') {
          isPast = true;
        }
      }
      
      if (!isPast) {
        setSelectedHour(hour);
        hourScrollRef.current?.scrollTo({ y: (hour - 1) * ITEM_HEIGHT, animated: true });
      } else {
        // Scroll back to current hour
        const now = new Date();
        const currentHour24 = now.getHours();
        const currentHour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24;
        setSelectedHour(currentHour12);
        hourScrollRef.current?.scrollTo({ y: (currentHour12 - 1) * ITEM_HEIGHT, animated: true });
      }
    }
  };

  const handleMinuteScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const minute = Math.round(offsetY / ITEM_HEIGHT);
    if (minute >= 0 && minute <= 59) {
      setSelectedMinute(minute);
    }
  };

  const handleMinuteScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const minute = Math.round(offsetY / ITEM_HEIGHT);
    if (minute >= 0 && minute <= 59) {
      // Check if this minute is in the past (only when on current date and current hour)
      let isPast = false;
      if (isCurrentDate()) {
        const now = new Date();
        const currentHour24 = now.getHours();
        const currentHour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24;
        const currentPeriod = currentHour24 >= 12 ? 'PM' : 'AM';
        const currentMinute = now.getMinutes();
        
        if (selectedHour === currentHour12 && selectedPeriod === currentPeriod) {
          isPast = minute < currentMinute;
        } else if (selectedPeriod === 'AM' && currentPeriod === 'PM') {
          isPast = true;
        } else if (selectedPeriod === currentPeriod && selectedHour < currentHour12) {
          isPast = true;
        }
      }
      
      if (!isPast) {
        setSelectedMinute(minute);
        minuteScrollRef.current?.scrollTo({ y: minute * ITEM_HEIGHT, animated: true });
      } else {
        // Scroll back to current minute
        const now = new Date();
        const currentMinute = now.getMinutes();
        setSelectedMinute(currentMinute);
        minuteScrollRef.current?.scrollTo({ y: currentMinute * ITEM_HEIGHT, animated: true });
      }
    }
  };

  const handlePeriodScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setSelectedPeriod(index === 0 ? 'AM' : 'PM');
  };

  const handlePeriodScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const period = index === 0 ? 'AM' : 'PM';
    
    // Check if AM is in the past (only when on current date and we're in PM)
    let isPast = false;
    if (isCurrentDate() && period === 'AM') {
      const now = new Date();
      const currentPeriod = now.getHours() >= 12 ? 'PM' : 'AM';
      if (currentPeriod === 'PM') {
        isPast = true;
      }
    }
    
    if (!isPast) {
      setSelectedPeriod(period);
      periodScrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    } else {
      // Scroll back to current period
      const now = new Date();
      const currentPeriod = now.getHours() >= 12 ? 'PM' : 'AM';
      setSelectedPeriod(currentPeriod);
      const periodIndex = currentPeriod === 'AM' ? 0 : 1;
      periodScrollRef.current?.scrollTo({ y: periodIndex * ITEM_HEIGHT, animated: true });
    }
  };

  const handleDone = () => {
    // Format the selected date and time
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    const dateTimeString = `${selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${timeString}`;
    setPromiseTime(dateTimeString);
    
    // Confirm and close modal
    onConfirm(timeString, selectedPeriod);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Modal Overlay - White background */}
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>Promise time</Text>

            {/* Selected Time Display */}
            {promiseTime && (
              <Text style={styles.selectedTimeDisplay}>
                {promiseTime}
              </Text>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Date & Time Picker - Interactive Wheel Style */}
            <View style={styles.dateTimePickerContainer}>
              {/* Navigation Header */}
              <View style={styles.pickerHeader}>
                <View style={styles.navArrows}>
                  <TouchableOpacity 
                    onPress={() => changeDay(-1)} 
                    style={styles.navButton}
                    disabled={isCurrentDate()}
                  >
                    <Text style={[
                      styles.navArrow,
                      isCurrentDate() && styles.navArrowDisabled
                    ]}>‹</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => changeDay(1)} 
                    style={styles.navButton}
                  >
                    <Text style={[
                      styles.navArrow,
                      styles.navArrowActive
                    ]}>›</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleDone}>
                  <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
              </View>

              {/* Wheel Picker - 4 Columns */}
              <View style={styles.wheelPickerContainer}>
                {/* Selection Dividers */}
                <View style={styles.selectionDividerTop} />
                <View style={styles.selectionDividerBottom} />
                
                {/* Date Column */}
                <View style={styles.wheelColumn}>
                  <ScrollView 
                    ref={dateScrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.wheelScrollContent}
                    snapToInterval={50 * scaleX}
                    decelerationRate="fast"
                    onScroll={handleDateScroll}
                    onMomentumScrollEnd={handleDateScrollEnd}
                    scrollEventThrottle={16}
                  >
                    {[...Array(14)].map((_, i) => {
                      const date = new Date(selectedDate);
                      date.setDate(selectedDate.getDate() + i - 6); // Show 6 days before and 7 days after selected date
                      const isSelected = date.toDateString() === selectedDate.toDateString();
                      
                      // Check if date is in the past
                      const now = new Date();
                      now.setHours(0, 0, 0, 0);
                      const checkDate = new Date(date);
                      checkDate.setHours(0, 0, 0, 0);
                      const isPast = checkDate.getTime() < now.getTime();
                      
                      const dayName = getDayName(date);
                      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                      const dayNum = date.getDate();
                      
                      return (
                        <TouchableOpacity
                          key={date.toDateString()}
                          onPress={() => {
                            if (!isPast) {
                              setSelectedDate(date);
                            }
                          }}
                          style={styles.wheelItem}
                          disabled={isPast}
                        >
                          <Text 
                            numberOfLines={1}
                            ellipsizeMode="clip"
                            style={[
                              styles.wheelDateText,
                              isSelected && styles.wheelSelectedDateText,
                              isPast && styles.wheelDateTextDisabled
                            ]}
                          >
                            {dayName} {monthName} {dayNum}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Hour Column */}
                <View style={styles.wheelColumn}>
                  <ScrollView 
                    ref={hourScrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.wheelScrollContent}
                    snapToInterval={50 * scaleX}
                    decelerationRate="fast"
                    onScroll={handleHourScroll}
                    onMomentumScrollEnd={handleHourScrollEnd}
                    scrollEventThrottle={16}
                  >
                    {[...Array(12)].map((_, i) => {
                      const hour = i + 1;
                      const isSelected = selectedHour === hour;
                      
                      // Check if this hour is in the past (only when on current date)
                      let isPast = false;
                      if (isCurrentDate()) {
                        const now = new Date();
                        const currentHour24 = now.getHours();
                        const currentHour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24;
                        const currentPeriod = currentHour24 >= 12 ? 'PM' : 'AM';
                        
                        // Check if this hour is before current hour (same period) or in previous period
                        if (selectedPeriod === currentPeriod) {
                          isPast = hour < currentHour12;
                        } else if (selectedPeriod === 'AM' && currentPeriod === 'PM') {
                          isPast = true; // All AM hours are in the past if we're in PM
                        }
                      }
                      
                      return (
                        <TouchableOpacity
                          key={`hour-${hour}`}
                          onPress={() => {
                            if (!isPast) {
                              setSelectedHour(hour);
                            }
                          }}
                          style={styles.wheelItem}
                          disabled={isPast}
                        >
                          <Text style={[
                            styles.wheelNumberText,
                            isSelected && styles.wheelSelectedNumberText,
                            isPast && styles.wheelNumberTextDisabled
                          ]}>
                            {hour}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Minute Column */}
                <View style={styles.wheelColumn}>
                  <ScrollView 
                    ref={minuteScrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.wheelScrollContent}
                    snapToInterval={50 * scaleX}
                    decelerationRate="fast"
                    onScroll={handleMinuteScroll}
                    onMomentumScrollEnd={handleMinuteScrollEnd}
                    scrollEventThrottle={16}
                  >
                    {[...Array(60)].map((_, i) => {
                      const isSelected = selectedMinute === i;
                      
                      // Check if this minute is in the past (only when on current date and current hour)
                      let isPast = false;
                      if (isCurrentDate()) {
                        const now = new Date();
                        const currentHour24 = now.getHours();
                        const currentHour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24;
                        const currentPeriod = currentHour24 >= 12 ? 'PM' : 'AM';
                        const currentMinute = now.getMinutes();
                        
                        // Check if we're in the same hour and period
                        if (selectedHour === currentHour12 && selectedPeriod === currentPeriod) {
                          isPast = i < currentMinute;
                        } else if (selectedPeriod === 'AM' && currentPeriod === 'PM') {
                          isPast = true; // All AM minutes are in the past if we're in PM
                        } else if (selectedPeriod === currentPeriod && selectedHour < currentHour12) {
                          isPast = true; // Past hour in same period
                        }
                      }
                      
                      return (
                        <TouchableOpacity
                          key={`minute-${i}`}
                          onPress={() => {
                            if (!isPast) {
                              setSelectedMinute(i);
                            }
                          }}
                          style={styles.wheelItem}
                          disabled={isPast}
                        >
                          <Text style={[
                            styles.wheelNumberText,
                            isSelected && styles.wheelSelectedNumberText,
                            isPast && styles.wheelNumberTextDisabled
                          ]}>
                            {i.toString().padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* AM/PM Column */}
                <View style={styles.wheelColumn}>
                  <ScrollView 
                    ref={periodScrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.wheelScrollContent}
                    snapToInterval={50 * scaleX}
                    decelerationRate="fast"
                    onScroll={handlePeriodScroll}
                    onMomentumScrollEnd={handlePeriodScrollEnd}
                    scrollEventThrottle={16}
                  >
                    {['AM', 'PM'].map((period) => {
                      const isSelected = selectedPeriod === period;
                      
                      // Check if AM is in the past (only when on current date and we're in PM)
                      let isPast = false;
                      if (isCurrentDate() && period === 'AM') {
                        const now = new Date();
                        const currentPeriod = now.getHours() >= 12 ? 'PM' : 'AM';
                        if (currentPeriod === 'PM') {
                          isPast = true; // AM is in the past if we're in PM
                        }
                      }
                      
                      return (
                        <TouchableOpacity
                          key={period}
                          onPress={() => {
                            if (!isPast) {
                              setSelectedPeriod(period as 'AM' | 'PM');
                            }
                          }}
                          style={styles.wheelItem}
                          disabled={isPast}
                        >
                          <Text style={[
                            styles.wheelNumberText,
                            isSelected && styles.wheelSelectedNumberText,
                            isPast && styles.wheelNumberTextDisabled
                          ]}>
                            {period}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    position: 'absolute',
    top: 232 * scaleX, // Start after header (same as Return Later modal)
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40 * scaleX,
  },
  title: {
    marginTop: 12,
    marginLeft: 24 * scaleX,
    fontSize: 20 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700',
    color: '#607aa1',
  },
  instruction: {
    marginTop: 7 * scaleX, // Same as Return Later modal
    marginLeft: 24 * scaleX, // Same as Return Later modal
    fontSize: 14 * scaleX,
    fontFamily: 'Inter',
    fontWeight: '300',
    color: '#000000',
    lineHeight: 15 * scaleX,
  },
  selectedTimeDisplay: {
    marginTop: 7 * scaleX,
    marginLeft: 24 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '400',
    color: '#5a759d',
  },
  divider: {
    marginTop: 17 * scaleX, // Same as Return Later modal
    marginHorizontal: 12 * scaleX, // Same as Return Later modal
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dateTimePickerContainer: {
    marginTop: 32 * scaleX, // Same as Return Later modal
    marginHorizontal: 35 * scaleX, // Same as Return Later modal
    height: 302 * scaleX,
    backgroundColor: '#FFFFFF',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16 * scaleX,
    paddingTop: 12 * scaleX,
    paddingBottom: 12 * scaleX,
    backgroundColor: '#F2F2F7', // Light gray background for entire header
    borderRadius: 10 * scaleX,
    marginBottom: 8 * scaleX,
  },
  navArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20 * scaleX,
  },
  navButton: {
    width: 40 * scaleX,
    height: 40 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrow: {
    fontSize: 36 * scaleX,
    color: '#C7C7CC', // Light gray color
    fontFamily: 'Helvetica',
    fontWeight: '300',
    lineHeight: 36 * scaleX,
  },
  navArrowActive: {
    color: '#007AFF', // iOS blue - active color
  },
  navArrowDisabled: {
    color: '#E5E5EA', // Very light gray - disabled
    opacity: 0.5,
  },
  doneButton: {
    fontSize: 17 * scaleX,
    color: '#007AFF', // iOS blue matching Figma
    fontFamily: 'Helvetica',
    fontWeight: '400',
  },
  wheelPickerContainer: {
    flexDirection: 'row',
    height: 250 * scaleX,
    position: 'relative',
    alignItems: 'center',
  },
  selectionDividerTop: {
    position: 'absolute',
    top: 100 * scaleX, // Center of picker (250 / 2 - 25 = 100)
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E5EA',
    zIndex: 10,
  },
  selectionDividerBottom: {
    position: 'absolute',
    top: 150 * scaleX, // Center + item height (100 + 50 = 150)
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E5EA',
    zIndex: 10,
  },
  wheelColumn: {
    flex: 1,
    height: '100%',
  },
  wheelScrollContent: {
    paddingTop: 100 * scaleX, // Padding to center first item between dividers
    paddingBottom: 100 * scaleX, // Padding to center last item between dividers
  },
  wheelItem: {
    height: 50 * scaleX, // Exact height between dividers (150 - 100 = 50px)
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2 * scaleX,
  },
  wheelDateText: {
    fontSize: 16 * scaleX,
    color: '#CCCCCC',
    fontFamily: 'Helvetica',
    fontWeight: '300',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  wheelSelectedDateText: {
    fontSize: 16 * scaleX,
    color: '#000000',
    fontFamily: 'Helvetica',
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  wheelDateTextDisabled: {
    color: '#E5E5EA',
    opacity: 0.5,
  },
  wheelNumberText: {
    fontSize: 20 * scaleX,
    color: '#CCCCCC',
    fontFamily: 'Helvetica',
    fontWeight: '300',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  wheelSelectedNumberText: {
    fontSize: 20 * scaleX,
    color: '#000000',
    fontFamily: 'Helvetica',
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  wheelNumberTextDisabled: {
    color: '#E5E5EA',
    opacity: 0.5,
  },
});
