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
import {MainContext} from '../../../App';
import ErrMessage from '../../components/errMessage/errMessage';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';

const DeleteAccount = () => {
  const [isUpload, setIsUpload] = useState(false);
  const navigation = useNavigation();
  const CTX = useContext(MainContext);
  const [defaul, setDefault] = useState(false);
  const [latest, setLatest] = useState(false);
  const [earliest, setEarliest] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [trouble, setTrouble] = useState(false);
  const inputRf = useRef();
  const [another, setAnother] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const onChangeDefault = useCallback(text => {
    setDefault(true);
    setLatest(false);
    setEarliest(false);
    setMultiple(false);
    setTrouble(false);
  }, []);

  const onChangeLatest = useCallback(text => {
    setDefault(false);
    setLatest(true);
    setEarliest(false);
    setMultiple(false);
    setTrouble(false);
  }, []);

  const onChangeEarliest = useCallback(text => {
    setDefault(false);
    setLatest(false);
    setEarliest(true);
    setMultiple(false);
    setTrouble(false);
  }, []);

  const onChangeMultiple = useCallback(text => {
    setDefault(false);
    setLatest(false);
    setEarliest(false);
    setMultiple(true);
    setTrouble(false);
  }, []);

  const onChangeTrouble = useCallback(text => {
    setDefault(false);
    setLatest(false);
    setEarliest(false);
    setMultiple(false);
    setTrouble(true);
  }, []);

  const pressHeaderHere = () => {
    navigation.goBack();
  };

  const checkSmth = () => {
    if (CTX.userObj?.hasAmass) {
      setShowMsg(true);
      setErrMsg(
        'Delete your amass account first before we can proceed to deleting your main account',
      );
      return;
    }
    if (CTX.userObj?.private_life) {
      setShowMsg(true);
      setErrMsg(
        'Delete your Private account before we can proceed to deleting your main account',
      );
      return;
    }
    navigation.navigate('MainDeleteAccount');
  };

  return (
    <DismissKeyboardWrapper>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}

      <ScrollView style={styles.scrollViewCover}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={pressHeaderHere}
          style={{paddingTop: 0, paddingBottom: 4, width: 35}}>
          <Ionicons name="arrow-back" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.personalInfo}>
          {isUpload ? 'Why are you leaving GoItLive?' : 'Delete account'}
        </Text>

        <Text style={styles.topText}>
          {isUpload
            ? "We're sorry to see you go! We'd love to know why you want to delete your account, so we can improve the app and support our community."
            : "If you want to leave GoItLive, your account and content will be deleted permanently and you won't be able to recover again."}
        </Text>

        {isUpload && (
          <>
            <View style={{paddingTop: 20}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => onChangeDefault('International passport')}
                style={styles.coverUserCommentSection}>
                <Text style={styles.sortText}>Am leaving temporally</Text>

                <View
                  style={{
                    ...styles.clickable,
                    backgroundColor: defaul ? '#0a224e' : '#fff',
                    borderColor: defaul ? '#0a224e' : '#ccc',
                  }}>
                  <View style={styles.innerCircle}></View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => onChangeLatest('Drivers license')}
                style={{
                  ...styles.coverUserCommentSection,
                  marginBottom: 2,
                  //   marginTop: 10,
                }}>
                <Text style={styles.sortText}>Safety or privacy concerns</Text>

                <View
                  style={{
                    ...styles.clickable,
                    backgroundColor: latest ? '#0a224e' : '#fff',
                    borderColor: latest ? '#0a224e' : '#ccc',
                  }}>
                  <View style={styles.innerCircle}></View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => onChangeMultiple('Drivers license')}
                style={{
                  ...styles.coverUserCommentSection,
                  marginBottom: 2,
                  //   marginTop: 10,
                }}>
                <Text style={styles.sortText}>I have muiltiple accounts</Text>

                <View
                  style={{
                    ...styles.clickable,
                    backgroundColor: multiple ? '#0a224e' : '#fff',
                    borderColor: multiple ? '#0a224e' : '#ccc',
                  }}>
                  <View style={styles.innerCircle}></View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => onChangeTrouble('Drivers license')}
                style={{
                  ...styles.coverUserCommentSection,
                  marginBottom: 2,
                }}>
                <Text style={styles.sortText}>Trouble getting started</Text>

                <View
                  style={{
                    ...styles.clickable,
                    backgroundColor: trouble ? '#0a224e' : '#fff',
                    borderColor: trouble ? '#0a224e' : '#ccc',
                  }}>
                  <View style={styles.innerCircle}></View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => onChangeEarliest('Others')}
                onPressOut={() => {
                  inputRf.current?.focus();
                }}
                style={{
                  ...styles.coverUserCommentSection,
                  borderBottomColor: '#fff',
                }}>
                <Text style={styles.sortText}>Another reason</Text>

                <View
                  style={{
                    ...styles.clickable,
                    backgroundColor: earliest ? '#0a224e' : '#fff',
                    borderColor: earliest ? '#0a224e' : '#ccc',
                  }}>
                  <View style={styles.innerCircle}></View>
                </View>
              </TouchableOpacity>

              {earliest && (
                <TextInput
                  ref={inputRf}
                  style={styles.anotherText}
                  value={another}
                  onChangeText={setAnother}
                />
              )}
            </View>
          </>
        )}
        <View style={{height: 50}}></View>
      </ScrollView>
      <View style={styles.bottomBtnColor}>
        {isUpload ? (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
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
              disable={!defaul && !latest && !earliest && !multiple && !trouble}
              label={'Continue'}
              onPress={checkSmth}
              style={{width: 150, marginTop: 0}}
            />
          </>
        ) : (
          <Btn
            label={'Continue'}
            onPress={() => setIsUpload(!isUpload)}
            style={{width: '100%', marginTop: 0}}
          />
        )}
      </View>
    </DismissKeyboardWrapper>
  );
};

export default DeleteAccount;

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
    flexWrap: 'wrap',
    padding: 0,
    color: '#000',
    fontSize: 14,
    marginTop: -1,
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
});
