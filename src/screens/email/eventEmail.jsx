import {
  View,
  Text,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import Fallback from '../../components/fallback/fallback';
import {MainContext} from '../../../App';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import ErrMessage from '../../components/errMessage/errMessage';

const Email = React.lazy(() => import('./email'));
const EventEmail = () => {
  const CTX = useContext(MainContext);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigator = useNavigation();
  const isFocused = useIsFocused();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [isChecked, setIsChecked] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

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

  const submitPhoneHere = async () => {
    // check if the first number is 0
    if (phone) {
      if (emailRegex.test(phone.trim())) {
        // createThreeButtonAlert("CORRECT EMAIL!!")
        sendRequestHere(phone.trim());
      } else {
        createThreeButtonAlert('Input email correctly');
      }
    } else {
      setErrMsg('Invalid phone number');
      setShowMsg(true);
      return;
    }
  };

  const redirectHome = () => {
    navigator.reset({
      index: 0,
      routes: [
        {
          name: 'Navigation',
        },
      ],
    });
  };

  const sendRequestHere = async userNumber => {
    if (loading) {
      return null;
    }

    if (!isChecked) {
      setErrMsg('Agree to our Terms & Policy');
      setShowMsg(true);
      return;
    }

    setLoading(true);

    const buildId = await DeviceInfo.getBuildId();
    const deviceId = await DeviceInfo.getDeviceId();
    const deviceName = await DeviceInfo.getDeviceName();
    const systemVersion = await DeviceInfo.getSystemVersion();
    const version = await DeviceInfo.getVersion();
    const manufacturer = await DeviceInfo.getManufacturer();
    const systemName = await DeviceInfo.getSystemName();

    try {
      const fetching = await fetch(
        `${CTX.url}auth/user/account/first-check-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: userNumber.toLowerCase(),
            buildId,
            deviceId,
            deviceName,
            systemVersion,
            version,
            manufacturer,
            systemName,
          }),
        },
      );
      const parsedJson = await fetching.json();
      setLoading(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }

      CTX.setToken(parsedJson?.data?.data);

      if (parsedJson?.data?.isOverRide) {
        CTX.setSessionToken(parsedJson?.data?.data);
        await AsyncStorage.setItem('@sessionToken', parsedJson?.data?.data);
        redirectHome();
      } else {
        // console.log("checking something =<<>>> ", parsedJson?.data);

        navigator.navigate(parsedJson?.data?.goTo, {
          phone: parsedJson?.data?.number,
          email: parsedJson?.data?.email,
          show_hint: parsedJson?.data?.show_hint,
          username: parsedJson?.data?.username,
        });
      }
      // console.log('parsedJson', parsedJson);
    } catch (error) {
      console.log('error sending number to backend => ', error);
      createThreeButtonAlert('Network request failed');
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

      console.log(
        `${CTX.url}system/config/info ==>> `,
        'error from getSystemConfig HERE!!! ===>>> ',
        error,
      );
    }
  };

  const requestUserPermissio = async () => {
    try {
      //On ios,checking permission before sending and receiving messages
      const authStatus = await messaging().requestPermission();
      // console.log('authStatus from requestUserPermission => ', authStatus);
      // console.log(
      //   'messaging.AuthorizationStatus.AUTHORIZED => ',
      //   messaging.AuthorizationStatus.AUTHORIZED,
      // );
      // console.log(
      //   'messaging.AuthorizationStatus.PROVISIONAL => ',
      //   messaging.AuthorizationStatus.PROVISIONAL,
      // );
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
      // const fcmToken = await AsyncStorage.getItem('@fcmToken');
      // console.log('fcmToken =>> in AsyncStorage.getItem => ', fcmToken);
      // if (!fcmToken) {
      try {
        const token = await messaging().getToken();

        // console.log('messaging().getToken() =>> ', token);

        if (token) {
          // console.log('token from if => ', token);
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
      // }

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

  // const getFcmToken = async () => {
  //   // Returns an FCM token for this device
  //   try {
  //     const fcmToken = await AsyncStorage.getItem('@fcmToken');
  //     console.log('fcmToken =>> in AsyncStorage.getItem => ', fcmToken);
  //     if (!fcmToken) {
  //       try {
  //         // Register device for remote messages first
  //         await messaging().registerDeviceForRemoteMessages();

  //         // Now you can get the token
  //         const token = await messaging().getToken();
  //         if (token) {
  //           console.log('token from getToken => ', token);
  //           await AsyncStorage.setItem('@fcmToken', token);
  //         } else {
  //           console.log('No token available');
  //         }
  //       } catch (error) {
  //         console.log('error from GetFCMToken not getting =>> ', error);
  //       }
  //     }
  //   } catch (error) {
  //     console.log('error from getFcmToken function ', error);
  //   }
  // };

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
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}

      <DismissKeyboardWrapper>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <Suspense fallback={<Fallback />}>
            <Email
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              phone={phone}
              loading={loading}
              setPhone={setPhone}
              submitPhoneHere={submitPhoneHere}
            />
          </Suspense>
        </KeyboardAvoidingView>
      </DismissKeyboardWrapper>
    </>
  );
};

export default EventEmail;

const DismissKeyboardWrapper = ({children}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    {children}
  </TouchableWithoutFeedback>
);
