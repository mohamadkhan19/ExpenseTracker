import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { useTheme } from '../../theme';
import ChartsScreen from './Charts.screen';
import LimitsScreen from './Limits.screen';

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'charts' | 'limits'>('charts');

  const tabs = [
    { id: 'charts', title: 'Charts' },
    { id: 'limits', title: 'Limits' },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'charts':
        return <ChartsScreen />;
      
      case 'limits':
        return <LimitsScreen />;
      
      default:
        return <ChartsScreen />;
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