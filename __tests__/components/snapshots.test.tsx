import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../../app/theme';
import { ExpenseCard } from '../../app/ui/organisms/ExpenseCard';
import { Button } from '../../app/ui/atoms/Button';
import { Input } from '../../app/ui/atoms/Input';

// Mock the logger to avoid console output during tests
jest.mock('../../app/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('UI Component Snapshot Tests', () => {
  describe('ExpenseCard', () => {
    const mockExpense = {
      id: '1',
      description: 'Coffee',
      amount: 4.50,
      category: 'Food',
      date: '2023-01-01',
    };

    it('should match snapshot for basic expense card', () => {
      const tree = render(
        <TestWrapper>
          <ExpenseCard expense={mockExpense} onPress={jest.fn()} />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for expense card with long description', () => {
      const longDescriptionExpense = {
        ...mockExpense,
        description: 'This is a very long description that should test text wrapping and layout',
      };

      const tree = render(
        <TestWrapper>
          <ExpenseCard expense={longDescriptionExpense} onPress={jest.fn()} />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for expense card with large amount', () => {
      const largeAmountExpense = {
        ...mockExpense,
        amount: 1234.56,
      };

      const tree = render(
        <TestWrapper>
          <ExpenseCard expense={largeAmountExpense} onPress={jest.fn()} />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for expense card with onLongPress', () => {
      const tree = render(
        <TestWrapper>
          <ExpenseCard 
            expense={mockExpense} 
            onPress={jest.fn()} 
            onLongPress={jest.fn()} 
          />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Button', () => {
    it('should match snapshot for primary button', () => {
      const tree = render(
        <TestWrapper>
          <Button title="Primary Button" onPress={jest.fn()} />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for secondary button', () => {
      const tree = render(
        <TestWrapper>
          <Button title="Secondary Button" variant="secondary" onPress={jest.fn()} />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for disabled button', () => {
      const tree = render(
        <TestWrapper>
          <Button title="Disabled Button" disabled onPress={jest.fn()} />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for button with custom style', () => {
      const tree = render(
        <TestWrapper>
          <Button 
            title="Custom Button" 
            onPress={jest.fn()}
            style={{ backgroundColor: 'red' }}
          />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for small button', () => {
      const tree = render(
        <TestWrapper>
          <Button title="Small Button" size="small" onPress={jest.fn()} />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for large button', () => {
      const tree = render(
        <TestWrapper>
          <Button title="Large Button" size="large" onPress={jest.fn()} />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Input', () => {
    it('should match snapshot for basic input', () => {
      const tree = render(
        <TestWrapper>
          <Input 
            placeholder="Enter text" 
            value="" 
            onChangeText={jest.fn()} 
          />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for input with value', () => {
      const tree = render(
        <TestWrapper>
          <Input 
            placeholder="Enter text" 
            value="Some text" 
            onChangeText={jest.fn()} 
          />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for input with error', () => {
      const tree = render(
        <TestWrapper>
          <Input 
            placeholder="Enter text" 
            value="" 
            onChangeText={jest.fn()}
            error="This field is required"
          />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for disabled input', () => {
      const tree = render(
        <TestWrapper>
          <Input 
            placeholder="Enter text" 
            value="" 
            onChangeText={jest.fn()}
            disabled
          />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for multiline input', () => {
      const tree = render(
        <TestWrapper>
          <Input 
            placeholder="Enter description" 
            value="" 
            onChangeText={jest.fn()}
            multiline
            numberOfLines={3}
          />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for numeric input', () => {
      const tree = render(
        <TestWrapper>
          <Input 
            placeholder="Enter amount" 
            value="" 
            onChangeText={jest.fn()}
            keyboardType="numeric"
          />
        </TestWrapper>
      );
      expect(tree).toMatchSnapshot();
    });
  });
});
