import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, ASSIGNED_TO } from '../../constants/roomDetailStyles';

interface AssignedToSectionProps {
  staff: {
    id: string;
    name: string;
    avatar?: any;
    initials?: string;
    avatarColor?: string;
  };
  onReassignPress?: () => void;
}

export default function AssignedToSection({
  staff,
  onReassignPress,
}: AssignedToSectionProps) {
  // Get first letter for initial if no avatar
  const initial = staff.initials || (staff.name ? staff.name.charAt(0).toUpperCase() : '?');
  
  // Generate color for initial circle based on name
  const getInitialColor = (name: string): string => {
    const colors = ['#ff4dd8', '#5a759d', '#607aa1', '#f0be1b'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.title}>Assigned to</Text>

      {/* Staff Info - Avatar or Initials */}
      {staff.avatar ? (
        <Image
          key={staff.id} // Force re-render when staff changes
          source={staff.avatar}
          style={styles.profilePicture}
          resizeMode="cover"
        />
      ) : (
        <View 
          key={staff.id} // Force re-render when staff changes
          style={[styles.initialsCircle, { backgroundColor: staff.avatarColor || getInitialColor(staff.name) }]}
        >
          <Text style={styles.initialsText}>{initial}</Text>
        </View>
      )}
      <Text style={styles.staffName}>{staff.name}</Text>

      {/* Reassign Button */}
      <TouchableOpacity
        style={styles.reassignButton}
        onPress={onReassignPress}
        activeOpacity={0.7}
      >
        <Text style={styles.reassignButtonText}>Reassign</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    minHeight: (740 - 650 + 50) * scaleX, // From Assigned to start (650) to button end (~740) + padding = 90px + 50px
    marginTop: (650 - 625) * scaleX, // Position after Guest Info divider (625px): 650 - 625 = 25px
  },
  title: {
    position: 'absolute',
    left: ASSIGNED_TO.title.left * scaleX,
    top: 0, // At top of container
    fontSize: ASSIGNED_TO.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ASSIGNED_TO.title.color,
  },
  profilePicture: {
    position: 'absolute',
    left: ASSIGNED_TO.profilePicture.left * scaleX,
    top: (ASSIGNED_TO.profilePicture.top - ASSIGNED_TO.title.top) * scaleX, // Relative to title (49px below title)
    width: ASSIGNED_TO.profilePicture.width * scaleX,
    height: ASSIGNED_TO.profilePicture.height * scaleX,
    borderRadius: (ASSIGNED_TO.profilePicture.width / 2) * scaleX,
  },
  staffName: {
    position: 'absolute',
    left: ASSIGNED_TO.staffName.left * scaleX,
    top: (ASSIGNED_TO.staffName.top - ASSIGNED_TO.title.top) * scaleX, // Relative to title (50px below title)
    fontSize: ASSIGNED_TO.staffName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ASSIGNED_TO.staffName.color,
  },
  reassignButton: {
    position: 'absolute',
    left: ASSIGNED_TO.reassignButton.left * scaleX,
    top: (ASSIGNED_TO.reassignButton.top - ASSIGNED_TO.title.top) * scaleX, // Relative to title (41px below title)
    width: ASSIGNED_TO.reassignButton.width * scaleX,
    height: ASSIGNED_TO.reassignButton.height * scaleX,
    borderRadius: ASSIGNED_TO.reassignButton.borderRadius * scaleX,
    backgroundColor: ASSIGNED_TO.reassignButton.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reassignButtonText: {
    fontSize: ASSIGNED_TO.reassignButton.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: ASSIGNED_TO.reassignButton.color,
  },
  initialsCircle: {
    position: 'absolute',
    left: ASSIGNED_TO.profilePicture.left * scaleX,
    top: (ASSIGNED_TO.profilePicture.top - ASSIGNED_TO.title.top) * scaleX,
    width: ASSIGNED_TO.profilePicture.width * scaleX,
    height: ASSIGNED_TO.profilePicture.height * scaleX,
    borderRadius: (ASSIGNED_TO.profilePicture.width / 2) * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#ffffff',
  },
});

