import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/core';

const TopButtons = ({isMe, setIsMe}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.coverTheTop}>
      {/* <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
        }}> */}
        <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() => setIsMe(true)}
          onPress={() => {
            navigation.navigate('personalPrivate');
          }}
          style={{
            ...styles.eachTopFollowing,
            paddingBottom: 2,
            borderBottomWidth: isMe ? 2 : 0,
            borderBottomColor: isMe ? '#fff' : 'inherit',
          }}>
          <Text
            style={{
              ...styles.eachTopFollowingText,
              color: isMe ? '#fff' : '#bbb',
              borderBottomWidth: isMe ? 2 : 0,
            }}>
            Me
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() => setIsMe(false)}
          onPress={() => {
            navigation.navigate('otherPrivate');
          }}
          style={{
            ...styles.eachTopFollowing,
            paddingBottom: 2,
            borderBottomWidth: !isMe ? 2 : 0,
            borderBottomColor: !isMe ? '#fff' : 'inherit',
          }}>
          <Text
            style={{
              ...styles.eachTopFollowingText,
              color: !isMe ? '#fff' : '#bbb',
              borderBottomWidth: !isMe ? 2 : 0,
            }}>
            Others
          </Text>
        </TouchableOpacity>
      {/* </View> */}
    </View>
  );
};

export default TopButtons;

const styles = StyleSheet.create({
  coverTheTop: {
      gap: 20,
      position: 'absolute',
      top: 30,
      zIndex: 200,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: 50,
  },
  eachTopFollowing: {
    // backgroundColor: "#ff0",
    padding: 10,
    paddingBottom: 2,
  },
  eachTopFollowingText: {
    paddingBottom: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },
});
