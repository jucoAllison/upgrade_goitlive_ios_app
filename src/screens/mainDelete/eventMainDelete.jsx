import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useWebSocket} from '../../../WebSocketContext';
import MainDelete from './mainDelete';
import RecoverDelete from './recoverDelete';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
const EventMainDelete = () => {
  const {latestMessage, connectionStatus} = useWebSocket();
  const [profileDetails, setProfileDetails] = useState(null);

  useEffect(() => {
    // getUserDetails();
    // setProfileDetails(profileData);
    if (latestMessage) {
      setProfileDetails(latestMessage);
    }
  }, [latestMessage]);

  return (
    <DismissKeyboardWrapper>
      {profileDetails?.is_deleting_account ? <RecoverDelete profileDetails={profileDetails} /> : <MainDelete />}
      {/* <MainDelete /> */}
    </DismissKeyboardWrapper>
  );
};

export default EventMainDelete;
