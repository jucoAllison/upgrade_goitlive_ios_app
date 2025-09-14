import {View, Text, StatusBar} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {useIsFocused, } from '@react-navigation/native';
import {MainContext} from '../../../App';
import ErrMessage from '../../components/errMessage/errMessage';

const AmassCenter = React.lazy(() => import('./amassCenter'));
const EventAmassCenter = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [userAmass, setUserAmass] = useState(null);
  const [otherAmass, setOtherAmass] = useState([]);

  const getAmassDetails = async () => {
    setLoading(true);
    console.log(`${CTX.systemConfig?.am}user/get/administrators/amass/center`);
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.am}user/get/administrators/amass/center`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      if (parsedJson?.error) {
        setErrMsg(parsedJson?.msg);
        setShowMsg(true);
        return;
      }
      setLoading(false);
      setUserAmass(parsedJson.data?.userData);
      setOtherAmass(parsedJson.data?.others);
      //   setMainData(parsedJson.data?.data);
      //   setUsers(parsedJson.data?.users);
      //   setIsUserJoined(parsedJson.data?.isUserJoined);
      //   setMemberShipDetails(parsedJson.data?.memberShipDetails);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
      getAmassDetails();
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
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}

      <Suspense fallback={null}>
        <AmassCenter
          onRefreshOthers={getAmassDetails}
          showMsg={showMsg}
          errMsg={errMsg}
          loading={loading}
          userAmass={userAmass}
          otherAmass={otherAmass}
          item={userAmass}
        />
      </Suspense>
    </>
  );
};

export default EventAmassCenter;
