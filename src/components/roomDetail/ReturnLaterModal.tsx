import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { typography } from '../../theme';
import { ShiftType } from '../../types/home.types';
import TimeSuggestionButton from './TimeSuggestionButton';
import AssignedToSection from './AssignedToSection';

const TIME_SUGGESTIONS = ['10 mins', '20 mins', '30 mins', '1 Hour'];
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scaleX = SCREEN_WIDTH / 430;

interface ReturnLaterModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (returnTime: string, period: 'AM' | 'PM', taskDescription?: string) => void;
  roomNumber?: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: any;
    initials?: string;
    avatarColor?: string;
    department?: string;
  };
  onReassignPress?: () => void;
  taskDescription?: string;
}

export default function ReturnLaterModal({
  visible,
  onClose,
  onConfirm,
  roomNumber,
  assignedTo,
  onReassignPress,
  taskDescription: initialTaskDescription,
}: ReturnLaterModalProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [returnTime, setReturnTime] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState(initialTaskDescription || '');
  const [isEditingTask, setIsEditingTask] = useState(false);
  
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

  // Refs for ScrollViews to control scrolling
  const dateScrollRef = useRef<ScrollView>(null);
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const periodScrollRef = useRef<ScrollView>(null);

  const ITEM_HEIGHT = 50 * scaleX;

  // Scroll to selected items on mount
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        // Scroll date to index 6 (center of the 14-day range)
        dateScrollRef.current?.scrollTo({ y: 6 * ITEM_HEIGHT, animated: false });
        
        // Scroll hour to selected hour (index is hour - 1)
        hourScrollRef.current?.scrollTo({ y: (selectedHour - 1) * ITEM_HEIGHT, animated: false });
        
        // Scroll minute to selected minute
        minuteScrollRef.current?.scrollTo({ y: selectedMinute * ITEM_HEIGHT, animated: false });
        
        // Scroll period to selected period (0 for AM, 1 for PM)
        const periodIndex = selectedPeriod === 'AM' ? 0 : 1;
        periodScrollRef.current?.scrollTo({ y: periodIndex * ITEM_HEIGHT, animated: false });
      }, 100);
    }
  }, [visible]);

  const handleSuggestionPress = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    
    // Calculate new time based on suggestion from CURRENT picker state
    let minutesToAdd = 0;
    
    if (suggestion === '1 Hour') {
      minutesToAdd = 60;
    } else {
      minutesToAdd = parseInt(suggestion.replace(' mins', ''));
    }
    
    // Create date from current picker selections
    const currentDate = new Date(selectedDate);
    let hour24 = selectedPeriod === 'PM' ? (selectedHour === 12 ? 12 : selectedHour + 12) : (selectedHour === 12 ? 0 : selectedHour);
    currentDate.setHours(hour24, selectedMinute, 0, 0);
    
    // Add the minutes from suggestion
    const newTime = new Date(currentDate.getTime() + minutesToAdd * 60 * 1000);
    const newHour24 = newTime.getHours();
    const newMinute = newTime.getMinutes();
    const newPeriod: ShiftType = newHour24 >= 12 ? 'PM' : 'AM';
    const newHour12 = newHour24 === 0 ? 12 : newHour24 > 12 ? newHour24 - 12 : newHour24;
    
    // Update state
    setSelectedDate(newTime);
    setSelectedHour(newHour12);
    setSelectedMinute(newMinute);
    setSelectedPeriod(newPeriod);
    
    // Scroll to the new positions
    setTimeout(() => {
      // Scroll date to center (index 6 in the 14-day range)
      dateScrollRef.current?.scrollTo({ y: 6 * ITEM_HEIGHT, animated: true });
      hourScrollRef.current?.scrollTo({ y: (newHour12 - 1) * ITEM_HEIGHT, animated: true });
      minuteScrollRef.current?.scrollTo({ y: newMinute * ITEM_HEIGHT, animated: true });
      const periodIndex = newPeriod === 'AM' ? 0 : 1;
      periodScrollRef.current?.scrollTo({ y: periodIndex * ITEM_HEIGHT, animated: true });
    }, 100);
    
    const timeString = `${newHour12.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')} ${newPeriod}`;
    setReturnTime(timeString);
  };
  
  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Add empty slots for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };
  
  const formatDateHeader = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  };
  
  const getDayName = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };
  
  // Check if a date/time combination is in the past
  const isDateTimeInPast = (date: Date, hour: number, minute: number, period: 'AM' | 'PM') => {
    const now = new Date();
    const checkDate = new Date(date);
    
    // Convert 12-hour to 24-hour format
    let hour24 = period === 'PM' ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
    checkDate.setHours(hour24, minute, 0, 0);
    
    return checkDate.getTime() < now.getTime();
  };

  // Check if we're at the current date
  const isCurrentDate = () => {
    const now = new Date();
    const selected = new Date(selectedDate);
    return now.toDateString() === selected.toDateString();
  };

  // Check if selected date/time is in the past
  const isSelectedDateTimeInPast = () => {
    return isDateTimeInPast(selectedDate, selectedHour, selectedMinute, selectedPeriod);
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
  
  const selectDay = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
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
    setReturnTime(timeString);
    
    // Update the displayed time in the header (you can add this to state if needed)
    console.log('Return Later time set:', timeString, 'on', selectedDate.toDateString());
  };

  const handleConfirm = () => {
    // Use the selected time from the picker
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    onConfirm(timeString, selectedPeriod, taskDescription);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Modal Overlay - White background starting after header */}
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>Return Later</Text>

            {/* Selected Time Display */}
            {returnTime && (
              <Text style={styles.selectedTimeDisplay}>
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {returnTime}
              </Text>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Suggestions Label */}
            <Text style={styles.suggestionsLabel}>Suggestions</Text>

            {/* Time Suggestions Buttons */}
            <View style={styles.suggestionsButtons}>
              {TIME_SUGGESTIONS.map((suggestion) => (
                <TimeSuggestionButton
                  key={suggestion}
                  label={suggestion}
                  isSelected={selectedSuggestion === suggestion}
                  onPress={() => handleSuggestionPress(suggestion)}
                />
              ))}
            </View>

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

            {/* Confirm Button */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>

            {/* Assigned To Title - Outside the card */}
            {assignedTo && (
              <Text style={styles.assignedToTitle}>Assigned to</Text>
            )}

            {/* Card Container for Assigned to and Task */}
            <View style={styles.assignedTaskCard}>
              {/* Assigned To Section */}
              {assignedTo && (
                <AssignedToSection
                  staff={assignedTo}
                  onReassignPress={() => {
                    onClose();
                    setTimeout(() => {
                      onReassignPress?.();
                    }, 100);
                  }}
                />
              )}

              {/* Divider between Assigned to and Task */}
              {assignedTo && <View style={styles.cardDivider} />}

                {/* Task Section */}
                <View style={styles.taskSection}>
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle}>Task</Text>
                    {!isEditingTask && !taskDescription && (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setIsEditingTask(true)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.addButtonText}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {isEditingTask || taskDescription ? (
                    <TextInput
                      style={styles.taskInput}
                      value={taskDescription}
                      onChangeText={setTaskDescription}
                      placeholder="Enter task description..."
                      placeholderTextColor="#999999"
                      multiline
                      autoFocus={isEditingTask}
                      onBlur={() => {
                        if (!taskDescription) {
                          setIsEditingTask(false);
                        }
                      }}
                    />
                  ) : null}
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
    top: 232 * scaleX,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200 * scaleX, // Extra padding to ensure Confirm button and card are visible
  },
  
  // Title
  title: {
    marginTop: 21 * scaleX,
    marginLeft: 24 * scaleX,
    fontSize: 20 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700',
    color: '#607aa1',
  },

  selectedTimeDisplay: {
    marginTop: 8 * scaleX,
    marginLeft: 24 * scaleX,
    fontSize: 16 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '400',
    color: '#5a759d',
  },
  
  // Instruction
  instruction: {
    marginTop: 7 * scaleX,
    marginLeft: 24 * scaleX,
    marginRight: 24 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: 'Inter',
    fontWeight: '300',
    color: '#000000',
    lineHeight: 15 * scaleX,
  },
  
  // Divider
  divider: {
    marginTop: 17 * scaleX,
    marginHorizontal: 12 * scaleX,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  
  // Suggestions Label
  suggestionsLabel: {
    marginTop: 24 * scaleX,
    marginLeft: 24 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '300',
    color: '#000000',
  },
  
  // Suggestions Buttons Container
  suggestionsButtons: {
    marginTop: 12 * scaleX,
    marginLeft: 32 * scaleX,
    flexDirection: 'row',
    gap: 13 * scaleX,
    flexWrap: 'wrap',
  },
  
  // Date & Time Picker Container
  dateTimePickerContainer: {
    marginTop: 32 * scaleX,
    marginHorizontal: 35 * scaleX, // Same as confirm button
    height: 302 * scaleX,
    backgroundColor: '#FFFFFF',
  },
  
  // Picker Header
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
    color: '#C7C7CC', // Light gray matching iOS style in Figma
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
  
  // Wheel Picker Container
  wheelPickerContainer: {
    flexDirection: 'row',
    height: 250 * scaleX,
    position: 'relative',
    alignItems: 'center',
  },
  
  // Selection Dividers (above and below selected item)
  selectionDividerTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100 * scaleX, // 40% of 250px = 100px
    height: 1,
    backgroundColor: '#E0E0E0',
    zIndex: 10,
  },
  
  selectionDividerBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 150 * scaleX, // 60% of 250px = 150px
    height: 1,
    backgroundColor: '#E0E0E0',
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
  
  // Date text styles (matching Figma)
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
  
  // Number text styles (hour, minute, AM/PM - matching Figma)
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
  
  // Confirm Button
  confirmButton: {
    marginTop: 40 * scaleX,
    marginHorizontal: 35 * scaleX,
    height: 70 * scaleX,
    backgroundColor: '#5a759d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  confirmButtonText: {
    fontSize: 18 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '400',
    color: '#FFFFFF',
  },
  
  // Assigned To Title (outside card)
  assignedToTitle: {
    marginTop: 30 * scaleX,
    marginLeft: 32 * scaleX,
    marginBottom: 12 * scaleX,
    fontSize: 15 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700',
    color: '#000000',
  },
  
  // Card Container for Assigned to and Task
  assignedTaskCard: {
    marginHorizontal: 35 * scaleX, // Same as confirm button
    minHeight: 181 * scaleX, // Min height from Figma, can grow
    backgroundColor: '#f9fafc',
    borderRadius: 9 * scaleX,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    paddingHorizontal: 16 * scaleX,
    paddingTop: 12 * scaleX, // Adjusted for proper spacing
    paddingBottom: 100 * scaleX, // Extra padding at bottom for task section
    marginBottom: 30 * scaleX,
  },
  
  // Divider between Assigned to and Task
  cardDivider: {
    position: 'absolute',
    left: 0, // Full width divider
    top: 94 * scaleX, // Position from Figma (1113 - 1019 = 94px from card top)
    width: 390 * scaleX, // Full card width
    height: 1,
    backgroundColor: '#e3e3e3',
    zIndex: 2,
  },
  
  // Task Section
  taskSection: {
    position: 'absolute',
    left: 16 * scaleX, // Match card padding
    right: 16 * scaleX, // Match card padding
    top: 102 * scaleX, // Below divider (94px) + 8px spacing
    paddingHorizontal: 0,
  },
  
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10 * scaleX,
    width: '100%',
  },
  
  taskTitle: {
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700',
    color: '#000000',
    flex: 0, // Don't grow
  },
  
  addButton: {
    width: 74 * scaleX,
    height: 39 * scaleX,
    borderRadius: 41 * scaleX,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // Don't shrink
  },
  
  addButtonText: {
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '300',
    color: '#000000',
  },
  
  taskInput: {
    fontSize: 13 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '300',
    color: '#000000',
    lineHeight: 18 * scaleX,
    minHeight: 60 * scaleX,
    textAlignVertical: 'top',
    padding: 0,
  },
});
