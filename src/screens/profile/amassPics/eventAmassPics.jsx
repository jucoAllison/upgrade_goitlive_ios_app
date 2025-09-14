import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {Suspense, useCallback, useContext, useEffect, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

import {MainContext} from '../../../../App';
import AbbrNum from '../../../helper/abbrev';
const AmassPics = React.lazy(() => import('./amassPics'));

const EventAmassPics = ({shouldRefresh, userID, isFocused}) => {
  const navigation = useNavigation();
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const CTX = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const [mainData, setMainData] = useState(null);

  // const data = [
  //   {
  //     ref: null,
  //     img: 'https://cdn.dribbble.com/users/4835348/avatars/normal/b8d590e40a3593bb4cd14729373c0cf7.jpg?1616456581',
  //     _id: '66564tyu9876',
  //   },
  //   {
  //     ref: null,
  //     img: 'https://cdn.dribbble.com/users/544452/avatars/normal/75871bc6158481115dda331f4817e329.jpg?1652874301',
  //     _id: '765ytryu76y',
  //   },
  //   // {
  //   //   ref: null,
  //   //   img: 'https://cdn.dribbble.com/users/677572/avatars/normal/cd94b72f04f84b0dcf1c1ee3f6bdf2b9.png?1634627780',
  //   //   _id: '8i7u6y5t56789',
  //   // },
  // ];

  const mappedVideos = mainData?.map((item, i) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EachAmassPost', {...item})}
        key={i}
        style={styles.itemVideoHere}>
        <Image
          style={styles.video}
          source={{
            uri: item.postUrl
              // ? item.postUrl+"/tr:q-30,lo-true"
              ? item.postUrl+"/tr:q-30,h-350,w-350,c-at_least"
              : 'https://cdn.dribbble.com/users/677572/avatars/normal/cd94b72f04f84b0dcf1c1ee3f6bdf2b9.png?1634627780',
          }}
          resizeMode={'cover'}
        />
        <View style={styles.likeCover}>
          <AntDesign name="like1" color="#fff" />
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 12,
              marginLeft: 2,
            }}>
            {AbbrNum(item?.like?.length, 0)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);
  // const getAmassFeeds = async () => {
    
  // };

  

  const getAmassFeeds = useCallback(async() => {
    setShowMsg(false);
    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.am}get/user/personal/amass/feed/${
          userID ? userID : CTX.userObj._id
        }`,
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
      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setLoading(false);
      setShowMsg(false);
      // console.log("parsedJson?.data?.data ==>> ");
      // console.log("parsedJson?.data?.data ==>> ");
      // console.log("parsedJson?.data?.data ==>> ");
      // console.log("parsedJson?.data?.data ==>> ", parsedJson?.data?.data);
      // console.log("parsedJson?.data?.data ==>> ");
      // console.log("parsedJson?.data?.data ==>> ");
      // console.log("parsedJson?.data?.data ==>> ");
      // console.log("parsedJson?.data?.data ==>> ");
      setMainData(parsedJson?.data);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  }, []);







  useEffect(() => {
    if (isFocused) {
      getAmassFeeds();
    }
    return () => setMainData([]);
  }, [userID, shouldRefresh, isFocused]);

  const mapLoadingFeeds = Array(3)
    .fill('sfss')
    .map((v, i) => (
      <View key={i} style={{...styles.itemVideoHere}}>
        <View style={{backgroundColor:"#efefef", width:390, height:197,}}>
         
        </View>
      </View>
    ));

  return (
    <>
      {/* {loading ? (
        <View style={{flexDirection: 'row'}}>{mapLoadingFeeds}</View> */}

{!mainData ? (
        <View style={{flexDirection: 'row'}}>{mapLoadingFeeds}</View>

        
      ) : (
        <>
          {showMsg ? (
            <>
              <View style={{...styles.activityCover, marginVertical: 30}}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{alignItems: 'center'}}
                  onPress={() => getAmassFeeds()}>
                  <FontAwesome5 size={40} color="#000" name="holly-berry" />
                  <Text style={{...styles.pleaseRetry, marginTop: 10}}>
                    {errMsg || 'Error happened'}
                  </Text>
                  <Text style={{...styles.pleaseRetry}}>Tap to retry</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Suspense
              fallback={
                <View style={styles.activityCover}>
                  <ActivityIndicator color={'#0a171e'} size={40} />
                </View>
              }>
              <AmassPics mappedVideos={mappedVideos} userID={userID} />
            </Suspense>
          )}
        </>
      )}
    </>
  );
};

export default EventAmassPics;

const styles = StyleSheet.create({
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  itemVideoHere: {
    flex: 1,
    minWidth: '33.3%', // 100% devided by the number of rows you want
    alignItems: 'center',
    height: 200,
    // backgroundColor: 'rgba(249, 180, 45, 0.25)',
    backgroundColor: '#443344',
    borderWidth: 1.5,
    borderColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  pleaseRetry: {
    color: '#000',
    fontFamily: 'Overpass-Regular',
    textAlign: 'center',
  },
  likeCover: {
    position: 'absolute',
    bottom: 15,
    alignItems: 'center',
    right: 18,
    flexDirection: 'row',
  },
});
