import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useCallback, useContext, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Btn from '../../components/button';

const RequestNewBackup = ({
  navigation,
  backup,
  setBackup,
  submitHandler,
  loading,
}) => {
  const pressHeaderHere = () => {
    navigation.goBack();
  };

  return (
    <>
        <ScrollView style={styles.scrollViewCover} 
        contentInsetAdjustmentBehavior="automatic"
         >
        <TouchableOpacity activeOpacity={0.8}
          onPress={pressHeaderHere}
          style={{paddingTop: 0, paddingBottom: 4, width: 35}}>
          <Ionicons name="arrow-back" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.personalInfo}>Request new backup</Text>

        <Text style={styles.topText}>
          Requesting a new backup code is an important part of keeping your
          account secure. It is recommended that you request a new backup code
          every few months, or whenever you think it may have been compromised.
        </Text>

        <Text style={styles.topText}>
          To change your backup code, you will need to know your current backup
          code in other to request a new backup code.
        </Text>

        <View style={styles.positionAbsoluteView}>
          <Text style={styles.whatsYourNumber}>
            Enter your backup code to continue
          </Text>

          <TextInput
            style={{...styles.inputTextInput, height: 53}}
            placeholder="eg | 32yGWs8I8e"
            value={backup}
            onChangeText={setBackup}
            placeholderTextColor={'#262626'}
          />
        </View>

        <View style={{height: 50}}></View>
      </ScrollView>
      <View style={styles.bottomBtnColor}>
        <TouchableOpacity activeOpacity={0.8}
          onPress={pressHeaderHere}
          style={{flexDirection: 'row', width: 150, alignItems: 'center'}}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#000" />
          <Text
            style={{
              color: '#000',
              textDecorationLine: 'underline',
              fontWeight: 'bold',
            }}>
            Back
          </Text>
        </TouchableOpacity>

        <Btn
          disable={backup.length < 9}
          label={'Request'}
          loading={loading}
          onPress={() => submitHandler()}
          style={{width: 150, marginTop: 0}}
        />
      </View>
    </>
  );
};

export default RequestNewBackup;

const styles = StyleSheet.create({
  scrollViewCover: {
    padding: 16,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  personalInfo: {
    color: '#111',
fontFamily: 'Satoshi',
    fontSize: 24,
    fontWeight: '500',
    marginVertical: 18,
  },
  coverProfile: {
    flexDirection: 'row',
    paddingVertical: 19,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    paddingRight: 100,
    alignItems: 'center',
  },
  coverProfilePic: {
    backgroundColor: '#0a224e',
    width: 45,
    height: 45,
    marginRight: 7,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {fontWeight: '400', color: 'rgb(112, 122, 138)', fontSize: 12},
  inputTextInput: {
    paddingLeft: 20,
    color: '#3b3b3b',
    width: '100%',
    paddingRight: 15,
    borderRadius: 5,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: '#9f9f9f',
  },
  bottomBtnColor: {
    marginTop: 'auto',
    width: '100%',
    borderTopColor: '#ccc',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  coverUserCommentSection: {
    width: '100%',
    paddingHorizontal: 20,
    height: 60,
    paddingLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomColor: "#d1d1d1",
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',

    justifyContent: 'space-between',
  },

  sortText: {
    color: '#3b3b3b',
    fontSize: 18,
  },
  clickable: {
    width: 28,
    height: 28,
    borderRadius: 45,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#d1d1d1',
    borderWidth: 2,
  },
  innerCircle: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  anotherText: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 0,
    paddingLeft: 14,
    paddingBottom: 9,
    fontSize: 13,
    color: '#000',
  },
  positionAbsoluteView: {
    marginTop: 40,
    width: '100%',
  },
  whatsYourNumber: {
    color: '#111',
    fontSize: 16,
  },

  textInputLinkCover: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#fff',
    zIndex: 2000,
  },
});
