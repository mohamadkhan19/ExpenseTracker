import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { ProgressBar } from '../charts/ProgressBar';
import { SpendingLimit, LimitStatus } from '../../features/limits/types';
import { formatLimitAmount, formatLimitPeriod } from '../../features/limits/utils';

interface LimitCardProps {
  limit: SpendingLimit;
  status?: LimitStatus;
  onEdit?: (limit: SpendingLimit) => void;
  onDelete?: (limitId: string) => void;
  showActions?: boolean;
}

export function LimitCard({
  limit,
  status,
  onEdit,
  onDelete,
  showActions = true,
}: LimitCardProps) {
  const { theme } = useTheme();

  const getStatusColor = () => {
    if (!status) return theme.colors.subtext;
    
    if (status.isExceeded) {
      return theme.colors.error;
    } else if (status.isNearLimit) {
      return theme.colors.warning;
    } else {
      return theme.colors.success;
    }
  };

  const getStatusText = () => {
    if (!status) return 'No data';
    
    if (status.isExceeded) {
      return 'Exceeded';
    } else if (status.isNearLimit) {
      return 'Near limit';
    } else {
      return 'Within limit';
    }
  };

  const getCategoryDisplayName = (category: string) => {
    if (category === 'overall') return 'Overall Budget';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: status?.isExceeded ? theme.colors.error : theme.colors.border,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="lg" weight="semibold" color="text">
            {getCategoryDisplayName(limit.category)}
          </Text>
          <Text variant="sm" color="subtext">
            {formatLimitPeriod(limit.period)} • {formatLimitAmount(limit.amount)}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor() },
            ]}
          >
            <Text variant="xs" weight="medium" color="white">
              {getStatusText()}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      {status && (
        <View style={styles.progressSection}>
          <ProgressBar
            value={status.currentAmount}
            maxValue={status.limitAmount}
            color={getStatusColor()}
            label={`${status.percentageUsed.toFixed(1)}% used`}
            showPercentage={false}
          />
          
          <View style={styles.progressDetails}>
            <Text variant="sm" color="text">
              Spent: {formatLimitAmount(status.currentAmount)}
            </Text>
            <Text variant="sm" color="subtext">
              Remaining: {formatLimitAmount(status.remainingAmount)}
            </Text>
          </View>
        </View>
      )}

      {/* Actions */}
      {showActions && (
        <View style={styles.actions}>
          <Button
            title="Edit"
            variant="outline"
            size="sm"
            onPress={() => onEdit?.(limit)}
            style={styles.actionButton}
          />
          
          <Button
            title="Delete"
            variant="outline"
            size="sm"
            onPress={() => onDelete?.(limit.id)}
            style={[styles.actionButton, { borderColor: theme.colors.error }]}
          />
        </View>
      )}

      {/* Additional Info */}
      <View style={styles.footer}>
        <Text variant="xs" color="subtext">
          Created {new Date(limit.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inactiveText: {
    marginLeft: 4,
  },
});
