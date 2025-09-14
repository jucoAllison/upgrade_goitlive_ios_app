import React, {Suspense, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {MainContext} from '../../../../../App';
import {useIsFocused, useNavigation} from '@react-navigation/core';
import ErrMessage from '../../../../components/errMessage/errMessage';

const PrivateProfile = React.lazy(() => import('./privateProfile'));
const EventEachUserPrivateProfile = ({route}) => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {user, isCaring} = route?.params;
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isUserCaring, setIsUserCaring] = useState(isCaring);
  const [showMsg, setShowMsg] = useState(false);
  const [data, setData] = useState(user);


  // getUserDetailsHere like num of following
  const getUserDetailsHere = async (username, ID) => {
    setLoading(true);
    setShowMsg(false);
    setErrMsg('');
    try {
      const fetching = await fetch(
        // `${CTX.systemConfig?.p}user/private/profile/get/${username}/${ID}`, // we get three fetching here as
        `${CTX.systemConfig?.p}get/account/profile/details/${ID}`,
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

      if (response.error) {
        setLoading(false);
        setErrMsg(response?.msg);
        setShowMsg(true);
        return;
      }

      setData(response?.data);
      setIsUserCaring(response?.checkCaring);
      setLoading(false);
      setShowMsg(false);
      setErrMsg('');
    } catch (error) {
      setLoading(false);
      console.log('error from getUserDetailsHere ==>> ', error);
      setErrMsg('Error happened, click to retry');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
      getUserDetailsHere(user?.username, user?._id);
      setData(route?.params?.user)
      // Your logic here when the screen is focused (e.g., console.log, state update)
    }
  }, [isFocused]);

  return (
    <>
      {showMsg && (
        <ErrMessage closeErr={() => setShowMsg(!showMsg)} msg={errMsg} />
      )}
      <View style={{backgroundColor: '#fff'}}>
        <StatusBar
          animated={true}
          backgroundColor={CTX.statusBarColor}
          // hidden={true}
          barStyle="dark-content"
        />
        <Suspense
          fallback={
            <View style={styles.activityCover}>
              <ActivityIndicator color={'#0a171e53'} size={40} />
            </View>
          }>
          <PrivateProfile
            user={data}
            isUserCaring={isUserCaring}
            setIsUserCaring={setIsUserCaring}
            loading={loading}
            navigation={navigation}
            isFocused={isFocused}
            getProfileDetails={() =>
              getUserDetailsHere(user?.username, user?._id)
            }
          />
        </Suspense>
      </View>
    </>
  );
};

export default EventEachUserPrivateProfile;

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
    color: '#0a171e',
    textAlign: 'center',
  },
});
