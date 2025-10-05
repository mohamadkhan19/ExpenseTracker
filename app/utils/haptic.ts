import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const HapticFeedback = {
  light: () => {
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
  },
  
  medium: () => {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
  },
  
  heavy: () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
  },
  
  success: () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
  },
  
  warning: () => {
    ReactNativeHapticFeedback.trigger('notificationWarning', hapticOptions);
  },
  
  error: () => {
    ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
  },
  
  selection: () => {
    ReactNativeHapticFeedback.trigger('selection', hapticOptions);
  },
};
