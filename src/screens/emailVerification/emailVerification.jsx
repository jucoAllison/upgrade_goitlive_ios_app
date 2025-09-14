import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useIsFocused, useRoute} from '@react-navigation/core';
import DeviceInfo from 'react-native-device-info';
import OtpInput from '../verification/otpInput';

//   import styles from './styles';
import {MainContext} from '../../../App';
import Button from '../../components/button';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
const EmailVerification = () => {
  const [filled, setFilled] = useState(false);
  const CTX = useContext(MainContext);
  const navigation = useNavigation();
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [pinCode, setPinCode] = useState(null);
  const isFocused = useIsFocused();
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

  const verifyPinHandler = async () => {
    const buildId = await DeviceInfo.getBuildId();
    const deviceId = await DeviceInfo.getDeviceId();
    const deviceName = await DeviceInfo.getDeviceName();
    const systemVersion = await DeviceInfo.getSystemVersion();
    const version = await DeviceInfo.getVersion();
    const manufacturer = await DeviceInfo.getManufacturer();
    const systemName = await DeviceInfo.getSystemName();
    if (loading) {
      return null;
    }
    if (!pinCode) {
      createThreeButtonAlert('Please fill out the inputs');
      setErrMsg('Please fill out the inputs');
      setShowMsg(true);
      return;
    }

    if (!filled) {
      createThreeButtonAlert('Please fill out the inputs');
      setErrMsg('Please fill out the inputs');
      setShowMsg(true);
      return;
    }
    setLoading(true);
    // console.log(
    //   'pin HERE!!!! ==>> ' + `${CTX.url}auth/user/account/verify-email-pin`,
    // );
    try {
      const fetching = await fetch(
        `${CTX.url}auth/user/account/verify-email-pin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.token}`,
          },
          body: JSON.stringify({
            sms: pinCode,
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
        createThreeButtonAlert(parsedJson?.m);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      CTX.setToken(parsedJson?.data?.data);
      CTX.setSessionToken(parsedJson?.data?.data);
      redirectHome();
      //   console.log('backupParsedJson', parsedJson);
    } catch (error) {
      setLoading(false);
      // console.log('error from verifyPinHandler', error);
      createThreeButtonAlert('Network request failed');
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

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

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#00000072');
    }
  }, [isFocused]);

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
    try {
      const fetching = await fetch(`${CTX.url}auth/user/account/resend/email`, {
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
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setCountDown(60);
    } catch (error) {
      console.log('error sending number to backend => ', error);
      setResending(false);
      setErrMsg('Network request failed');
      createThreeButtonAlert('Network request failed');
      setShowMsg(true);
    }
  };

  // fbi.gov/news

  return (
    <>
      <DismissKeyboardWrapper>
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
                textAlign: 'center',
                marginBottom: 10,
                fontWeight: '400',
              }}>
              Please check your email and enter the verification code
            </Text>

            {/* <OTPTextInput
            // style={{width: '80%'}}
            // pinCount={4}
            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            // onCodeChanged = {code => { this.setState({code})}}
            inputCount={4}
            autoFocus
            offTintColor="#DCDCDC"
            tintColor="#3CB371"
            textInputStyle={{...styles.underlineStyleBase, textTransform: "uppercase",}}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            handleTextChange={code => setPinCode(code)}           
            keyboardType='default'
          /> */}

            <OtpInput
              value={pinCode}
              setValue={setPinCode}
              // onComplete={code => {
              //   console.log('User entered OTP:', code);
              // }}
              filled={filled}
              setFilled={setFilled}
            />

            <Button
              onPress={() => verifyPinHandler()}
              label={
                loading ? (
                  <ActivityIndicator color="#fff" size={30} />
                ) : (
                  'Submit'
                )
              }
              disable={pinCode?.length < 4}
              style={{width: '100%', marginTop: 20, height: 50}}
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
                <Text
                  style={{marginRight: 3, color: '#fff', fontWeight: 'bold'}}>
                  Resending{' '}
                </Text>
                <ActivityIndicator size={17} color={'#fff'} />
              </>
            )}
          </TouchableOpacity>
        </ImageBackground>
      </DismissKeyboardWrapper>
    </>
  );
};

export default EmailVerification;

const styles = StyleSheet.create({
  styleLandingLogo: {
    width: '100%',
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  coverHere: {
    width: '100%',
    padding: 20,
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  eachInputHereTextInput: {
    width: 50,
    height: 50,
    overflow: 'hidden',
    color: '#3b3b3b',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    paddingLeft: 20,
  },

  positionAbsoluteView: {
    width: '100%',
    // height: 400,
    // marginTop: -140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: 20,
    // backgroundColor: 'blue',
  },
  whatsYourNumber: {
    fontWeight: 'bold',
    // marginTop: -230,
    marginBottom: 30,
    fontSize: 30,
    color: '#fff',
    // zIndex: 20000,
  },
  positionAbsolute: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  textInputLinkCover: {
    width: '100%',
    borderRadius: 5,
    height: 50,
    borderWidth: 2,
    backgroundColor: '#fff',
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 10,
    alignItems: 'center',
    borderColor: '#fff',
    paddingLeft: 20,
  },
  inputTextInput: {
    paddingLeft: 20,
    color: '#3b3b3b',
    textTransform: 'uppercase',
    width: '100%',
    paddingRight: 15,
  },
  backTouchableOpacity: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#0a171e',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    top: 20,
  },
  copyHandler: {
    width: 80,
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e20154',
    height: '100%',
  },
  eachBtnCover: {
    backgroundColor: '#e20154',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 55,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },

  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 60,
    backgroundColor: '#fff',
    color: '#3b3b3b',
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
// correction HERE needed!!!
