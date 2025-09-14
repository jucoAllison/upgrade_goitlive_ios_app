import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/core';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Clipboard from '@react-native-community/clipboard';
import DeviceInfo from 'react-native-device-info';

import styles from '../verification/verification.styles';
import {MainContext} from '../../../App';
import ErrMessage from '../../components/errMessage/errMessage';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
const FromForgottenBackup = () => {
  const CTX = useContext(MainContext);
  const navigation = useNavigation();
  const [backup, setBackup] = useState('');
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const copySerialCode = useCallback((text = '') => {
    Clipboard.setString(text);

    setTimeout(() => {
      setCopyText('Copy');
    }, 1000);
    setCopyText('Copied');
  }, []);

  const redirectHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Navigation',
        },
      ],
    });
  };

  const backupHandler = async () => {
    if (loading) {
      return null;
    }

    if (!backup) {
      setErrMsg('Input your backup code to continue');
      setShowMsg(true);
      return;
    }

    const buildId = await DeviceInfo.getBuildId();
    const deviceId = await DeviceInfo.getDeviceId();
    const deviceName = await DeviceInfo.getDeviceName();
    const systemVersion = await DeviceInfo.getSystemVersion();
    const version = await DeviceInfo.getVersion();
    const manufacturer = await DeviceInfo.getManufacturer();
    const systemName = await DeviceInfo.getSystemName();

    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.url}auth/user/account/verify-forgotten-backup-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.token}`,
          },
          body: JSON.stringify({
            backup: backup,
            email: route?.params?.email?.trim()?.toLowerCase(),
            build_id: buildId,
            device_id: deviceId,
            device_name: deviceName,
            system_version: systemVersion,
            version: version,
            manufacturer: manufacturer,
            system_name: systemName,
          }),
        },
      );
      const parsedJson = await fetching.json();
      setLoading(false);
      if (parsedJson?.e) {
        // console.log('backupParsedJson', parsedJson?.m);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setErrMsg(parsedJson?.data?.data);
      setShowMsg(true);

      CTX.setToken(parsedJson?.data?.data);
      CTX.setSessionToken(parsedJson?.data?.data);
      redirectHome();
    } catch (error) {
      setLoading(false);
      // console.log('error verifying backup code => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

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
          {/* <TouchableOpacity activeOpacity={0.8}
          style={styles.backTouchableOpacity}
          onPress={() => navigation.navigate('Number')}>
          <MaterialIcons
          size={27}
          name="arrow-back-ios"
          style={{marginLeft: 10}}
          color={'#fff'}
          />
          </TouchableOpacity> */}
          <View style={styles.positionAbsoluteView}>
            <Text style={styles.whatsYourNumber}>Backup Code</Text>
            <Text
              style={{
                ...styles.whatsYourNumber,
                fontSize: 17,
                fontWeight: '400',
              }}>
              Check your email for your backup code. Keep it safe after using it
              to login into your account
            </Text>

            <View style={styles.textInputLinkCover}>
              <FontAwesome name="qrcode" size={22} color="#3b3b3b" />
              <TextInput
                style={{
                  ...styles.inputTextInput,
                  paddingLeft: 20,
                }}
                placeholder="* * * * * * * * *"
                placeholderTextColor={'#262626'}
                value={backup}
                autoCapitalize="none"
                onChangeText={e => {
                  setBackup(e);
                }}
              />

              {/* <Text style={{...styles.inputTextInput, color: "#000"}}>
              {route?.params?.backup_words}
              </Text> */}

              {/* <Pressable
              onPress={() => copySerialCode(route?.params?.backup_words)}
              style={styles.copyHandler}>
              <Text style={{fontWeight: 'bold', color: '#000'}}>{copyText}</Text>
              </Pressable> */}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={backupHandler}
              style={{paddingTop: 10, width: '100%'}}>
              <View style={styles.eachBtnCover}>
                {loading ? (
                  <ActivityIndicator color="#fff" size={30} />
                ) : (
                  <Text style={styles.eachBtnText}>Proceed to app</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </DismissKeyboardWrapper>
    </>
  );
};

export default FromForgottenBackup;
