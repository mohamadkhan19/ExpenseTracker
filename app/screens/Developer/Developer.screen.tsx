import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { useTheme } from '../../theme';
import { useCreateExpenseMutation } from '../../store/api/expenses.api';
import { ExpenseCategory } from '../../features/expenses/types';
import { useAnalytics } from '../../features/analytics/hooks/useAnalytics';
import { useSpendingLimits } from '../../features/limits/hooks/useSpendingLimits';

interface DeveloperScreenProps {
  onClose: () => void;
}

export function DeveloperScreen({ onClose }: DeveloperScreenProps) {
  const { theme, themeMode, toggleTheme: toggleThemeMode } = useTheme();
  const [createExpense] = useCreateExpenseMutation();
  const [isGenerating, setIsGenerating] = useState(false);
  const { analyticsData, calculations } = useAnalytics();
  const { limits, analytics: limitsAnalytics } = useSpendingLimits();

  const generateRandomExpense = async () => {
    setIsGenerating(true);
    
    const categories: ExpenseCategory[] = ['food', 'transport', 'entertainment', 'shopping', 'utilities', 'health', 'education', 'other'];
    const descriptions = [
      'Coffee and breakfast', 'Uber ride to work', 'Movie tickets', 'Grocery shopping',
      'Electricity bill', 'Doctor visit', 'Online course', 'Random purchase',
      'Lunch with friends', 'Gas station', 'Netflix subscription', 'Phone bill',
      'Gym membership', 'Book purchase', 'Dinner out', 'Bus fare'
    ];

    try {
      for (let i = 0; i < 10; i++) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
        const randomAmount = Math.floor(Math.random() * 200) + 5; // $5-$205
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30)); // Last 30 days

        await createExpense({
          amount: randomAmount,
          category: randomCategory,
          description: randomDescription,
          date: randomDate.toISOString().split('T')[0],
        }).unwrap();
      }
      
      Alert.alert('Success', '10 random expenses have been added!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate random expenses');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTheme = () => {
    toggleThemeMode();
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="xxl" weight="bold" color="text">
            Developer Tools
          </Text>
          <Text variant="sm" color="subtext">
            Hidden developer screen for testing and debugging
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" color="text" style={styles.sectionTitle}>
            Theme Controls
          </Text>
          <Button
            title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Theme`}
            variant="outline"
            onPress={toggleTheme}
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" color="text" style={styles.sectionTitle}>
            Test Data
          </Text>
          <Button
            title={isGenerating ? "Generating..." : "Add 10 Random Expenses"}
            variant="primary"
            onPress={generateRandomExpense}
            disabled={isGenerating}
            style={styles.button}
          />
          <Text variant="xs" color="subtext" style={styles.helperText}>
            This will add 10 random expenses with various categories and amounts for testing purposes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" color="text" style={styles.sectionTitle}>
            Analytics Overview
          </Text>
          <View style={styles.infoCard}>
            <Text variant="sm" color="text" style={styles.infoText}>
              Total Spent: ${calculations.totalSpent.toFixed(2)}
            </Text>
            <Text variant="sm" color="text" style={styles.infoText}>
              Daily Average: ${calculations.averagePerDay.toFixed(2)}
            </Text>
            <Text variant="sm" color="text" style={styles.infoText}>
              Categories: {analyticsData?.categoryBreakdown.length || 0}
            </Text>
            <Text variant="sm" color="text" style={styles.infoText}>
              Growth: {calculations.spendingGrowth >= 0 ? '+' : ''}{calculations.spendingGrowth.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" color="text" style={styles.sectionTitle}>
            Limits Overview
          </Text>
          <View style={styles.infoCard}>
            <Text variant="sm" color="text" style={styles.infoText}>
              Total Limits: {limitsAnalytics.totalLimits}
            </Text>
            <Text variant="sm" color="text" style={styles.infoText}>
              Active Limits: {limitsAnalytics.activeLimits}
            </Text>
            <Text variant="sm" color="text" style={styles.infoText}>
              Exceeded: {limitsAnalytics.exceededLimits}
            </Text>
            <Text variant="sm" color="text" style={styles.infoText}>
              Near Limit: {limitsAnalytics.approachingLimits}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" color="text" style={styles.sectionTitle}>
            App Info
          </Text>
          <View style={styles.infoCard}>
            <Text variant="sm" color="text" style={styles.infoText}>
              Current Theme: {themeMode === 'system' ? 'System' : themeMode === 'dark' ? 'Dark' : 'Light'}
            </Text>
            <Text variant="sm" color="text" style={styles.infoText}>
              Version: 1.0.0
            </Text>
            <Text variant="sm" color="text" style={styles.infoText}>
              Build: Task 6 Analytics
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Close Developer Screen"
            variant="secondary"
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  button: {
    marginBottom: 8,
  },
  helperText: {
    marginTop: 8,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
  },
  infoText: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 32,
    marginBottom: 32,
  },
  closeButton: {
    marginTop: 16,
  },
});
