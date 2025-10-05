import React, { useState } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { formatDateForInput } from '../../lib/validation';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  placeholder?: string;
  error?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Select date', error }: DatePickerProps) {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  
  const selectedDate = value ? new Date(value) : new Date();
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      const formattedDate = formatDateForInput(selectedDate);
      onChange(formattedDate);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
          borderRadius: theme.radii.md,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          backgroundColor: theme.colors.surface,
          justifyContent: 'center',
          minHeight: 48,
        }}
        onPress={() => setShowPicker(true)}
        accessibilityRole="button"
        accessibilityLabel={`Date picker: ${formatDisplayDate(value)}`}
        accessibilityHint="Tap to select a date"
      >
        <Text
          variant="md"
          color={value ? 'text' : 'subtext'}
          style={{ textAlign: 'left' }}
        >
          {formatDisplayDate(value)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
        />
      )}
    </>
  );
}
