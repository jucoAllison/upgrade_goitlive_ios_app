import {View, Text, StatusBar, Alert} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import Numbers from './number';
import Fallback from '../../components/fallback/fallback';
import {MainContext} from '../../../App';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const EventNumber = () => {
  const CTX = useContext(MainContext);
  const [toggle, setToggle] = useState(true);
  const [phone, setPhone] = useState(null);
  const navigator = useNavigation();
  const isFocused = useIsFocused();
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [objHere, setObjHere] = useState({math: ''});
  const [accType, setAccType] = useState({
    country_code: 'NG',
    country_en: 'Nigeria',
    country_cn: '尼日利亚',
    phone_code: 234,
  });


  const createThreeButtonAlert = (msg="Unable to complete request") =>
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

  const submitPhoneHere = async () => {
    // check if the first number is 0
    if (phone) {
      const spread = phone?.toString().split('');
      if (spread[0] == '0') {
        let toStringed = phone?.toString();
        const convertedNum = toStringed.replace(/^0+/, '');

        sendRequestHere(convertedNum);
      } else {
        sendRequestHere(phone);
      }
    } else {
      setErrMsg('Invalid phone number');
      setShowMsg(true);
      return;
    }
  };

  const sendRequestHere = async userNumber => {
    if (loading) {
      return null;
    }
    setLoading(true);
    try {
      const fetching = await fetch(`${CTX.url}auth/user/account/check-number`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({phone: accType?.phone_code + userNumber}),
      });
      const parsedJson = await fetching.json();
      setLoading(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m)
        setShowMsg(true);
        return;
      }
      CTX.setToken(parsedJson?.data?.data);
      // console.log('parsedJson', parsedJson);
      navigator.navigate(parsedJson?.data?.goTo, {
        phone: parsedJson?.data?.number,
        email: parsedJson?.data?.email,
      });
    } catch (error) {
      console.log('error sending number to backend => ', error);
        createThreeButtonAlert("Network request failed")
        setLoading(false);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  const getSessionToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@sessionToken');
      if (value && value.length > 10) {
        // setSessionToken(value);
        await navigator.reset({
          index: 0,
          routes: [
            {
              name: 'Navigation',
            },
          ],
        });
        // } else {
        //   navigator.navigate('Number');
      }
    } catch (e) {
      console.log('eHERE! from getting ASYNC STORAGE', e);
    }
  };

  const getSystemConfig = async () => {
    try {
      const fetching = await fetch(`${CTX.url}system/config/info`);
      const getData = await fetching.json();
      CTX.systemConfigHandler(getData?.data);
      CTX.setIsUpgrade(getData?.data?.app_version !== CTX.appVersion);

      if (getData?.data?.isUnderMaintenance) {
        // if (!true) {
        await navigator.reset({
          index: 0,
          routes: [
            {
              name: 'UnderManten',
            },
          ],
        });
        return;
      } else {
        getSessionToken();
      }
    } catch (error) {
      setTimeout(() => {
        getSystemConfig();
      }, 2000);
      
      console.log(`${CTX.url}system/config/info ==>> `, 'error from getSystemConfig HERE!!! ===>>> ', error);
    }
  };

  const requestUserPermissio = async () => {
    try {
      //On ios,checking permission before sending and receiving messages
      const authStatus = await messaging().requestPermission();
      console.log('authStatus from requestUserPermission => ', authStatus);
      console.log(
        'messaging.AuthorizationStatus.AUTHORIZED => ',
        messaging.AuthorizationStatus.AUTHORIZED,
      );
      console.log(
        'messaging.AuthorizationStatus.PROVISIONAL => ',
        messaging.AuthorizationStatus.PROVISIONAL,
      );
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.log('error from requestUserPermission function ', error);
    }
  };

  
  const getFcmToken = async () => {
    // Returns an FCM token for this device
    try {
      const fcmToken = await AsyncStorage.getItem('@fcmToken');
      console.log('fcmToken =>> in AsyncStorage.getItem => ', fcmToken);
      if (!fcmToken) {
        try {
          const token = await messaging().getToken();
          if (token) {
            console.log('token from if => ', token);
            await AsyncStorage.setItem('@fcmToken', token);
          } else {
            await messaging().registerDeviceForRemoteMessages();

            // Get the token
            const anoToken = await messaging().getToken();
            console.log('anoToken from else => ', anoToken);

            await AsyncStorage.setItem('@fcmToken', anoToken);
          }
        } catch (error) {
          console.log('error from GetFCMToken not getting =>> ', error);
        }
      }

      // firebase
      //   .messaging()
      //   .getToken()
      //   .then(fcmToken => {
      //     console.log('FCM Token -> ', fcmToken);
      //   });
    } catch (error) {
      console.log('error from getFcmToken function ', error);
    }
  };
  
  useEffect(() => {
    if (isFocused) {
      if (requestUserPermissio()) {
        getFcmToken();
      }
      CTX.setStatusBarColor('#00000072');
      getSystemConfig();
    }
  }, [isFocused]);

  return (
    <>
      <StatusBar animated={true} backgroundColor={CTX.statusBarColor} />

      {/* <Suspense fallback={<Fallback />}> */}
      <Suspense fallback={null}>
        <Numbers
          phone={phone}
          loading={loading}
          setPhone={setPhone}
          submitPhoneHere={submitPhoneHere}
          accType={accType}
          setAccType={setAccType}
        />
      </Suspense>
    </>
  );
};

export default EventNumber;
