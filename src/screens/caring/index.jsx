import React, {memo, Suspense, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useRoute} from '@react-navigation/core';

import AbbrNum from '../../helper/abbrev';
import {MainContext} from '../../../App';
const Caring = React.lazy(() => import('./caring'));
const Cared = React.lazy(() => import('./cared'));
const Index = () => {
  const route = useRoute();
  const [toggle, setToggle] = useState(null);
  const [countDocs, setCountDocs] = useState({});
  const CTX = useContext(MainContext);

  // const getCountDocsHere = async () => {
  //   try {
  //     let urlHere = `${CTX.systemConfig?.p}user/profile/get/care/count/${route?.params?._id}`;

  //     const fetching = await fetch(
  //       urlHere, // we get three fetching here as
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
  //       // setLoading(false);
  //       // setErrMsg(response.data?.msg);
  //       // setShowMsg(true);
  //       console.log('error from getCountDocsHere ==>> ', response.data?.msg);

  //       return;
  //     }
  //     console.log('...getCountDocsHere ==>>> ', response?.data);
  //   } catch (error) {
  //     console.log('error from getCountDocsHere ==>> ', error);
  //   }
  // };

  useEffect(() => {
    // get the counts here!!!
    // getCountDocsHere();
    setToggle(route?.params?.isCaring);
    CTX.setStatusBarColor('#fff');

    return () => setToggle(null);
  }, [route?.params]);

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle="dark-content"
      />
      <View style={styles.line}>
        <TouchableOpacity activeOpacity={0.8}
          onPress={() => setToggle(true)}
          style={{width: '50%'}}>
          <Text
            style={{
              ...styles.caredText,
              color: toggle ? '#262626' : '#26262699',
              borderBottomColor: toggle ? '#262626' : '#f5f5f5',
              borderBottomWidth: toggle ? 2 : 0,
            }}>
            {AbbrNum(route?.params?.cared, 0)} Caring
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}
          onPress={() => setToggle(false)}
          style={{width: '50%'}}>
          <Text
            style={{
              ...styles.caredText,
              color: toggle ? '#26262699' : '#262626',
              borderBottomColor: toggle ? '#f5f5f5' : '#262626',
              borderBottomWidth: toggle ? 0 : 2,
            }}>
            {AbbrNum(route?.params?.caring, 0)} Cared
          </Text>
        </TouchableOpacity>
      </View>

      {/* <View style={{paddingTop: 20}}> */}
      {toggle && (
        <Suspense
          fallback={
            <View style={styles.activityCover}>
              <ActivityIndicator color={'#0a171e53'} size={40} />
            </View>
          }>
          <Caring toggle={toggle} route={route} />
        </Suspense>
      )}
      
      {!toggle && (
        <Suspense
          fallback={
            <View style={styles.activityCover}>
              <ActivityIndicator color={'#0a171e53'} size={40} />
            </View>
          }>
          <Cared toggle={toggle} route={route} />
          {/* )} */}
        </Suspense>
      )}
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    flex: 1,
  },
  line: {
    alignItems: 'center',
    marginTop: 30,
    borderBottomWidth: 1,
    borderColor: '#d1d1d1',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  caredText: {
    paddingBottom: 15,
    fontSize: 18,
    color: '#262626',
    textAlign: 'center',
    marginRight: 20,
    borderBottomWidth: 2,
    width: '100%',
    fontFamily: 'Gilroy-Bold',
  },
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
    color: '#0a171e',
    textAlign: 'center',
  },
});

export default memo(Index);