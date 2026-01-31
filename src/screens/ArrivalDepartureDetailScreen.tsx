import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { scaleX, ROOM_DETAIL_HEADER, DETAIL_TABS, CONTENT_AREA, GUEST_INFO, NOTES_SECTION, LOST_AND_FOUND, ASSIGNED_TO, ASSIGNED_TASK_CARD } from '../constants/roomDetailStyles';
import RoomDetailHeader from '../components/roomDetail/RoomDetailHeader';
import DetailTabNavigation from '../components/roomDetail/DetailTabNavigation';
import GuestInfoCard from '../components/roomDetail/GuestInfoCard';
import NotesSection from '../components/roomDetail/NotesSection';
import LostAndFoundSection from '../components/roomDetail/LostAndFoundSection';
import AssignedToSection from '../components/roomDetail/AssignedToSection';
import TaskSection from '../components/roomDetail/TaskSection';
import ChecklistSection from '../components/roomDetail/ChecklistSection';
import RoomTicketsSection from '../components/roomDetail/RoomTicketsSection';
import StatusChangeModal from '../components/allRooms/StatusChangeModal';
import ReturnLaterModal from '../components/roomDetail/ReturnLaterModal';
import PromiseTimeModal from '../components/roomDetail/PromiseTimeModal';
import RefuseServiceModal from '../components/roomDetail/RefuseServiceModal';
import ReassignModal from '../components/roomDetail/ReassignModal';
import AddNoteModal from '../components/roomDetail/AddNoteModal';
import AddTaskModal from '../components/roomDetail/AddTaskModal';
import ViewTaskModal from '../components/roomDetail/ViewTaskModal';
import type { RoomCardData, StatusChangeOption } from '../types/allRooms.types';
import { STATUS_OPTIONS } from '../types/allRooms.types';
import type { RoomDetailData, DetailTab, Note, Task } from '../types/roomDetail.types';
import type { RootStackParamList } from '../navigation/types';
import { mockStaffData } from '../data/mockStaffData';

type ArrivalDepartureDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ArrivalDepartureDetail'
>;

export default function ArrivalDepartureDetailScreen() {
  const navigation = useNavigation<ArrivalDepartureDetailScreenNavigationProp>();
  const route = useRoute();
  const room = (route.params as any)?.room as RoomCardData;

  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReturnLaterModal, setShowReturnLaterModal] = useState(false);
  const [showPromiseTimeModal, setShowPromiseTimeModal] = useState(false);
  const [showRefuseServiceModal, setShowRefuseServiceModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showViewTaskModal, setShowViewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusButtonPosition, setStatusButtonPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const statusButtonRef = useRef<TouchableOpacity>(null);
  // Track current status to update header background color
  const [currentStatus, setCurrentStatus] = useState<RoomCardData['houseKeepingStatus']>(room.houseKeepingStatus);
  // Track selected status option text to display in header
  const [selectedStatusText, setSelectedStatusText] = useState<string | undefined>(undefined);
  // Track Return Later: timestamp for time-only + remaining countdown (e.g. "2:30 PM · 30 mins 2s")
  const [returnLaterAtTimestamp, setReturnLaterAtTimestamp] = useState<number | undefined>(undefined);
  // Track Promise Time: timestamp for time + countdown in header
  const [promiseTimeAtTimestamp, setPromiseTimeAtTimestamp] = useState<number | undefined>(undefined);
  // Track Refuse Service: selected reason or custom reason to show in header
  const [refuseServiceReason, setRefuseServiceReason] = useState<string | undefined>(undefined);
  // Track room data locally to allow updates (e.g., flagged status)
  const [localRoom, setLocalRoom] = useState<RoomCardData>(room);
  // Track notes and assigned staff in state
  // Initialize notes based on room status - show default notes for InProgress, empty for others
  const [notes, setNotes] = useState<Note[]>(() => {
    // For InProgress status, show default notes; for other statuses (Cleaned, Dirty, Inspected), start with empty or room notes
    if (room.houseKeepingStatus === 'InProgress') {
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
    // For Cleaned, Dirty, Inspected statuses, start with empty notes array
    // In a real app, you would fetch notes from the API based on room status
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
          id: '1', // Default id since StaffInfo doesn't have id
          name: room.staff.name,
          avatar: room.staff.avatar || require('../../assets/icons/profile-avatar.png'),
          initials: room.staff.initials,
          avatarColor: room.staff.avatarColor,
          // Get department from mock data by matching name
          department: (() => {
            const staffMember = mockStaffData.find(s => s.name === room.staff?.name);
            return staffMember?.department;
          })(),
        }
      : undefined
  );
  // Track tasks in state
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Track paused time - show when status is Pause
  const [pausedAt, setPausedAt] = useState<string | undefined>(
    selectedStatusText === 'Pause' ? '11:22' : undefined // Default for demo, in real app get from room data
  );

  // Transform room data to detail data format
  // In a real app, this would come from an API or be passed directly
  const roomDetail: RoomDetailData = {
    ...room,
    specialInstructions: room.guests && room.guests.length > 0
      ? 'Please prepare a high-floor suite with a city view, away from the elevators, set to 21°C, with hypoallergenic pillows and a fresh orchid on the nightstand.'
      : undefined,
    notes: notes,
    tasks: tasks,
    assignedTo: assignedStaff,
    isUrgent: room.isPriority,
  };

  const handleBackPress = () => {
    // Navigate back to previous screen (All Rooms)
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback: navigate to AllRooms if can't go back
      navigation.navigate('AllRooms');
    }
  };

  const handleStatusPress = () => {
    // Measure the status button position
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
      // Fallback: use header position constants
      setStatusButtonPosition({
        x: ROOM_DETAIL_HEADER.statusIndicator.left * scaleX,
        y: ROOM_DETAIL_HEADER.statusIndicator.top * scaleX,
        width: ROOM_DETAIL_HEADER.statusIndicator.width * scaleX,
        height: ROOM_DETAIL_HEADER.statusIndicator.height * scaleX,
      });
      setShowStatusModal(true);
    }
  };

  const handleFlagToggle = (flagged: boolean) => {
    setLocalRoom((prev) => ({ ...prev, flagged }));
    // TODO: Save to backend/API
    console.log('Flag toggled for room:', localRoom.roomNumber, 'flagged:', flagged);
  };

  const handleStatusSelect = (statusOption: StatusChangeOption) => {
    // Find the status option label
    const statusOptionConfig = STATUS_OPTIONS.find(opt => opt.id === statusOption);
    const statusLabel = statusOptionConfig?.label || '';

    // If Return Later is selected, show the Return Later modal
    if (statusOption === 'ReturnLater') {
      setShowStatusModal(false);
      setShowReturnLaterModal(true);
      setSelectedStatusText(statusLabel);
      return;
    }

    // If PromisedTime is selected, show the Promise Time modal
    if (statusOption === 'PromisedTime') {
      setShowStatusModal(false);
      setShowPromiseTimeModal(true);
      setSelectedStatusText(statusLabel);
      return;
    }

    // If RefuseService is selected, show the Refuse Service modal
    if (statusOption === 'RefuseService') {
      setShowStatusModal(false);
      setShowRefuseServiceModal(true);
      setSelectedStatusText(statusLabel);
      return;
    }

    // Map status option to RoomStatus
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
          // These might be actions/metadata, not status changes
          // For now, keep InProgress status
          return 'InProgress';
        default:
          return 'InProgress';
      }
    };

    const newStatus = mapStatusOptionToRoomStatus(statusOption);

    // Update local status state to change header background color
    setCurrentStatus(newStatus);
    
    // If Pause is selected, don't change the status text (keep "In Progress")
    // Only set paused time to show "Paused at {time}" below the status
    if (statusOption === 'Pause') {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setPausedAt(`${hours}:${minutes}`);
      // Don't set selectedStatusText - keep it undefined so it shows "In Progress"
      setSelectedStatusText(undefined);
    } else {
      // Update selected status text to show the selected option label
      setSelectedStatusText(statusLabel);
      setPausedAt(undefined);
    }

    // TODO: Update room status in backend/API
    console.log('Status changed for room:', room.roomNumber, 'to:', newStatus);

    // Close modal
    setShowStatusModal(false);
    setStatusButtonPosition(null);
  };

  const handleReturnLaterConfirm = (returnTime: string, period: 'AM' | 'PM', taskDescription?: string, _formattedDateTime?: string, returnAtTimestamp?: number) => {
    console.log('Return Later confirmed for room:', room.roomNumber, 'at:', returnTime, period);
    if (taskDescription && taskDescription.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: taskDescription,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
      console.log('Task saved from Return Later modal:', taskDescription);
    }
    if (returnAtTimestamp != null) {
      setReturnLaterAtTimestamp(returnAtTimestamp);
    }
    setShowReturnLaterModal(false);
  };

  const handlePromiseTimeConfirm = (promiseTime: string, period: 'AM' | 'PM', _formattedDateTime?: string, promiseAtTimestamp?: number) => {
    console.log('Promise Time confirmed for room:', room.roomNumber, 'at:', promiseTime, period);
    if (promiseAtTimestamp != null) {
      setPromiseTimeAtTimestamp(promiseAtTimestamp);
    }
    setShowPromiseTimeModal(false);
  };

  const handleRefuseServiceConfirm = (reason: string) => {
    setRefuseServiceReason(reason);
    setShowRefuseServiceModal(false);
  };

  const handleTabPress = (tab: DetailTab) => {
    setActiveTab(tab);
    // TODO: Load content for other tabs
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
    // Create a new task (no creator/staff info needed)
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      createdAt: new Date().toISOString(),
    };
    
    // Add task to state
    setTasks(prev => [...prev, newTask]);
    
    // TODO: Save task to backend/API
    console.log('Task added for room:', room.roomNumber, 'task:', taskText);
  };

  const handleSaveNote = (noteText: string) => {
    // Get current logged-in user (default to first staff member)
    // In real app, get from auth context
    const currentUser = mockStaffData[0]; // Default logged-in user
    
    // Create a new note with current user info
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
    // TODO: Save note to backend/API
    console.log('Note saved:', noteText);
  };

  const handleAddPhotos = () => {
    // Navigate to Lost and Found screen and open the register modal
    navigation.navigate('Main' as any, {
      screen: 'LostAndFound',
      params: { openRegisterModal: true },
    } as any);
  };

  const handleLostAndFoundTitlePress = () => {
    // Navigate to Lost and Found screen
    navigation.navigate('Main' as any, {
      screen: 'LostAndFound',
    } as any);
  };

  const handleReassign = () => {
    console.log('handleReassign called, opening ReassignModal');
    setShowReassignModal(true);
  };

  const handleStaffSelect = (staffId: string) => {
    console.log('Staff selected:', staffId);
    // Find the selected staff member from mock data
    const selectedStaff = mockStaffData.find((s) => s.id === staffId);
    if (selectedStaff) {
      setAssignedStaff({
        id: selectedStaff.id,
        name: selectedStaff.name,
        avatar: selectedStaff.avatar,
        initials: selectedStaff.initials,
        department: selectedStaff.department, // Include department
        // Generate color for initial circle based on name if no avatarColor
        avatarColor: selectedStaff.avatarColor || (() => {
          const colors = ['#ff4dd8', '#5a759d', '#607aa1', '#f0be1b'];
          const index = selectedStaff.name.charCodeAt(0) % colors.length;
          return colors[index];
        })(),
      });
      // TODO: Update room assignment in backend/API
      console.log('Room assigned to:', selectedStaff.name);
    }
    setShowReassignModal(false);
  };

  const handleAutoAssign = () => {
    console.log('Auto assign requested');
    // TODO: Implement auto assign logic
    // For now, just close the modal
    setShowReassignModal(false);
  };

  if (!room) {
    return null;
  }

  // For Arrival/Departure rooms, find both guests
  const arrivalGuest = room.guests.find((g) => g.timeLabel === 'ETA');
  const departureGuest = room.guests.find((g) => g.timeLabel === 'EDT');
  
  // Ensure we have both guests for Arrival/Departure screen
  const hasArrivalGuest = !!arrivalGuest;
  const hasDepartureGuest = !!departureGuest;

  return (
    <View style={styles.container}>
      {/* Gray Background - Behind everything (0-285px) */}
      <View style={styles.backgroundTop} />

      {/* Header - Yellow (0-232px) */}
      <RoomDetailHeader
        roomNumber={room.roomNumber}
        roomCode={`${room.roomCategory} - ${room.credit}`}
        status={currentStatus}
        onBackPress={handleBackPress}
        onStatusPress={handleStatusPress}
        statusButtonRef={statusButtonRef}
        customStatusText={
          showReturnLaterModal
            ? 'Return Later'
            : showPromiseTimeModal ? 'Promise Time' :
            showRefuseServiceModal ? 'Refuse Service' :
            selectedStatusText
        }
        pausedAt={pausedAt}
        returnLaterAtTimestamp={returnLaterAtTimestamp}
        promiseTimeAtTimestamp={promiseTimeAtTimestamp}
        refuseServiceReason={refuseServiceReason}
      />

      {/* Tab Navigation - Below header (252px) */}
      <DetailTabNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      {/* Content Area - Starts at 285px */}
      {/* Checklist and Tickets Tabs have their own ScrollView, so render separately */}
      {activeTab === 'Checklist' ? (
        <ChecklistSection
          roomNumber={room.roomNumber}
          roomStatus={currentStatus}
          onSubmit={(data) => {
            // TODO: Handle checklist submission
            console.log('Checklist submitted:', data);
            // Optionally show success message or navigate back
          }}
          onCancel={() => {
            // TODO: Handle cancel - could navigate back or reset
            console.log('Checklist cancelled');
          }}
        />
      ) : activeTab === 'Tickets' ? (
        <RoomTicketsSection
          roomNumber={room.roomNumber}
          onSubmit={(ticketData) => {
            // TODO: Handle ticket submission
            console.log('Ticket submitted:', ticketData);
            // Optionally show success message or navigate back
          }}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Content Sections - Only show Overview tab content for now */}
          {activeTab === 'Overview' && (
          <>
            {/* Guest Info Section */}
            {(hasArrivalGuest || hasDepartureGuest) && (
              <View style={styles.guestInfoSection}>
                <Text style={styles.guestInfoTitle}>Guest Info</Text>

                {/* Arrival Guest */}
                {arrivalGuest && (
                  <GuestInfoCard
                    guest={arrivalGuest}
                    isArrival={true}
                    numberBadge={room.priorityCount?.toString()}
                    specialInstructions={roomDetail.specialInstructions}
                    absoluteTop={GUEST_INFO.arrival.name.top}
                    contentAreaTop={CONTENT_AREA.top}
                  />
                )}

                {/* Divider - show after arrival guest if there's a departure guest */}
                {arrivalGuest && departureGuest && <View style={styles.divider1} />}

                {/* Departure Guest */}
                {departureGuest && (
                  <GuestInfoCard
                    guest={departureGuest}
                    isArrival={false}
                    numberBadge={room.secondGuestPriorityCount?.toString() || room.priorityCount?.toString()}
                    specialInstructions={undefined} // Departure guests don't have special instructions
                    isSecondGuest={!!arrivalGuest} // Second guest if there's an arrival guest
                    absoluteTop={GUEST_INFO.departure.name.top}
                    contentAreaTop={CONTENT_AREA.top}
                  />
                )}

                {/* Divider - show after departure guest in Arrival/Departure rooms */}
                {departureGuest && arrivalGuest && <View style={styles.divider2} />}
              </View>
            )}

            {/* Spacer to reserve space for absolutely positioned card */}
            <View style={styles.cardSpacer} />

            {/* Assigned to Section Container - Similar structure to Lost and Found */}
            {roomDetail.assignedTo && (
              <View style={styles.assignedToSectionContainer}>
                {/* Assigned to Title - Outside and above the card */}
                <Text style={styles.assignedToTitle}>Assigned to</Text>
              </View>
            )}

            {/* Card Container for Assigned to and Task sections */}
            <View style={styles.assignedTaskCard}>
              {/* Assigned to Section */}
              {roomDetail.assignedTo && (
                <AssignedToSection
                  staff={roomDetail.assignedTo}
                  onReassignPress={handleReassign}
                />
              )}

              {/* Divider between Assigned to and Task sections */}
              <View style={styles.cardDivider} />

              {/* Task Section */}
              <TaskSection
                tasks={roomDetail.tasks || []}
                onAddPress={handleAddTask}
                onSeeMorePress={handleSeeMoreTask}
              />
            </View>

            {/* Lost and Found Section */}
            <LostAndFoundSection 
              onAddPhotosPress={handleAddPhotos}
              onTitlePress={handleLostAndFoundTitlePress}
            />

            {/* Notes Section */}
            <NotesSection
              notes={roomDetail.notes}
              onAddPress={handleAddNote}
            />
          </>
        )}

          {/* Other tabs content - placeholder */}
          {activeTab !== 'Overview' && (
            <View style={styles.placeholderContent}>
              <Text style={styles.placeholderText}>
                {activeTab} content coming soon
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Status Change Modal */}
      <StatusChangeModal
        visible={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setStatusButtonPosition(null);
        }}
        onStatusSelect={handleStatusSelect}
        onFlagToggle={handleFlagToggle}
        currentStatus={currentStatus}
        room={localRoom}
        buttonPosition={statusButtonPosition}
        showTriangle={false}
      />

      <ReturnLaterModal
        visible={showReturnLaterModal}
        onClose={() => {
          setShowReturnLaterModal(false);
          // Clear selected status text when modal is closed without confirmation
          setSelectedStatusText(undefined);
        }}
        onConfirm={handleReturnLaterConfirm}
        roomNumber={room.roomNumber}
        assignedTo={roomDetail.assignedTo}
        onReassignPress={handleReassign}
        taskDescription={roomDetail.tasks && roomDetail.tasks.length > 0 ? roomDetail.tasks[0].text : undefined}      />

      <PromiseTimeModal
        visible={showPromiseTimeModal}
        onClose={() => {
          setShowPromiseTimeModal(false);
          // Clear selected status text when modal is closed without confirmation
          setSelectedStatusText(undefined);
        }}
        onConfirm={handlePromiseTimeConfirm}
        roomNumber={room.roomNumber}
      />

      <RefuseServiceModal
        visible={showRefuseServiceModal}
        onClose={() => {
          setShowRefuseServiceModal(false);
          setSelectedStatusText(undefined);
          setRefuseServiceReason(undefined);
        }}
        onConfirm={handleRefuseServiceConfirm}
        roomNumber={room.roomNumber}
        assignedTo={roomDetail.assignedTo}
        onReassignPress={handleReassign}
      />

      {/* Reassign Modal */}
      <ReassignModal
        visible={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        onStaffSelect={handleStaffSelect}
        onAutoAssign={handleAutoAssign}
        currentAssignedStaffId={roomDetail.assignedTo?.id}
        roomNumber={room.roomNumber}
      />

      {/* Add Note Modal */}
      <AddNoteModal
        visible={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        onSave={handleSaveNote}
        roomNumber={room.roomNumber}
      />

      {/* Add Task Modal */}
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
    paddingTop: 0, // No extra padding at top, content starts immediately
    paddingBottom: 200 * scaleX, // Extra padding at bottom to ensure all sections are visible
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
    paddingTop: (GUEST_INFO.title.top - CONTENT_AREA.top) * scaleX, // Space from content area start to Guest Info title
    minHeight: (625 - 303) * scaleX, // From Guest Info title (303) to second divider (625) - reduced gap
  },
  guestInfoTitle: {
    position: 'absolute',
    left: GUEST_INFO.title.left * scaleX,
    top: (GUEST_INFO.title.top - CONTENT_AREA.top) * scaleX, // 303 - 285 = 18px from scroll start
    fontSize: GUEST_INFO.title.fontSize * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: GUEST_INFO.title.color,
  },
  divider1: {
    position: 'absolute',
    left: GUEST_INFO.divider.left,
    top: (GUEST_INFO.divider.top - CONTENT_AREA.top) * scaleX,
    width: GUEST_INFO.divider.width * scaleX,
    height: GUEST_INFO.divider.height,
    backgroundColor: GUEST_INFO.divider.color,
    zIndex: 0, // Below guest info content
  },
  divider2: {
    position: 'absolute',
    left: GUEST_INFO.divider2.left,
    top: (GUEST_INFO.divider2.top - CONTENT_AREA.top) * scaleX,
    width: GUEST_INFO.divider2.width * scaleX,
    height: GUEST_INFO.divider2.height,
    backgroundColor: GUEST_INFO.divider2.color,
    zIndex: 0, // Below guest info content
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
    // Spacer to reserve space for the absolutely positioned card and title
    // From Figma:
    // Guest Info section ends at divider 2: 625px absolute = (625 - 285) = 340px from content area
    // "Assigned to" title starts at: 644px absolute = (644 - 285) = 359px from content area (19px gap)
    // Card starts at: 674px absolute = (674 - 285) = 389px from content area (30px gap from title)
    // Card ends at: 674 + 206.09 = 880.09px absolute = (880.09 - 285) = 595.09px from content area
    // Total spacer height: From Guest Info end (625px) to card end (880.09px) = 255.09px
    height: ((ASSIGNED_TASK_CARD.top - GUEST_INFO.divider2.top) + ASSIGNED_TASK_CARD.height) * scaleX, // (674 - 625) + 206.09 = 255.09px
    width: '100%',
  },
  assignedToSectionContainer: {
    position: 'absolute',
    left: 0,
    width: '100%',
    top: (ASSIGNED_TO.title.top - CONTENT_AREA.top) * scaleX, // 644 - 285 = 359px from content area start (Figma)
    height: 20 * scaleX, // Height for title section (title is 15px, so 20px gives some space)
    zIndex: 2, // Above card
  },
  assignedToTitle: {
    position: 'absolute',
    left: ASSIGNED_TO.title.left * scaleX,
    top: 0, // At top of container (similar to Lost and Found)
    fontSize: ASSIGNED_TO.title.fontSize * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: ASSIGNED_TO.title.color,
  },
  assignedTaskCard: {
    position: 'absolute',
    left: ASSIGNED_TASK_CARD.left * scaleX,
    top: (ASSIGNED_TASK_CARD.top - CONTENT_AREA.top) * scaleX, // 674 - 285 = 389px from content area start (Figma)
    width: ASSIGNED_TASK_CARD.width * scaleX,
    height: ASSIGNED_TASK_CARD.height * scaleX, // Fixed height: 206.09px from Figma
    borderRadius: ASSIGNED_TASK_CARD.borderRadius * scaleX,
    backgroundColor: ASSIGNED_TASK_CARD.backgroundColor,
    borderWidth: ASSIGNED_TASK_CARD.borderWidth,
    borderColor: ASSIGNED_TASK_CARD.borderColor,
    paddingHorizontal: ASSIGNED_TASK_CARD.paddingHorizontal * scaleX,
    paddingVertical: ASSIGNED_TASK_CARD.paddingVertical * scaleX,
    zIndex: 1, // Ensure card is above spacer
    overflow: 'hidden', // Clip content that extends beyond card boundaries
  },
  cardDivider: {
    position: 'absolute',
    left: ASSIGNED_TASK_CARD.paddingHorizontal * scaleX, // Divider starts after card padding
    top: ASSIGNED_TASK_CARD.divider.top * scaleX, // 80px from card content top (updated)
    width: ASSIGNED_TASK_CARD.divider.width * scaleX,
    height: ASSIGNED_TASK_CARD.divider.height, // 1px
    backgroundColor: ASSIGNED_TASK_CARD.divider.backgroundColor,
    zIndex: 2, // Above both Assigned to (zIndex: 1) and Task sections (zIndex: 0)
  },
});
