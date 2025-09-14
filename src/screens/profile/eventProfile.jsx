// import {View, Text, TouchableOpacity} from 'react-native';
// import React, { useContext } from 'react';
// import { MainContext } from '../../../App';

// const EventProfile = () => {
//   const CTX = useContext(MainContext)

//   return (
//     <View>
//       <Text>EventProfile</Text>
//       <Text>EventProfile</Text>
//       <Text>EventProfile</Text>
//       <Text>EventProfile</Text>
//       <Text onPress={() => CTX.logoutUser()}>EventProfile</Text>
//     </View>
//   );
// };

// export default EventProfile;




import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  NativeModules,
  // Pressable,
  // Modal,
  // Image,
} from 'react-native';
import React, {Suspense, useContext, useEffect, useRef, useState} from 'react';
import {useRoute, useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import ErrMessage from '../../components/errMessage/errMessage';
import {MainContext} from '../../../App';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {GetUserDetails} from '../../helper/getUserHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import MyProfile from './myProfile';
// const Status = React.lazy(() => import('./status'));
const MyProfile = React.lazy(() => import('./profile'));
const EventMyProfile = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  // const navigation = useNavigation()
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileDetails, setProfileDetails] = useState({});
  const route = useRoute();
  const ws = useRef(null);

  // const getDetailsHere = async () => {
  //   const userDetails = await GetUserDetails(CTX.url, CTX.sessionToken);
  //   if (userDetails.user) {
  //     CTX.setToken(userDetails.token);
  //     // await AsyncStorage.setItem('@sessionToken', userDetails.token);
  //     CTX.setUserObj(userDetails.user);

  //     setProfileDetails(userDetails.user);
  //     setLoading(false);
  //     return;
  //   }
  // };




  // const getDetailsHere = async () => {
  //   // const userDetails = await GetUserDetails(CTX.url, CTX.sessionToken);
  //   // if (userDetails.user) {
  //   //   CTX.setToken(userDetails.token);
  //   //   // await AsyncStorage.setItem('@sessionToken', userDetails.token);
  //   //   CTX.setUserObj(userDetails.user);

  //   //   setProfileDetails(userDetails.user);
  //   //   setLoading(false);
  //   //   return;
  //   // }




  //   try {
  //     const fetching = await fetch(`${CTX.url}user/auth`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `bearer ${CTX.sessionToken}`,
  //       },
  //     });
  //     const parsedJson = await fetching.json();
  //     // CTX.setToken(parsedJson?.data?.data);
  //     // console.log('USER DETAILS HERE!!!');
  //     // console.log('USER DETAILS HERE!!!'); 
  //     // console.log('parsedJson', parsedJson.data);
  //     // console.log('USER DETAILS HERE!!!');
  //     // console.log('USER DETAILS HERE!!!');

  //     setLoading(false);
  //     CTX.setToken(parsedJson.data.token);
  //   //   // await AsyncStorage.setItem('@sessionToken', userDetails.token);
  //     CTX.setUserObj(parsedJson.data.user);

  //     // return parsedJson.data;

  
  //     // return parsedJson.data;
  //   } catch (error) {
  //     setLoading(false);
  //     console.log('catch error HERE => ', error);
  //     return;
  //   }
  // };




  // const getTheParticularProfile = async _id => {
  //   setLoading(true);
  //   try {
  //     getDetailsHere();
  //   } catch (error) {
  //     setLoading(false);
  //     console.log('error fetching data for private HERE! => ', error);
  //     setErrMsg('Network request failed');
  //     setShowMsg(true);
  //   }
  // };

  // const getTheParticularProfileCodely = async _id => {
  //   setLoading(true);
  //   try {
  //     getDetailsHere();
  //   } catch (error) {
  //     setLoading(false);
  //     console.log('error fetching data for private HERE! => ', error);
  //     setErrMsg('Network request failed');
  //     setShowMsg(true);
  //   }
  // };

  // const sendRequestHere = async fcmToken => {
  //   try {
  //     const fetching = await fetch(`${CTX.url}user/set/token`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `bearer ${CTX.sessionToken}`,
  //       },
  //       body: JSON.stringify({fcmToken}),
  //     });
  //     const parsedJson = await fetching.json();

  //     if (parsedJson?.isRemoved) {
  //       return CTX.logoutUser();
  //     }
  //   } catch (error) {
  //     console.log('error from  HERE! sendRequestHere => ', error);
  //   }
  // };

  // const getTokenHandler = async () => {
  //   const token = await messaging().getToken();
  //   if (token) {
  //     console.log('token from if => ', token);
  //     await AsyncStorage.setItem('@fcmToken', token);
  //     return token;
  //   } else {
  //     await messaging().registerDeviceForRemoteMessages();

  //     // Get the token
  //     const anoToken = await messaging().getToken();
  //     console.log('anoToken from else => ', anoToken);
  //     await AsyncStorage.setItem('@fcmToken', anoToken);
  //     return token;
  //   }
  // };

  // const setFcmTokenToServerCodely = async () => {
  //   // this setFcmTokenToServerCodely sets user fcmToken from async storage to server
  //   try {
  //     const fcmToken = await AsyncStorage.getItem('@fcmToken');
  //     if (!fcmToken) {
  //       console.log('no fcm token found');
  //       const getToken = await getTokenHandler();
  //       sendRequestHere(getToken);
  //     } else {
  //       if (fcmToken.length < 13) {
  //         const getToken = await getTokenHandler();
  //         sendRequestHere(getToken);
  //         return console.log('fcmToken.length < 13');
  //       }
  //       sendRequestHere(fcmToken);
  //     }
  //   } catch (error) {
  //     console.log('error from  HERE! setFcmTokenToServerCodely => ', error);
  //   }
  // };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
      // navigation.setParams({screenName: 'Profile'});
      // getTheParticularProfileCodely();
    }
  }, [isFocused]);

  
  
  // useEffect(() => {
  //   if (isFocused) {
  //     getTheParticularProfile();
  //     setFcmTokenToServerCodely();
  //   }
  // }, []);

  return (
    <>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}

      <Suspense
        fallback={
          <View style={styles.activityCover}>
            <ActivityIndicator color={'#0a171e'} size={40} />
          </View>
        }>
        <MyProfile
          loading={loading}
          // profileDetails={CTX.userObj}
          username={route?.params ? route?.params?.username : CTX?.userObj?.username}
          params={route?.params}
          // getProfileDetails={getTheParticularProfile}
          isFocused={isFocused}
        />
        {/* <Status setShowMsg={setShowMsg} setErrMsg={setErrMsg} /> */}
      </Suspense>
      {/* )} */}
    </>
  );
};

export default EventMyProfile;

const styles = StyleSheet.create({
  coverMain: {
    flex: 1,
    width: '100%',
    heigth: '100%',
    backgroundColor: '#000',
  },
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  anocenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    backgroundColor: '#00000066',
  },
  anomodalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 7,
    padding: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // coverMain: {
  //   flex: 1,
  //   width: '100%',
  //   heigth: '100%',
  //   backgroundColor: '#000',
  // },
  // activityCover: {
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  //   top: 0,
  //   left: 0,
  //   backgroundColor: '#0a171e53',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   zIndex: 10,
  // },
});