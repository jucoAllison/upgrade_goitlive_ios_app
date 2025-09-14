import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo, useCallback, useState} from 'react';

const SortBy = ({setDetails, closeModalPress}) => {
  const [defaul, setDefault] = useState(false);
  const [latest, setLatest] = useState(false);
  const [earliest, setEarliest] = useState(false);

  const onChangeDefault = useCallback(text => {
    setDefault(true);
    setLatest(false);
    setDetails(text);
    setEarliest(false);
    setTimeout(() => {
      closeModalPress();
    }, 200);
  }, []);

  const onChangeLatest = useCallback(text => {
    setDefault(false);
    setLatest(true);
    setEarliest(false);
    setDetails(text);
    setTimeout(() => {
      closeModalPress();
    }, 200);
  }, []);

  const onChangeEarliest = useCallback(text => {
    setDefault(false);
    setLatest(false);
    setDetails(text);
    setEarliest(true);
    setTimeout(() => {
      closeModalPress();
    }, 200);
  }, []);

  return (
    <View style={{paddingTop: 20}}>
      <TouchableOpacity activeOpacity={0.8}
        onPress={() => onChangeDefault('International passport')}
        style={styles.coverUserCommentSection}>
        <Text style={styles.sortText}>International passport</Text>

        <View
          style={{
            ...styles.clickable,
            backgroundColor: defaul ? 'blue' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8}
        onPress={() => onChangeLatest('Drivers license')}
        style={{...styles.coverUserCommentSection, marginVertical: 20}}>
        <Text style={styles.sortText}>Drivers license</Text>

        <View
          style={{
            ...styles.clickable,
            backgroundColor: latest ? 'blue' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8}
        onPress={() => onChangeEarliest('Others')}
        style={{...styles.coverUserCommentSection, borderBottomColor: '#fff'}}>
        <Text style={styles.sortText}>Others</Text>

        <View
          style={{
            ...styles.clickable,
            backgroundColor: earliest ? 'blue' : '#fff',
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
    // backgroundColor: '#efefef',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#d1d1d1',
    // borderBottomWidth: 2,
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
