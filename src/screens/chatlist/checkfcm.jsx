import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useWebSocket } from '../../../WebSocketContext';
import { MainContext } from '../../../App';

const Checkfcm = () => {
  const isFocused = useIsFocused();
  const { connectionStatus, sendMessage } = useWebSocket();
  const CTX = useContext(MainContext);
  const [showPEr, setShowPEr] = useState(true);

  const getFCMToken = async () => {
    const getToken = await AsyncStorage.getItem('@fcmToken');

    if (getToken != CTX.userObj?.fcmToken) {
      try {
        // reset fcmTokenHERE
        const fetching = await fetch(
          `${CTX.url}account/profile/user/set/token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${CTX.sessionToken}`,
            },
            body: JSON.stringify({
              fcmToken: getToken,
            }),
          },
        );
        const parsedJson = await fetching.json();
        sendMessage({
          action: 'rebringuserdetails',
          token: CTX.sessionToken,
        });
      } catch (error) {
        console.log('error posting fctoken data for session! => ', error);
      }
    }

    // console.log('CTX.userObj?.fcmToken => ', CTX.userObj?.fcmToken);
  };

  // iOS-specific: Request notification permissions
  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      return enabled;
    }
    return true; // For iOS-only app, always true for other platforms
  };

  // Initialize notification setup
  const initializeNotifications = async () => {
    try {
      const hasPermission = await requestUserPermission();
      if (hasPermission) {
        await getFCMToken();
      } else {
        setShowPEr(false);
      }
    } catch (error) {
      console.log('❌ Error initializing notifications:', error);
    }
  };

  useEffect(() => {
    initializeNotifications();
  }, [isFocused, connectionStatus]);

  const allowHere = async () => {
    try {
      Linking.openSettings(); // Opens the app's settings page
    } catch (error) {
      console.log('error from allowHere =>>> ', error);
    }
  };

  return (
    <>
      {!showPEr && (
        <View>
          <Text
            style={{
              ...styles.username,
              color: CTX.isDarkMode ? '#fff' : '#000',
              marginTop: 44,
            }}
          >
            Permission
          </Text>
          <Text
            style={{
              ...styles.username,
              fontFamily: 'Gilroy-Medium',
              marginTop: 17,
              fontSize: 15,
              color: CTX.isDarkMode ? '#aaa' : '#333',
            }}
          >
            Notifications are currently disabled. To stay updated, please enable
            them in Settings.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => allowHere()}
            style={{ paddingTop: 40, width: '100%' }}
          >
            <View style={styles.eachBtnCover}>
              <Text style={styles.eachBtnText}>Allow</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default Checkfcm;

const styles = StyleSheet.create({
  eachImg: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },

  dateText: {
    position: 'absolute',
    top: 8,
    fontFamily: 'Gilroy-Regular',
    right: 6,
    color: '#9f9f9f',
  },

  coverStatusRound: {
    marginRight: 13,
    padding: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderBottomColor: '#e20154',
    borderBottomEndRadius: 30,
    borderRightColor: '#e20154',
  },
  coverNot: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 4,
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    marginTop: 2,
  },
  eachBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  eachBtnCover: {
    backgroundColor: '#e20154',
    paddingHorizontal: 20,
    borderRadius: 60,
    height: 47,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  username: {
    fontSize: 26,
    fontFamily: 'Gilroy-Bold',
  },
});
