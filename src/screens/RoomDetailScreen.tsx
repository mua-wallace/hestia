/**
 * Room Detail Screen - Wrapper that transforms route params to props
 * Uses reusable RoomDetailContent component
 * Supports: Arrival, Departure, ArrivalDeparture, Stayover, Turndown
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROOM_DETAIL_HEADER, scaleX } from '../constants/roomDetailStyles';
import StatusChangeModal from '../components/allRooms/StatusChangeModal';
import InspectedStatusSlideModal from '../components/allRooms/InspectedStatusSlideModal';
import ReturnLaterModal from '../components/roomDetail/ReturnLaterModal';
import PromiseTimeModal from '../components/roomDetail/PromiseTimeModal';
import RefuseServiceModal from '../components/roomDetail/RefuseServiceModal';
import ReassignModal from '../components/roomDetail/ReassignModal';
import AddNoteModal from '../components/roomDetail/AddNoteModal';
import AddTaskModal from '../components/roomDetail/AddTaskModal';
import ViewTaskModal from '../components/roomDetail/ViewTaskModal';
import RoomDetailContent from '../components/roomDetail/RoomDetailContent';
import { getRoomTypeConfig } from '../constants/roomTypeConfigs';
import type { RoomCardData, StatusChangeOption } from '../types/allRooms.types';
import { STATUS_OPTIONS } from '../types/allRooms.types';
import type { Note, Task, RoomType, HistoryEvent, HistoryGroup } from '../types/roomDetail.types';
import type { LostAndFoundItem } from '../types/lostAndFound.types';
import type { RootStackParamList } from '../navigation/types';
import { mockStaffData } from '../data/mockStaffData';
import { useRoomsStore } from '../store/useRoomsStore';
import { authService } from '../services/auth';
import { colors } from '../theme';
import { getMockHistoryEvents } from '../data/mockHistoryData';
import { generateHistoryReport } from '../utils/generateHistoryReport';
import { showStayoverWithLinenBadge } from '../utils/stayoverLinen';
import { getDefaultTaskText } from '../utils/defaultTasks';
import { getRoomNotes, addRoomNote } from '../services/rooms';

type RoomDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RoomDetail'
>;

export default function RoomDetailScreen() {
  const navigation = useNavigation<RoomDetailScreenNavigationProp>();
  const route = useRoute();
  const room = (route.params as any)?.room as RoomCardData;
  const roomType = (route.params as any)?.roomType as RoomType || 'ArrivalDeparture'; // Default to ArrivalDeparture

  const { updateRoom, updatingRoomId } = useRoomsStore();

  if (!room) {
    console.warn('RoomDetailScreen: No room data provided');
    return null;
  }

  const isUpdating = updatingRoomId === room.id;
  const config = React.useMemo(() => getRoomTypeConfig(roomType), [roomType]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showInspectedModal, setShowInspectedModal] = useState(false);
  const [buttonPositionForInspection, setButtonPositionForInspection] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [showReturnLaterModal, setShowReturnLaterModal] = useState(false);
  const [showPromiseTimeModal, setShowPromiseTimeModal] = useState(false);
  const [showRefuseServiceModal, setShowRefuseServiceModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showViewTaskModal, setShowViewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusButtonPosition, setStatusButtonPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const statusButtonRef = useRef<React.ComponentRef<typeof TouchableOpacity>>(null);
  
  // Track current status to update header background color
  const [currentStatus, setCurrentStatus] = useState<RoomCardData['houseKeepingStatus']>(room.houseKeepingStatus);
  // Track room data locally to allow updates (e.g., flagged status)
  const [localRoom, setLocalRoom] = useState<RoomCardData>(room);
  // Track selected status option text to display in header
  const [selectedStatusText, setSelectedStatusText] = useState<string | undefined>(undefined);
  // Track Return Later: timestamp for time-only display + remaining countdown (e.g. "2:30 PM · 30 mins 2s")
  const [returnLaterAtTimestamp, setReturnLaterAtTimestamp] = useState<number | undefined>(undefined);
  // Track Promise Time: timestamp for time + countdown in header
  const [promiseTimeAtTimestamp, setPromiseTimeAtTimestamp] = useState<number | undefined>(undefined);
  // Track Refuse Service: selected reason or custom reason to show in header
  const [refuseServiceReason, setRefuseServiceReason] = useState<string | undefined>(undefined);

  // Track notes in state. For Supabase rooms we load via getRoomNotes; for mock we use room.roomNotes.
  const [notes, setNotes] = useState<Note[]>(() => {
    if (room.roomNotes && room.roomNotes.trim()) {
      const noteTexts = room.roomNotes.split(/\n\n+/).filter((text: string) => text.trim());
      return noteTexts.map((text: string, index: number) => ({
        id: `room-note-${index}`,
        text: text.trim(),
        staff: {
          name: room.noteMadeBy?.name || 'Staff',
          avatar: room.noteMadeBy?.avatar ?? require('../../assets/icons/profile-avatar.png'),
        },
        createdAt: new Date().toISOString(),
      }));
    }
    return [];
  });

  // Load notes from room_notes when room is from Supabase (valid UUID)
  useEffect(() => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!room?.id || !uuidRegex.test(room.id)) return;
    getRoomNotes(room.id).then((loaded) => setNotes(loaded)).catch(() => {});
  }, [room?.id]);
  
  const [assignedStaff, setAssignedStaff] = useState<{
    id: string;
    name: string;
    avatar?: any;
    initials?: string;
    avatarColor?: string;
    department?: string;
  } | undefined>(
    room.roomAttendantAssigned
      ? {
          id: '1',
          name: room.roomAttendantAssigned.name,
          avatar: room.roomAttendantAssigned.avatar || require('../../assets/icons/profile-avatar.png'),
          initials: room.roomAttendantAssigned.initials,
          avatarColor: room.roomAttendantAssigned.avatarColor,
          department: (() => {
            const staffMember = mockStaffData.find(s => s.name === room.roomAttendantAssigned?.name);
            return staffMember?.department;
          })(),
        }
      : undefined
  );
  
  // Track tasks in state - initialize from room data if available
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Initialize from room data if tasks are provided
    if (room.tasks && room.tasks.length > 0) {
      return room.tasks.map(task => ({
        id: task.id,
        text: task.text,
        createdAt: task.createdAt,
      }));
    }
    // Otherwise start with empty array
    return [];
  });
  
  // Track history events in state
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>(() => {
    return getMockHistoryEvents(room.roomNumber);
  });
  
  // Get task description - use actual tasks or default task
  const getTaskDescription = () => {
    if (tasks.length > 0) {
      return tasks[0].text;
    }
    // Return default task based on room type
    return getDefaultTaskText(roomType);
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
        roomCode: `${room.roomCategory} - ${room.credit}`,
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
  const [pausedAt, setPausedAt] = useState<string | undefined>(undefined);

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('AllRooms' as any, {} as any);
    }
  };

  const handleStatusPress = () => {
    if (statusButtonRef.current) {
      statusButtonRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
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
      setShowRefuseServiceModal(true);
      setSelectedStatusText(statusLabel);
      return;
    }

    const mapStatusOptionToRoomStatus = (option: StatusChangeOption): RoomCardData['houseKeepingStatus'] => {
      switch (option) {
        case 'Dirty':
          return 'Dirty';
        case 'InProgress':
          return 'InProgress';
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

    // Priority toggles: if already priority, clicking Priority resets to normal
    if (statusOption === 'Priority') {
      const newIsPriority = !localRoom.isPriority;
      setLocalRoom((prev) => ({ ...prev, isPriority: newIsPriority }));
      setSelectedStatusText(undefined);
      setPausedAt(undefined);
    } else if (statusOption === 'Pause') {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setPausedAt(`${hours}:${minutes}`);
      setSelectedStatusText(undefined);
    } else {
      setSelectedStatusText(statusLabel);
      setPausedAt(undefined);
    }

    const priorityPayload = statusOption === 'Priority' ? (!localRoom.isPriority ? 'high' : 'normal') : undefined;
    updateRoom(room.id, {
      house_keeping_status: newStatus,
      ...(priorityPayload !== undefined && { priority: priorityPayload }),
    }).catch((e) => console.warn('Failed to update room status in Supabase', e));

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

  const handleSaveNote = async (noteText: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (room.id && uuidRegex.test(room.id)) {
      try {
        const newNote = await addRoomNote(room.id, noteText);
        setNotes((prev) => [...prev, newNote]);
        setLocalRoom((prev) => ({
          ...prev,
          notes: { count: (prev.notes?.count ?? 0) + 1, hasRushed: prev.notes?.hasRushed || false },
          noteMadeBy: { name: newNote.staff.name, avatar: newNote.staff.avatar },
        }));
      } catch (e) {
        console.warn('Failed to save note to Supabase', e);
      }
      return;
    }
    // Mock path: append note with current user as author
    const [noteAuthorLabel, avatarUrl] = await Promise.all([
      authService.getCurrentUserNoteLabel(),
      authService.getCurrentUserAvatarUrl(),
    ]);
    const newNote: Note = {
      id: Date.now().toString(),
      text: noteText,
      staff: {
        name: noteAuthorLabel,
        avatar: avatarUrl || require('../../assets/icons/profile-avatar.png'),
      },
      createdAt: new Date().toISOString(),
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setLocalRoom((prev) => ({
      ...prev,
      notes: { count: updatedNotes.length, hasRushed: prev.notes?.hasRushed || false },
      noteMadeBy: { name: noteAuthorLabel, avatar: avatarUrl || undefined },
    }));
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

  // Transform room data to props format for reusable component
  // Determine guests based on room type
  const roomGuests = room.guests || [];
  
  // Build guests array with type information
  const guestsWithTypes: Array<{ guest: import('../types/allRooms.types').GuestInfo; type: 'Arrival' | 'Departure' | 'Stayover' | 'Turndown' }> = [];
  
  if (roomType === 'ArrivalDeparture') {
    // For Arrival/Departure: first guest is Arrival, second is Departure
    // Try to find guests by timeLabel first, fallback to array position if timeLabel is missing or "N/A"
    let arrivalGuest = roomGuests.find((g) => g.timeLabel === 'ETA');
    let departureGuest = roomGuests.find((g) => g.timeLabel === 'EDT');
    
    // Fallback: if no ETA found, use first guest as Arrival (if it's not already EDT)
    if (!arrivalGuest && roomGuests.length >= 1 && roomGuests[0].timeLabel !== 'EDT') {
      arrivalGuest = roomGuests[0];
    }
    
    // Fallback: if no EDT found, use second guest as Departure (if it exists and is not already ETA)
    if (!departureGuest && roomGuests.length >= 2 && roomGuests[1].timeLabel !== 'ETA') {
      departureGuest = roomGuests[1];
    }
    
    // Ensure we don't add the same guest twice
    if (arrivalGuest && arrivalGuest !== departureGuest) {
      guestsWithTypes.push({ guest: arrivalGuest, type: 'Arrival' });
    }
    if (departureGuest && departureGuest !== arrivalGuest) {
      guestsWithTypes.push({ guest: departureGuest, type: 'Departure' });
    }
    
    // Edge case: if we only found one guest, make sure we add it
    if (guestsWithTypes.length === 0 && roomGuests.length > 0) {
      guestsWithTypes.push({ guest: roomGuests[0], type: 'Arrival' });
    }
  } else if (roomType === 'Arrival') {
    // For Arrival: single arrival guest
    const arrivalGuest = roomGuests.find((g) => g.timeLabel === 'ETA') || roomGuests[0];
    if (arrivalGuest) {
      guestsWithTypes.push({ guest: arrivalGuest, type: 'Arrival' });
    }
  } else if (roomType === 'Departure') {
    // For Departure: single departure guest
    const departureGuest = roomGuests.find((g) => g.timeLabel === 'EDT') || roomGuests[0];
    if (departureGuest) {
      guestsWithTypes.push({ guest: departureGuest, type: 'Departure' });
    }
  } else if (roomType === 'Stayover') {
    // For Stayover: single stayover guest
    const stayoverGuest = roomGuests[0];
    if (stayoverGuest) {
      guestsWithTypes.push({ guest: stayoverGuest, type: 'Stayover' });
    }
  } else if (roomType === 'Turndown') {
    // For Turndown: single turndown guest
    const turndownGuest = roomGuests[0];
    if (turndownGuest) {
      guestsWithTypes.push({ guest: turndownGuest, type: 'Turndown' });
    }
  }

  // Get task description from tasks
  const taskDescription = getTaskDescription();

  // Get lost & found items based on config
  const lostAndFoundItems = config.lostAndFoundType === 'withItems' ? [
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
      status: 'stored' as const,
      createdAt: new Date().toISOString(),
    },
  ] : undefined;

  return (
    <View style={{ flex: 1 }}>
      {isUpdating && (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }]}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      )}
      <RoomDetailContent
        roomNumber={room.roomNumber}
        roomCode={`${room.roomCategory} - ${room.credit}`}
        status={currentStatus}
        isPriority={localRoom.isPriority === true}
        flagged={localRoom.flagged}
        frontOfficeStatus={room.frontOfficeStatus === 'Refresh' ? undefined : room.frontOfficeStatus}
        roomType={roomType}
        guests={guestsWithTypes}
        specialInstructions={room.specialInstructions ?? undefined}
        assignedTo={assignedStaff}
        taskDescription={taskDescription}
        notes={notes}
        lostAndFoundItems={lostAndFoundItems}
        historyEvents={historyEvents}
        onBackPress={handleBackPress}
        onStatusPress={handleStatusPress}
        onStatusChange={handleStatusSelect}
        onReassign={handleReassign}
        onAddNote={handleAddNote}
        onSaveNote={handleSaveNote}
        onAddTask={handleAddTask}
        onSaveTask={handleSaveTask}
        onAddLostAndFoundItem={handleAddPhotos}
        onDownloadHistoryReport={handleDownloadReport}
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
        showWithLinenBadge={room.frontOfficeStatus === 'Stayover' && showStayoverWithLinenBadge(room)}
      />

      {/* Modals */}
      <StatusChangeModal
        visible={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setStatusButtonPosition(null);
        }}
        onStatusSelect={handleStatusSelect}
        onInspectedSelect={() => {
          setButtonPositionForInspection(statusButtonPosition);
          setShowInspectedModal(true);
        }}
        currentStatus={currentStatus}
        room={localRoom}
        buttonPosition={statusButtonPosition}
        showTriangle={false}
        onFlagToggle={(flagged) => {
          setLocalRoom((prev) => ({ ...prev, flagged }));
          updateRoom(room.id, { flagged }).catch((e) => console.warn('Failed to update room flag in Supabase', e));
        }}
      />

      <InspectedStatusSlideModal
        visible={showInspectedModal}
        onClose={() => {
          setShowInspectedModal(false);
          setButtonPositionForInspection(null);
        }}
        onComplete={() => {
          handleStatusSelect('Inspected');
          setShowInspectedModal(false);
          setButtonPositionForInspection(null);
        }}
        buttonPosition={buttonPositionForInspection}
        headerHeight={232}
        showTriangle={!!buttonPositionForInspection}
      />

      <ReturnLaterModal
        visible={showReturnLaterModal}
        onClose={() => {
          setShowReturnLaterModal(false);
          setSelectedStatusText(undefined);
        }}
        onConfirm={handleReturnLaterConfirm}
        roomNumber={room.roomNumber}
        assignedTo={assignedStaff}
        onReassignPress={handleReassign}
        taskDescription={tasks.length > 0 ? tasks[0].text : undefined}
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

      <RefuseServiceModal
        visible={showRefuseServiceModal}
        onClose={() => {
          setShowRefuseServiceModal(false);
          setSelectedStatusText(undefined);
          setRefuseServiceReason(undefined);
        }}
        onConfirm={handleRefuseServiceConfirm}
        roomNumber={room.roomNumber}
        assignedTo={assignedStaff}
        onReassignPress={handleReassign}
      />

      <ReassignModal
        visible={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        onStaffSelect={handleStaffSelect}
        onAutoAssign={handleAutoAssign}
        currentAssignedStaffId={assignedStaff?.id}
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
