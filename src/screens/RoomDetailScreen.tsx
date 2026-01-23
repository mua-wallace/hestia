/**
 * Room Detail Screen - Reusable for all room types
 * Supports: Arrival, Departure, ArrivalDeparture, Stayover, Turndown
 * 
 * This screen dynamically adjusts layout based on room type configuration
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { scaleX, ROOM_DETAIL_HEADER, DETAIL_TABS, CONTENT_AREA, GUEST_INFO, ASSIGNED_TO, ASSIGNED_TASK_CARD } from '../constants/roomDetailStyles';
import { getRoomTypeConfig } from '../constants/roomTypeConfigs';
import { calculatePositions } from '../utils/roomDetailPositions';
import RoomDetailHeader from '../components/roomDetail/RoomDetailHeader';
import DetailTabNavigation from '../components/roomDetail/DetailTabNavigation';
import GuestInfoCard from '../components/roomDetail/GuestInfoCard';
import NotesSection from '../components/roomDetail/NotesSection';
import LostAndFoundSection from '../components/roomDetail/LostAndFoundSection';
import AssignedToSection from '../components/roomDetail/AssignedToSection';
import ChecklistSection from '../components/roomDetail/ChecklistSection';
import RoomTicketsSection from '../components/roomDetail/RoomTicketsSection';
import StatusChangeModal from '../components/allRooms/StatusChangeModal';
import ReturnLaterModal from '../components/roomDetail/ReturnLaterModal';
import PromiseTimeModal from '../components/roomDetail/PromiseTimeModal';
// import RefuseServiceModal from '../components/roomDetail/RefuseServiceModal'; // TODO: Implement Refuse Service modal
import ReassignModal from '../components/roomDetail/ReassignModal';
import AddNoteModal from '../components/roomDetail/AddNoteModal';
import AddTaskModal from '../components/roomDetail/AddTaskModal';
import ViewTaskModal from '../components/roomDetail/ViewTaskModal';
import HistorySection from '../components/roomDetail/HistorySection';
import type { RoomCardData, StatusChangeOption } from '../types/allRooms.types';
import { STATUS_OPTIONS } from '../types/allRooms.types';
import type { RoomDetailData, DetailTab, Note, Task, RoomType, HistoryEvent, HistoryGroup } from '../types/roomDetail.types';
import type { LostAndFoundItem } from '../types/lostAndFound.types';
import type { RootStackParamList } from '../navigation/types';
import { mockStaffData } from '../data/mockStaffData';
import { getMockHistoryEvents } from '../data/mockHistoryData';
import { generateHistoryReport } from '../utils/generateHistoryReport';

type RoomDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RoomDetail'
>;

export default function RoomDetailScreen() {
  const navigation = useNavigation<RoomDetailScreenNavigationProp>();
  const route = useRoute();
  const room = (route.params as any)?.room as RoomCardData;
  const roomType = (route.params as any)?.roomType as RoomType || 'ArrivalDeparture'; // Default to ArrivalDeparture

  // Get room type configuration and calculate positions
  const config = useMemo(() => getRoomTypeConfig(roomType), [roomType]);
  const positions = useMemo(() => calculatePositions(config), [config]);

  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReturnLaterModal, setShowReturnLaterModal] = useState(false);
  const [showPromiseTimeModal, setShowPromiseTimeModal] = useState(false);
  // const [showRefuseServiceModal, setShowRefuseServiceModal] = useState(false); // TODO: Implement Refuse Service modal
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showViewTaskModal, setShowViewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusButtonPosition, setStatusButtonPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const statusButtonRef = useRef<TouchableOpacity>(null);
  
  // Track current status to update header background color
  const [currentStatus, setCurrentStatus] = useState<RoomCardData['status']>(room.status);
  // Track selected status option text to display in header
  const [selectedStatusText, setSelectedStatusText] = useState<string | undefined>(undefined);
  
  // Track notes and assigned staff in state
  const [notes, setNotes] = useState<Note[]>(() => {
    if (room.status === 'InProgress') {
      return [
        {
          id: '1',
          text: "Guest wants 2 extra bath towels + 1 hand towel. Don't move items on desk. Refill water bottles daily. Check minibar usage. Leave AC on medium-cool.",
          staff: {
            name: room.staff?.name || 'Stella Kitou',
            avatar: require('../../assets/icons/profile-avatar.png'),
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          text: 'Deep clean bathroom (heavy bath use). Change all linens + pillow protectors. Vacuum under bed. Restock all amenities. Light at entrance flickering report to maintenance.',
          staff: {
            name: room.staff?.name || 'Stella Kitou',
            avatar: require('../../assets/icons/profile-avatar.png'),
          },
          createdAt: new Date().toISOString(),
        },
      ];
    }
    return [];
  });
  
  const [assignedStaff, setAssignedStaff] = useState<{
    id: string;
    name: string;
    avatar?: any;
    initials?: string;
    avatarColor?: string;
    department?: string;
  } | undefined>(
    room.staff
      ? {
          id: '1',
          name: room.staff.name,
          avatar: room.staff.avatar || require('../../assets/icons/profile-avatar.png'),
          initials: room.staff.initials,
          avatarColor: room.staff.avatarColor,
          department: (() => {
            const staffMember = mockStaffData.find(s => s.name === room.staff?.name);
            return staffMember?.department;
          })(),
        }
      : undefined
  );
  
  // Track tasks in state
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Track history events in state
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>(() => {
    return getMockHistoryEvents(room.roomNumber);
  });
  
  // Constants for "See More" functionality (matching ReturnLaterModal)
  const MAX_LINES = 2; // Maximum lines to show before truncating
  const LINE_HEIGHT = 18; // Line height in unscaled pixels
  const dummyTaskText = 'Deep clean bathroom (heavy bath use). Change all linens + pillow protectors. Vacuum under bed. Restock all amenities. Light at entrance flickering report to maintenance.';
  
  // "See More" functionality state
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [textHeight, setTextHeight] = useState<number>(0);
  const fullTextRef = useRef<Text>(null);
  
  // Calculate if text needs truncation (rough estimate for initial render)
  const charsPerLine = 50;
  const maxChars = MAX_LINES * charsPerLine;
  const estimatedNeedsTruncation = dummyTaskText.length > maxChars;
  
  // Measure full text height to determine if truncation is needed
  const handleFullTextLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setTextHeight(height);
    const maxHeight = MAX_LINES * LINE_HEIGHT * scaleX;
    setShowSeeMore(height > maxHeight);
  };
  
  // Initialize showSeeMore based on estimated length
  useEffect(() => {
    if (textHeight === 0) {
      setShowSeeMore(estimatedNeedsTruncation);
    }
  }, [dummyTaskText, textHeight, estimatedNeedsTruncation]);
  
  // Get truncated text for display
  const getDisplayText = () => {
    if (!showSeeMore) {
      return dummyTaskText;
    }
    // Truncate to approximately MAX_LINES
    const truncated = dummyTaskText.substring(0, maxChars);
    // Find last space to avoid cutting words
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  };
  
  const handleSeeMorePress = () => {
    setShowSeeMore(false);
  };

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleDownloadReport = async () => {
    if (isGeneratingReport) return; // Prevent multiple clicks
    
    try {
      setIsGeneratingReport(true);
      
      // Group events for the report (same logic as HistorySection)
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const normalizeDate = (date: Date): Date => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      };

      const sortedEvents = [...historyEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      const dateMap = new Map<string, HistoryEvent[]>();

      sortedEvents.forEach((event) => {
        const eventDate = normalizeDate(event.timestamp);
        const key = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;
        if (!dateMap.has(key)) {
          dateMap.set(key, []);
        }
        dateMap.get(key)!.push(event);
      });

      const groupedEvents: HistoryGroup[] = [];
      dateMap.forEach((events, key) => {
        const [year, month, day] = key.split('-').map(Number);
        const eventDate = new Date(year, month, day);
        const todayNormalized = normalizeDate(today);
        const yesterdayNormalized = normalizeDate(yesterday);
        const eventDateNormalized = normalizeDate(eventDate);

        let dateLabel: string;
        if (eventDateNormalized.getTime() === todayNormalized.getTime()) {
          dateLabel = 'Today';
        } else if (eventDateNormalized.getTime() === yesterdayNormalized.getTime()) {
          dateLabel = 'Yesterday';
        } else {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthName = monthNames[eventDate.getMonth()];
          const yearNum = eventDate.getFullYear();
          if (yearNum === now.getFullYear()) {
            dateLabel = `${monthName} ${day}`;
          } else {
            dateLabel = `${monthName} ${day} ${yearNum}`;
          }
        }

        groupedEvents.push({
          dateLabel,
          date: eventDate,
          events: events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
        });
      });

      const sortedGroupedEvents = groupedEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

      // Generate and download the PDF
      await generateHistoryReport({
        roomNumber: room.roomNumber,
        roomCode: room.roomCode,
        events: historyEvents,
        groupedEvents: sortedGroupedEvents,
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      // TODO: Show error alert to user
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };
  
  // Track paused time
  const [pausedAt, setPausedAt] = useState<string | undefined>(
    selectedStatusText === 'Pause' ? '11:22' : undefined
  );

  // Transform room data to detail data format
  const roomDetail: RoomDetailData = {
    ...room,
    roomType,
    specialInstructions: config.hasSpecialInstructions && room.guests && room.guests.length > 0
      ? 'Please prepare a high-floor suite with a city view, away from the elevators, set to 21°C, with hypoallergenic pillows and a fresh orchid on the nightstand.'
      : undefined,
    notes: notes,
    tasks: tasks,
    assignedTo: assignedStaff,
    isUrgent: room.isPriority,
    lostAndFoundItems: config.lostAndFoundType === 'withItems' ? [
      // Mock lost & found items for Stayover/Turndown
      {
        id: 'lf1',
        itemName: 'Wrist Watch',
        itemId: 'FH31390',
        location: 'Guest bathroom while cleaning',
        storedLocation: 'HSK Office',
        registeredBy: {
          name: 'Stella Kitou',
          avatar: require('../../assets/icons/profile-avatar.png'),
          timestamp: '15:00, 11 November 2025',
        },
        status: 'stored',
        createdAt: new Date().toISOString(),
      },
    ] : undefined,
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('AllRooms');
    }
  };

  const handleStatusPress = () => {
    if (statusButtonRef.current) {
      statusButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setStatusButtonPosition({
          x: pageX,
          y: pageY,
          width,
          height,
        });
        setShowStatusModal(true);
      });
    } else {
      setStatusButtonPosition({
        x: ROOM_DETAIL_HEADER.statusIndicator.left * scaleX,
        y: ROOM_DETAIL_HEADER.statusIndicator.top * scaleX,
        width: ROOM_DETAIL_HEADER.statusIndicator.width * scaleX,
        height: ROOM_DETAIL_HEADER.statusIndicator.height * scaleX,
      });
      setShowStatusModal(true);
    }
  };

  const handleStatusSelect = (statusOption: StatusChangeOption) => {
    const statusOptionConfig = STATUS_OPTIONS.find(opt => opt.id === statusOption);
    const statusLabel = statusOptionConfig?.label || '';

    if (statusOption === 'ReturnLater') {
      console.log('🔵 Return Later selected - opening modal...');
      setShowStatusModal(false);
      setShowReturnLaterModal(true);
      setSelectedStatusText(statusLabel);
      console.log('🔵 showReturnLaterModal set to TRUE');
      return;
    }

    if (statusOption === 'PromisedTime') {
      setShowStatusModal(false);
      setShowPromiseTimeModal(true);
      setSelectedStatusText(statusLabel);
      return;
    }

    if (statusOption === 'RefuseService') {
      setShowStatusModal(false);
      // setShowRefuseServiceModal(true); // TODO: Implement Refuse Service modal
      setSelectedStatusText(statusLabel);
      console.log('Refuse Service selected - modal not yet implemented');
      return;
    }

    const mapStatusOptionToRoomStatus = (option: StatusChangeOption): RoomCardData['status'] => {
      switch (option) {
        case 'Dirty':
          return 'Dirty';
        case 'Cleaned':
          return 'Cleaned';
        case 'Inspected':
          return 'Inspected';
        case 'Priority':
        case 'Pause':
        case 'ReturnLater':
        case 'RefuseService':
        case 'PromisedTime':
          return 'InProgress';
        default:
          return 'InProgress';
      }
    };

    const newStatus = mapStatusOptionToRoomStatus(statusOption);
    setCurrentStatus(newStatus);
    
    if (statusOption === 'Pause') {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setPausedAt(`${hours}:${minutes}`);
      setSelectedStatusText(undefined);
    } else {
      setSelectedStatusText(statusLabel);
      setPausedAt(undefined);
    }

    console.log('Status changed for room:', room.roomNumber, 'to:', newStatus);
    setShowStatusModal(false);
    setStatusButtonPosition(null);
  };

  const handleReturnLaterConfirm = (returnTime: string, period: 'AM' | 'PM', taskDescription?: string) => {
    console.log('Return Later confirmed for room:', room.roomNumber, 'at:', returnTime, period);
    
    // Save task if provided
    if (taskDescription && taskDescription.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: taskDescription,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
      console.log('Task saved from Return Later modal:', taskDescription);
    }
    
    // TODO: Call backend API to save return time
    setShowReturnLaterModal(false);
  };

  const handlePromiseTimeConfirm = (promiseTime: string, period: 'AM' | 'PM') => {
    console.log('Promise Time confirmed for room:', room.roomNumber, 'at:', promiseTime, period);
    // TODO: Save promise time to backend/API
    setShowPromiseTimeModal(false);
    // Keep selectedStatusText to show "Promise Time" in header
  };

  // TODO: Implement Refuse Service modal
  // const handleRefuseServiceConfirm = (selectedReasons: string[], customReason?: string) => {
  //   console.log('Refuse Service confirmed for room:', room.roomNumber, 'reasons:', selectedReasons, 'custom:', customReason);
  //   setShowRefuseServiceModal(false);
  // };

  const handleTabPress = (tab: DetailTab) => {
    setActiveTab(tab);
  };

  const handleAddNote = () => {
    setShowAddNoteModal(true);
  };

  const handleAddTask = () => {
    setShowAddTaskModal(true);
  };

  const handleSeeMoreTask = (task: Task) => {
    setSelectedTask(task);
    setShowViewTaskModal(true);
  };

  const handleCloseViewTaskModal = () => {
    setShowViewTaskModal(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (taskText: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    console.log('Task added for room:', room.roomNumber, 'task:', taskText);
  };

  const handleSaveNote = (noteText: string) => {
    const currentUser = mockStaffData[0];
    const newNote: Note = {
      id: Date.now().toString(),
      text: noteText,
      staff: {
        name: currentUser.name,
        avatar: currentUser.avatar || require('../../assets/icons/profile-avatar.png'),
      },
      createdAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    console.log('Note saved:', noteText);
  };

  const handleAddPhotos = () => {
    navigation.navigate('Main' as any, {
      screen: 'LostAndFound',
      params: { openRegisterModal: true },
    } as any);
  };

  const handleLostAndFoundTitlePress = () => {
    navigation.navigate('Main' as any, {
      screen: 'LostAndFound',
    } as any);
  };

  const handleLostAndFoundItemPress = (item: LostAndFoundItem) => {
    console.log('Lost & Found item pressed:', item.itemName);
    // TODO: Navigate to item detail or show modal
  };

  const handleReassign = () => {
    console.log('handleReassign called, opening ReassignModal');
    setShowReassignModal(true);
  };

  const handleStaffSelect = (staffId: string) => {
    console.log('Staff selected:', staffId);
    const selectedStaff = mockStaffData.find((s) => s.id === staffId);
    if (selectedStaff) {
      setAssignedStaff({
        id: selectedStaff.id,
        name: selectedStaff.name,
        avatar: selectedStaff.avatar,
        initials: selectedStaff.initials,
        department: selectedStaff.department,
        avatarColor: selectedStaff.avatarColor || (() => {
          const colors = ['#ff4dd8', '#5a759d', '#607aa1', '#f0be1b'];
          const index = selectedStaff.name.charCodeAt(0) % colors.length;
          return colors[index];
        })(),
      });
      console.log('Room assigned to:', selectedStaff.name);
    }
    setShowReassignModal(false);
  };

  const handleAutoAssign = () => {
    console.log('Auto assign requested');
    setShowReassignModal(false);
  };

  if (!room) {
    return null;
  }

  // Determine guests based on room type
  const guests = room.guests || [];
  const firstGuest = config.numberOfGuests === 2 
    ? guests.find((g) => g.timeLabel === 'ETA') 
    : guests[0];
  const secondGuest = config.numberOfGuests === 2 
    ? guests.find((g) => g.timeLabel === 'EDT') 
    : undefined;

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
      // Spacer must reserve space from divider2 to the Lost & Found title (not just card end)
      // This ensures the absolutely positioned card doesn't overlap with Lost & Found section
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

  return (
    <View style={styles.container}>
      {/* Gray Background */}
      <View style={styles.backgroundTop} />

      {/* Header */}
      <RoomDetailHeader
        roomNumber={room.roomNumber}
        roomCode={room.roomType}
        status={currentStatus}
        onBackPress={handleBackPress}
        onStatusPress={handleStatusPress}
        statusButtonRef={statusButtonRef}
        customStatusText={
          showReturnLaterModal
            ? 'Return Later'
            : showPromiseTimeModal ? 'Promise Time' :
            // showRefuseServiceModal ? 'Refuse Service' : // TODO: Implement Refuse Service modal
            selectedStatusText
        }
        pausedAt={pausedAt}
      />

      {/* Tab Navigation */}
      <DetailTabNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      {/* Content Area */}
      {activeTab === 'Checklist' ? (
        <ChecklistSection
          roomNumber={room.roomNumber}
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
          roomNumber={room.roomNumber}
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
                    guest={firstGuest}
                    isArrival={firstGuest.timeLabel === 'ETA'}
                    numberBadge={room.priorityCount?.toString()}
                    specialInstructions={roomDetail.specialInstructions}
                    absoluteTop={positions.firstGuestTop}
                    contentAreaTop={CONTENT_AREA.top}
                    specialInstructionsTitleTop={positions.specialInstructionsTitle}
                    specialInstructionsTextTop={positions.specialInstructionsText}
                    roomCategory={firstGuest.timeLabel === 'ETA' ? 'Arrival' : roomType}
                  />
                )}

                {/* Divider between guests */}
                {firstGuest && secondGuest && <View style={[styles.divider1, dynamicStyles.divider1]} />}

                {/* Second Guest */}
                {secondGuest && (
                  <GuestInfoCard
                    guest={secondGuest}
                    isArrival={false}
                    numberBadge={room.secondGuestPriorityCount?.toString() || room.priorityCount?.toString()}
                    specialInstructions={undefined}
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
            {roomDetail.assignedTo && (
              <View style={[styles.assignedToSectionContainer, dynamicStyles.assignedToSectionContainer]}>
                <Text style={styles.assignedToTitle}>Assigned to</Text>
              </View>
            )}

            {/* Card Container */}
            <View style={[styles.assignedTaskCard, dynamicStyles.assignedTaskCard]}>
              {roomDetail.assignedTo && (
                <AssignedToSection
                  staff={roomDetail.assignedTo}
                  onReassignPress={handleReassign}
                />
              )}

              <View style={styles.cardDivider} />

              {/* Task Section - Inline implementation matching ReturnLaterModal */}
              <View style={styles.taskSection}>
                <Text style={styles.taskTitle}>Task</Text>
                {/* Hidden text to measure full height */}
                <Text
                  ref={fullTextRef}
                  style={[styles.taskText, styles.hiddenText]}
                  onLayout={handleFullTextLayout}
                >
                  {dummyTaskText}
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
            </View>

            {/* Lost and Found Section */}
            <LostAndFoundSection 
              displayType={config.lostAndFoundType}
              items={roomDetail.lostAndFoundItems}
              onAddPhotosPress={handleAddPhotos}
              onTitlePress={handleLostAndFoundTitlePress}
              onItemPress={handleLostAndFoundItemPress}
            />

            {/* Notes Section */}
            <NotesSection
              notes={roomDetail.notes}
              onAddPress={handleAddNote}
            />
          </>
        )}

          {activeTab === 'History' && (
            <HistorySection
              events={historyEvents}
              roomNumber={room.roomNumber}
              roomCode={room.roomCode}
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

      {/* Modals */}
      <StatusChangeModal
        visible={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setStatusButtonPosition(null);
        }}
        onStatusSelect={handleStatusSelect}
        currentStatus={currentStatus}
        room={room}
        buttonPosition={statusButtonPosition}
        showTriangle={false}
      />

      <ReturnLaterModal
        visible={showReturnLaterModal}
        onClose={() => {
          setShowReturnLaterModal(false);
          setSelectedStatusText(undefined);
        }}
        onConfirm={handleReturnLaterConfirm}
        roomNumber={room.roomNumber}
        assignedTo={roomDetail.assignedTo}
        onReassignPress={handleReassign}
        taskDescription={roomDetail.tasks && roomDetail.tasks.length > 0 ? roomDetail.tasks[0].text : undefined}
      />

      <PromiseTimeModal
        visible={showPromiseTimeModal}
        onClose={() => {
          setShowPromiseTimeModal(false);
          setSelectedStatusText(undefined);
        }}
        onConfirm={handlePromiseTimeConfirm}
        roomNumber={room.roomNumber}
      />

      {/* TODO: Implement Refuse Service modal */}
      {/* <RefuseServiceModal
        visible={showRefuseServiceModal}
        onClose={() => {
          setShowRefuseServiceModal(false);
          setSelectedStatusText(undefined);
        }}
        onConfirm={handleRefuseServiceConfirm}
        roomNumber={room.roomNumber}
        assignedTo={roomDetail.assignedTo}
        onReassignPress={handleReassign}
      /> */}

      <ReassignModal
        visible={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        onStaffSelect={handleStaffSelect}
        onAutoAssign={handleAutoAssign}
        currentAssignedStaffId={roomDetail.assignedTo?.id}
        roomNumber={room.roomNumber}
      />

      <AddNoteModal
        visible={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        onSave={handleSaveNote}
        roomNumber={room.roomNumber}
      />

      <AddTaskModal
        visible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onSave={handleSaveTask}
      />

      <ViewTaskModal
        visible={showViewTaskModal}
        task={selectedTask}
        onClose={handleCloseViewTaskModal}
      />
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
    left: 16 * scaleX, // Match card padding
    right: 16 * scaleX, // Match card padding
    top: 86 * scaleX, // Below divider (78px) + 8px spacing
    paddingHorizontal: 0,
  },
  taskTitle: {
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 8 * scaleX,
  },
  taskText: {
    fontSize: 13 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '300',
    color: '#000000',
    lineHeight: 18 * scaleX,
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
