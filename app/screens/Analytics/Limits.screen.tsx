import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { Input } from '../../ui/atoms/Input';
import { LimitCard } from '../../ui/molecules/LimitCard';
import { ChartContainer } from '../../ui/charts/ChartContainer';
import { useTheme } from '../../theme';
import { useSpendingLimits } from '../../features/limits/hooks/useSpendingLimits';
import { SpendingLimit, LimitPeriod, ExpenseCategory } from '../../features/limits/types';
import { ExpenseCategory as Category } from '../../features/expenses/types';

export default function LimitsScreen() {
  const { theme } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLimit, setEditingLimit] = useState<SpendingLimit | null>(null);
  
  const {
    limits,
    limitStatuses,
    alerts,
    analytics,
    isLoading,
    error,
    createLimit,
    updateLimit,
    deleteLimit,
    toggleLimitActive,
    unreadAlertsCount,
    criticalAlerts,
  } = useSpendingLimits();

  // Form state
  const [formData, setFormData] = useState({
    category: '' as Category | 'overall',
    amount: '',
    period: 'monthly' as LimitPeriod,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const categoryOptions: { label: string; value: Category | 'overall' }[] = [
    { label: 'Overall Budget', value: 'overall' },
    { label: 'Food & Dining', value: 'food' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Bills & Utilities', value: 'bills' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Travel', value: 'travel' },
    { label: 'Education', value: 'education' },
    { label: 'Other', value: 'other' },
  ];

  const periodOptions: { label: string; value: LimitPeriod }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    }

    if (!formData.period) {
      errors.period = 'Period is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingLimit) {
        await updateLimit({
          id: editingLimit.id,
          amount: Number(formData.amount),
          period: formData.period,
        });
      } else {
        await createLimit({
          category: formData.category,
          amount: Number(formData.amount),
          period: formData.period,
        });
      }

      // Reset form
      setFormData({
        category: '' as Category | 'overall',
        amount: '',
        period: 'monthly' as LimitPeriod,
      });
      setShowAddForm(false);
      setEditingLimit(null);
    } catch (err) {
      Alert.alert('Error', 'Failed to save limit');
    }
  };

  const handleEdit = (limit: SpendingLimit) => {
    setEditingLimit(limit);
    setFormData({
      category: limit.category,
      amount: limit.amount.toString(),
      period: limit.period,
    });
    setShowAddForm(true);
  };

  const handleDelete = (limitId: string) => {
    Alert.alert(
      'Delete Limit',
      'Are you sure you want to delete this limit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteLimit(limitId),
        },
      ]
    );
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingLimit(null);
    setFormData({
      category: '' as Category | 'overall',
      amount: '',
      period: 'monthly' as LimitPeriod,
    });
    setFormErrors({});
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text variant="lg" color="subtext">
            Loading limits...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="xxl" weight="bold" color="text">
            Spending Limits
          </Text>
          <Text variant="md" color="subtext" style={styles.subtitle}>
            Set and manage your spending limits
          </Text>
        </View>

        {/* Alerts Summary */}
        {alerts.length > 0 && (
          <ChartContainer
            title="Alerts"
            subtitle={`${unreadAlertsCount} unread alerts`}
            headerAction={{
              title: 'View All',
              onPress: () => {}, // TODO: Navigate to alerts screen
            }}
          >
            {criticalAlerts.slice(0, 3).map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={[styles.alertIcon, { backgroundColor: theme.colors.error }]}>
                  <Text variant="sm" color="white">!</Text>
                </View>
                <View style={styles.alertContent}>
                  <Text variant="sm" weight="medium" color="text">
                    {alert.title}
                  </Text>
                  <Text variant="xs" color="subtext">
                    {alert.message}
                  </Text>
                </View>
              </View>
            ))}
          </ChartContainer>
        )}

        {/* Limits Analytics */}
        <ChartContainer
          title="Limits Overview"
          subtitle="Current limits status"
        >
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsItem}>
              <Text variant="lg" weight="bold" color="text">
                {analytics.totalLimits}
              </Text>
              <Text variant="sm" color="subtext">Total Limits</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text variant="lg" weight="bold" color="text">
                {analytics.activeLimits}
              </Text>
              <Text variant="sm" color="subtext">Active</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text variant="lg" weight="bold" color="error">
                {analytics.exceededLimits}
              </Text>
              <Text variant="sm" color="subtext">Exceeded</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text variant="lg" weight="bold" color="warning">
                {analytics.approachingLimits}
              </Text>
              <Text variant="sm" color="subtext">Near Limit</Text>
            </View>
          </View>
        </ChartContainer>

        {/* Add/Edit Form */}
        {showAddForm && (
          <ChartContainer
            title={editingLimit ? 'Edit Limit' : 'Add New Limit'}
            subtitle="Set spending limits for categories"
          >
            <View style={styles.form}>
              {/* Category Selection */}
              <View style={styles.formGroup}>
                <Text variant="sm" weight="medium" color="text" style={styles.label}>
                  Category
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {categoryOptions.map((option) => (
                    <Button
                      key={option.value}
                      title={option.label}
                      variant={formData.category === option.value ? 'primary' : 'outline'}
                      size="sm"
                      onPress={() => setFormData(prev => ({ ...prev, category: option.value }))}
                      style={styles.categoryButton}
                    />
                  ))}
                </ScrollView>
                {formErrors.category && (
                  <Text variant="xs" color="error" style={styles.errorText}>
                    {formErrors.category}
                  </Text>
                )}
              </View>

              {/* Amount Input */}
              <View style={styles.formGroup}>
                <Input
                  label="Amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                  keyboardType="numeric"
                  error={formErrors.amount}
                />
              </View>

              {/* Period Selection */}
              <View style={styles.formGroup}>
                <Text variant="sm" weight="medium" color="text" style={styles.label}>
                  Period
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodScroll}>
                  {periodOptions.map((option) => (
                    <Button
                      key={option.value}
                      title={option.label}
                      variant={formData.period === option.value ? 'primary' : 'outline'}
                      size="sm"
                      onPress={() => setFormData(prev => ({ ...prev, period: option.value }))}
                      style={styles.periodButton}
                    />
                  ))}
                </ScrollView>
                {formErrors.period && (
                  <Text variant="xs" color="error" style={styles.errorText}>
                    {formErrors.period}
                  </Text>
                )}
              </View>

              {/* Form Actions */}
              <View style={styles.formActions}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={handleCancel}
                  style={styles.formButton}
                />
                <Button
                  title={editingLimit ? 'Update' : 'Create'}
                  variant="primary"
                  onPress={handleSubmit}
                  style={styles.formButton}
                />
              </View>
            </View>
          </ChartContainer>
        )}

        {/* Add Limit Button */}
        {!showAddForm && (
          <View style={styles.addButtonContainer}>
            <Button
              title="Add New Limit"
              variant="primary"
              onPress={() => setShowAddForm(true)}
              style={styles.addButton}
            />
          </View>
        )}

        {/* Existing Limits */}
        {limits.map((limit) => (
          <LimitCard
            key={limit.id}
            limit={limit}
            status={limitStatuses.find(s => s.limitId === limit.id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={toggleLimitActive}
            showActions={true}
          />
        ))}

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  subtitle: {
    marginTop: 4,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  alertIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    marginBottom: 8,
  },
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    marginRight: 8,
    minWidth: 80,
  },
  periodScroll: {
    flexDirection: 'row',
  },
  periodButton: {
    marginRight: 8,
    minWidth: 60,
  },
  errorText: {
    marginTop: 4,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
  },
  addButtonContainer: {
    padding: 20,
  },
  addButton: {
    marginBottom: 8,
  },
  bottomPadding: {
    height: 100,
  },
});
