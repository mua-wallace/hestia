/**
 * Reusable Room Detail Content Component
 * Accepts props for all content sections
 * Handles: Arrival/Departure, Arrival, Departure, Stayover, Turndown
 */

import React, { useState, useRef, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { colors } from '../../theme';
import { scaleX, CONTENT_AREA, GUEST_INFO, ASSIGNED_TO, ASSIGNED_TASK_CARD } from '../../constants/roomDetailStyles';
import { getRoomTypeConfig } from '../../constants/roomTypeConfigs';
import { calculatePositions } from '../../utils/roomDetailPositions';
import RoomDetailHeader from './RoomDetailHeader';
import DetailTabNavigation from './DetailTabNavigation';
import GuestInfoCard from './GuestInfoCard';
import NotesSection from './NotesSection';
import LostAndFoundSection from './LostAndFoundSection';
import AssignedToSection from './AssignedToSection';
import ChecklistSection from './ChecklistSection';
import RoomTicketsSection from './RoomTicketsSection';
import HistorySection from './HistorySection';
import type { RoomDetailScreenProps, DetailTab, HistoryEvent } from '../../types/roomDetail.types';
import type { RoomStatus } from '../../types/allRooms.types';

export default function RoomDetailContent({
  roomNumber,
  roomCode,
  status,
  flagged = false,
  isPriority = false,
  frontOfficeStatus,
  roomType,
  guests,
  specialInstructions,
  assignedTo,
  taskDescription,
  notes = [],
  lostAndFoundItems,
  historyEvents = [],
  onBackPress,
  onStatusPress,
  onStatusChange,
  onFlagToggle,
  onReassign,
  onAddNote,
  onSaveNote,
  onAddTask,
  onSaveTask,
  onAddLostAndFoundItem,
  onDownloadHistoryReport,
  customStatusText,
  pausedAt,
  returnLaterAtTimestamp,
  promiseTimeAtTimestamp,
  refuseServiceReason,
  showWithLinenBadge = false,
}: RoomDetailScreenProps) {
  // Get room type configuration and calculate positions
  const config = useMemo(() => getRoomTypeConfig(roomType), [roomType]);
  // Calculate positions based on actual presence of special instructions
  const hasSpecialInstructionsData = !!specialInstructions;
  // Get first guest name to check if it wraps (for Arrival/Departure rooms)
  const firstGuestName = guests.find(g => g.type === 'Arrival')?.guest?.name || guests[0]?.guest?.name;
  const positions = useMemo(() => calculatePositions(config, hasSpecialInstructionsData, firstGuestName), [config, hasSpecialInstructionsData, firstGuestName]);

  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
  const statusButtonRef = useRef<TouchableOpacity>(null);
  
  // Track current status - sync with parent when status changes (e.g. from StatusChangeModal)
  const [currentStatus, setCurrentStatus] = useState<RoomStatus>(status);
  React.useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  // Handle status change
  const handleStatusChange = (newStatus: RoomStatus) => {
    setCurrentStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  // Handle flag toggle
  const handleFlagToggle = (isFlagged: boolean) => {
    onFlagToggle?.(isFlagged);
  };

  // "See More" functionality for task description
  const MAX_LINES = 2;
  const LINE_HEIGHT = 18;
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [textHeight, setTextHeight] = useState<number>(0);
  const fullTextRef = useRef<Text>(null);
  
  const charsPerLine = 50;
  const maxChars = MAX_LINES * charsPerLine;
  const estimatedNeedsTruncation = taskDescription ? taskDescription.length > maxChars : false;
  
  const handleFullTextLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setTextHeight(height);
    const maxHeight = MAX_LINES * LINE_HEIGHT * scaleX;
    setShowSeeMore(height > maxHeight);
  };
  
  React.useEffect(() => {
    if (textHeight === 0 && taskDescription) {
      setShowSeeMore(estimatedNeedsTruncation);
    }
  }, [taskDescription, textHeight, estimatedNeedsTruncation]);
  
  const getDisplayText = () => {
    if (!taskDescription) return '';
    if (!showSeeMore) {
      return taskDescription;
    }
    const truncated = taskDescription.substring(0, maxChars);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  };

  const handleSeeMorePress = () => {
    setShowSeeMore(false);
  };

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleDownloadReport = async () => {
    if (isGeneratingReport || !onDownloadHistoryReport) return;
    try {
      setIsGeneratingReport(true);
      await onDownloadHistoryReport();
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Determine guests based on room type
  // For Arrival/Departure: first guest is Arrival, second is Departure
  // For other types: single guest
  const arrivalGuest = guests.find(g => g.type === 'Arrival');
  const departureGuest = guests.find(g => g.type === 'Departure');
  const stayoverGuest = guests.find(g => g.type === 'Stayover');
  const turndownGuest = guests.find(g => g.type === 'Turndown');
  
  // Determine which guest to show first based on room type
  const firstGuest = roomType === 'ArrivalDeparture' 
    ? arrivalGuest 
    : roomType === 'Departure'
    ? departureGuest
    : roomType === 'Stayover'
    ? stayoverGuest
    : roomType === 'Turndown'
    ? turndownGuest
    : arrivalGuest; // Default to Arrival
  
  const secondGuest = roomType === 'ArrivalDeparture' ? departureGuest : undefined;

  // Calculate dynamic styles based on positions
  const dynamicStyles = {
    guestInfoSection: {
      paddingTop: (positions.guestInfoTitle - CONTENT_AREA.top) * scaleX,
      minHeight: (positions.divider2 - positions.guestInfoTitle) * scaleX,
    },
    guestInfoTitle: {
      top: (positions.guestInfoTitle - CONTENT_AREA.top) * scaleX,
    },
    divider1: {
      top: (positions.divider1 - CONTENT_AREA.top) * scaleX,
    },
    divider2: {
      top: (positions.divider2 - CONTENT_AREA.top) * scaleX,
    },
    cardSpacer: {
      height: ((positions.lostAndFoundTitle - positions.divider2)) * scaleX,
    },
    assignedToSectionContainer: {
      top: (positions.assignedToTitle - CONTENT_AREA.top) * scaleX,
    },
    assignedTaskCard: {
      top: (positions.cardTop - CONTENT_AREA.top) * scaleX,
      height: positions.cardHeight * scaleX,
    },
  };

  const handleTabPress = (tab: DetailTab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      {/* Gray Background */}
      <View style={styles.backgroundTop} />

      {/* Header */}
      <RoomDetailHeader
        roomNumber={roomNumber}
        roomCode={roomCode}
        status={currentStatus}
        onBackPress={onBackPress}
        onStatusPress={onStatusPress}
        statusButtonRef={statusButtonRef}
        customStatusText={customStatusText}
        pausedAt={pausedAt}
        returnLaterAtTimestamp={returnLaterAtTimestamp}
        promiseTimeAtTimestamp={promiseTimeAtTimestamp}
        refuseServiceReason={refuseServiceReason}
        flagged={flagged}
        isPriority={isPriority}
        frontOfficeLabel={frontOfficeStatus === 'Stayover' ? 'Stayover' : undefined}
        showWithLinenBadge={showWithLinenBadge}
      />

      {/* Tab Navigation */}
      <DetailTabNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      {/* Content Area */}
      {activeTab === 'Checklist' ? (
        <ChecklistSection
          roomNumber={roomNumber}
          roomCode={roomCode}
          roomStatus={currentStatus}
          onSubmit={(data) => {
            console.log('Checklist submitted:', data);
          }}
          onCancel={() => {
            console.log('Checklist cancelled');
          }}
        />
      ) : activeTab === 'Tickets' ? (
        <RoomTicketsSection
          roomNumber={roomNumber}
          onSubmit={(ticketData) => {
            console.log('Ticket submitted:', ticketData);
          }}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'Overview' && (
          <>
            {/* Guest Info Section */}
            {(firstGuest || secondGuest) && (
              <View style={[styles.guestInfoSection, dynamicStyles.guestInfoSection]}>
                <Text style={[styles.guestInfoTitle, dynamicStyles.guestInfoTitle]}>Guest Info</Text>

                {/* First Guest */}
                {firstGuest && (
                  <GuestInfoCard
                    guest={firstGuest.guest}
                    isArrival={firstGuest.type === 'Arrival' || firstGuest.type === 'Stayover' || firstGuest.type === 'Turndown'}
                    numberBadge={firstGuest.guest?.vipCode?.toString()}
                    specialInstructions={
                      // Show special instructions after Arrival guest for Arrival/Departure
                      // Or after first guest for other types if present
                      (roomType === 'ArrivalDeparture' && firstGuest.type === 'Arrival') || 
                      (roomType !== 'ArrivalDeparture')
                        ? specialInstructions
                        : undefined
                    }
                    absoluteTop={positions.firstGuestTop}
                    contentAreaTop={CONTENT_AREA.top}
                    specialInstructionsTitleTop={positions.specialInstructionsTitle}
                    specialInstructionsTextTop={positions.specialInstructionsText}
                    roomCategory={firstGuest.type}
                  />
                )}

                {/* Divider between guests (only for Arrival/Departure) */}
                {firstGuest && secondGuest && roomType === 'ArrivalDeparture' && (
                  <View style={[styles.divider1, dynamicStyles.divider1]} />
                )}

                {/* Second Guest (Departure for Arrival/Departure) */}
                {secondGuest && roomType === 'ArrivalDeparture' && (
                  <GuestInfoCard
                    guest={secondGuest.guest}
                    isArrival={false}
                    numberBadge={secondGuest.guest?.vipCode?.toString() || firstGuest?.guest?.vipCode?.toString()}
                    specialInstructions={undefined} // No special instructions for departure guest
                    isSecondGuest={!!firstGuest}
                    absoluteTop={positions.secondGuestTop!}
                    contentAreaTop={CONTENT_AREA.top}
                    roomCategory="Departure"
                  />
                )}

                {/* Divider after guest info */}
                {(firstGuest || secondGuest) && <View style={[styles.divider2, dynamicStyles.divider2]} />}
              </View>
            )}

            {/* Spacer for card */}
            <View style={[styles.cardSpacer, dynamicStyles.cardSpacer]} />

            {/* Assigned to Section */}
            {assignedTo && (
              <View style={[styles.assignedToSectionContainer, dynamicStyles.assignedToSectionContainer]}>
                <Text style={styles.assignedToTitle}>Assigned to</Text>
              </View>
            )}

            {/* Card Container */}
            <View style={[styles.assignedTaskCard, dynamicStyles.assignedTaskCard]}>
              {assignedTo && (
                <AssignedToSection
                  staff={assignedTo}
                  onReassignPress={onReassign}
                />
              )}

              <View style={styles.cardDivider} />

              {/* Task Section - Always show (with default if no taskDescription) */}
              {taskDescription && (
                <View style={styles.taskSection}>
                  <Text style={styles.taskTitle}>Task</Text>
                  {/* Hidden text to measure full height */}
                  <Text
                    ref={fullTextRef}
                    style={[styles.taskText, styles.hiddenText]}
                    onLayout={handleFullTextLayout}
                  >
                    {taskDescription}
                  </Text>
                  {/* Text with inline "see more" button */}
                  <Text
                    style={styles.taskText}
                    numberOfLines={!showSeeMore ? MAX_LINES : undefined}
                  >
                    {getDisplayText()}
                    {showSeeMore && (
                      <>
                        {' '}
                        <Text
                          style={styles.seeMoreText}
                          onPress={handleSeeMorePress}
                        >
                          see more
                        </Text>
                      </>
                    )}
                  </Text>
                </View>
              )}
            </View>

            {/* Lost and Found Section */}
            <LostAndFoundSection 
              displayType={config.lostAndFoundType}
              items={lostAndFoundItems}
              onAddPhotosPress={onAddLostAndFoundItem}
              onTitlePress={() => {
                // Navigate to Lost & Found screen if needed
                console.log('Lost & Found title pressed');
              }}
              onItemPress={(item) => {
                console.log('Lost & Found item pressed:', item.itemName);
              }}
            />

            {/* Notes Section */}
            <NotesSection
              notes={notes}
              onAddPress={onAddNote}
            />
          </>
        )}

          {activeTab === 'History' && (
            <HistorySection
              events={historyEvents}
              roomNumber={roomNumber}
              roomCode={roomCode}
              onDownloadReport={handleDownloadReport}
              isGeneratingReport={isGeneratingReport}
            />
          )}
          {activeTab !== 'Overview' && activeTab !== 'History' && (
            <View style={styles.placeholderContent}>
              <Text style={styles.placeholderText}>
                {activeTab} content coming soon
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
    marginTop: CONTENT_AREA.top * scaleX,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 200 * scaleX,
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CONTENT_AREA.backgroundTopHeight * scaleX,
    backgroundColor: CONTENT_AREA.backgroundTop,
    zIndex: 0,
  },
  guestInfoSection: {
    position: 'relative',
    width: '100%',
  },
  guestInfoTitle: {
    position: 'absolute',
    left: GUEST_INFO.title.left * scaleX,
    fontSize: GUEST_INFO.title.fontSize * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: GUEST_INFO.title.color,
  },
  divider1: {
    position: 'absolute',
    left: GUEST_INFO.divider.left,
    width: GUEST_INFO.divider.width * scaleX,
    height: GUEST_INFO.divider.height,
    backgroundColor: GUEST_INFO.divider.color,
    zIndex: 0,
  },
  divider2: {
    position: 'absolute',
    left: GUEST_INFO.divider2.left,
    width: GUEST_INFO.divider2.width * scaleX,
    height: GUEST_INFO.divider2.height,
    backgroundColor: GUEST_INFO.divider2.color,
    zIndex: 0,
  },
  placeholderContent: {
    padding: 40 * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200 * scaleX,
  },
  placeholderText: {
    fontSize: 16 * scaleX,
    color: '#999',
  },
  cardSpacer: {
    width: '100%',
  },
  assignedToSectionContainer: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 20 * scaleX,
    zIndex: 2,
  },
  assignedToTitle: {
    position: 'absolute',
    left: ASSIGNED_TO.title.left * scaleX,
    top: 0,
    fontSize: ASSIGNED_TO.title.fontSize * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: ASSIGNED_TO.title.color,
  },
  assignedTaskCard: {
    position: 'absolute',
    left: ASSIGNED_TASK_CARD.left * scaleX,
    width: ASSIGNED_TASK_CARD.width * scaleX,
    borderRadius: ASSIGNED_TASK_CARD.borderRadius * scaleX,
    backgroundColor: ASSIGNED_TASK_CARD.backgroundColor,
    borderWidth: ASSIGNED_TASK_CARD.borderWidth,
    borderColor: ASSIGNED_TASK_CARD.borderColor,
    paddingHorizontal: ASSIGNED_TASK_CARD.paddingHorizontal * scaleX,
    paddingVertical: ASSIGNED_TASK_CARD.paddingVertical * scaleX,
    zIndex: 1,
    overflow: 'hidden',
  },
  cardDivider: {
    position: 'absolute',
    left: ASSIGNED_TASK_CARD.paddingHorizontal * scaleX,
    top: ASSIGNED_TASK_CARD.divider.top * scaleX,
    width: ASSIGNED_TASK_CARD.divider.width * scaleX,
    height: ASSIGNED_TASK_CARD.divider.height,
    backgroundColor: ASSIGNED_TASK_CARD.divider.backgroundColor,
    zIndex: 2,
  },
  taskSection: {
    position: 'absolute',
    left: 16 * scaleX, // Card padding
    right: 16 * scaleX, // Card padding
    top: (ASSIGNED_TASK_CARD.divider.top + ASSIGNED_TASK_CARD.divider.height + 6) * scaleX, // Below divider with 6px spacing
    paddingHorizontal: 0,
    width: ASSIGNED_TASK_CARD.width * scaleX - (ASSIGNED_TASK_CARD.paddingHorizontal * 2 * scaleX), // Full width minus padding
  },
  taskTitle: {
    fontSize: 14 * scaleX, // From Figma: 14px
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: '#000000', // From Figma: black
    marginBottom: 8 * scaleX, // Spacing between title and text
  },
  taskText: {
    fontSize: 13 * scaleX, // From Figma: 13px
    fontFamily: 'Helvetica',
    fontWeight: '300' as any, // Light weight
    color: '#000000', // From Figma: black
    lineHeight: 18 * scaleX, // Proper line height for readability
  },
  hiddenText: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
    width: '100%',
  },
  seeMoreText: {
    fontSize: 13 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '500',
    color: '#5a759d',
  },
});
