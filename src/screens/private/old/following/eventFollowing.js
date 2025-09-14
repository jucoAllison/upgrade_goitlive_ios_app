// import {
//   View,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   StatusBar,
// } from 'react-native';
// import React, {Suspense, useContext, useEffect, useState} from 'react';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import {MainContext} from '../../../../../App';
// import {useIsFocused, useRoute} from '@react-navigation/native';

// const Following = React.lazy(() => import('./following'));
// const EventUserProfile = () => {
//   const route = useRoute();
//   const CTX = useContext(MainContext);
//   const [showMsg, setShowMsg] = useState(false);
//   const [errMsg, setErrMsg] = useState('');
//   const [profileDetails, setProfileDetails] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const getThePersonalPrivate = async () => {
//     if (loading) {
//       return;
//     }
//     setLoading(true);
//     try {
//       const fetching = await fetch(
//         `${CTX.systemConfig?.p}user/personal/private/profile`,
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
//       if (parsedJson?.error) {
//         setErrMsg(parsedJson?.msg);
//         setShowMsg(true);
//         return;
//       }
//       setErrMsg('');
//       setShowMsg(false);
//       setProfileDetails(parsedJson.data.data);
//     } catch (error) {
//       setLoading(false);
//       console.log('error fetching data for personal private HERE! => ', error);
//       setErrMsg('Network request failed');
//       setShowMsg(true);
//     }
//   };

//   useEffect(() => {
//     // Your code here
//     getThePersonalPrivate();
//   }, [route.params?.uniqueKey]);

//   return (
//     <>
//       <StatusBar
//         animated={true}
//         backgroundColor={CTX.statusBarColor}
//         // hidden={true}
//         barStyle="light-content"
//       />
//       {loading ? (
//         <View style={styles.activityCoverr}>
//           <ActivityIndicator color={'#0a171e'} size={40} />
//         </View>
//       ) : showMsg ? (
//         <>
//           <TouchableOpacity activeOpacity={0.8}
//             onPress={() => getThePersonalPrivate()}
//             style={{...styles.activiityCover, marginTop: 100}}>
//             <FontAwesome5 size={40} color="#0a171e" name="holly-berry" />
//             <Text style={{...styles.pleaseRetry, marginTop: 10}}>{errMsg}</Text>
//             <Text style={{...styles.pleaseRetry, marginTop: 10}}>
//               Tap to retry
//             </Text>
//           </TouchableOpacity>
//         </>
//       ) : (
//         <Suspense
//           fallback={
//             <View style={styles.activityCover}>
//               <ActivityIndicator color={'#0a171e'} size={40} />
//             </View>
//           }>
//           {profileDetails?.length > 0 && <Following data={profileDetails[0]} />}
//         </Suspense>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   coverMain: {
//     flex: 1,
//     width: '100%',
//     heigth: '100%',
//     backgroundColor: '#000',
//   },
//   activityCover: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     top: 0,
//     left: 0,
//     backgroundColor: '#0a171e53',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   activiityCover: {
//     width: '80%',
//     height: '100%',
//     marginLeft: 'auto',
//     marginRight: 'auto',
//     // justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pleaseRetry: {
//     color: '#0a171e',
//     textAlign: 'center',
//   },
//   activityCoverr: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
// });

// export default EventUserProfile;

import {
  View,
  Text,
  Alert,
  StatusBar,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {MainContext} from '../../../../../App';
import {PostContext} from '../../../../../postVideoCTX';
import Fallback from '../../../../components/fallback/fallback';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const PersonalPrivate = React.lazy(() => import('./following'));
const EventPersonalPrivate = () => {
  const CTX = useContext(MainContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const PostCTX = useContext(PostContext);
  // const route = useRoute();
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [profileDetails, setProfileDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [parentScrollEnabled, setParentScrollEnabled] = useState(true);

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const getUserPrivateVideo = async () => {
    // if (loading) {
    //   return;
    // }
    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}get/account/user/personal/private/profile`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      setLoading(false);
      if (parsedJson?.e) {
        setLoading(false);
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        console.log("parsedJson?.m =>> ", parsedJson?.m);
        setShowMsg(true);
        return;
      }

      // console.log('parsedJson here!! =>> ', parsedJson);

      if (PostCTX.uploadVideo) {
        const detailsHere = {
          ...PostCTX.uploadVideo,
          url: PostCTX?.uploadVideo?.uri,
          video: PostCTX?.uploadVideo?.uri,
          tags: PostCTX.selectedTags,
          isCover: PostCTX.isCover,
          note: PostCTX.msgInput,
        };
        setLoading(false);
        setErrMsg('');
        setShowMsg(false);
        setProfileDetails([detailsHere]);
        return;
      }

      if (parsedJson.isPrivate) {
        setLoading(false);
        setErrMsg('');
        setShowMsg(false);
        setProfileDetails(parsedJson.data);
        return;
      }

      if (!parsedJson.isPrivate) {
        return PostCTX.setIsUploadingNew(true);
      }

      PostCTX.setMinimize(false);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for personal private HERE! => ', error);
      setErrMsg('Network request failed');
      createThreeButtonAlert('Network request failed');
      setShowMsg(true);
    }
  };

  useEffect(() => {
    getUserPrivateVideo();
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    getUserPrivateVideo();
    setTimeout(() => {
      setRefreshing(false);
    }, 1400);
  };

  // console.log("parentScrollEnabled HERE!! =>> ", parentScrollEnabled);

  return (
    <>
      {!PostCTX?.upLoading ? (
        <View
          style={{
            gap: 20,
            position: 'absolute',
            top: 30,
            zIndex: 200,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: 50,
          }}>
          <View
            style={{
              paddingBottom: 2,
              borderBottomWidth: !PostCTX.minimize ? 2 : 0,
              borderBottomColor: !PostCTX.minimize ? '#fff' : 'inherit',
            }}>
            <Text
              style={{
                borderBottomWidth: 2,
                borderBottomColor: '#fff',
                fontWeight: 'bold',
                fontSize: 15,
                color: !PostCTX.minimize ? '#fff' : '#bbb',
                // // fontSize: "bold",
                fontFamily: 'satoshiblack',
                paddingHorizontal: 5,
              }}
              onPress={() => console.log('true')}>
              Me
            </Text>
          </View>
          <View
            style={{
              paddingBottom: 2,
              borderBottomWidth: PostCTX.minimize ? 2 : 0,
              borderBottomColor: PostCTX.minimize ? '#fff' : 'inherit',
            }}>
            <Text
              style={{
                borderBottomWidth: 2,
                borderBottomColor: '#fff',
                fontWeight: 'bold',
                fontSize: 15,
                color: PostCTX.minimize ? '#fff' : '#bbb',
                // // fontSize: "bold",
                // fontFamily: 'satoshiblack',
                paddingHorizontal: 5,
              }}
              // onPress={() => PostCTX.setMinimize(false)}
              onPress={() => {
                navigation.navigate('otherPrivate');
              }}>
              Others
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            gap: 20,
            position: 'absolute',
            top: 35,
            zIndex: 200,
            flexDirection: 'row',
            // alignItems: 'flex-end',
            justifyContent: 'flex-end',
            width: '100%',
          }}>
          <ActivityIndicator
            size={24}
            color={'#e20254'}
            style={{marginRight: 10, marginTop: 10}}
          />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEnabled={parentScrollEnabled}>
        <StatusBar backgroundColor={'#000'} barStyle={'light-content'} />
        {loading ? (
          // <>
          // <Text>Loading</Text>
          // <Text>Loading</Text>
          // <Text>Loading</Text>
          // </>
          <Fallback />
        ) : (
          <Suspense fallback={null}>
            <PersonalPrivate
              createThreeButtonAlert={createThreeButtonAlert}
              data={profileDetails[0]}
              setParentScrollEnabled={setParentScrollEnabled}
            />
          </Suspense>
        )}
      </ScrollView>
    </>
  );
};

export default EventPersonalPrivate;
