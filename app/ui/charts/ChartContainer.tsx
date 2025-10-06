import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onPress?: () => void;
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
  showHeader?: boolean;
  headerAction?: {
    title: string;
    onPress: () => void;
  };
}

export function ChartContainer({
  title,
  subtitle,
  children,
  onPress,
  isLoading = false,
  error,
  emptyMessage = 'No data available',
  showHeader = true,
  headerAction,
}: ChartContainerProps) {
  const { theme } = useTheme();

  const Container = onPress ? TouchableOpacity : View;

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={[styles.content, styles.centerContent]}>
          <Text variant="md" color="subtext">
            Loading chart data...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.content, styles.centerContent]}>
          <Text variant="md" color="error">
            Error: {error}
          </Text>
        </View>
      );
    }

    if (emptyMessage && React.Children.count(children) === 0) {
      return (
        <View style={[styles.content, styles.centerContent]}>
          <Text variant="md" color="subtext">
            {emptyMessage}
          </Text>
        </View>
      );
    }

    return <View style={styles.content}>{children}</View>;
  };

  return (
    <Container
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
        onPress && styles.pressable,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {showHeader && (
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.headerLeft}>
            <Text variant="lg" weight="semibold" color="text">
              {title}
            </Text>
            {subtitle && (
              <Text variant="sm" color="subtext" style={styles.subtitle}>
                {subtitle}
              </Text>
            )}
          </View>
          {headerAction && (
            <TouchableOpacity
              style={[styles.headerAction, { backgroundColor: theme.colors.primary }]}
              onPress={headerAction.onPress}
            >
              <Text variant="sm" weight="medium" color="primaryContrastText">
                {headerAction.title}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {renderContent()}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    overflow: 'hidden',
  },
  pressable: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  headerAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  content: {
    padding: 16,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
});
