/**
 * React Native App Entry Point
 * Uses the SAME translator.js core engine as web version
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import SAME core engine verification
import { LANGUAGE_CONFIGS } from '../translator.js';

import HomeScreen from './screens/HomeScreen.jsx';

const Stack = createStackNavigator();

/**
 * Main App Component for React Native
 */
export default function App() {
  // Verify we're using the same core as web
  console.log('React Native App initialized');
  console.log('Using SAME translator.js with', Object.keys(LANGUAGE_CONFIGS).length, 'languages');
  console.log('Same voice IDs as web version:', {
    standard: LANGUAGE_CONFIGS.standard_english.voiceId,
    genZ: LANGUAGE_CONFIGS.gen_z_english.voiceId,
    spanish: LANGUAGE_CONFIGS.spanish.voiceId
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1F2937',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'SlangSwap',
            headerTitle: 'SlangSwap - Same Core as Web'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}