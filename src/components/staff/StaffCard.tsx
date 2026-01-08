import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, STAFF_CARD } from '../../constants/staffStyles';
import { StaffMember } from '../../types/staff.types';
import StaffCardProgressBar from './StaffCardProgressBar';

interface StaffCardProps {
  staff: StaffMember;
}

export default function StaffCard({ staff }: StaffCardProps) {
  const hasCurrentTask = !!staff.currentTask;
  const cardHeight = hasCurrentTask
    ? STAFF_CARD.height.standard
    : STAFF_CARD.height.compact;

  return (
    <View style={[styles.container, { height: cardHeight * scaleX }]}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {staff.avatar ? (
          <Image
            source={staff.avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : staff.initials ? (
          <View
            style={[
              styles.initialsCircle,
              { backgroundColor: staff.avatarColor || '#5a759d' },
            ]}
          >
            <Text style={styles.initialsText}>{staff.initials}</Text>
          </View>
        ) : null}
      </View>

      {/* Name */}
      <Text style={styles.name}>{staff.name}</Text>

      {/* Progress Ratio */}
      <Text style={styles.progressRatio}>
        {staff.progressRatio.completed}/{staff.progressRatio.total}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <StaffCardProgressBar
          completed={staff.progressRatio.completed}
          total={staff.progressRatio.total}
        />
      </View>

      {/* Task Statistics */}
      <View style={styles.taskStatsContainer}>
        <Text style={styles.taskStat}>
          <Text style={styles.taskStatLabel}>Inprogress. </Text>
          <Text style={styles.taskStatValue}>{staff.taskStats.inProgress}</Text>
        </Text>
        <Text style={[styles.taskStat, styles.taskStatCleaned]}>
          <Text style={styles.taskStatLabel}>Cleaned. </Text>
          <Text style={styles.taskStatValue}>{staff.taskStats.cleaned}</Text>
        </Text>
        <Text style={[styles.taskStat, styles.taskStatDirty]}>
          <Text style={styles.taskStatLabel}>Dirty. </Text>
          <Text style={styles.taskStatValue}>{staff.taskStats.dirty}</Text>
        </Text>
      </View>

      {/* Current Task */}
      {hasCurrentTask && (
        <View style={styles.currentTaskContainer}>
          <View style={styles.currentTaskCircle}>
            <Image
              source={require('../../../assets/icons/in-progress-icon.png')}
              style={styles.taskIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.currentTaskTextContainer}>
            <Text style={styles.roomText}>Room {staff.currentTask.roomNumber}</Text>
            <Text
              style={[
                styles.timer,
                {
                  color: staff.currentTask.isActive
                    ? STAFF_CARD.currentTask.timer.activeColor
                    : STAFF_CARD.currentTask.timer.inactiveColor,
                },
              ]}
            >
              {staff.currentTask.timer}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: STAFF_CARD.width * scaleX,
    backgroundColor: STAFF_CARD.backgroundColor,
    borderWidth: STAFF_CARD.borderWidth * scaleX,
    borderColor: STAFF_CARD.borderColor,
    borderRadius: STAFF_CARD.borderRadius * scaleX,
    marginHorizontal: STAFF_CARD.marginHorizontal * scaleX,
    marginBottom: STAFF_CARD.marginBottom * scaleX,
    position: 'relative',
  },
  avatarContainer: {
    position: 'absolute',
    left: STAFF_CARD.avatar.left * scaleX,
    top: STAFF_CARD.avatar.top * scaleX,
    width: STAFF_CARD.avatar.width * scaleX,
    height: STAFF_CARD.avatar.height * scaleX,
  },
  avatar: {
    width: STAFF_CARD.avatar.width * scaleX,
    height: STAFF_CARD.avatar.height * scaleX,
    borderRadius: STAFF_CARD.avatar.borderRadius * scaleX,
  },
  initialsCircle: {
    width: STAFF_CARD.avatar.width * scaleX,
    height: STAFF_CARD.avatar.height * scaleX,
    borderRadius: STAFF_CARD.avatar.borderRadius * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 13 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#ffffff',
  },
  name: {
    position: 'absolute',
    left: STAFF_CARD.name.left * scaleX,
    top: STAFF_CARD.name.top * scaleX,
    fontSize: STAFF_CARD.name.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: STAFF_CARD.name.color,
  },
  progressRatio: {
    position: 'absolute',
    right: STAFF_CARD.progressRatio.right * scaleX,
    top: STAFF_CARD.progressRatio.top * scaleX,
    fontSize: STAFF_CARD.progressRatio.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: STAFF_CARD.progressRatio.color,
  },
  progressBarContainer: {
    position: 'absolute',
    left: STAFF_CARD.progressBar.left * scaleX,
    top: STAFF_CARD.progressBar.top * scaleX,
  },
  taskStatsContainer: {
    position: 'absolute',
    left: 0,
    top: STAFF_CARD.taskStats.top * scaleX,
    width: '100%',
  },
  taskStat: {
    position: 'absolute',
    left: STAFF_CARD.taskStats.inProgress.left * scaleX,
    fontSize: STAFF_CARD.taskStats.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: STAFF_CARD.taskStats.color,
  },
  taskStatCleaned: {
    left: STAFF_CARD.taskStats.cleaned.left * scaleX,
  },
  taskStatDirty: {
    left: STAFF_CARD.taskStats.dirty.left * scaleX,
  },
  taskStatLabel: {
    fontWeight: typography.fontWeights.light as any,
  },
  taskStatValue: {
    fontWeight: typography.fontWeights.bold as any,
  },
  currentTaskContainer: {
    position: 'absolute',
    left: STAFF_CARD.currentTask.circle.left * scaleX,
    top: STAFF_CARD.currentTask.top * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentTaskCircle: {
    width: STAFF_CARD.currentTask.circle.width * scaleX,
    height: STAFF_CARD.currentTask.circle.height * scaleX,
    borderRadius: STAFF_CARD.currentTask.circle.borderRadius * scaleX,
    backgroundColor: STAFF_CARD.currentTask.circle.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskIcon: {
    width: STAFF_CARD.currentTask.bellIcon.width * scaleX,
    height: STAFF_CARD.currentTask.bellIcon.height * scaleX,
  },
  currentTaskTextContainer: {
    marginLeft: (STAFF_CARD.currentTask.roomText.left - STAFF_CARD.currentTask.circle.left - STAFF_CARD.currentTask.circle.width) * scaleX,
    justifyContent: 'center',
  },
  roomText: {
    fontSize: STAFF_CARD.currentTask.roomText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: STAFF_CARD.currentTask.roomText.color,
    lineHeight: STAFF_CARD.currentTask.roomText.fontSize * scaleX * 1.2,
  },
  timer: {
    fontSize: STAFF_CARD.currentTask.timer.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    marginTop: 2 * scaleX,
    lineHeight: STAFF_CARD.currentTask.timer.fontSize * scaleX * 1.2,
  },
});

