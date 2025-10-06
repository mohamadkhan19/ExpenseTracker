import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { useTheme } from '../../theme';
import { useCreateExpenseMutation, useGetExpensesQuery } from '../../store/api/expenses.api';
import { ExpenseCategory } from '../../features/expenses/types';
import { AsyncStorageClient } from '../../services/storage/asyncStorageClient';

interface DeveloperScreenProps {
  onClose: () => void;
}

export function DeveloperScreen({ onClose }: DeveloperScreenProps) {
  const { theme, themeMode, toggleTheme: toggleThemeMode } = useTheme();
  const [createExpense] = useCreateExpenseMutation();
  const { refetch: refetchExpenses } = useGetExpensesQuery();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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

  const resetApp = async () => {
    Alert.alert(
      'Reset App',
      'This will delete ALL data including expenses, limits, and settings. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              // Clear all AsyncStorage data
              await AsyncStorageClient.clear();
              
              // Refetch expenses to update the UI
              await refetchExpenses();
              
              Alert.alert('Success', 'App has been reset to initial state!');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset app data');
            } finally {
              setIsResetting(false);
            }
          },
        },
      ]
    );
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
            App Management
          </Text>
          <Button
            title={isResetting ? "Resetting..." : "Reset App"}
            variant="outline"
            onPress={resetApp}
            disabled={isResetting}
            style={[styles.button, { borderColor: theme.colors.error }]}
          />
          <Text variant="xs" color="subtext" style={styles.helperText}>
            This will delete all data and reset the app to its initial state.
          </Text>
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
