import {View, Text, StatusBar} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {MainContext} from '../../../App';
import Fallback from '../../components/fallback/fallback';

const AmassCenter = React.lazy(() => import('./publishLive'));
const EventPublishLive = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileDetails, setProfileDetails] = useState({...CTX.userObj});

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  
  const togglePublishHandler = async () => {
    const spread = {
      ...profileDetails,
      isPrivateLivePublish: !profileDetails?.isPrivateLivePublish,
    };

    setProfileDetails(spread);
    if (loading) return;

    setLoading(true);
    setShowMsg(false);
    try {
      const fetching = await fetch(`${CTX.url}account/profile/private/publish`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
      });
      const parsedJson = await fetching.json();
      if (parsedJson?.e) {
        setLoading(false);
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }
    } catch (error) {
      setLoading(false);
      console.log(
        'error fetching getTokenAndId for goingLive HERE! => ',
        error,
      );
      setErrMsg('Network request failed');
      createThreeButtonAlert('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
      setProfileDetails(CTX.userObj);
    }
  }, [isFocused]);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        translucent={false}
        barStyle={'dark-content'}
      />

      <Suspense fallback={<Fallback />}>
        <AmassCenter
          togglePublish={togglePublishHandler}
          showMsg={showMsg}
          errMsg={errMsg}
          loading={loading}
          data={profileDetails}
        />
      </Suspense>
    </>
  );
};

export default EventPublishLive;
