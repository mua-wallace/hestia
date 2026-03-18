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
import CleanChecklistModal from '../components/allRooms/CleanChecklistModal';
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
import { useRoomsStore } from '../store/useRoomsStore';
import { authService } from '../services/auth';
import { colors } from '../theme';
import { getMockHistoryEvents } from '../data/mockHistoryData';
import { generateHistoryReport } from '../utils/generateHistoryReport';
import { showStayoverWithLinenBadge } from '../utils/stayoverLinen';
import { getDefaultTaskText } from '../utils/defaultTasks';
import { getRoomNotes, addRoomNote, getRoomDetailsById, fullRoomDetailsToRoomCardData, type FullRoomDetails } from '../services/rooms';

type RoomDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RoomDetail'
>;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapFrontOfficeToRoomType(frontOffice: string | null | undefined, reservationCount: number): RoomType {
  if (reservationCount >= 2) return 'ArrivalDeparture';
  switch (frontOffice) {
    case 'Arrival': return 'Arrival';
    case 'Departure': return 'Departure';
    case 'Stayover': return 'Stayover';
    case 'Turndown': return 'Turndown';
    case 'No Task': return 'Stayover';
    default: return 'Stayover';
  }
}

export default function RoomDetailScreen() {
  const navigation = useNavigation<RoomDetailScreenNavigationProp>();
  const route = useRoute();
  const params = route.params as { 
    room?: RoomCardData; 
    roomType?: RoomType; 
    roomId?: string;
    initialTab?: 'Overview' | 'Tickets' | 'Checklist' | 'History';
    departmentName?: string;
  } | undefined;
  const initialRoom = params?.room;
  const initialRoomType = params?.roomType ?? 'ArrivalDeparture';
  const roomId = params?.roomId;
  const initialTab = params?.initialTab;
  const departmentName = params?.departmentName;

  const { updateRoom, updatingRoomId, data: roomsData } = useRoomsStore();
  const shift = roomsData?.selectedShift ?? 'AM';

  const [loadingDetails, setLoadingDetails] = useState(!!(roomId && UUID_REGEX.test(roomId)));
  const [fetchedRoom, setFetchedRoom] = useState<RoomCardData | null>(null);
  const [fetchedRoomType, setFetchedRoomType] = useState<RoomType | null>(null);
  const [fetchedNotes, setFetchedNotes] = useState<Note[] | null>(null);
  const [fetchedAssignedStaff, setFetchedAssignedStaff] = useState<{
    id: string;
    name: string;
    avatar?: any;
    initials?: string;
    avatarColor?: string;
    department?: string;
  } | null>(null);
  const [fetchedLostAndFound, setFetchedLostAndFound] = useState<LostAndFoundItem[] | null>(null);

  useEffect(() => {
    if (!roomId || !UUID_REGEX.test(roomId)) {
      setLoadingDetails(false);
      return;
    }
    let cancelled = false;
    setLoadingDetails(true);
    getRoomDetailsById(roomId)
      .then((full: FullRoomDetails | null) => {
        if (cancelled || !full) {
          setLoadingDetails(false);
          return;
        }
        const roomCard = fullRoomDetailsToRoomCardData(full, shift as 'AM' | 'PM');
        setFetchedRoom(roomCard);
        const firstRes = full.reservations[0];
        const rawFrontOffice = firstRes?.front_office_status ?? 'Stayover';
        setFetchedRoomType(
          mapFrontOfficeToRoomType(rawFrontOffice, full.reservations.length)
        );
        setFetchedNotes(
          full.notes.map((n) => ({
            id: n.id,
            text: n.text,
            staff: { name: n.staff.name, avatar: n.staff.avatar_url ?? undefined },
            createdAt: n.created_at,
          }))
        );
        const assignment = full.assignedStaff[0];
        if (assignment) {
          setFetchedAssignedStaff({
            id: assignment.user_id,
            name: assignment.staff.full_name,
            avatar: assignment.staff.avatar_url ?? undefined,
            initials: assignment.staff.full_name.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase() || '?',
            department: assignment.staff.department_name,
          });
        } else {
          setFetchedAssignedStaff(undefined);
        }
        setFetchedLostAndFound(
          full.lostAndFoundItems.map((item) => ({
            id: item.id,
            itemName: item.item_name,
            itemId: item.id,
            location: item.description ?? 'Room',
            storedLocation: item.storage_location ?? '',
            registeredBy: { name: 'Staff', timestamp: item.found_at },
            status: (item.status as 'stored' | 'shipped' | 'returned' | 'discarded') ?? 'stored',
            createdAt: item.found_at,
          }))
        );
        setLoadingDetails(false);
      })
      .catch(() => setLoadingDetails(false));
    return () => { cancelled = true; };
  }, [roomId, shift]);

  const placeholderRoom: RoomCardData | null =
    roomId && loadingDetails && !initialRoom
      ? {
          id: roomId,
          roomNumber: '—',
          roomCategory: '',
          credit: 0,
          frontOfficeStatus: 'Stayover',
          houseKeepingStatus: 'InProgress',
          reservationStatus: 'Occupied',
          guests: [],
          roomAttendantAssigned: null,
          isPriority: false,
          flagged: false,
          specialInstructions: null,
          roomNotes: null,
          noteMadeBy: null,
          notes: undefined,
          withLinen: false,
          promisedTime: null,
        }
      : null;

  const room = fetchedRoom ?? initialRoom ?? placeholderRoom;
  const roomType = fetchedRoomType ?? initialRoomType;

  if (!room && !loadingDetails) {
    console.warn('RoomDetailScreen: No room data provided');
    return null;
  }

  const roomGuests = room.guests || [];
  const effectiveRoomType: RoomType = roomGuests.length >= 2 ? 'ArrivalDeparture' : roomType;
  const isUpdating = updatingRoomId === room.id;
  const config = React.useMemo(() => getRoomTypeConfig(effectiveRoomType), [effectiveRoomType]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showInspectedModal, setShowInspectedModal] = useState(false);
  const [showCleanChecklistModal, setShowCleanChecklistModal] = useState(false);
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

  // Sync fetched full-details into state when load by roomId completes
  useEffect(() => {
    if (fetchedNotes !== null) setNotes(fetchedNotes);
    if (fetchedAssignedStaff !== null) setAssignedStaff(fetchedAssignedStaff);
    if (fetchedRoom) {
      setLocalRoom(fetchedRoom);
      setCurrentStatus(fetchedRoom.houseKeepingStatus);
    }
  }, [fetchedNotes, fetchedAssignedStaff, fetchedRoom]);

  // Load notes from room_notes when room is from Supabase and we did not load via getRoomDetailsById
  useEffect(() => {
    if (fetchedNotes !== null) return;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!room?.id || !uuidRegex.test(room.id)) return;
    getRoomNotes(room.id).then((loaded) => setNotes(loaded)).catch(() => {});
  }, [room?.id, fetchedNotes]);
  
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
          department: undefined,
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
    return getDefaultTaskText(effectiveRoomType);
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

    // Priority only toggles rush icon on room card; do not change room detail background or status icon
    if (statusOption === 'Priority') {
      const newIsPriority = !localRoom.isPriority;
      setLocalRoom((prev) => ({ ...prev, isPriority: newIsPriority }));
      setSelectedStatusText(undefined);
      setPausedAt(undefined);
      const priorityPayload = newIsPriority ? 'high' : 'normal';
      updateRoom(room.id, {
        ...(localRoom.houseKeepingStatus && { house_keeping_status: localRoom.houseKeepingStatus }),
        priority: priorityPayload,
      }).catch((e) => console.warn('Failed to update room status in Supabase', e));
      setShowStatusModal(false);
      setStatusButtonPosition(null);
      return;
    }

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

    updateRoom(room.id, {
      house_keeping_status: newStatus,
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
    // Staff data should come from Supabase, not mock data
    if (staffId) {
      setAssignedStaff({
        id: staffId,
        name: 'Staff Member',
        avatar: require('../../assets/icons/profile-avatar.png'),
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
  // Build guests array with type information
  const guestsWithTypes: Array<{ guest: import('../types/allRooms.types').GuestInfo; type: 'Arrival' | 'Departure' | 'Stayover' | 'Turndown' }> = [];
  
  if (effectiveRoomType === 'ArrivalDeparture') {
    // For Arrival/Departure: show both guests whenever we have at least two entries.
    // Prefer ETA/EDT when present, but always fall back to array order so nothing disappears.
    const etaGuest = roomGuests.find((g) => g.timeLabel === 'ETA');
    const edtGuest = roomGuests.find((g) => g.timeLabel === 'EDT');

    let arrivalGuest = etaGuest ?? roomGuests[0];
    let departureGuest = edtGuest ?? (roomGuests.length > 1 ? roomGuests[1] : roomGuests[0]);

    // If both resolved to the same object but we have more than one guest, pick a different one for departure
    if (arrivalGuest === departureGuest && roomGuests.length > 1) {
      const alt = roomGuests.find((g) => g !== arrivalGuest);
      if (alt) {
        // Prefer keeping EDT as departure when possible
        departureGuest = edtGuest && edtGuest !== arrivalGuest ? edtGuest : alt;
      }
    }

    if (arrivalGuest) {
      guestsWithTypes.push({ guest: arrivalGuest, type: 'Arrival' });
    }
    if (departureGuest && departureGuest !== arrivalGuest) {
      guestsWithTypes.push({ guest: departureGuest, type: 'Departure' });
    }
  } else if (effectiveRoomType === 'Arrival') {
    // For Arrival: single arrival guest
    const arrivalGuest = roomGuests.find((g) => g.timeLabel === 'ETA') || roomGuests[0];
    if (arrivalGuest) {
      guestsWithTypes.push({ guest: arrivalGuest, type: 'Arrival' });
    }
  } else if (effectiveRoomType === 'Departure') {
    // For Departure: single departure guest
    const departureGuest = roomGuests.find((g) => g.timeLabel === 'EDT') || roomGuests[0];
    if (departureGuest) {
      guestsWithTypes.push({ guest: departureGuest, type: 'Departure' });
    }
  } else if (effectiveRoomType === 'Stayover') {
    // For Stayover: single stayover guest
    const stayoverGuest = roomGuests[0];
    if (stayoverGuest) {
      guestsWithTypes.push({ guest: stayoverGuest, type: 'Stayover' });
    }
  } else if (effectiveRoomType === 'Turndown') {
    // For Turndown: single turndown guest
    const turndownGuest = roomGuests[0];
    if (turndownGuest) {
      guestsWithTypes.push({ guest: turndownGuest, type: 'Turndown' });
    }
  }

  // Get task description from tasks
  const taskDescription = getTaskDescription();

  // Lost & found: use fetched items when loaded by roomId, else mock when config says withItems
  const lostAndFoundItems =
    fetchedLostAndFound !== null
      ? fetchedLostAndFound
      : config.lostAndFoundType === 'withItems'
        ? [
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
          ]
        : undefined;

  if (loadingDetails && !initialRoom) {
    return (
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isUpdating && (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }]}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      )}
      {/* Layout lives in RoomDetailContent (Figma 1772-104); this screen only fetches and passes props. */}
      <RoomDetailContent
        roomId={room.id}
        roomNumber={room.roomNumber}
        roomCode={`${room.roomCategory} - ${room.credit}`}
        status={currentStatus}
        isPriority={localRoom.isPriority === true}
        flagged={localRoom.flagged}
        frontOfficeStatus={room.frontOfficeStatus === 'Refresh' ? undefined : room.frontOfficeStatus}
        roomType={effectiveRoomType}
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
        initialTab={initialTab}
        departmentName={departmentName}
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
        onCleanedSelect={() => setShowCleanChecklistModal(true)}
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
        showTriangle={false}
      />

      <CleanChecklistModal
        visible={showCleanChecklistModal}
        onClose={() => setShowCleanChecklistModal(false)}
        onComplete={() => {
          handleStatusSelect('Cleaned');
          setShowCleanChecklistModal(false);
        }}
        headerHeight={232}
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
