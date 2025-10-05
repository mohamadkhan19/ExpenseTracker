import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { ExpenseCategory } from '../../features/expenses/types';

interface CategoryDropdownProps {
  selectedCategory: ExpenseCategory | 'all';
  onCategorySelect: (category: ExpenseCategory | 'all') => void;
}

const categories: (ExpenseCategory | 'all')[] = [
  'all',
  'food',
  'transport',
  'entertainment',
  'shopping',
  'utilities',
  'health',
  'education',
  'other',
];

export function CategoryDropdown({ selectedCategory, onCategorySelect }: CategoryDropdownProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const formatCategory = (category: ExpenseCategory | 'all') => {
    if (category === 'all') return 'All Categories';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleSelect = (category: ExpenseCategory | 'all') => {
    onCategorySelect(category);
    setIsOpen(false);
  };

  const renderCategoryItem = ({ item }: { item: ExpenseCategory | 'all' }) => (
    <TouchableOpacity
      style={{
        padding: theme.spacing.md,
        backgroundColor: item === selectedCategory ? theme.colors.primary : theme.colors.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}
      onPress={() => handleSelect(item)}
    >
      <Text
        variant="md"
        color={item === selectedCategory ? 'primaryContrastText' : 'text'}
        weight={item === selectedCategory ? 'medium' : 'regular'}
      >
        {formatCategory(item)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          backgroundColor: theme.colors.surface,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => setIsOpen(true)}
      >
        <Text variant="md" color="text">
          {formatCategory(selectedCategory)}
        </Text>
        <Text variant="md" color="subtext">
          ▼
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radii.md,
              maxHeight: 300,
              width: '80%',
              overflow: 'hidden',
            }}
          >
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
