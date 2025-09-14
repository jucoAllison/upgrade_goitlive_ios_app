import React from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';



const DismissKeyboardWrapper = ({ children }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0} 
      >

    {children}
      </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);


export default DismissKeyboardWrapper