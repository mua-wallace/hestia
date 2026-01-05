import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PROMISE_TIME_MODAL, scaleX } from '../../constants/promiseTimeModalStyles';
import TimePickerWheel from '../shared/TimePickerWheel';

interface PromiseTimePickerContainerProps {
  selectedHour: number; // 0-23
  selectedMinute: number; // 0-59
  selectedPeriod: 'AM' | 'PM';
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
}

export default function PromiseTimePickerContainer({
  selectedHour,
  selectedMinute,
  selectedPeriod,
  onHourChange,
  onMinuteChange,
}: PromiseTimePickerContainerProps) {
  // Generate hours array (1-12 for 12-hour format)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Generate minutes array (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // Convert 24-hour to 12-hour format for display
  const getDisplayHour = (hour24: number): number => {
    if (hour24 === 0) return 12; // Midnight
    if (hour24 > 12) return hour24 - 12; // Afternoon
    return hour24;
  };

  // Convert 12-hour display hour back to 24-hour format
  const get24Hour = (displayHour: number, period: 'AM' | 'PM'): number => {
    if (period === 'AM') {
      return displayHour === 12 ? 0 : displayHour;
    } else {
      return displayHour === 12 ? 12 : displayHour + 12;
    }
  };

  const displayHour = getDisplayHour(selectedHour);
  const selectedMinuteStr = selectedMinute.toString().padStart(2, '0');

  const handleHourChange = (value: string | number) => {
    const newDisplayHour = typeof value === 'number' ? value : parseInt(value, 10);
    const new24Hour = get24Hour(newDisplayHour, selectedPeriod);
    onHourChange(new24Hour);
  };

  const handleMinuteChange = (value: string | number) => {
    const newMinute = typeof value === 'number' ? value : parseInt(value, 10);
    onMinuteChange(newMinute);
  };

  return (
    <View style={styles.container}>
      <View style={styles.hoursColumn}>
        <TimePickerWheel
          values={hours}
          selectedValue={displayHour}
          onValueChange={handleHourChange}
          itemHeight={PROMISE_TIME_MODAL.timePicker.itemHeight}
          snapInterval={PROMISE_TIME_MODAL.timePicker.itemHeight}
          width={PROMISE_TIME_MODAL.timePicker.columnWidth}
        />
      </View>
      <View style={styles.minutesColumn}>
        <TimePickerWheel
          values={minutes}
          selectedValue={selectedMinuteStr}
          onValueChange={handleMinuteChange}
          itemHeight={PROMISE_TIME_MODAL.timePicker.itemHeight}
          snapInterval={PROMISE_TIME_MODAL.timePicker.itemHeight}
          width={PROMISE_TIME_MODAL.timePicker.columnWidth}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: PROMISE_TIME_MODAL.timePicker.height * scaleX,
    width: '100%',
  },
  hoursColumn: {
    position: 'absolute',
    // Hours column is positioned absolutely relative to screen (from Figma calc(50% - 43.7px))
    left: PROMISE_TIME_MODAL.timePicker.hoursColumnLeft * scaleX,
    top: 0,
  },
  minutesColumn: {
    position: 'absolute',
    // Minutes column is positioned absolutely relative to screen (from Figma calc(50% + 73.06px))
    left: PROMISE_TIME_MODAL.timePicker.minutesColumnLeft * scaleX,
    top: 0,
  },
});

