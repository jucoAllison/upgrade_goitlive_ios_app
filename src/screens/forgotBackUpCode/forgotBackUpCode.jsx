import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Btn from '../../components/button';
const ForgotBackupCode = ({
  navigation,
  inputs,
  setInputs,
  loading,
  route,
  showNextHandler,
  showBottomSheetHandler,
  account_type,
  sendCodeHandler,
  isNext, setIsNext,
}) => {
  const splitted = route?.params?.phone?.split('');
  const splittedUsername = route?.params?.show_hint
    ? route?.params?.username?.split('')
    : '';

  // console.log("route?.params =>>> ", route?.params);

  const pressHeaderHere = () => {
    navigation.goBack();
  };

  return (
    <>
      <ScrollView style={styles.scrollViewCover}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={pressHeaderHere}
          style={{paddingTop: 0, paddingBottom: 4, width: 35}}>
          <Ionicons name="arrow-back" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.personalInfo}>Forgot backup code</Text>

        {isNext ? (
          <Text style={styles.topText}>
            Confirm your email address by entering it completely. You will
            receive a backup code via email, which you must enter before you can
            continue.
          </Text>
        ) : (
          <Text style={styles.topText}>
            {/* Forgot your backup code? don't worry it won't take long. Just fill */}
            {/* in the below information correctly for confirmation. */}
            Forgot your backup code? Don’t worry — it won’t take long. Just fill
            in the information below correctly to confirm your identity.
          </Text>
        )}
        {isNext ? (
          <View style={styles.positionAbsoluteView}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.whatsYourNumber}>Email</Text>
              <Text style={styles.whatsYourNumber}>
                {route?.params?.email?.split('')[0] +
                  route?.params?.email?.split('')[1] +
                  route?.params?.email?.split('')[2] +
                  '****' +
                  route?.params?.email?.split('@')[1]}
              </Text>
            </View>
            <TextInput
              style={{...styles.inputTextInput, height: 44}}
              placeholder=""
              value={inputs?.email}
              onChangeText={e => setInputs({...inputs, email: e})}
              placeholderTextColor={'#262626'}
            />
          </View>
        ) : (
          <>
            <View style={styles.positionAbsoluteView}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.whatsYourNumber}>Username</Text>

                {route?.params?.show_hint && (
                  <Text style={styles.whatsYourNumber}>
                    {'******' +
                      splittedUsername[splittedUsername?.length - 3] +
                      splittedUsername[splittedUsername?.length - 2] +
                      splittedUsername[splittedUsername?.length - 1]}
                  </Text>
                )}
              </View>

              <TextInput
                style={{...styles.inputTextInput, height: 45}}
                placeholder=""
                value={inputs?.username}
                onChangeText={e => setInputs({...inputs, username: e})}
                placeholderTextColor={'#262626'}
              />
            </View>

            <View style={{...styles.positionAbsoluteView, marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.whatsYourNumber}>Phone</Text>

                {route?.params?.show_hint && (
                  <Text style={styles.whatsYourNumber}>
                    {'******' +
                      splitted[splitted?.length - 3] +
                      splitted[splitted?.length - 2] +
                      splitted[splitted?.length - 1]}
                  </Text>
                )}
              </View>

              <TextInput
                style={{...styles.inputTextInput, height: 45}}
                placeholder=""
                value={inputs?.phone}
                onChangeText={e => setInputs({...inputs, phone: e})}
                placeholderTextColor={'#262626'}
              />
            </View>

            {/* <View style={{...styles.positionAbsoluteView, marginTop: 10}}>
              <Text style={styles.whatsYourNumber}>Account type </Text>
              <TouchableOpacity activeOpacity={0.8}
                onPress={showBottomSheetHandler}
                style={{
                  ...styles.textInputLinkCover,
                  height: 46,
                  borderWidth: 2,
                  borderColor: '#9f9f9f',
                  paddingLeft: 20,
                }}>
                <MaterialCommunityIcons
                  name="typewriter"
                  size={22}
                  color="#3b3b3b"
                />
                <Text style={{...styles.inputTextInput, borderWidth: 0}}>
                  {account_type}
                </Text>
              </TouchableOpacity>
            </View> */}
          </>
        )}
        <View style={{height: 50}}></View>
      </ScrollView>
      <View style={styles.bottomBtnColor}>
        {isNext ? (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              // onPress={() => setIsNext(false)}
              
                onPress={pressHeaderHere}
              style={{flexDirection: 'row', width: 150, alignItems: 'center'}}>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color="#000"
              />
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
              disable={!inputs?.email}
              label={'Send code'}
              loading={loading}
              onPress={() => sendCodeHandler()}
              style={{width: 150, marginTop: 0}}
            />
          </>
        ) : (
          <Btn
            disable={!inputs?.username || !inputs?.phone}
            label={'Next'}
            onPress={showNextHandler}
            style={{width: '100%', marginTop: 0}}
          />
        )}
      </View>
    </>
  );
};

export default ForgotBackupCode;

const styles = StyleSheet.create({
  scrollViewCover: {
    padding: 16,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  personalInfo: {
    color: '#111',
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
    // fontFamily: 'Overpass-Regular',
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
