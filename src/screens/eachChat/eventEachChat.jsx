import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Alert,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import calling from '../../assets/sounds/notification.mp3';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MainContext} from '../../../App';
import {useRoute, useIsFocused, useNavigation} from '@react-navigation/core';
import Fallback from '../../components/fallback/fallback';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
import {useFocusEffect} from '@react-navigation/native';
import {useWebSocket} from '../../../WebSocketContext';
import ErrMessage from '../../components/errMessage/errMessage';

const EachChat = React.lazy(() => import('./eachChat'));

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback', true);

const EventEachChat = () => {
  // const sound = new Sound(
  //   // 'https://res.cloudinary.com/damrxxkrp/video/upload/v1696845368/calling_db5wny.mp3',
  //   calling,
  //   Sound.MAIN_BUNDLE,
  //   async error => {
  //     if (error) {
  //       console.log('Failed to load the sound', error);
  //     } else {
  //       console.log('Sound loaded successfully.');
  //     }
  //   },
  // );
  const [content, setContent] = useState('');
  const CTX = useContext(MainContext);
  const route = useRoute();
  const navigation = useNavigation();
  const {_id} = route.params;
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [dataDetails, setDataDetails] = useState({});
  const [chatId, setChatId] = useState(null);
  const [replying, setReplying] = useState(null);
  const textInputRef = useRef();
  const [selectedArr, setSelectedArr] = useState([]);
  const isFocused = useIsFocused();
  const [blobUri, setBlobUri] = useState(null);
  const replyTo = ({content, username, _id}) => {
    setReplying({content, username, _id});
    textInputRef.current.focus();
  };
  const {connectionStatus, sendMessage, ws} = useWebSocket();
  const intervalRef = useRef(null);

  const sound = new Sound(
    // 'https://res.cloudinary.com/damrxxkrp/video/upload/v1696845368/calling_db5wny.mp3',
    'notification.mp3',
    Sound.MAIN_BUNDLE,
    async error => {
      if (error) {
        console.log('Failed to load the sound', error);
      } else {
        console.log('Sound loaded successfully.');
      }
    },
  );


// console.log('Sound file:', calling);
// console.log('Type:',  require('../../assets/sounds/notification.mp3'));
// console.log('Is string?', typeof calling === 'string');


  // const sound = new Sound(
  //   calling, // The path to the sound file (local or URL)
  //   '', // The source of the sound (local bundle or remote)
  //   error => {
  //     // Error callback
  //     if (error) {
  //       console.log('Failed to load the sound', error);
  //     } else {
  //       console.log('Sound loaded successfully.');
  //     }
  //   },
  // );

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  // console.log('replying hafa ==>> ', replying);
  const setMessageHere = async () => {
    if (loading) {
      return null;
    }
    setLoading(true);
    try {
      const msgId = Math.random().toString().split('.')[1];
      const fetching = await fetch(`${CTX.url}user/chat/new-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
        body: JSON.stringify({
          users: _id,
          msg_id: msgId,
          content: content?.trim(),
          base64: blobUri ? blobUri : null,
          readBy: [CTX?.userObj?._id],

          //   createdAt: new Date().toISOString(),
          //   user: {
          //     _id: CTX?.userObj?._id,
          //     username: CTX?.userObj?.username,
          //   },
        }),
      });
      const parsedJson = await fetching.json();
      setLoading(false);
      // if (parsedJson?.isRemoved) {
      //   return CTX.logoutUser();
      // }
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setDataDetails(parsedJson.data);
      setChatId(parsedJson.data?._id);
      setContent('');
      setBlobUri('');
    } catch (error) {
      setLoading(false);
      console.log('error creating first messages => ', error);
      setErrMsg('Network request failed');
      createThreeButtonAlert('Network request failed');
      setShowMsg(true);
    }
  };

  // const playSound = () => {
  //   try {
  //     sound?.play(success => {
  //       if (success) {
  //         console.log('Sound played successfully ==>> ', success);
  //       } else {
  //         console.log('Sound playback failed ===>>> ', sound);
  //       }
  //     });
  //     console.log('Sound played successfully');
  //   } catch (error) {
  //     console.log('Error playing sound:', error);
  //   }
  // };

  const playSound = () => {
    try {
      sound.play(success => {
        if (success) {
          console.log('Sound played successfully ==>> ', success);
        } else {
          console.log('Sound playback failed ===>>> ');
        }
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const emitMsgToSocket = async write_up => {
    // sound?.play(success => {
    //   if (success) {
    //     console.log('Sound played successfully ==>> ', success);
    //   } else {
    //     console.log('Sound playback failed ===>>> ', sound);
    //   }
    // });
    if (CTX?.load_more_msg) return;
    setLoading(true);
    setContent('');

    playSound();

    try {
      // const replyingObj = replying && {
      //   replyTo: replying.username,
      //   msg: replying.content,
      //   replyId: replying._id,
      // };
      setLoading(true);

      const msgObj = {
        replyingTo: replying ? replying._id : null,
        base64: blobUri ? blobUri : null,
        createdAt: new Date().toISOString(),
        content: write_up,
        isDeleted: false,
        isDeletedFromMe: false,
        user: CTX?.userObj?._id,
        otherUser: route.params?._id,
        myUsername: CTX?.userObj?.username,
        readBy: [CTX?.userObj?._id],
      };

      // const spreadMsg = chatMessage ? [...chatMessage] : [];
      // spreadMsg.unshift(msgObj);
      // setChatMessage(spreadMsg);

      // ws.current.send(
      //   JSON.stringify({
      //     action: 'eachchatwebsocket',
      //     token: CTX.sessionToken,
      //     payload: {
      //       action: 'send_message',
      //       other_user_id: route.params?._id,
      //       my_id: CTX.userObj?._id,
      //       chat_id: chatDetails?._id,
      //       obj: msgObj,
      //     },
      //   }),
      // );

      sendMessage({
        action: 'eachchatwebsocket',
        token: CTX.sessionToken,
        payload: {
          action: 'send_message',
          other_user_id: route.params?._id,
          my_id: CTX.userObj?._id,
          chat_id: CTX.chatDetails?._id,
          obj: msgObj,
        },
      });

      setContent('');
      setReplying(null);
      setBlobUri('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error from emitMsgToSocket function => ', error);
    }
  };

  const readMessage = async _id => {
    try {
      const fetching = await fetch(
        `${CTX.url}user/chat/read-message/${_id ? _id : null}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      // if (parsedJson?.isRemoved) {
      //   return CTX.logoutUser();
      // }
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      // console.log('parsedJson.data => ', parsedJson.data);
    } catch (error) {
      setLoading(false);
      console.log('error creating first messages => ', error);
      createThreeButtonAlert('Network request failed for readMessage');
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  const addMessageToConversation = ({msgID, msgObj}) => {
    setDataDetails({...dataDetails, messages: msgObj});
    readMessage(chatId);
  };

  const getChatDetails = async userId => {
    if (loading) {
      return null;
    }

    setLoadingMsg(true);
    try {
      const fetching = await fetch(
        `${CTX.url}user/chat/get/message/details/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      //   if (parsedJson?.isRemoved) {
      //     return CTX.logoutUser();
      //   }
      setLoadingMsg(false);
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      if (parsedJson.data?.data?._id) {
        CTX.socketObj?.emit('join-room', parsedJson.data?.data?._id);
      }
      setChatId(parsedJson.data?._id);
      readMessage(parsedJson.data?._id);
      setDataDetails(parsedJson.data);
    } catch (error) {
      setLoadingMsg(false);
      console.log('error verifying create account => ', error);
      createThreeButtonAlert('Network request failed');
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  const stopSound = async () => {
    console.log('stopSound ==>>');
    // onPlaySubscription.remove
    await sound.stop(success => {
      if (success) {
        console.log('Sound played successfully ==>> ', success);
      } else {
        console.log('Sound playback failed ===>>> ');
      }
    });
  };

  //   const fetchMoreMessages = () => {
  //   if (chatMessages.length === 0) return;

  //   const oldest = chatMessages[0]; // first item in FlatList
  //   ws.current.send(JSON.stringify({
  //     action: "fetchMessages",
  //     token: CTX.sessionToken,
  //     payload: {
  //       chat_id: chatDetails?._id,
  //       limit: 30,
  //       before: oldest.createdAt,
  //     }
  //   }));
  // };

  // // First load of chat data
  // if (receivedData.action === "chatInit") {
  //   setChatDetails(receivedData?.data?.chat);
  //   setChatMessage(receivedData?.data?.messages);
  // }

  // // Pagination (older messages)
  // if (receivedData.action === "messagesFetched") {
  //   setChatMessage(prev => [...receivedData.data, ...prev]);
  // }

  // <FlatList
  //   data={chatMessages}
  //   inverted
  //   onEndReached={() => {
  //     if (!loadingMore) {
  //       fetchMoreMessages();
  //     }
  //   }}
  //   onEndReachedThreshold={0.1} // triggers when close to top
  //   renderItem={renderMessage}
  // />

  // BACKEND
  // BACKEND
  // BACKEND
  // if (action === "fetchMessages") {
  //   const { chat_id, limit = 30, before } = payload;

  //   const filter = { chat: chat_id };
  //   if (before) filter.createdAt = { $lt: new Date(before) };

  //   const messages = await DB.MESSAGE.find(filter)
  //     .populate("user", "username email full_name")
  //     .sort({ createdAt: -1 }) // newest first
  //     .limit(limit);

  //   ws.send(JSON.stringify({
  //     action: "messages",
  //     data: messages.reverse(), // reverse so UI can append to top
  //   }));
  // }

  // const connectSocketHere = () => {
  //   if (connectionStatus === 'connected') return;

  //   try {
  //     ws.current = new WebSocket(CTX.webSocketURL);

  //     ws.current.onopen = () => {
  //       setConnectionStatus('connected');
  //       ws.current.send(
  //         JSON.stringify({
  //           action: 'eachchatwebsocket',
  //           token: CTX.sessionToken,
  //           payload: {
  //             action: 'initial_chat',
  //             my_id: CTX.userObj?._id,
  //             other_user_id: route.params?._id,
  //             chat_id: chatDetails?._id,
  //           },
  //         }),
  //       );
  //     };

  //     ws.current.onmessage = async event => {
  //       const receivedData = JSON.parse(event.data);

  //       if (receivedData.error) {
  //         navigation.goBack();
  //         return;
  //       }

  //       if (receivedData.action == 'initial_chat') {
  //         setChatDetails(receivedData?.data?.chat);
  //         setChatMessage(receivedData?.data?.messages);
  //         return;
  //       }

  //       if (receivedData.action == 'new_chat') {
  //         setChatDetails(receivedData?.data?.chat);
  //         setChatMessage(receivedData?.data?.messages);

  //         // now join the room
  //         console.log('now join the room', receivedData?.data);

  //         ws.current.send(
  //           JSON.stringify({
  //             action: 'eachchatwebsocket',
  //             token: CTX.sessionToken,
  //             payload: {
  //               action: 'join_room',
  //               chat_id: receivedData?.data?.chat?._id,
  //               my_id: CTX.userObj?._id,
  //             },
  //           }),
  //         );
  //         return;
  //       }

  //       if (receivedData.action == 'new_message') {
  //         const spread = chatMessage ? [...chatMessage] : [];
  //         setChatMessage(prev => [receivedData?.data, ...prev]);
  //         return;
  //       }
  //     };

  //     ws.current.onclose = () => {
  //       console.log('chat closed ❌');
  //       setConnectionStatus('disconnected');
  //     };

  //     ws.current.onerror = err => {
  //       console.log('chat ws error 🚨:', err);
  //       setConnectionStatus('disconnected');
  //     };
  //   } catch (error) {
  //     console.log('connectSocketHere ERROR =>> ', error);
  //   }
  // };

  // const connectSocketHere = (isReconnect = false) => {
  //   if (ws.current && ws.current.readyState === WebSocket.OPEN) {
  //     console.log('Already connected ✅');
  //     return;
  //   }

  //   try {
  //     ws.current = new WebSocket(CTX.webSocketURL);

  //     ws.current.onopen = () => {
  //       setConnectionStatus('connected');

  //       if (isReconnect) {
  //         console.log('Reconnected without sending initial_chat 🚀');
  //         // only rejoin the room, since we already have chatDetails
  //         if (chatDetails?._id) {
  //           ws.current.send(
  //             JSON.stringify({
  //               action: 'eachchatwebsocket',
  //               token: CTX.sessionToken,
  //               payload: {
  //                 action: 'join_room',
  //                 chat_id: chatDetails._id,
  //                 my_id: CTX.userObj?._id,
  //               },
  //             }),
  //           );
  //         }
  //       } else {
  //         console.log('First connect, sending initial_chat 🚀');
  // ws.current.send(
  //   JSON.stringify({
  //     action: 'eachchatwebsocket',
  //     token: CTX.sessionToken,
  //     payload: {
  //       action: 'initial_chat',
  //       my_id: CTX.userObj?._id,
  //       other_user_id: route.params?._id,
  //       chat_id: chatDetails?._id,
  //     },
  //   }),
  // );
  //       }
  //     };

  // ws.current.onmessage = async event => {
  //   const receivedData = JSON.parse(event.data);

  //   if (receivedData.error) {
  //     navigation.goBack();
  //     return;
  //   }

  //   if (receivedData.action == 'initial_chat') {
  //     setChatDetails(receivedData?.data?.chat);
  //     setChatMessage(receivedData?.data?.messages);
  //     return;
  //   }

  //   if (receivedData.action == 'new_chat') {
  //     setChatDetails(receivedData?.data?.chat);
  //     setChatMessage(receivedData?.data?.messages);

  //     ws.current.send(
  //       JSON.stringify({
  //         action: 'eachchatwebsocket',
  //         token: CTX.sessionToken,
  //         payload: {
  //           action: 'join_room',
  //           chat_id: receivedData?.data?.chat?._id,
  //           my_id: CTX.userObj?._id,
  //         },
  //       }),
  //     );
  //     return;
  //   }

  //   if (receivedData.action == 'new_message') {
  //     setChatMessage(prev => [receivedData?.data, ...prev]);
  //     return;
  //   }
  // };

  //     ws.current.onclose = () => {
  //       console.log('chat closed ❌');
  //       setConnectionStatus('disconnected');

  //       // try reconnecting automatically
  //       setTimeout(() => {
  //         console.log('Attempting reconnect...');
  //         connectSocketHere(true); // pass true for reconnect
  //       }, 2000); // retry after 2s (tweak as needed)
  //     };

  //     ws.current.onerror = err => {
  //       console.log('chat ws error 🚨:', err);
  //       setConnectionStatus('disconnected');
  //     };
  //   } catch (error) {
  //     console.log('connectSocketHere ERROR =>> ', error);
  //   }
  // };

  const connectSocketHere = () => {
    if (!ws.current) return console.log('CHECK UR INTERNET CONNECTION!!');

    // console.log("CTX.userObj?._id ===>>>> ", CTX.userObj);

    sendMessage({
      action: 'eachchatwebsocket',
      token: CTX.sessionToken,
      payload: {
        action: 'initial_chat',
        my_id: CTX.userObj?._id,
        other_user_id: route.params?._id,
        chat_id: null,
      },
    });
  };

  // const disconnectSocketHere = () => {
  //   if (ws.current) {
  //     //   ws.current.send(
  //     //   JSON.stringify({
  //     //           action: 'eachchatwebsocket',
  //     //           token: CTX.sessionToken,
  //     //           payload: {
  //     //             action: 'leave_room',
  //     //             chatId: chatDetails?._id, userId: CTX.userObj?._id
  //     //           },
  //     //         }),
  //     // );

  //     ws.current.close();
  //     ws.current = null;
  //     setConnectionStatus('disconnected');
  //   }
  // };

  // console.log("chatMessage =>>> ", chatMessage);
  // console.log("chatDetails =>>> ", chatDetails);

  // Automatically connect/disconnect when screen focus changes
  // useFocusEffect(
  //   useCallback(() => {
  //     if (connectionStatus == 'connected') {
  //       console.log('Screen focused, connecting socket...');
  //       connectSocketHere();
  //     }
  //     // return () => {
  //     //   console.log('Screen unfocused, disconnecting socket...');
  //     //   disconnectSocketHere();
  //     // };
  //   }, [route.params?._id, connectionStatus, isFocused]),
  // );

  useEffect(() => {
    if (isFocused) {
      connectSocketHere();
    }

    return async () => {
      await AsyncStorage.setItem('@chat_message', JSON.stringify([]));
      await AsyncStorage.setItem('@deletedMessages', JSON.stringify([]));

      CTX.setLoad_more(true);

      CTX.setChatMessage(null);
      CTX.setDeletedMessages([]);
      CTX.setChatDetails(null);
    };
  }, [route.params?._id, connectionStatus, isFocused]);

  // useEffect(() => {
  //   if (CTX.socketObj) {
  //     CTX.socketObj.on('receive-personal-message', addMessageToConversation);
  //   }

  //   return () => {
  //     CTX.socketObj?.off('receive-personal-message');
  //     stopSound();
  //     sound.release();
  //   };
  // }, [CTX.socketObj]);

  useEffect(() => {
    if (!CTX.chatMessage || CTX.chatMessage.length < 1) {
      return;
    }

    const unreadIds = CTX.chatMessage
      .filter(msg => !msg?.readBy?.includes(CTX.userObj?._id))
      .map(msg => msg?._id);

    // read unread messages here!
    if (unreadIds.length > 0) {
      sendMessage({
        action: 'eachchatwebsocket',
        token: CTX.sessionToken,
        payload: {
          action: 'read_messages',
          my_id: CTX?.userObj?._id,
          chat_id: CTX?.chatDetails?._id,
          message_ids: unreadIds,
        },
      });
    }
  }, [CTX.chatMessage]);

  const loadMoreMessages = () => {
    if (!CTX?.chatMessage) return;

    if (!CTX.load_more) {
      return;
    }

    const oldestMessage =
      CTX?.chatMessage && CTX?.chatMessage[CTX?.chatMessage?.length - 1]; // first one in the list

    CTX?.setLoad_more_msg(true);

    if (!ws.current) {
      setErrMsg('CHECK UR INTERNET CONNECTION!!');
      setShowMsg(true);
      console.log('CHECK UR INTERNET CONNECTION!!');
      return;
    }

    // console.log('loadMoreMessages ===>>>> ', Math.random());

    sendMessage({
      action: 'eachchatwebsocket',
      token: CTX.sessionToken,
      payload: {
        action: 'load_more_messages',
        before_message_id: oldestMessage?._id,
        chat_id: CTX?.chatDetails?._id,
        limit: 30,
      },
    });
  };

  const setContentHandler = e => {
    setContent(e);

    // if (e?.length > 3) {
    // sendMessage({
    //   action: 'eachchatwebsocket',
    //   token: CTX.sessionToken,
    //   payload: {
    //     action: 'typing_messages',
    //     user: CTX?.userObj?.username,
    //     my_id: CTX?.userObj?._id,
    //     chat_id: CTX?.chatDetails?._id,
    //   },
    // });
    // }

    // // mark user as typing
    // typingRef.current = true;
    // lastTypingTimeRef.current = Date.now();

    // if (!typingTimeoutRef.current) {
    //   // ws.current.send(
    //   //   JSON.stringify({ action: 'typing', chat_id, user_id: CTX.userObj._id, isTyping: true })
    //   // );

    //   sendMessage({
    //     action: 'eachchatwebsocket',
    //     token: CTX.sessionToken,
    //     payload: {
    //       action: 'typing_messages',
    //       user: CTX?.userObj?.username,
    //       my_id: CTX?.userObj?._id,
    //       chat_id: CTX?.chatDetails?._id,
    //     },
    //   });

    //   typingTimeoutRef.current = setTimeout(() => {
    //     typingTimeoutRef.current = null;

    //     // if user is still typing after 4s, send again
    //     if (typingRef.current) setContentHandler(e);
    //   }, 4000);
    // }

    // // stop typing after user hasn't typed for 5s
    // setTimeout(() => {
    //   if (Date.now() - lastTypingTimeRef.current >= 5000) {
    //     typingRef.current = false;
    //     // ws.current.send(
    //     //   JSON.stringify({ action: 'typing', chat_id, user_id: CTX.userObj._id, isTyping: false })
    //     // );

    // sendMessage({
    //   action: 'eachchatwebsocket',
    //   token: CTX.sessionToken,
    //   payload: {
    //     action: 'typing_messages',
    //     user: CTX?.userObj?.username,
    //     my_id: CTX?.userObj?._id,
    //     chat_id: CTX?.chatDetails?._id,
    //   },
    // });
    //   }
    // }, 5000);

    if (!intervalRef.current) {
      sendMessage({
        action: 'eachchatwebsocket',
        token: CTX.sessionToken,
        payload: {
          action: 'typing_messages',
          user: CTX?.userObj?.username,
          my_id: CTX?.userObj?._id,
          chat_id: CTX?.chatDetails?._id,
        },
      });

      intervalRef.current = setInterval(() => {
        // console.log('sendMessage HERE!');

        sendMessage({
          action: 'eachchatwebsocket',
          token: CTX.sessionToken,
          payload: {
            action: 'typing_messages',
            user: CTX?.userObj?.username,
            my_id: CTX?.userObj?._id,
            chat_id: CTX?.chatDetails?._id,
          },
        });
      }, 3500);
    }

    // Reset timer that detects if user stopped typing
    if (intervalRef.stopTimeout) {
      clearTimeout(intervalRef.stopTimeout);
    }

    // If user doesn’t type for 2s, clear the interval
    intervalRef.stopTimeout = setTimeout(() => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }, 2000);
  };

  const deleteMSGhandler = () => {
    console.log('selectedArr =>>>> ', CTX.chatDetails?._id, selectedArr.length);

    const getMyMessage = selectedArr.filter(v => v.user._id == CTX.userObj._id);
    const notMyMessage = selectedArr.filter(v => v.user._id != CTX.userObj._id);

    const rearrage_mymessage = getMyMessage.map(v => {
      return {
        _id: v._id,
        deleted_from: [CTX.userObj._id, route.params?._id],
      };
    });

    const rearrage_notmessage = notMyMessage.map(v => {
      return {
        _id: v._id,
        deleted_from: [CTX.userObj._id],
      };
    });

    const combined = [...rearrage_mymessage, ...rearrage_notmessage];

    sendMessage({
      action: 'eachchatwebsocket',
      token: CTX.sessionToken,
      payload: {
        action: 'delete_message',
        my_id: CTX.userObj?._id,
        updates: combined,
        chat_id: CTX.chatDetails?._id,
        other_user_id: route.params?._id,
      },
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
          width: '100%',
          height: '100%',
          position: 'relative',
        },
      ]}>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
      )}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Suspense fallback={<Fallback />}>
          <EachChat
            setMessageHere={setMessageHere}
            content={content}
            setContent={setContentHandler}
            loading={loading}
            dataDetails={dataDetails}
            replying={replying}
            textInputRef={textInputRef}
            setReplying={setReplying}
            replyTo={replyTo}
            emitMsgToSocket={emitMsgToSocket}
            showMsg={showMsg}
            errMsg={errMsg}
            setErrMsg={setErrMsg}
            setShowMsg={setShowMsg}
            loadingMsg={loadingMsg}
            reSetDataDetails={data => setDataDetails(data)}
            chatId={chatId}
            selectedArr={selectedArr}
            setSelectedArr={setSelectedArr}
            blobUri={blobUri}
            receiptID={route?.params?._id}
            chatMessage={CTX.chatMessage}
            loadMoreMessages={loadMoreMessages}
            deleteMSGhandler={deleteMSGhandler}
          />
        </Suspense>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EventEachChat;

const styles = StyleSheet.create({
  coverMain: {
    flex: 1,
    width: '100%',
    heigth: '100%',
    backgroundColor: '#000',
  },
  activityCover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#0a171e53',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
