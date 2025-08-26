/**
 * Optimized Button Component for Mobile
 * Ensures proper touch targets and visual feedback
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';

/**
 * Mobile-optimized button with proper touch targets
 */
export const OptimizedButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  icon = null,
  style = {},
  textStyle = {},
  ...props
}) => {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? '#fff' : '#2563EB'} 
          />
          {title && <Text style={[textStyles, styles.loadingText]}>{title}</Text>}
        </View>
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {title && <Text style={textStyles}>{title}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * Icon Button for compact spaces
 */
export const IconButton = ({
  icon,
  onPress,
  disabled = false,
  size = 'medium',
  style = {},
  ...props
}) => {
  const buttonStyles = [
    styles.iconButton,
    styles[`${size}Icon`],
    disabled && styles.disabled,
    style
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base button styles
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Button variants
  primary: {
    backgroundColor: '#2563EB',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  success: {
    backgroundColor: '#10B981',
  },
  danger: {
    backgroundColor: '#EF4444',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#374151',
  },

  // Button sizes - ensuring minimum 44pt touch target
  small: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    minHeight: 56,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#2563EB',
  },
  successText: {
    color: '#fff',
  },
  dangerText: {
    color: '#fff',
  },
  outlineText: {
    color: '#D1D5DB',
  },
  disabledText: {
    opacity: 0.7,
  },

  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Icon button styles
  iconButton: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  smallIcon: {
    width: 40,
    height: 40,
  },
  mediumIcon: {
    width: 48,
    height: 48,
  },
  largeIcon: {
    width: 56,
    height: 56,
  },

  // Loading and content
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    marginLeft: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});

export default OptimizedButton;