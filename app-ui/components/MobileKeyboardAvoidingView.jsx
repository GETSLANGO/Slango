/**
 * Mobile Keyboard Avoiding View Component
 * Handles keyboard overlays properly on both iOS and Android
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';

/**
 * Wrapper component to handle keyboard behavior consistently
 */
export const MobileKeyboardAvoidingView = ({ 
  children, 
  style = {},
  scrollEnabled = true,
  ...props 
}) => {
  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

  if (scrollEnabled) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, style]}
        behavior={behavior}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        {...props}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={behavior}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default MobileKeyboardAvoidingView;