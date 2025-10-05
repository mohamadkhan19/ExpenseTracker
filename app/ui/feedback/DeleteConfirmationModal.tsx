import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

interface DeleteConfirmationModalProps {
  visible: boolean;
  expenseDescription?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  visible,
  expenseDescription,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={1}
        onPress={onCancel}
      >
        <View
          style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.radii.lg,
            padding: theme.spacing.xl,
            margin: theme.spacing.lg,
            maxWidth: '90%',
            minWidth: 280,
          }}
        >
          <Text variant="lg" weight="bold" color="text" style={{ marginBottom: theme.spacing.sm, textAlign: 'center' }}>
            Delete Expense
          </Text>
          
          <Text variant="md" color="text" style={{ marginBottom: theme.spacing.lg, textAlign: 'center' }}>
            Are you sure you want to delete this expense?
            {expenseDescription && (
              <>
                {'\n\n'}
                <Text variant="md" weight="medium" color="primary">
                  "{expenseDescription}"
                </Text>
              </>
            )}
            {'\n\n'}
            This action cannot be undone.
          </Text>

          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={onCancel}
              style={{ flex: 1 }}
              disabled={isLoading}
            />
            <Button
              title="Delete"
              variant="primary"
              onPress={onConfirm}
              style={{ flex: 1 }}
              disabled={isLoading}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
