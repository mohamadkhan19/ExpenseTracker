import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { useTheme } from '../../theme';

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'limits' | 'trends'>('overview');

  const tabs = [
    { id: 'overview', title: 'Overview' },
    { id: 'charts', title: 'Charts' },
    { id: 'limits', title: 'Limits' },
    { id: 'trends', title: 'Trends' },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.content}>
            <Text variant="lg" weight="semibold" color="text" style={styles.sectionTitle}>
              Analytics Overview
            </Text>
            <Text variant="md" color="subtext" style={styles.description}>
              Comprehensive insights into your spending patterns and financial trends.
            </Text>
            
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text variant="md" weight="medium" color="text" style={styles.cardTitle}>
                📊 Quick Stats
              </Text>
              <Text variant="sm" color="subtext" style={styles.cardText}>
                Total Expenses: $0.00
              </Text>
              <Text variant="sm" color="subtext" style={styles.cardText}>
                This Month: $0.00
              </Text>
              <Text variant="sm" color="subtext" style={styles.cardText}>
                Categories: 0
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text variant="md" weight="medium" color="text" style={styles.cardTitle}>
                🎯 Spending Limits
              </Text>
              <Text variant="sm" color="subtext" style={styles.cardText}>
                No limits set yet
              </Text>
              <Button
                title="Set Limits"
                variant="outline"
                size="sm"
                style={styles.button}
              />
            </View>
          </View>
        );
      
      case 'charts':
        return (
          <View style={styles.content}>
            <Text variant="lg" weight="semibold" color="text" style={styles.sectionTitle}>
              Chart Visualizations
            </Text>
            <Text variant="md" color="subtext" style={styles.description}>
              Visual breakdown of your expenses by category and time.
            </Text>
            
            <View style={[styles.placeholder, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text variant="lg" style={styles.placeholderIcon}>📈</Text>
              <Text variant="md" color="subtext" style={styles.placeholderText}>
                Charts will be implemented here
              </Text>
              <Text variant="sm" color="subtext" style={styles.placeholderSubtext}>
                Line charts, pie charts, and bar charts
              </Text>
            </View>
          </View>
        );
      
      case 'limits':
        return (
          <View style={styles.content}>
            <Text variant="lg" weight="semibold" color="text" style={styles.sectionTitle}>
              Spending Limits
            </Text>
            <Text variant="md" color="subtext" style={styles.description}>
              Set and manage spending limits for categories and overall budget.
            </Text>
            
            <View style={[styles.placeholder, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text variant="lg" style={styles.placeholderIcon}>🚨</Text>
              <Text variant="md" color="subtext" style={styles.placeholderText}>
                Limits management will be implemented here
              </Text>
              <Text variant="sm" color="subtext" style={styles.placeholderSubtext}>
                Set category limits and monthly budgets
              </Text>
            </View>
          </View>
        );
      
      case 'trends':
        return (
          <View style={styles.content}>
            <Text variant="lg" weight="semibold" color="text" style={styles.sectionTitle}>
              Trends & Patterns
            </Text>
            <Text variant="md" color="subtext" style={styles.description}>
              Analyze spending patterns and identify trends over time.
            </Text>
            
            <View style={[styles.placeholder, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text variant="lg" style={styles.placeholderIcon}>📊</Text>
              <Text variant="md" color="subtext" style={styles.placeholderText}>
                Trends analysis will be implemented here
              </Text>
              <Text variant="sm" color="subtext" style={styles.placeholderSubtext}>
                Monthly comparisons and spending patterns
              </Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                title={tab.title}
                variant={activeTab === tab.id ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && { backgroundColor: theme.colors.primary }
                ]}
              />
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tabScroll: {
    paddingHorizontal: 4,
  },
  tabButton: {
    marginRight: 8,
    minWidth: 80,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 12,
  },
  cardText: {
    marginBottom: 4,
  },
  button: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  placeholder: {
    padding: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    marginBottom: 16,
  },
  placeholderText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  placeholderSubtext: {
    textAlign: 'center',
  },
});
