import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import React, { Suspense, useContext, useState } from 'react';
import EventProfileTop from '../../components/profileTop/eventProfileTop';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MainContext } from '../../../App';

const UserProfiles = ({ userObj, getUserDetails, loading }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState({ ran: Math.random() });
  const isFocused = useIsFocused();
  const navigator = useNavigation();
  const CTX = useContext(MainContext);

  const onRefresh = () => {
    getUserDetails();
    setShouldRefresh({ ran: Math.random() });
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{
        backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
      }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />

      {userObj?._id?.length > 0 && (
        <View>
          <EventProfileTop
            profileDetails={userObj}
            connectionStatus={loading ? 'disconnected' : 'connected'}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default UserProfiles;
