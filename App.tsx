// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <NewAppScreen
//         templateFileName="App.tsx"
//         safeAreaInsets={safeAreaInsets}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;

import SocketIOClient from 'socket.io-client';
import { View, Text, useColorScheme } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebSocketContext } from './WebSocketContext'; // adjust path as needed
import { AgoraEngineProvider } from './AgoraEngineContext';
import PostVideoCTX from './postVideoCTX';
import Fallback from './src/components/fallback/fallback';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const url = 'https://api.goitlive.com/api/v3/';
  const webSocketURL = 'wss://api.goitlive.com';
  const mainUrl = 'https://api.goitlive.com/';

  // const url = 'http://172.20.10.4:5017/api/v3/';
  // const webSocketURL = 'ws://172.20.10.4:5017';
  // const mainUrl = 'http://172.20.10.4:5017/';

  const [socketObj, setSocketObj] = useState(null);
  const [token, setToken] = useState(null);
  const [userObj, setUserObj] = useState({ username: '' });
  const [statusBarColor, setStatusBarColor] = useState('#fff');
  const [systemConfig, setSystemConfig] = useState(null);
  const [isUpgrade, setIsUpgrade] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  const [privateReceivingCaller, setPrivateReceivingCaller] = useState(null);
  const [loginSession, setLoginSession] = useState(null);
  const navigation = useNavigation();
  const ws = useRef(null);
  // chat list for listing chat
  const [chat_list, setChat_list] = useState(null);
  // each chat details here!
  const [chatDetails, setChatDetails] = useState(null);
  const [chatMessage, setChatMessage] = useState(null);
  const [load_more_msg, setLoad_more_msg] = useState(false);
  const [load_more, setLoad_more] = useState(true);
  const [typing, setTyping] = useState([]);
  const [deletedMessages, setDeletedMessages] = useState([]);

  const setSessionTokenHandler = async _payload => {
    setSessionToken(_payload);
  };

  // first request  fetched with system configurations inside it
  const systemConfigHandler = _payload => {
    setSystemConfig(_payload);
    1;
  };

  const setTokenHandler = useCallback(_payload => {
    setToken(_payload);
  }, []);

  const setUserObjHandler = async _payload => {
    try {
      if (_payload) {
        // console.log('_payload from setUserObjHandler ==>>  ', _payload);
        const spreadArr = [..._payload?.status];
        const latestStatus =
          spreadArr?.length > 0 ? [spreadArr[spreadArr?.length - 1]] : [];

        const rechecked = { ..._payload, status: [...latestStatus] };

        // console.log('rechecked HERE!! ==>>> ', rechecked);

        setUserObj(rechecked);
        // await AsyncStorage.setItem('@userObj', JSON.stringify(rechecked));
      }
    } catch (error) {
      console.log('error from setUserObjHandler in APP ==>>  ', error);
    }
  };

  const logoutUserHandler = async () => {
    try {
      console.log('logoutUseHandler was called HERE!! =>> ', Math.random());
      console.log('logoutUseHandler was called HERE!! =>> ', Math.random());
      console.log('logoutUseHandler was called HERE!! =>> ', Math.random());
      console.log('logoutUseHandler was called HERE!! =>> ', Math.random());
      console.log('logoutUseHandler was called HERE!! =>> ', Math.random());
      console.log('logoutUseHandler was called HERE!! =>> ', Math.random());
      console.log('logoutUseHandler was called HERE!! =>> ', Math.random());
      setSocketObj(null);
      setSessionToken(null);
      // setUserObjHandler(null);
      setUserObj({});
      setToken(null);
      // setIsUnderMaintenance(false);
      await AsyncStorage.removeItem('@amassSuggestionsWarn');
      await AsyncStorage.removeItem('@abundanceWarn');
      await AsyncStorage.removeItem('@sessionToken');
      await AsyncStorage.removeItem('@fcmToken');
      await AsyncStorage.removeItem('@searchedItem');
      await AsyncStorage.removeItem('@statusWarn');
      await AsyncStorage.removeItem('@userObj');

      await navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Splash',
          },
        ],
      });

      // const deviceName = await DeviceInfo.getDeviceName();
    } catch (error) {
      console.log('logoutUserHandler ERROR =>', error);
    }
  };

  const getUserDetails = async () => {
    try {
      const fetchUser = await fetch(`${url}account/profile/get/details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      const jsoned = await fetchUser?.json();

      if (jsoned?.m == 'invalid user in session') {
        logoutUserHandler();
        return;
      }

      setUserObj(jsoned?.data);
    } catch (error) {
      // toast("network connection error");
      console.log('error from APP useEffect =>> ', error);
    }
  };

  useEffect(() => {
    if (!sessionToken) {
      return console.log('no sessionToken from APP.JS');
    }
    getUserDetails();

    const socket = SocketIOClient.connect(mainUrl, {
      query: { token: sessionToken },
    });

    socket.on('connect', () => {
      console.log('connected');
      setSocketObj(socket);

      socket.emit('join-room', userObj._id);
    });

    socket.on('connect_error', err => {
      console.log('socket.on here => ', err);
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      if (socket?.connected) {
        socket.close();
      }
    };
  }, [sessionToken]);

  return (
    <MainContext.Provider
      value={{
        isDarkMode,
        url,
        webSocketURL,
        sessionToken,
        setSessionToken: setSessionTokenHandler,
        socketObj,
        token,
        setToken: setTokenHandler,
        userObj,
        setUserObjHandler: setUserObjHandler,
        setUserObj,
        statusBarColor,
        setStatusBarColor,
        logoutUser: logoutUserHandler,
        systemConfig,
        systemConfigHandler,
        setIsUpgrade,
        isUpgrade,
        loginSession,
        setLoginSession,
        chatDetails,
        chat_list,
        chatMessage,
        setChatDetails,
        setChat_list,
        setChatMessage,
        load_more_msg,
        setLoad_more_msg,
        load_more,
        setLoad_more,
        typing,
        setTyping,
        deletedMessages,
        setDeletedMessages,
      }}
    >
      <WebSocketContext
        sessionToken={sessionToken}
        webSocketURL={webSocketURL}
        logoutHandler={logoutUserHandler}
        userObj={userObj}
      >
        <AgoraEngineProvider>
          {/* <Text style={{ color: 'red' }}>ABCDEFGHIJKLNMOP</Text>
        <Text style={{ color: 'red' }}>ABCDEFGHIJKLNMOP</Text>
        <Text style={{ color: 'red' }}>ABCDEFGHIJKLNMOP</Text>
        <Text style={{ color: 'red' }}>ABCDEFGHIJKLNMOP</Text>
        <Text style={{ color: 'red' }}>ABCDEFGHIJKLNMOP</Text>
        <Text style={{ color: 'red' }}>ABCDEFGHIJKLNMOP</Text>
        <Text style={{ color: 'red' }}>ABCDEFGHIJKLNMOP</Text> */}

          <PostVideoCTX />
        </AgoraEngineProvider>
      </WebSocketContext>
    </MainContext.Provider>
  );
};

export default App;

export const MainContext = React.createContext({
  isDarkMode: null,
  url: null,
  webSocketURL: null,
  sessionToken: null,
  setSessionToken: () => {},
  chat_list: null,
  setChat_list: () => {},
  chatDetails: null,
  setChatDetails: () => {},
  chatMessage: null,
  setChatMessage: () => {},
  load_more_msg: null,
  setLoad_more_msg: () => {},
  load_more: null,
  setLoad_more: () => {},
  typing: null,
  setTyping: () => {},
  deletedMessages: null,
  setDeletedMessages: () => {},
  userObj: null,
  socketObj: null,
  setUserObj: null,
  logoutUser: () => {},
  setUserObjHandler: () => {},
  token: null,
  setToken: () => {},
  setIsUpgrade: () => {},
  isUpgrade: null,
  systemConfig: null,
  systemConfigHandler: () => {},
  isUnderMaintenance: null,
  setIsUnderMaintenance: () => {},
  appVersion: null,
  statusBarColor: null,
  setStatusBarColor: () => {},
  loginSession: null,
  setLoginSession: () => {},
});

// node --max-old-space-size=8192 node_modules/react-native/cli.js start --reset-cache
// node --max-old-space-size=8192 node_modules/react-native/cli.js start --reset-cache
// node --max-old-space-size=8192 node_modules/react-native/cli.js start --reset-cache
// node --max-old-space-size=8192 node_modules/react-native/cli.js start --reset-cache

// backgroundColor: '#e20154',
// fontFamily: 'Gilroy-Bold',

// parent communication
// finances
// staffing
// registration
// medication
