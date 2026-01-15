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
    department?: string; // Department/role (e.g., "HSK")
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
      {/* Left Column: Profile Picture, Name, Department */}
      <View style={styles.leftColumn}>
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
        {/* Name and Department Column */}
        <View style={styles.nameColumn}>
          <Text style={styles.staffName}>{staff.name}</Text>
          {/* Department/Role - show if available */}
          {staff.department && (
            <Text style={styles.department}>{staff.department}</Text>
          )}
        </View>
      </View>

      {/* Right Column: Reassign Button */}
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
    position: 'absolute',
    top: 0, // Start at top of card content area
    left: 0,
    width: '100%',
    height: 80 * scaleX, // Height up to divider (80px from card content top per Figma)
    zIndex: 1, // Below divider, above Task section
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'hidden', // Ensure content doesn't extend beyond container
  },
  leftColumn: {
    flexDirection: 'row', // Change to row to position name next to picture
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: ASSIGNED_TO.profilePicture.top * scaleX,
  },
  profilePicture: {
    width: ASSIGNED_TO.profilePicture.width * scaleX,
    height: ASSIGNED_TO.profilePicture.height * scaleX,
    borderRadius: (ASSIGNED_TO.profilePicture.width / 2) * scaleX,
    marginLeft: ASSIGNED_TO.profilePicture.left * scaleX,
    marginRight: (ASSIGNED_TO.staffName.left - ASSIGNED_TO.profilePicture.left - ASSIGNED_TO.profilePicture.width) * scaleX, // Space between picture and name
  },
  staffName: {
    fontSize: ASSIGNED_TO.staffName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ASSIGNED_TO.staffName.color,
    marginTop: (ASSIGNED_TO.staffName.top - ASSIGNED_TO.profilePicture.top) * scaleX, // Align with picture top (18 - 17 = 1px)
  },
  department: {
    fontSize: ASSIGNED_TO.department.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: ASSIGNED_TO.department.color,
    marginTop: (ASSIGNED_TO.department.top - ASSIGNED_TO.staffName.top - ASSIGNED_TO.staffName.fontSize) * scaleX, // Space between name and department (34 - 18 - 13 = 3px)
  },
  reassignButton: {
    position: 'absolute',
    right: 16 * scaleX, // 16px padding from card edge
    top: ASSIGNED_TO.reassignButton.top * scaleX, // Relative to card content area
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
  nameColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  initialsCircle: {
    width: ASSIGNED_TO.profilePicture.width * scaleX,
    height: ASSIGNED_TO.profilePicture.height * scaleX,
    borderRadius: (ASSIGNED_TO.profilePicture.width / 2) * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: ASSIGNED_TO.profilePicture.left * scaleX,
    marginRight: (ASSIGNED_TO.staffName.left - ASSIGNED_TO.profilePicture.left - ASSIGNED_TO.profilePicture.width) * scaleX, // Space between picture and name
  },
  initialsText: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#ffffff',
  },
});

