import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-haptic-feedback
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const MockSvg = (props: any) => React.createElement(View, props);
  
  return {
    __esModule: true,
    default: MockSvg,
    Svg: MockSvg,
    Circle: MockSvg,
    Ellipse: MockSvg,
    G: MockSvg,
    Text: MockSvg,
    TextPath: MockSvg,
    TSpan: MockSvg,
    Path: MockSvg,
    Polygon: MockSvg,
    Polyline: MockSvg,
    Line: MockSvg,
    Rect: MockSvg,
    Use: MockSvg,
    Image: MockSvg,
    Symbol: MockSvg,
    Defs: MockSvg,
    LinearGradient: MockSvg,
    RadialGradient: MockSvg,
    Stop: MockSvg,
    ClipPath: MockSvg,
    Pattern: MockSvg,
    Mask: MockSvg,
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
