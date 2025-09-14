import {View, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import CreateAccount from './createAccount';
import DeviceInfo from 'react-native-device-info';
import {MainContext} from '../../../App';
import {useRoute, useNavigation} from '@react-navigation/core';
import ErrMessage from '../../components/errMessage/errMessage';
import {isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventCreateAccount = () => {
  const CTX = useContext(MainContext);
  const route = useRoute();
  const navigation = useNavigation();
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [full_name, setFull_name] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(null);
  const [account_type, setAccount_type] = useState('Account type');
  const [phone, setPhone] = useState(null);
  const [usernameErr, setUsernameErr] = useState(null);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [country, setCountry] = useState({
    country_code: 'NG',
    country_en: 'Nigeria',
    country_cn: '尼日利亚',
    phone_code: 234,
  });

  const createAccountHandler = async () => {
    // const isEmailValid = await validateEmail(email);
    const build_id = await DeviceInfo.getBuildId();
    const device_id = await DeviceInfo.getDeviceId();
    const device_name = await DeviceInfo.getDeviceName();
    const system_version = await DeviceInfo.getSystemVersion();
    const version = await DeviceInfo.getVersion();
    const manufacturer = await DeviceInfo.getManufacturer();
    const system_name = await DeviceInfo.getSystemName();

    const fullNumber = parsePhoneNumber(phone, country?.country_code);

    if (!fullNumber.isValid()) {
      setErrMsg('Enter a valid phone number');
      setShowMsg(true);
      return;
    }

    if (loading) {
      return null;
    }

    if (!full_name || !username || !email || account_type == 'Account type') {
      setErrMsg('Please fill out the inputs');
      setShowMsg(true);
      return;
    }

    // if (!isChecked) {
    //   setErrMsg('Agree to our Terms & Policy');
    //   setShowMsg(true);
    //   return;
    // }

    setLoading(true);
    try {
      const fetching = await fetch(`${CTX.url}auth/user/account/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.token}`,
        },
        body: JSON.stringify({
          email: email.toLowerCase()?.trim(),
          phone: fullNumber.number?.trim(),
          username: username.toLowerCase()?.trim(),
          full_name: full_name?.trim(),
          account_type: account_type.toLowerCase(),
          country_obj: country,
          build_id,
          device_id,
          device_name,
          system_version,
          version,
          manufacturer,
          system_name,
        }),
      });
      const parsedJson = await fetching.json();
      setLoading(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }

      // console.log('parsedJson?.data =>>> ', parsedJson?.data);
        await AsyncStorage.setItem('@sessionToken', parsedJson?.data?.data);

      CTX.setToken(parsedJson?.data?.data);
      CTX.setSessionToken(parsedJson?.data?.data);
      navigation.navigate('SerialCode', {
        backup_words: parsedJson?.data?.backup_words,
      });
    } catch (error) {
      console.log('Error from creating account here! => ', error);
      setLoading(false);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    setEmail(route?.params?.email);
    // setPhone(route?.params?.phone);
  }, []);

  const setUsernameHandler = text => {
    setUsername(text);

    // === Validate Character Set ===
    const hasInvalidChars = /[^a-zA-Z0-9._]/.test(text);
    if (hasInvalidChars) {
      setUsernameErr(
        'Invalid Characters. Username can include only letters, numbers, underscores, or periods',
      );
      return;
    }

    // === Validate Number in First 4 Characters ===
    const firstFour = text.slice(0, 4);
    const hasNumberInFirstFour = /[0-9]/.test(firstFour);
    if (hasNumberInFirstFour) {
      setUsernameErr('Invalid Input. Numbers can follow after four characters');
      return;
    }

    // === Validate Length ===
    if (text.length > 26) {
      setUsernameErr('Limit Reached. Maximum character length is 26');
      return;
    }

    // ✅ All validations passed
    setUsernameErr(null);
  };

  const checkUsernameExist = async revap => {
    console.log('revap =>> ', revap);

    setUsernameLoading(true);
    try {
      const fetching = await fetch(`${CTX.url}user/account/check/username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: revap}),
      });
      const parsedJson = await fetching.json();
      setUsernameLoading(false);
      if (parsedJson?.error) {
        return setUsernameErr(true);
      }
      setUsernameErr(false);
      return;
    } catch (error) {
      setUsernameLoading(false);
      setUsernameErr(true);
      console.log('checkUsernameExist ERROR! => ', error);
    }
  };

  const clearAllUsername = () => {
    setUsername('');
  };

  const checkEmailExist = async revap => {
    setEmailLoading(true);
    try {
      const fetching = await fetch(`${CTX.url}user/account/check/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: revap}),
      });
      const parsedJson = await fetching.json();
      setEmailLoading(false);
      if (parsedJson?.error) {
        return setEmailErr(true);
      }
      setEmailErr(false);
      return;
    } catch (error) {
      setEmailLoading(false);
      setEmailErr(true);
      console.log('checkUsernameExist ERROR! => ', error);
    }
  };

  const showMsgHere = () => {
    setErrMsg(
      'Username must contains alphanumeric characters, underscore, full stop. Numbers comes after four letters',
    );
    setShowMsg(true);
  };

  const setEmailHandler = e => {
    // setEmail(e);
    // checkEmailExist(e);

    // const validateEmail = email => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    //   if (emailRegex.test(email)) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // };

    // if (!isEmailValid) {
    //   setErrMsg('Invalid email');
    //   setShowMsg(true);
    //   return;
    // }

    setEmail(e);
    if (emailRegex.test(e)) {
      checkEmailExist(e);
      // console.log("return true => HERE!" );
      return;
    } else {
      // console.log("return false => HERE!" );
      return;
    }
  };

  return (
    <>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}

      <DismissKeyboardWrapper>
        <CreateAccount
          createAccountHandler={createAccountHandler}
          full_name={full_name}
          email={email}
          account_type={account_type}
          username={username}
          phone={phone}
          setPhone={setPhone}
          setFull_name={setFull_name}
          setUsername={setUsername}
          setEmailHandler={setEmailHandler}
          setAccount_type={setAccount_type}
          loading={loading}
          setUsernameHandler={setUsernameHandler}
          clearAllUsername={clearAllUsername}
          usernameErr={usernameErr}
          usernameLoading={usernameLoading}
          emailErr={emailErr}
          emailLoading={emailLoading}
          showMsgHere={showMsgHere}
          country={country}
          setCountry={setCountry}
        />
      </DismissKeyboardWrapper>
    </>
  );
};

export default EventCreateAccount;
