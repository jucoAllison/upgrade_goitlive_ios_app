import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo, useCallback, useState} from 'react';

const SortBy = ({closeModalPress, setSelected}) => {
  const [defaul, setDefault] = useState(false);
  const [latest, setLatest] = useState(false);
  const [earliest, setEarliest] = useState(false);

  const onChangeDefault = useCallback(() => {
    setSelected('all');
    setDefault(true);
    setLatest(false);
    setEarliest(false);
    setTimeout(() => {
      closeModalPress();
    }, 200);
  }, []);

  const onChangeLatest = useCallback(() => {
    setSelected('only-recharge');
    setDefault(false);
    setLatest(true);
    setEarliest(false);
    setTimeout(() => {
      closeModalPress();
    }, 200);
  }, []);

  const onChangeEarliest = useCallback(() => {
    setSelected('only-withdrawal');
    setDefault(false);
    setLatest(false);
    setEarliest(true);
    setTimeout(() => {
      closeModalPress();
    }, 200);
  }, []);

  return (
    <View style={{paddingTop: 20}}>
      <TouchableOpacity activeOpacity={0.8}
        onPress={onChangeDefault}
        style={styles.coverUserCommentSection}>
        <Text style={styles.sortText}>Default</Text>

        <View
          style={{
            ...styles.clickable,
            backgroundColor: defaul ? '#e20154' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8}
        onPress={onChangeLatest}
        style={{...styles.coverUserCommentSection, marginVertical: 20}}>
        <Text style={styles.sortText}>All deposit</Text>

        <View
          style={{
            ...styles.clickable,
            backgroundColor: latest ? '#e20154' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8}
        onPress={onChangeEarliest}
        style={{...styles.coverUserCommentSection, borderBottomColor: '#fff'}}>
        <Text style={styles.sortText}>All withdrawal</Text>

        <View
          style={{
            ...styles.clickable,
            backgroundColor: earliest ? '#e20154' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  coverUserCommentSection: {
    width: '100%',
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },

  sortText: {
    color: '#3b3b3b',
    fontSize: 18,
  },
  clickable: {
    width: 36,
    height: 36,
    borderRadius: 45,
    backgroundColor: '#e20154',
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: '#d1d1d1',
    borderWidth: 2,
  },
  innerCircle: {
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
});

export default memo(SortBy);
