import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/core';
import Lottie from 'lottie-react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// import animationData from '../../../../assets/json/loading.json';
import animationData from '../../../../assets/json/withLoading.json';
import {MainContext} from '../../../../../App';

const Private = React.lazy(() => import('./private'));
const EventPrivate = ({swipeEnabled, setSwipeEnabled}) => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigation = useNavigation();

  // // check if the user has already a private
  // const checkIfUserHasPrivateAccount = async () => {
  //   if (!hasMore || loading) return; // Prevent fetching if there are no more items or already fetching
  //   console.log('currentPage ==>> ', currentPage);

  //   setLoading(true);
  //   setShowMsg(false);
  //   setErrMsg('');
  //   // console.log(
  //   //   `${CTX.systemConfig?.p}user/get_private_account/${currentPage}/3`
  //   // );
  //   try {
  //     const fetching = await fetch(
  //       `${CTX.systemConfig?.p}user/get_private_account/${currentPage}/3`, // we get three fetching here as
  //       // `${CTX.systemConfig?.p}user/get_private_account/1/3`, // we get three fetching here as
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
  //       setErrMsg(response?.msg);
  //       setShowMsg(true);
  //       return;
  //     }
  //     if (!response?.data?.isPrivate) {
  //       console.log('NewToPrivateLive');
  //       navigation.navigate('NewToPrivateLive');
  //       return;
  //     }
  //     let spreading = [...data, ...response?.data?.data];
  //     // console.log('checkIfUserHasPrivateAccount ==>>> ', spreading);
  //     setData(spreading);
  //     setHasMore(response?.data?.hasMore);
  //     setCurrentPage(prevPage => prevPage + 1);
  //     setLoading(false);
  //     setShowMsg(false);
  //     setErrMsg('');
  //   } catch (error) {
  //     setLoading(false);
  //     console.log('error from uploadVideoToServer ==>> ', error);
  //     setErrMsg('Network request failed');
  //     setShowMsg(true);
  //   }
  //   // }, [currentPage]);
  // };

  // useEffect(() => {
  //   checkIfUserHasPrivateAccount();
  // }, []);









  









   // check if the user has already a private
   const checkIfUserHasPrivateAccount = async () => {
    if (!hasMore || loading) return; // Prevent fetching if there are no more items or already fetching
    // console.log('currentPage ==>> ', currentPage);

    setLoading(true);
    setShowMsg(false);
    setErrMsg('');
    // console.log(
    //   `${CTX.systemConfig?.p}get/account/get_private_account/${currentPage}/3`
    // );
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}get/account/get_private_account/${currentPage}/3`, // we get three fetching here as
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const response = await fetching.json();
      if (response?.isRemoved) {
        return CTX.logoutUser();
      }

      if (response.e) {
        setLoading(false);
        setErrMsg(response?.m);
        createThreeButtonAlert(response?.m)
        setShowMsg(true);
        return;
      }
      if (!response?.isPrivate) {
        console.log('NewToPrivateLive');
        // navigation.navigate('NewToPrivateLive');
        PostCTX?.setMinimize(true);
        return;
      }
      // console.log("response?.data HERE!!! for private =>> ", response?.data);
      
      let spreading = [...data, ...response?.data];
      setData(spreading);
      setHasMore(response?.hasMore);
      setCurrentPage(prevPage => prevPage + 1);
      // console.log('(response?.hasMore ==>>> ', response?.hasMore);
      // console.log('(spreading.length ==>>> ', spreading.length);
      // console.log('(response?.hasMore ==>>> ', response?.hasMore);
      setLoading(false);
      setShowMsg(false);
      setErrMsg('');
    } catch (error) {
      setLoading(false);
      console.log('error from uploadVideoToServer ==>> ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
    // }, [currentPage]);
  };

  useEffect(() => {
    checkIfUserHasPrivateAccount();
  }, []);


















  // const newMessageFromUser = async ({shouldBlock}) => {
  //   console.log('shouldBlock HERE!!  =>>> ');
  //   console.log('shouldBlock HERE!!  =>>> ');
  //   console.log('shouldBlock HERE!!  =>>> ');
  //   console.log('shouldBlock HERE!!  =>>> ', shouldBlock);
  //   console.log('shouldBlock HERE!!  =>>> ');
  //   console.log('shouldBlock HERE!!  =>>> ');
  //   console.log('shouldBlock HERE!!  =>>> ');
  //   console.log('shouldBlock HERE!!  =>>> ');
  // };

  // useEffect(() => {
  //   if (CTX.socketObj) {
  //     CTX.socketObj.on('debitUserResponse', newMessageFromUser);
  //   }

  //   return () => {
  //     CTX.socketObj?.off('debitUserResponse');
  //   };
  // }, [CTX.socketObj]);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle="light-content"
      />
      {data.length < 1 && loading ? (
        <View style={styles.activityCover}>
          <View
            style={{
              width: '40%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Lottie
              style={styles.Lottie}
              source={animationData}
              autoPlay
              loop
            />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      ) : (
        <>
          {showMsg ? (
            <>
              <View style={{...styles.activityCover}}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{alignItems: 'center'}}
                  onPress={() => checkIfUserHasPrivateAccount()}>
                  <FontAwesome5 size={40} color="#fff" name="holly-berry" />
                  <Text style={{...styles.pleaseRetry, marginTop: 10}}>
                    {errMsg || 'Error happened'}
                  </Text>
                  <Text style={{...styles.pleaseRetry}}>Tap to retry</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.container}>
              <Suspense
                fallback={
                  <View style={styles.activityCover}>
                    <ActivityIndicator color={'#0a171e53'} size={40} />
                  </View>
                }>
                <Private
                  data={data}
                  onRefreshOthers={checkIfUserHasPrivateAccount}
                  swipeEnabled={swipeEnabled}
                  setSwipeEnabled={setSwipeEnabled}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  loading={loading}
                  checkIfUserHasPrivateAccount={checkIfUserHasPrivateAccount}
                  hasMore={hasMore}
                  isFocused={isFocused}
                  CTX={CTX}
                />
              </Suspense>
            </View>
          )}
        </>
      )}
    </>
  );
};

export default EventPrivate;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  activityCover: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: -15,
    fontSize: 13,
    fontFamily: 'Overpass-Regular',
  },
  pleaseRetry: {
    color: '#fff',
    fontFamily: 'Overpass-Regular',
    textAlign: 'center',
  },
  Lottie: {
    width: 150,
    height: 150,
  },
});
