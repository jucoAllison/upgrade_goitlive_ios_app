import {View, Text, Alert} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';

import {MainContext} from '../../../App';
import Withdraw from './withdrawal';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
// const  = React.lazy(() => import(''));
const EventWithdrawal = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const [inputs, setInputs] = useState({});
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [otherData, setOtherData] = useState(null);
  const [selectedText, setSelectedText] = useState({
    code: '001',
    name: 'Select bank',
  });
  const createSuccessButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => {
          console.log('Close pressed');
        },
      },
    ]);

  const withdrawHandler = async () => {
    if (loading) return; // Prevent fetching if there are no more items or already fetching

    setLoading(true);
    setShowMsg(false);
    setErrMsg('');
    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/user/withdraw`, // we get three fetching here as
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({
            name: inputs?.name,
            account_number: inputs?.number,
            bank_code: selectedText?.code,
          }),
        },
      );
      const response = await fetching.json();
      if (response?.isRemoved) {
        return CTX.logoutUser();
      }

      if (response.e) {
        setLoading(false);
        setErrMsg(response?.m);
        createSuccessButtonAlert(response?.m);
        setShowMsg(true);
        return;
      }

      setLoading(false);
      setShowMsg(false);

      // console.log("response. from withdrawal =>>> ", response);
      

      CTX.setSessionToken(response.data);

      // checkIfThereIsPendingWithdrawal();
      setErrMsg('');
    } catch (error) {
      setLoading(false);
      console.log('error from uploadVideoToServer ==>> ', error);
      createSuccessButtonAlert('Network request failed');
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
    // }, [currentPage]);
  };

  // const checkIfThereIsPendingWithdrawal = async () => {
  //   setMainLoading(true);
  //   setShowMsg(false);
  //   setErrMsg('');
  //   try {
  //     const fetching = await fetch(
  //       `${CTX.url}account/profile/user/withdraw`, // we get three fetching here as
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `bearer ${CTX.sessionToken}`,
  //         },
  //       },
  //     );
  //     const response = await fetching.json();
  //     if (response?.isRemoved) {
  //       return CTX.logoutUser();
  //     }

  //     if (response.e) {
  //       setMainLoading(false);
  //       setErrMsg(response?.m);
  //       createSuccessButtonAlert(response?.m);
  //       setShowMsg(true);
  //       return;
  //     }
  //     console.log('checkIfThereIsPendingWithdrawal HERE!!  ===>> ', response);
  //     setOtherData(response?.data);
  //     setMainLoading(false);
  //     setShowMsg(false);
  //     setErrMsg('');
  //   } catch (error) {
  //     setMainLoading(false);
  //     console.log('error from uploadVideoToServer ==>> ', error);
  //     createSuccessButtonAlert('Network request failed');
  //     setErrMsg('Network request failed');
  //     setShowMsg(true);
  //   }
  // };

  useEffect(() => {
    if (isFocused) {
      // checkIfThereIsPendingWithdrawal();
      CTX.setStatusBarColor('#fff');
    }
  }, [isFocused]);
  return (
    <>
      <DismissKeyboardWrapper>
        <Withdraw
          inputs={inputs}
          setInputs={setInputs}
          withdrawHandler={withdrawHandler}
          otherData={otherData}
          selectedText={selectedText}
          setSelectedText={setSelectedText}
          loading={loading}
        />
      </DismissKeyboardWrapper>
    </>
  );
};

export default EventWithdrawal;
