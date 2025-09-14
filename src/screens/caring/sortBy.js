import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo, useCallback, useState} from 'react';

const SortBy = () => {
  const [defaul, setDefault] = useState(true);
  const [latest, setLatest] = useState(false);
  const [earliest, setEarliest] = useState(false);

  const onChangeDefault = useCallback(() => {
    setDefault(true);
    setLatest(false);
    setEarliest(false);
  }, []);

  const onChangeLatest = useCallback(() => {
    setDefault(false);
    setLatest(true);
    setEarliest(false);
  }, []);

  const onChangeEarliest = useCallback(() => {
    setDefault(false);
    setLatest(false);
    setEarliest(true);
  }, []);

  return (
    <View style={{paddingTop: 20}}>
      <View style={styles.coverUserCommentSection}>
        <Text style={styles.sortText}>Default</Text>

        <TouchableOpacity activeOpacity={0.8}
          onPress={onChangeDefault}
          style={{
            ...styles.clickable,
            backgroundColor: defaul ? 'blue' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </TouchableOpacity>
      </View>

      <View style={{...styles.coverUserCommentSection, marginVertical: 20}}>
        <Text style={styles.sortText}>Date followed: Latest</Text>

        <TouchableOpacity activeOpacity={0.8}
          onPress={onChangeLatest}
          style={{
            ...styles.clickable,
            backgroundColor: latest ? 'blue' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </TouchableOpacity>
      </View>

      <View
        style={{...styles.coverUserCommentSection, borderBottomColor: '#fff'}}>
        <Text style={styles.sortText}>Date followed: Earliest</Text>

        <TouchableOpacity activeOpacity={0.8}
          onPress={onChangeEarliest}
          style={{
            ...styles.clickable,
            backgroundColor: earliest ? 'blue' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  coverUserCommentSection: {
    width: '100%',
    paddingHorizontal: 20,
    height: 60,
    // backgroundColor: '#efefef',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 2,
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
    backgroundColor: 'blue',
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
