import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme';
import ExpensesListScreen from '../screens/ExpensesList/ExpensesList.screen';
import ChartsScreen from '../screens/Analytics/Charts.screen';
import LimitsScreen from '../screens/Analytics/Limits.screen';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.subtext,
        tabBarLabelStyle: {
          fontSize: theme.fontSizes.xs,
          fontWeight: theme.fontWeights.medium,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontSize: theme.fontSizes.lg,
          fontWeight: theme.fontWeights.semibold,
        },
      }}
    >
      <Tab.Screen
        name="Expenses"
        component={ExpensesListScreen}
        options={{
          title: 'Expenses',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Charts"
        component={ChartsScreen}
        options={{
          title: 'Charts',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Limits"
        component={LimitsScreen}
        options={{
          title: 'Limits',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="limit" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Simple icon component using text symbols
function TabIcon({ name, size, color }: { name: string; size: number; color: string }) {
  const getIconSymbol = (iconName: string) => {
    switch (iconName) {
      case 'wallet':
        return '💰';
      case 'chart-bar':
        return '📊';
      case 'limit':
        return '🚨';
      default:
        return '📱';
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size, color }}>
        {getIconSymbol(name)}
      </Text>
    </View>
  );
}