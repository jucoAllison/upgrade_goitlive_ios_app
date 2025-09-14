// import React, {Suspense, useContext, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Pressable,
// } from 'react-native';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import {useNavigation} from '@react-navigation/core';

// import {MainContext} from '../../../../../../App';
// const Comments = React.lazy(() => import('./comments'));
// const EventComment = ({obj}) => {
//   const CTX = useContext(MainContext);
//   const [loading, setLoading] = useState(false);
//   const [showMsg, setShowMsg] = useState(false);
//   const [msgComment, setMsgComment] = useState('');
//   const [loadingMsg, setLoadingMsg] = useState(false);
//   const [lastComments, setLastComments] = useState([]);
//   const navigation = useNavigation();
//   // {userID: user._id, privateId: _id}
//   const getLastComments = async () => {
//     setShowMsg(false);
//     if (loading) {
//       return;
//     }
//     setLoading(true);
//     try {
//       const fetching = await fetch(
//         `${CTX.systemConfig?.p}user/private-live/comment/${obj.userID}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `bearer ${CTX.sessionToken}`,
//           },
//         },
//       );
//       const parsedJson = await fetching.json();

//       if (parsedJson?.isRemoved) {
//         return CTX.logoutUser();
//       }

//       setLoading(false);
//       setShowMsg(false);
//       const filteredMessages = await parsedJson?.data?.data.filter(
//         v => v !== null,
//       );

//       setLastComments(filteredMessages.reverse());
//     } catch (error) {
//       // setLoading(false);
//       console.log('error liking a private => ', error);
//       // setErrMsg('Network request failed');
//       setLoading(false);
//       setShowMsg(true);
//     }
//   };

//   useEffect(() => {
//     getLastComments();
//   }, []);

//   const sendMessages = async () => {
//     setShowMsg(false);
//     if (loadingMsg) {
//       return;
//     }

//     if (msgComment.trim().length < 1) {
//       return;
//     }

//     setLoadingMsg(true);
//     try {
//       const fetching = await fetch(
//         `${CTX.systemConfig?.p}user/private-live/comment/${obj.userID}/${obj.privateId}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `bearer ${CTX.sessionToken}`,
//           },
//           body: JSON.stringify({content: msgComment}),
//         },
//       );
//       const parsedJson = await fetching.json();

//       if (parsedJson?.isRemoved) {
//         return CTX.logoutUser();
//       }

//       navigation.navigate('MainGroupChat', {
//         group_id: parsedJson.data._id,
//       });

//       setLoadingMsg(false);
//       setShowMsg(false);
//       setMsgComment('');
//       getLastComments();
//     } catch (error) {
//       console.log('error sending  comment for a private live => ', error);
//       // setErrMsg('Network request failed');
//       setLoadingMsg(false);
//       setShowMsg(true);
//     }
//   };

//   return (
//     <Pressable
//       onPress={() => {
//         return null;
//       }}
//       style={styles.coverScrollView}
//       // style={{height: 30}}
//     >
//       <>
//         {showMsg ? (
//           <TouchableOpacity activeOpacity={0.8}
//             onPress={getLastComments}
//             style={styles.activiityCover}>
//             <FontAwesome5 size={40} color="#262626" name="holly-berry" />
//             <Text style={styles.pleaseRetry}>
//               Error happened, click to retry
//             </Text>
//           </TouchableOpacity>
//         ) : (
//           <Suspense fallback={null}>
//             <Comments
//               lastComments={lastComments}
//               msgComment={msgComment}
//               loading={loading}
//               setMsgComment={setMsgComment}
//               loadingMsg={loadingMsg}
//               sendMessages={sendMessages}
//             />
//           </Suspense>
//         )}
//       </>
//     </Pressable>
//   );
// };

// export default EventComment;

// const styles = StyleSheet.create({
//   activiityCover: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 80,
//   },
//   pleaseRetry: {
//     marginTop: 20,
//     color: '#262626',
//     textAlign: 'center',
//   },
//   coverScrollView: {
//     height: '100%',
//   },
// });

// // [
// //   {
// //     user: {
// //       _id: '3768904565543ewd',
// //       username: 'hell_world',
// //       photo:
// //         'https://cdn.dribbble.com/users/377878/avatars/normal/b5baa50ac2ab81d10bdfa989361ceeba.jpg?1457901250',
// //       verified: true,
// //       monetized: true,
// //     },
// //     content: "stand strong"
// //   },
// //   {
// //     user: {
// //       _id: '34565543ewd',
// //       username: 'don_jazzy',
// //       photo:
// //         'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
// //       verified: true,
// //       monetized: true,
// //     },
// //     content: 'these is fire!!!',
// //   },
// //   {
// //     user: {
// //       _id: '34565543ewd',
// //       username: 'kizz_daniel',
// //       photo:
// //         'https://cdn.dribbble.com/users/4394/avatars/normal/274c3c3b6ad9adec0888c9c9c722a4d6.jpg?1522413391',
// //       verified: false,
// //       monetized: true,
// //     },
// //     content: 'i love you bro!!!',
// //   },
// //   {
// //     user: {
// //       _id: '34565543ewd',
// //       username: 'arrie_starr',
// //       photo:
// //         'https://cdn.dribbble.com/users/159815/avatars/normal/8dca3d0ad45d12b742e3696203b64646.jpg?1444519773',
// //       verified: false,
// //       monetized: false,
// //     },
// //     content: 'a rare talent!!!',
// //   },
// //   {
// //     user: {
// //       _id: '34565543ewd',
// //       username: 'davido',
// //       photo:
// //         'https://cdn.dribbble.com/users/4394/avatars/normal/274c3c3b6ad9adec0888c9c9c722a4d6.jpg?1522413391',
// //       verified: true,
// //       monetized: true,
// //     },
// //     content: 'signeed',
// //   },
// //   {
// //     user: {
// //       _id: '34565543ewd',
// //       username: 'wizkid',
// //       photo:
// //         'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
// //       verified: true,
// //       monetized: true,
// //     },
// //     content: 'best of luck',
// //   },

// //   {
// //     user: {
// //       _id: '3768904565543ewd',
// //       username: 'hell_world',
// //       photo:
// //         'https://cdn.dribbble.com/users/377878/avatars/normal/b5baa50ac2ab81d10bdfa989361ceeba.jpg?1457901250',
// //       verified: true,
// //       monetized: true,
// //     },
// //     content: "stand strong"
// //   },
// //   {
// //     user: {
// //       _id: '34565543ewd',
// //       username: 'don_jazzy',
// //       photo:
// //         'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
// //       verified: true,
// //       monetized: true,
// //     },
// //     content: 'these is fire!!!',
// //   },
// //   {
// //     user: {
// //       _id: '34565543ewd',
// //       username: 'kizz_daniel',
// //       photo:
// //         'https://cdn.dribbble.com/users/4394/avatars/normal/274c3c3b6ad9adec0888c9c9c722a4d6.jpg?1522413391',
// //       verified: false,
// //       monetized: true,
// //     },
// //     content: 'i love you bro!!!',
// //   },
// //   {
// //     user: {
// //       _id: '34565543ewd',
// //       username: 'arrie_starr',
// //       photo:
// //         'https://cdn.dribbble.com/users/159815/avatars/normal/8dca3d0ad45d12b742e3696203b64646.jpg?1444519773',
// //       verified: false,
// //       monetized: false,
// //     },
// //     content: 'a rare talent!!!',
// //   },
// //   {
// //     user: {
// //       _id: '34565543ewd',
// //       username: 'davido',
// //       photo:
// //         'https://cdn.dribbble.com/users/4394/avatars/normal/274c3c3b6ad9adec0888c9c9c722a4d6.jpg?1522413391',
// //       verified: true,
// //       monetized: true,
// //     },
// //     content: 'signeed',
// //   },
// //   {
// //     user: {
// //       _id: '34565543ewd',
// //       username: 'wizkid',
// //       photo:
// //         'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
// //       verified: true,
// //       monetized: true,
// //     },
// //     content: 'best of luck',
// //   },
// // ]

import React, {Suspense, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/core';

import {MainContext} from '../../../../../../App';
import {PostContext} from '../../../../../../postVideoCTX';
const Comments = React.lazy(() => import('./comments'));
const EventComment = ({obj}) => {
  const CTX = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [msgComment, setMsgComment] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [lastComments, setLastComments] = useState([]);
  const [shouldComment, setShouldComment] = useState(false)
  const navigation = useNavigation();
  const PostCTX = useContext(PostContext);
  const [replying, setReplying] = useState(null);
  // {userID: user._id, privateId: _id}

  // console.log('obj.userID HERE!! =>>> ', obj);

  const getLastComments = async () => {
    setShowMsg(false);
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}get/account/user/private-live/comment/${obj.privateId}`,
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

      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        setShowMsg(true);

        return;
      }

      setLoading(false);
      setShowMsg(false);
      const filteredMessages = await parsedJson?.data.filter(v => v !== null);

      // console.log(
      //   'filteredMessages from getlastcomment =>> ',
      //   filteredMessages,
      // );

      setShouldComment(parsedJson?.shouldComment)
      setLastComments(filteredMessages);
    } catch (error) {
      // setLoading(false);
      console.log('error liking a private => ', error);
      // setErrMsg('Network request failed');
      setLoading(false);
      setShowMsg(true);
    }
  };

  // console.log("obj HERE!! =>> ", obj);

  useEffect(() => {
    // if(!PostCTX?.upLoading){
    getLastComments();
    // }
  }, []);

  const sendMessages = async () => {
    setShowMsg(false);
    if (loadingMsg) {
      return;
    }

    if (msgComment.trim().length < 1) {
      return;
    }

    setLoadingMsg(true);
    try {
      const msgId = Math.random().toString().split('.')[1];

      const replyingObj = replying && {
        replyTo: replying?.user?.username,
        msg: replying.content,
        replyId: replying._id,
      };

      const msgObj = {
        _id: msgId,
        replyingObj: replying ? replyingObj : null,
        createdAt: new Date().toISOString(),
        content: msgComment,

        user: {
          _id: CTX?.userObj?._id,
          username: CTX?.userObj?.username,
          verify: CTX?.userObj?.verify,
          photo: CTX?.userObj?.photo,
        },
      };

      console.log(`${CTX.systemConfig?.p}get/account/user/private-live/comment/${obj.userID}/${obj.privateId}`);

      const fetching = await fetch(
        `${CTX.systemConfig?.p}get/account/user/private-live/comment/${obj.userID}/${obj.privateId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({msgObj}),
        },
      );
      const parsedJson = await fetching.json();

      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }

      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        setLoadingMsg(false);
        setShowMsg(true);
        return;
      }

      // console.log("parsedJson.data from data =>>> ", parsedJson);

      // navigation.navigate('MainGroupChat', {
      //   group_id: parsedJson._id,
      // });

      setLoadingMsg(false);
      setShowMsg(false);
      setMsgComment('');
      setReplying(null)

      // const calc = {
      //   _id: Math.random(),
      //   createdAt: new Date().toISOString(),
      //   content: msgComment.trim(),
      //   user: {
      //     _id: CTX.userObj._id,
      //     username: CTX.userObj.username,
      //     photo: CTX.userObj.photo,
      //     full_name: CTX.userObj.full_name,
      //     monetize: CTX.userObj.monetize,
      //     verify: CTX.userObj.verify,
      //     active: CTX.userObj.active,
      //   },
      // };

      const spread = [...lastComments]

      spread.unshift(msgObj)
      setLastComments(spread)
      // getLastComments();
    } catch (error) {
      console.log('error sending  comment for a private live => ', error);
      // setErrMsg('Network request failed');
      setLoadingMsg(false);
      setShowMsg(true);
    }
  };

  return (
    <Pressable
      onPress={() => {
        return null;
      }}
      style={styles.coverScrollView}
      // style={{height: 30}}
    >
      <>
        {PostCTX?.upLoading ? (
          <TouchableOpacity
            activeOpacity={0.8}
            // onPress={getLastComments}
            style={styles.activiityCover}>
            <FontAwesome5 size={40} color="#262626" name="holly-berry" />
            <Text style={styles.pleaseRetry}>
              Can't get comments now, video is still processing
            </Text>
          </TouchableOpacity>
        ) : shouldComment ? (
          <View style={styles.activiityCover}>
            <FontAwesome5 size={40} color="#262626" name="holly-berry" />
            <Text style={styles.pleaseRetry}>Post do not support comment</Text>
          </View>
        ) : (
          <>
            {showMsg ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={getLastComments}
                style={styles.activiityCover}>
                <FontAwesome5 size={40} color="#262626" name="holly-berry" />
                <Text style={styles.pleaseRetry}>
                  {errMsg || 'Error happened, click to retry'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Suspense fallback={null}>
                <Comments
                  lastComments={lastComments}
                  msgComment={msgComment}
                  loading={loading}
                  setMsgComment={setMsgComment}
                  loadingMsg={loadingMsg}
                  sendMessages={sendMessages}
                  replying={replying}
                setReplying={setReplying}
                />
              </Suspense>
            )}
          </>
        )}
      </>
    </Pressable>
  );
};

export default EventComment;

const styles = StyleSheet.create({
  activiityCover: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  pleaseRetry: {
    marginTop: 20,
    color: '#262626',
    textAlign: 'center',
  },
  coverScrollView: {
    height: '100%',
  },
});

// [
//   {
//     user: {
//       _id: '3768904565543ewd',
//       username: 'hell_world',
//       photo:
//         'https://cdn.dribbble.com/users/377878/avatars/normal/b5baa50ac2ab81d10bdfa989361ceeba.jpg?1457901250',
//       verified: true,
//       monetized: true,
//     },
//     content: "stand strong"
//   },
//   {
//     user: {
//       _id: '34565543ewd',
//       username: 'don_jazzy',
//       photo:
//         'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
//       verified: true,
//       monetized: true,
//     },
//     content: 'these is fire!!!',
//   },
//   {
//     user: {
//       _id: '34565543ewd',
//       username: 'kizz_daniel',
//       photo:
//         'https://cdn.dribbble.com/users/4394/avatars/normal/274c3c3b6ad9adec0888c9c9c722a4d6.jpg?1522413391',
//       verified: false,
//       monetized: true,
//     },
//     content: 'i love you bro!!!',
//   },
//   {
//     user: {
//       _id: '34565543ewd',
//       username: 'arrie_starr',
//       photo:
//         'https://cdn.dribbble.com/users/159815/avatars/normal/8dca3d0ad45d12b742e3696203b64646.jpg?1444519773',
//       verified: false,
//       monetized: false,
//     },
//     content: 'a rare talent!!!',
//   },
//   {
//     user: {
//       _id: '34565543ewd',
//       username: 'davido',
//       photo:
//         'https://cdn.dribbble.com/users/4394/avatars/normal/274c3c3b6ad9adec0888c9c9c722a4d6.jpg?1522413391',
//       verified: true,
//       monetized: true,
//     },
//     content: 'signeed',
//   },
//   {
//     user: {
//       _id: '34565543ewd',
//       username: 'wizkid',
//       photo:
//         'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
//       verified: true,
//       monetized: true,
//     },
//     content: 'best of luck',
//   },

//   {
//     user: {
//       _id: '3768904565543ewd',
//       username: 'hell_world',
//       photo:
//         'https://cdn.dribbble.com/users/377878/avatars/normal/b5baa50ac2ab81d10bdfa989361ceeba.jpg?1457901250',
//       verified: true,
//       monetized: true,
//     },
//     content: "stand strong"
//   },
//   {
//     user: {
//       _id: '34565543ewd',
//       username: 'don_jazzy',
//       photo:
//         'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
//       verified: true,
//       monetized: true,
//     },
//     content: 'these is fire!!!',
//   },
//   {
//     user: {
//       _id: '34565543ewd',
//       username: 'kizz_daniel',
//       photo:
//         'https://cdn.dribbble.com/users/4394/avatars/normal/274c3c3b6ad9adec0888c9c9c722a4d6.jpg?1522413391',
//       verified: false,
//       monetized: true,
//     },
//     content: 'i love you bro!!!',
//   },
//   {
//     user: {
//       _id: '34565543ewd',
//       username: 'arrie_starr',
//       photo:
//         'https://cdn.dribbble.com/users/159815/avatars/normal/8dca3d0ad45d12b742e3696203b64646.jpg?1444519773',
//       verified: false,
//       monetized: false,
//     },
//     content: 'a rare talent!!!',
//   },
//   {
//     user: {
//       _id: '34565543ewd',
//       username: 'davido',
//       photo:
//         'https://cdn.dribbble.com/users/4394/avatars/normal/274c3c3b6ad9adec0888c9c9c722a4d6.jpg?1522413391',
//       verified: true,
//       monetized: true,
//     },
//     content: 'signeed',
//   },
//   {
//     user: {
//       _id: '34565543ewd',
//       username: 'wizkid',
//       photo:
//         'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
//       verified: true,
//       monetized: true,
//     },
//     content: 'best of luck',
//   },
// ]
