import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { useTheme } from '../../theme';
import ChartsScreen from './Charts.screen';
import LimitsScreen from './Limits.screen';
import TrendsScreen from './Trends.screen';

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
                onPress={() => setActiveTab('limits')}
              />
            </View>

            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text variant="md" weight="medium" color="text" style={styles.cardTitle}>
                📈 Charts & Visualizations
              </Text>
              <Text variant="sm" color="subtext" style={styles.cardText}>
                View detailed charts and spending patterns
              </Text>
              <Button
                title="View Charts"
                variant="outline"
                size="sm"
                style={styles.button}
                onPress={() => setActiveTab('charts')}
              />
            </View>

            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text variant="md" weight="medium" color="text" style={styles.cardTitle}>
                📊 Trends & Patterns
              </Text>
              <Text variant="sm" color="subtext" style={styles.cardText}>
                Analyze spending behavior over time
              </Text>
              <Button
                title="View Trends"
                variant="outline"
                size="sm"
                style={styles.button}
                onPress={() => setActiveTab('trends')}
              />
            </View>
          </View>
        );
      
      case 'charts':
        return <ChartsScreen />;
      
      case 'limits':
        return <LimitsScreen />;
      
      case 'trends':
        return <TrendsScreen />;
      
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
});