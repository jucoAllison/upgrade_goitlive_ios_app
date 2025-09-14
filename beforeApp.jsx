import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import App from './App';

const BeforeApp = () => {
  return (
    <NavigationContainer>
      <GestureHandlerRootView>
        <App />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default BeforeApp;
