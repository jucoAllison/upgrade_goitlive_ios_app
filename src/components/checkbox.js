import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Entypo';

function MyCheckbox({checked, onChange}) {
  function onCheckmarkPress() {
    onChange(!checked);
  }

  return (
    <TouchableOpacity activeOpacity={0.8}
      style={[styles.checkboxBase, checked && styles.checkboxChecked]}
      onPress={onCheckmarkPress}>
      {checked && (
        <Ionicons
          name="check"
          style={styles.checkIconHere}
          size={19}
          color="white"
        />
      )}
    </TouchableOpacity>
  );
}

export default MyCheckbox;

const styles = StyleSheet.create({
  checkboxBase: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e20154',
    backgroundColor: 'transparent',
  },

  checkboxChecked: {
    backgroundColor: '#e20154',
  },

  appContainer: {
    flex: 1,
    alignItems: 'center',
  },
  checkIconHere: {
    marginTop: -0.2,
    marginLeft: -0.2,
  },
  appTitle: {
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 24,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkboxLabel: {
    marginLeft: 8,
    fontWeight: 500,
    fontSize: 18,
  },
});
