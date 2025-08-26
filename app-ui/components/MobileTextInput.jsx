/**
 * Mobile-optimized Text Input Component
 * Ensures proper keyboard handling and accessibility
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';

/**
 * Enhanced TextInput for mobile with proper sizing and feedback
 */
export const MobileTextInput = ({
  value,
  onChangeText,
  placeholder,
  maxLength = 5000,
  multiline = false,
  label,
  error,
  characterCount = false,
  style = {},
  inputStyle = {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  const containerStyles = [
    styles.container,
    isFocused && styles.focused,
    error && styles.error,
    style
  ];

  const textInputStyles = [
    styles.textInput,
    multiline && styles.multiline,
    inputStyle
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={textInputStyles}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          maxLength={maxLength}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          selectionColor="#2563EB"
          {...props}
        />
        
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        {characterCount && (
          <Text style={styles.characterCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

/**
 * Compact input for single line entries
 */
export const CompactInput = ({
  value,
  onChangeText,
  placeholder,
  style = {},
  ...props
}) => {
  return (
    <TextInput
      style={[styles.compactInput, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#6B7280"
      selectionColor="#2563EB"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  
  focused: {
    // Add focus styling if needed
  },
  
  error: {
    // Error styling handled in inputContainer
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 12,
  },

  inputContainer: {
    position: 'relative',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
  },

  textInput: {
    fontSize: 18,
    color: '#fff',
    padding: 20,
    minHeight: 56,
    lineHeight: 26,
    fontWeight: '500',
    ...Platform.select({
      ios: {
        paddingTop: 20,
        paddingBottom: 20,
      },
      android: {
        textAlignVertical: 'center',
      },
    }),
  },

  multiline: {
    height: 140,
    textAlignVertical: 'top',
    paddingTop: 20,
  },

  clearButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearButtonText: {
    color: '#9CA3AF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },

  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },

  characterCount: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },

  compactInput: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 16,
    fontSize: 16,
    color: '#fff',
    minHeight: 48,
  },
});

export default MobileTextInput;