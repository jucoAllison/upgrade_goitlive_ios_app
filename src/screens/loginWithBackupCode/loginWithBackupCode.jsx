import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {memo, useContext, useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/core';

import styles from '../number/styles';
import {MainContext} from '../../../App';
import ErrMessage from '../../components/errMessage/errMessage';
import Button from '../../components/button';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
const LoginWithBackupCode = () => {
  const [backup, setBackup] = useState(null);
  const navigation = useNavigation();
  const CTX = useContext(MainContext);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const isFocused = useIsFocused();

  const checkBackupHandler = async () => {
    if (loading) {
      return null;
    }
    if (!backup) {
      setErrMsg('Please fill out the inputs');
      setShowMsg(true);
      return;
    }
    setLoading(true);
    console.log('pin HERE!!!! ==>> ' + CTX.token);
    try {
      const fetching = await fetch(
        `${CTX.url}auth/user/account/verify-backup-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.token}`,
          },
          body: JSON.stringify({
            backup: backup?.trim()?.toLowerCase(),
            phone: route.params.phone,
            email: route.params?.email,
          }),
        },
      );
      const parsedJson = await fetching.json();
      setLoading(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      CTX.setToken(parsedJson?.data);

      navigation.navigate(parsedJson?.goTo, {
        phone: parsedJson?.phone,
        email: parsedJson?.email,
      });
    } catch (error) {
      setLoading(false);
      // console.log('error verifying backup code => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#00000072');
    }
  }, [isFocused]);

  return (
    <>
      <DismissKeyboardWrapper>
        {showMsg && (
          <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
        )}
        <ImageBackground
          source={{uri: CTX.systemConfig?.loginBackgroundImageUrl}}
          style={styles.styleLandingLogo}>
          <StatusBar
            animated={true}
            backgroundColor={CTX.statusBarColor}
            hidden={true}
          />
          <View style={styles.coverHere}></View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backTouchableOpacity}
            onPress={() => navigation.navigate('Number')}>
            <MaterialIcons
              size={27}
              name="arrow-back-ios"
              style={{marginLeft: 10}}
              color={'#fff'}
            />
          </TouchableOpacity>
          <View style={styles.positionAbsoluteView}>
            <Text
              style={{
                ...styles.whatsYourNumber,
                fontSize: 20,
                fontWeight: '400',
              }}>
              Enter your backup code to continue
            </Text>

            <View style={styles.textInputLinkCover}>
              <TextInput
                style={{...styles.inputTextInput, paddingLeft: 20, height: 40}}
                placeholder="eg | 32yGWs8I8e"
                value={backup}
                onChangeText={setBackup}
                placeholderTextColor={'#262626'}
              />
            </View>

            {/* <TouchableOpacity activeOpacity={0.8}
            onPress={() => checkBackupHandler()}
            style={{paddingTop: 10, width: '100%'}}>
            <View
            style={{
              ...styles.eachBtnCover,
              backgroundColor: backup ? '#e20154' : '#e2015488',
              }}>
              {loading ? (
                <ActivityIndicator color="#fff" size={30} />
                ) : (
                  <Text style={styles.eachBtnText}>Submit</Text>
                  )}
                  </View>
                  </TouchableOpacity> */}

            <Button
              onPress={() => checkBackupHandler()}
              label={
                loading ? (
                  <ActivityIndicator color="#fff" size={30} />
                ) : (
                  'Submit'
                )
              }
              disable={!backup}
              style={{width: '100%', marginTop: 30, height: 50}}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('ForgotBackupCode', {
                phone: route.params.phone,
                email: route.params?.email,
                show_hint: route.params?.show_hint,
                username: route.params?.username,
              })
            }
            style={{
              position: 'absolute',
              left: 23,
              bottom: 30,
              padding: 20,
              backgroundColor: '#00000073',
              paddingVertical: 7,
              borderRadius: 8,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontFamily: 'Overpass-Regular',
                fontWeight: '400',
                color: '#fff',
              }}>
              Forgot your backup code?
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </DismissKeyboardWrapper>
    </>
  );
};

export default memo(LoginWithBackupCode);
