import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import React, {memo, useContext, useEffect, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Paystack, paystackProps} from '@hurshore/react-native-paystack-webview';
import {WebView} from 'react-native-webview';

import {MainContext} from '../../../App';
import styles from './deposit.styles';
//   import {GetUserDetails} from '../../helper/getUserHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/button';
//   import ErrMessage from '../../components/errMessage/errMessage';
const Deposit = ({amount, setAmount}) => {
  const [paymentURL, setPaymentURL] = useState(null); // create this on Paystack
  const CTX = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const [isUsd, setIsUsd] = useState(false);
  const paystackWebViewRef = useRef();
  const webViewRef = useRef(null);

  const createThreeButtonAlert = (
    msg = `Our deposit system is currently under maintenance. Please contact us at https://goitlive.com/contact.html or email us at help@goitlive.com to proceed with a manual payment.

The GoitLive Team`,
    alhe = 'Deposit Under Maintenance',
  ) =>
    Alert.alert(alhe, msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  // console.log('amount HERE =>> ', amount);

  function isNumber(str) {
    // return !isNaN(parseFloat(str)) && isFinite(str);
    //
    return /^\d+(\.\d+)?$/.test(str);
  }

  const initializePayment = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${CTX?.url}account/profile/authorization/url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CTX?.sessionToken}`,
          },
          body: JSON.stringify({
            email: CTX.userObj?.email,
            phone: CTX.userObj?.phone,
            currency: isUsd ? 'USD' : 'NGN',
            amount: parseInt(amount) * 100, // Convert to kobo
          }),
        },
      );

      const sawait = await response.json();
      setLoading(false);

      if (sawait.e) {
        createThreeButtonAlert(sawait.m, 'Alert');
        return;
      }

      console.log('sawait =>>> '.sawait);
      setPaymentURL(sawait?.data);
    } catch (error) {
      setLoading(false);
      console.error('Payment initialization failed:', error);
      throw error;
    }
  };

  // const onClose = (e) => {
  //   console.log("onClose function =>> ", e);
  // }
  const onClose = e => {
    console.log('onClose function =>> ', e);
  };

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle="dark-content"
      />

      <View style={styles.containerCover}>
        {!paymentURL && (
          <>
            <Text style={styles.upperText}>Enter amount</Text>
            <View style={styles.coverSearchHere}>
              <MaterialCommunityIcons
                name="numeric"
                color="#262626"
                size={24}
              />
              <TextInput
                style={styles.innerTextInput}
                placeholder="eg 2000"
                keyboardType="numeric"
                placeholderTextColor={'#262626'}
                value={amount}
                onChangeText={e => {
                  const inputValue = e;
                  const newValue = inputValue.replace(/\D/g, ''); // Replace non-numeric characters with an empty string
                  setAmount(newValue);
                }}
              />

              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 10,
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                // onPress={() => setIsUsd(!isUsd)}
                >
                <Text style={{color: '#000'}}>{isUsd ? 'USD' : 'NGN'}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* <PayWithFlutterwave
            onRedirect={handleOnRedirect}
            options={{
              tx_ref: generateRef(11),
              authorization: 'FLWPUBK_TEST-e0bdd242fa4d4357a7a2421159e3bf42-X',
              customer: {
                // email: CTX.userObj?.email,
                email: 'jucoallison@gmail.com',
              },
              amount: parseInt(amount),
              currency: 'NGN',
              // payment_options: 'card, mobilemoney, ussd',
              payment_options: 'card',
            }}
            customButton={props => (
              <TouchableOpacity activeOpacity={0.8}
                style={{paddingTop: 10, width: '100%'}}
                isBusy={props.isInitializing}
                onPress={() => {
                  if (amount) {
                    return props.onPress();
                  } else {
                    return createThreeButtonAlert("Minimum deposit is 1000 naira");
                  }
                }}
                // isBusy={props.isInitializing}
                // disabled={props.disabled}
              >
                <View
                  style={{
                    ...styles.eachBtnCover,
                    backgroundColor: amount ? '#e20154' : '#e2015488',
                  }}>
                  {loading ? (
                    <ActivityIndicator color="#fff" size={30} />
                  ) : (
                    <Text style={{...styles.eachBtnText, color: '#fff'}}>
                      Recharge
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          /> */}

        <View style={{flex: 1}}>
          {/* <Paystack
          ref={paystackWebViewRef}
          paystackKey="pk_test_dde3c0ddc8b1d43fe16571ed4d308ae97eacabff" // Your public key
          // billingEmail={CTX.userObj?.email}
          billingEmail={"jucoallison@gmail.com"}

          amount={200000} // amount in kobo
          currency="NGN"
          onSuccess={async res => {
            console.log('Payment Success:', res);
            // Send reference to backend for verification
            const fawait = await fetch(
              `${CTX?.url}account/profile/user/fund/${res.transactionRef.reference}`,
              {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  reference: res.transactionRef.reference,
                  using: 'paystack',
                }),
              },
            );

            const sawait = await fawait.json();

            if (sawait.e) {
              createThreeButtonAlert(sawait.m, 'Alert');
              return;
            }

            CTX.setToken(sawait.token);
            CTX.setSessionToken(sawait.token);
            createThreeButtonAlert('Recharge successful', 'Alert');
          }}
          onCancel={() => {
            console.log('Payment cancelled');
          }}
        /> */}

          {/* <Paystack  
        paystackKey="pk_live_6e75d15b7b20eb1a18aa915f69d689d3761c407b"
        amount={'25000.00'}
        billingEmail="jucoallison@gmail.com"
        activityIndicatorColor="green"
        onCancel={(e) => {
          console.log("e => ", e);
          // handle response here
        }}
        onSuccess={(res) => {
          console.log("res => ", res);
          
          // handle response here
        }}
        autoStart={true}
      /> */}

          {paymentURL && (
            <WebView
              source={{uri: paymentURL?.authorization_url}}
              // onNavigationStateChange={(navState) => {
              //   // Optional: detect redirect URL success/failure
              //   console.log(navState.url);
              // }}
              ref={webViewRef}
              onNavigationStateChange={navState => {
                console.log('navState.url =>>>> ', navState);
                if (navState.url.includes('your-success-redirect-url')) {
                  onClose('success');
                }
                if (navState.url.includes('your-cancel-redirect-url')) {
                  onClose('cancel');
                }
              }}
              onError={() => {
                setShowWebView(false);
                Alert.alert('Error', 'Failed to load payment page');
              }}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          )}
        </View>
        {!paymentURL && (
          <Button
            label={'Recharge'}
            onPress={() => {
              initializePayment();
              // paystackWebViewRef.current.startTransaction();
            }}
            loading={loading}
            style={{width: '100%', height: 55, marginTop: 30}}
            disable={loading || !isNumber(amount) || amount?.length < 3}
          />
        )}
        {/* 
          




<Button label={"Pay now"} onPress={()=> paystackWebViewRef.current.startTransaction()} /> */}

        {/* <TouchableOpacity activeOpacity={0.8} onPress={onPressHandler}>
    <Text style={{...styles.upperText, textAlign: "center"}}>or bank transfer</Text>
  </TouchableOpacity> */}
      </View>
    </>
  );
};

export default memo(Deposit);

// {
//   tx_ref: generateTransactionRef(),
//   authorization: '[your merchant public Key]',
//   amount: 100,
//   currency: 'USD',
//   customer: {
//     email: 'customer-email@example.com',
//   },
//   payment_options: 'card',
// }

// flw_p_key = "FLWPUBK-c531ac278c422e129d6603da656749f5-X"
// flw_s_key = "FLWSECK-29525775d3ebecfe3988ecb4eb72c082-18d5032df8dvt-X"
