import { useState, useMemo, useCallback } from 'react';
import { FilterState, FilterCounts, FloorFilter } from '../types/filter.types';

const defaultFilterState: FilterState = {
  roomStates: {
    dirty: false,
    inProgress: false,
    cleaned: false,
    inspected: false,
    priority: false,
  },
  guests: {
    arrivals: false,
    departures: false,
    turnDown: false,
    stayOver: false,
  },
  floors: {
    all: false,
    first: false,
    second: false,
    third: false,
    fourth: false,
  },
};

export function useHomeFilters(initialFilters?: FilterState) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || defaultFilterState
  );

  const toggleRoomState = useCallback((state: keyof FilterState['roomStates']) => {
    setFilters((prev) => ({
      ...prev,
      roomStates: {
        ...prev.roomStates,
        [state]: !prev.roomStates[state],
      },
    }));
  }, []);

  const toggleGuest = useCallback((guest: keyof FilterState['guests']) => {
    setFilters((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [guest]: !prev.guests[guest],
      },
    }));
  }, []);

  const toggleFloor = useCallback((floor: FloorFilter) => {
    setFilters((prev) => ({
      ...prev,
      floors: {
        ...(prev.floors || defaultFilterState.floors),
        [floor]: !(prev.floors || defaultFilterState.floors)[floor],
      },
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilterState);
  }, []);

  const calculateResultCount = useCallback(
    (filterCounts: FilterCounts): number => {
      let count = 0;
      let hasAnyFilter = false;

      // Count room states
      Object.entries(filters.roomStates).forEach(([key, selected]) => {
        if (selected) {
          hasAnyFilter = true;
          count += filterCounts.roomStates[key as keyof FilterCounts['roomStates']] || 0;
        }
      });

      // Count guests
      Object.entries(filters.guests).forEach(([key, selected]) => {
        if (selected) {
          hasAnyFilter = true;
          count += filterCounts.guests[key as keyof FilterCounts['guests']] || 0;
        }
      });

      // Count floors (if provided)
      const floorSelections = filters.floors || defaultFilterState.floors;
      if (filterCounts.floors) {
        Object.entries(floorSelections).forEach(([key, selected]) => {
          if (selected) {
            hasAnyFilter = true;
            count += filterCounts.floors?.[key as FloorFilter] || 0;
          }
        });
      }

      // If no filters selected, return 0 (caller can provide a fallback total if needed)
      if (!hasAnyFilter) {
        return 0;
      }

      return count;
    },
    [filters]
  );

  const hasActiveFilters = useMemo(() => {
    return (
      Object.values(filters.roomStates).some((v) => v) ||
      Object.values(filters.guests).some((v) => v) ||
      Object.values(filters.floors || {}).some((v) => v)
    );
  }, [filters]);

  // Ensure filters is always defined
  const safeFilters: FilterState = {
    ...defaultFilterState,
    ...filters,
    roomStates: filters?.roomStates || defaultFilterState.roomStates,
    guests: filters?.guests || defaultFilterState.guests,
    floors: filters?.floors || defaultFilterState.floors,
  };

  return {
    filters: safeFilters,
    setFilters,
    toggleRoomState,
    toggleGuest,
    toggleFloor,
    resetFilters,
    calculateResultCount,
    hasActiveFilters,
  };
}
