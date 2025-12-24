import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { scaleX, scaleY, scaleFont } from '../utils/scaling';

const DESIGN_WIDTH = 440;

/**
 * Hook to get scaling functions based on current screen dimensions
 */
export const useScale = () => {
  const dimensions = useMemo(() => Dimensions.get('window'), []);
  
  return useMemo(
    () => ({
      scaleX,
      scaleY,
      scaleFont,
      width: dimensions.width,
      height: dimensions.height,
      designWidth: DESIGN_WIDTH,
    }),
    [dimensions]
  );
};

