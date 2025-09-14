import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/core';

const TopButtons = ({isMe, setIsMe}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.coverTheTop}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
        }}>
        <TouchableOpacity activeOpacity={0.8}
          // onPress={() => setIsMe(true)}
          onPress={() => {
            navigation.navigate('personalPrivate');
          }}
          style={styles.eachTopFollowing}>
          <Text
            style={{
              ...styles.eachTopFollowingText,
              color: isMe ? '#fff' : '#bbb',
              borderBottomWidth: isMe ? 2 : 0,
            }}>
            Me
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}
          // onPress={() => setIsMe(false)}
          onPress={() => {
            navigation.navigate('otherPrivate');
          }}
          style={styles.eachTopFollowing}>
          <Text
            style={{
              ...styles.eachTopFollowingText,
              color: !isMe ? '#fff' : '#bbb',
              borderBottomWidth: !isMe ? 2 : 0,
            }}>
            Others
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopButtons;

const styles = StyleSheet.create({
  coverTheTop: {
    // backgroundColor: '#dd000077',
    position: 'absolute',
    width: '100%',
    height: 50,
    top: 30,
    // left: 10,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  eachTopFollowing: {
    // backgroundColor: "#ff0",
    padding: 10,
  },
  eachTopFollowingText: {
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },
});
