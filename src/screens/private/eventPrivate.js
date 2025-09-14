import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const OldNavigation = React.lazy(() => import('./old/oldNavigation'));
const EventUploadPrivate = React.lazy(() => import('./new/eventUploadPrivate'));
import {MainContext} from '../../../App';
import {useNavigation} from '@react-navigation/core';

const EventPrivate = () => {
  // const CTX = useContext(MainContext);
  // const [errMsg, setErrMsg] = useState('');
  // const [showMsg, setShowMsg] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [isPrivate, setIsPrivate] = useState(null);
  // const [data, setData] = useState([]);
  // const navigation = useNavigation()

  // // check if the user has already a private
  // const checkIfUserHasPrivateAccount = async () => {
  //   setLoading(true);
  //   setShowMsg(false);
  //   setErrMsg('');
  //   try {
  //     const fetching = await fetch(
  //       `${CTX.systemConfig?.p}user/get_private_account/1/3`, // we get three fetching here as
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

  //     if (response.error) {
  //       setLoading(false);
  //       setErrMsg(response.data?.msg);
  //       setShowMsg(true);
  //       return;
  //     }

  //     console.log('response gotten from private successfully:');
  //     console.log('response gotten from private successfully:');
  //     console.log(
  //       'response gotten from private successfully:',
  //       response?.data?.data,
  //     );
  //     console.log('response gotten from private successfully:');
  //     console.log('response gotten from private successfully:');
  //     console.log('response gotten from private successfully:');
  //     navigation.navigate('TabPrivateForOthers')
  //     setIsPrivate(response?.data?.isPrivate);
  //     setData(response?.data?.data);
  //     setLoading(false);
  //     setShowMsg(false);
  //     setErrMsg('');
  //   } catch (error) {
  //     setLoading(false);
  //     console.log('error from uploadVideoToServer ==>> ', error);
  //     setErrMsg('Error happened, click to retry');
  //     setShowMsg(true);
  //   }
  // };

  // useEffect(() => {
  //   checkIfUserHasPrivateAccount();
  // }, []);

  // <Private />
  // return <OldNavigation />;

  return <OldNavigation />;
};

export default EventPrivate;

const styles = StyleSheet.create({
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  activiityCover: {
    width: '80%',
    height: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  pleaseRetry: {
    color: '#fff',
    textAlign: 'center',
  },
});
