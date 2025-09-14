import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { View, Text } from 'react-native';
import ErrMessage from './src/components/errMessage/errMessage';
import { useNavigation } from '@react-navigation/native';
import { MainContext } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WSContext = React.createContext({
  sendMessage: () => {},
  ws: null,
  connectionStatus: null,
  latestMessage: null,
});

export const useWebSocket = () => {
  const context = useContext(WSContext);
  if (!context)
    throw new Error('useWebSocket must be used within WebSocketProvider');
  return context;
};

export const WebSocketContext = ({
  sessionToken,
  webSocketURL,
  children,
  logoutHandler,
  userObj,
}) => {
  const CTX = useContext(MainContext);
  const ws = useRef(null);
  const [latestMessage, setLatestMessage] = useState(null);
  //   'connecting' | 'connected' | 'disconnected'
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [errMsg, setErrMsg] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const navigate = useNavigation();

  // send money here!
  const sendMessage = (message: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      setErrMsg('Internet required');
      setShowMsg(true);
      console.log('WebSocket is not open.');
    }
  };

  const connectSocket = () => {
    if (connectionStatus == 'connected') return;

    ws.current = new WebSocket(webSocketURL);

    ws.current.onopen = () => {
      console.log('WebSocket connected ✅');
      setConnectionStatus('connected');

      // Initial message
      ws.current?.send(
        JSON.stringify({
          action: 'getuserdetails',
          token: sessionToken,
        }),
      );
    };

    // Add binary type to handle different message types
    ws.current.binaryType = 'arraybuffer';

    ws.current.onmessage = async event => {
      try {
        // console.log('onmessage HERE!! =>>> ', event);

        const data = JSON.parse(event.data);

        // check if its logout time
        if (data?.error) {
          console.log('WebSocket closed ❌, reconnecting...');
          ws.current?.close();
          setConnectionStatus('disconnected');
          logoutHandler();
          return;
        }

        // update user information!
        if (data?.type === 'USER_INFORMATION') {
          console.log("USER_INFORMATION");
          
          setLatestMessage(data.data);
          CTX.setUserObj(data.data);
          return;
        }

        // update chat list information! for chat list data
        if (data.action == 'list_chat') {
          // console.log("SHOULD EAT! SHOULD EAT!! SHOULD EAT!!!");
          await AsyncStorage.setItem('@list_chat', JSON.stringify(data?.data));
          CTX.setChat_list(data?.data);
          return;
        }

        if (data.action == 'initial_chat') {
          // console.log("'initial_chat' =>>> ", Math.random(), data?.data?.messages?.length);

          CTX.setChatDetails(data?.data?.chat);
          CTX.setChatMessage(data?.data?.messages);
          await AsyncStorage.setItem(
            '@chat_message',
            JSON.stringify(data?.data?.messages),
          );
          return;
        }

        if (data.action == 'new_chat') {
          CTX.setChatDetails(data?.data?.chat);
          await AsyncStorage.setItem(
            '@chat_message',
            JSON.stringify(data?.data?.messages),
          );
          CTX.setChatMessage(data?.data?.messages);

          sendMessage({
            action: 'eachchatwebsocket',
            token: sessionToken,
            payload: {
              action: 'join_room',
              chat_id: data?.data?.chat?._id,
              my_id: userObj?._id,
            },
          });
          return;
        }

        if (data.action == 'each_chat_error') {
          navigate.navigate('Navigation', {
            screen: 'Chats',
          });
          return;
        }

        if (data.action == 'new_message') {
          const old_msg = await AsyncStorage.getItem('@chat_message');

          const spread_old = old_msg ? [...JSON.parse(old_msg)] : [];

          CTX?.setLoad_more_msg(false);

          const spread_new_message = [data?.data, ...spread_old];

          await AsyncStorage.setItem(
            '@chat_message',
            JSON.stringify(spread_new_message),
          );

          // CTX.setChatMessage(prev => [data?.data, ...prev]);
          CTX.setChatMessage(spread_new_message);
          return;
        }

        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ', data);
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');
        // console.log('JUST data  =>>> ');

        if (data?.type === 'CHAT_LIST_UPDATE') {
          // console.log('data.data from CHAT_LIST_UPDATE =>>> ', data.data);

          // console.log('data.data =>> ', data.data?.userDetails);
          const listing = await AsyncStorage.getItem('@list_chat');

          const parse_lis = JSON.parse(listing);

          const spread = [...parse_lis];

          const findindex = spread.findIndex(
            chat => chat._id === data.data._id,
          );

          if (findindex !== -1) {
            const settin = spread.filter(chat => chat._id !== data.data._id);

            settin.unshift(data?.data);

            // console.log(
            //   'REMOVED and replaced HERE!!! =>>> ',
            //   settin.length,
            //   Math.random(),
            // );

            await AsyncStorage.setItem('@list_chat', JSON.stringify(settin));

            // Remove old version and add updated version to top
            CTX.setChat_list(settin);
            return;
          } else {
            // New chat → insert at top
            CTX.setChat_list([data.data, ...spread]);
            return;
          }
        }

        if (data?.action === 'load_more_messages') {
          // get old messages from async storage

          if (data.data.length < 1) {
            CTX?.setLoad_more_msg(false);
            CTX.setLoad_more(false);
            return;
          }

          const from_async = await AsyncStorage.getItem('@chat_message');

          // const spreading_msg = CTX.chatMessage
          //   ? [...CTX.chatMessage, ...data.data]
          //   : [...data.data];

          const spreading_msg = [...JSON.parse(from_async), ...data.data];

          await AsyncStorage.setItem(
            '@chat_message',
            JSON.stringify(spreading_msg),
          );

          CTX.setChatMessage(spreading_msg);
          CTX?.setLoad_more_msg(false);

          return;
        }

        if (data?.type === 'read_receipt') {
          const { chat_id, read } = data.data;

          const spread_chat_list = await AsyncStorage.getItem('@list_chat');

          const parse_lis = JSON.parse(spread_chat_list);

          const spread = [...parse_lis];

          const mapped = spread.map((v, i) =>
            v._id === chat_id
              ? { ...v, unreadCount: parseFloat(v.unreadCount - read) }
              : v,
          );
          await AsyncStorage.setItem('@list_chat', JSON.stringify(mapped));

          // Remove old version and add updated version to top
          CTX.setChat_list(mapped);

          return;
        }

        if (data?.type === 'user_typing') {
          const { chat_id, user } = data.data;

          // check if the data.data is already there so it won't call
          const spread_typing_list = await AsyncStorage.getItem('@typing');
          const parse_lis = spread_typing_list
            ? JSON.parse(spread_typing_list)
            : [];
          const spread_typing = [...CTX.typing];
          const filtered = spread_typing.filter(
            r => r.chat_id === chat_id && r.user === user,
          );
          // console.log("filtered =>> ", filtered.length);

          if (filtered.length < 1) {
            const calculation = prev => {
              if (prev.some(w => w.chat_id === chat_id && w.user === user)) {
                return prev; // duplicate found
              }
              return [...prev, { chat_id, user }];
            };

            CTX.setTyping(prev => {
              const updated = calculation(prev);

              // store in AsyncStorage
              AsyncStorage.setItem('@typing', JSON.stringify(updated));
              return updated;
            });

            // auto remove after 5s if no "stop typing" comes
            setTimeout(() => {
              // const calcTimeout = prev => {
              //   prev.filter(w => !(w.chat_id === chat_id && w.user === user));

              //   return prev;
              // };
              // CTX.setTyping(prev => {
              //   const updated = calcTimeout(prev);
              //   AsyncStorage.setItem('@typing', JSON.stringify(updated));

              //   console.log('updated =>> ', updated);
              //   // prev.filter(w => !(w.chat_id === chat_id && w.user === user)),
              //   return updated;
              // });

              const fill = spread_typing.filter(
                w => !(w.chat_id === chat_id && w.user === user),
              );

              // console.log("fill =>> ", fill);

              CTX.setTyping(fill);

              AsyncStorage.setItem('@typing', JSON.stringify(fill));
            }, 3500);
          }

          return;
        }
        if (data?.type === 'delete_message') {
          const spread_typing_list = await AsyncStorage.getItem(
            '@deletedMessages',
          );
          const parse_lis = spread_typing_list
            ? JSON.parse(spread_typing_list)
            : [];
          const revapped = [...parse_lis, ...data.data];

          console.log('parse_lis from websocketcontext =>>>> ', revapped);

          CTX.setDeletedMessages(revapped);
          AsyncStorage.setItem('@deletedMessages', JSON.stringify(revapped));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error, event.data);
      }
    };

    ws.current.onclose = () => {
      ws.current?.close();
      console.log('WebSocket closed ❌, reconnecting...');
      setConnectionStatus('disconnected');
      setTimeout(connectSocket, 4000); // Reconnect after delay
    };

    ws.current.onerror = err => {
      console.log('WebSocket error 🚨:', err);
    };
  };

  useEffect(() => {
    if (sessionToken) {
      console.log('connectSocket FROM WS', sessionToken.length);
      console.log('Connecting socket with token length:');

      connectSocket();
      // } else {
      //   setConnectionStatus('disconnected');
      //   if (ws.current) {
      //     ws.current.close();
      //     ws.current = null;
      //   }
      //   return console.log('no sessionToken FROM WS');
    }
    // Connect once when app starts
    // console.log('CONNECTION FROM FROM WS')

    return () => {
      ws.current?.close();
    };
  }, [sessionToken]);

  return (
    <>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}
      <WSContext.Provider
        value={{ sendMessage, connectionStatus, latestMessage, ws }}
      >
        {children}
      </WSContext.Provider>
    </>
  );
};

// export default WebSocketContext
