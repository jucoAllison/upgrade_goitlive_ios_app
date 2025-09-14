import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import OtpInput from './otpInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/core';
import DeviceInfo from 'react-native-device-info';

import styles from './verification.styles';
import {MainContext} from '../../../App';
//   import ErrMessage from '../../components/errMessage/errMessage';
import Button from '../../components/button';
import ErrMessage from '../../components/errMessage/errMessage';

const Verification = () => {
  const CTX = useContext(MainContext);
  const navigation = useNavigation();
  const [backup, setBackup] = useState('');
  const [filled, setFilled] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const [resending, setResending] = useState(false);
  const route = useRoute();

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
      // {
      //   text: 'Cancel',
      //   onPress: () => console.log('Cancel Pressed'),
      //   style: 'cancel',
      // },
      // {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  const createAccountHandler = async () => {
    if (loading) {
      return null;
    }
    if (!filled) {
      setErrMsg('Please fill out the inputs');
      setShowMsg(true);
      return;
    }
    setLoading(true);
    try {
      const fetching = await fetch(`${CTX.url}auth/user/account/verify-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.token}`,
        },

        body: JSON.stringify({sms: backup}),
      });
      const parsedJson = await fetching.json();
      // if (parsedJson?.isRemoved) {
      //   return CTX.logoutUser();
      // }
      setLoading(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        // createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      CTX.setToken(parsedJson?.data?.data);
      // console.log('parsedJson?.data', parsedJson?.data);
      // console.log('parsedJson?.data', parsedJson?.data);
      // console.log('parsedJson?.data', parsedJson?.data);
      navigation.navigate(parsedJson?.data?.goTo, {
        phone: parsedJson?.data?.phone,
        email: parsedJson?.data?.email,
      });
    } catch (error) {
      setLoading(false);
      console.log('error verifying create account => ', error);
      // createThreeButtonAlert('Network request failed');
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    if (countDown > 0) {
      setTimeout(() => {
        setCountDown(prev => prev - 1);
      }, 1200);
    }
  }, [countDown]);

  // resending the code for phone thats for newly people that wants to create account
  const resendHandler = async () => {
    if (countDown > 0) {
      return null;
    }

    const buildId = await DeviceInfo.getBuildId();
    const device_id = await DeviceInfo.getDeviceId();
    const device_name = await DeviceInfo.getDeviceName();
    const systemVersion = await DeviceInfo.getSystemVersion();
    const version = await DeviceInfo.getVersion();
    const device_agent = await DeviceInfo.getManufacturer();
    const systemName = await DeviceInfo.getSystemName();

    if (resending) {
      return null;
    }
    setResending(true);
    // 8147652005 opay uzaamaka fransica chibbgo

    try {
      const fetching = await fetch(`${CTX.url}auth/user/account/first/resend/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: route.params.phone,
          email: route.params.email,
          buildId,
          device_id,
          device_name,
          systemVersion,
          version,
          device_agent,
          systemName,
        }),
      });
      const parsedJson = await fetching.json();
      setResending(false);
      if (parsedJson?.e) {
        // createThreeButtonAlert(parsedJson?.m);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      // console.log('parsedJson from resending', parsedJson?.data);
      setCountDown(60);
    } catch (error) {
      console.log('error sending number to backend => ', error);
      setResending(false);
      // createThreeButtonAlert('Network request failed');
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  // console.log("route.params.phone =>>> ", route.params.phone);
  

  return (
    <>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        hidden={true}
      />
      {/* {showMsg && (
      <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
    )} */}
      <ImageBackground
        source={{uri: CTX.systemConfig?.loginBackgroundImageUrl}}
        style={styles.styleLandingLogo}>
        {/* <StatusBar animated={true} backgroundColor="#0a171e" /> */}
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
              marginBottom: 10,
              textAlign: 'center',
              fontWeight: '400',
            }}>
            Check your email and enter the verification code sent
          </Text>

          <OtpInput
            value={backup}
            setValue={setBackup}
            // onComplete={code => {
            //   console.log('User entered OTP:', code);
            // }}
            filled={filled}
            setFilled={setFilled}
          />

          <Button
            onPress={() => createAccountHandler()}
            // label={'Submit'}
            label={
              loading ? <ActivityIndicator color="#fff" size={30} /> : 'Submit'
            }
            disable={backup?.length < 4}
            style={{width: '100%', marginTop: 0, height: 50, marginTop: 20}}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={resendHandler}
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
          {!resending ? (
            <Text
              style={{
                fontFamily: 'Overpass-Regular',
                fontWeight: 'bold',
                color: '#fff',
              }}>
              Resend {countDown > 0 && countDown}
            </Text>
          ) : (
            <>
              <Text style={{marginRight: 8, color: '#fff', fontWeight: 'bold'}}>
                {' '}
                Resending{' '}
              </Text>
              <ActivityIndicator size={17} color={'#fff'} />
            </>
          )}
        </TouchableOpacity>
      </ImageBackground>
    </>
  );
};

export default Verification;
