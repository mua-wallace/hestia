import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { REASSIGN_MODAL, scaleX } from '../../constants/reassignModalStyles';
import { ReassignTab, StaffMember } from '../../types/staff.types';
import ReassignHeader from './ReassignHeader';
import ReassignTabs from './ReassignTabs';
import StaffListContainer from './StaffListContainer';
import { mockStaffData } from '../../data/mockStaffData';
import { fetchStaffFromSupabase } from '../../services/staff';

interface ReassignModalProps {
  visible: boolean;
  onClose: () => void;
  onStaffSelect: (staffId: string) => void;
  onAutoAssign: () => void;
  currentAssignedStaffId?: string;
  roomNumber?: string;
  /** When false, hides the Auto Assign button (e.g. for "Assign Staff" flow). Default true. */
  showAutoAssign?: boolean;
}

export default function ReassignModal({
  visible,
  onClose,
  onStaffSelect,
  onAutoAssign,
  currentAssignedStaffId,
  roomNumber,
  showAutoAssign = true,
}: ReassignModalProps) {
  const [activeTab, setActiveTab] = useState<ReassignTab>('OnShift');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(
    currentAssignedStaffId || null
  );
  const [staff, setStaff] = useState<StaffMember[]>(mockStaffData);

  // Load staff list from Supabase when modal is visible; fall back to mock data if empty/error.
  React.useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      const supabaseStaff = await fetchStaffFromSupabase();
      if (cancelled) return;
      if (supabaseStaff.length > 0) {
        setStaff(supabaseStaff);
      } else {
        setStaff(mockStaffData);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible]);

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
    onStaffSelect(staffId);
    onClose();
  };

  const handleAutoAssign = () => {
    // Find staff with lowest workload
    const filteredStaff = getFilteredStaff();
    if (filteredStaff.length > 0) {
      // Sort by workload and select the one with lowest workload
      const sortedStaff = [...filteredStaff].sort((a, b) => (a.workload ?? 0) - (b.workload ?? 0));
      handleStaffSelect(sortedStaff[0].id);
    } else {
      // Fallback: call the onAutoAssign callback
      onAutoAssign();
    }
  };

  const getFilteredStaff = (): StaffMember[] => {
    let filtered = staff;
    
    // Filter by tab
    switch (activeTab) {
      case 'OnShift':
        filtered = filtered.filter((s) => s.onShift);
        break;
      case 'AM':
        filtered = filtered.filter((s) => s.onShift && s.shift === 'AM');
        break;
      case 'PM':
        filtered = filtered.filter((s) => s.onShift && s.shift === 'PM');
        break;
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerQuery) ||
          (s.department ?? '').toLowerCase().includes(lowerQuery)
      );
    }
    
    return filtered;
  };

  // Debug log
  React.useEffect(() => {
    if (visible) {
      console.log('ReassignModal is now visible');
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <ReassignHeader
          onBackPress={onClose}
          onAutoAssignPress={showAutoAssign ? handleAutoAssign : undefined}
        />

        {/* Tabs */}
        <ReassignTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onSearchPress={() => {
            // TODO: Implement search functionality
            console.log('Search pressed');
          }}
        />

        {/* Staff List */}
        <StaffListContainer
          staff={staff}
          activeTab={activeTab}
          searchQuery={searchQuery}
          selectedStaffId={selectedStaffId || undefined}
          onStaffSelect={handleStaffSelect}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

