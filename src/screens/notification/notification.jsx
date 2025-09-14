import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import React, { Suspense, useCallback, useContext, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import  Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import styles from './styles';
import { MainContext } from '../../../App';
import Fallback from '../../components/fallback/fallback';
import EachNotification from './eachNotification';
// const EachNotification = React.lazy(() => import('./eachNotification'));

const Notification = ({
  showMsg,
  errMsg,
  loading,
  notification,
  reTryStuff,
  showBottomSheetHandler,
  topIndex,
  setShowMsg,
  setErrMsg,
  setLoading,
  setNotification,
}) => {
  const [text, setText] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const CTX = useContext(MainContext);
  // const [selected, setSelected] = useState({_id: "66c6592aa766ed2e1906961b"});
  const [selected, setSelected] = useState(null);
  const [replying, setReplying] = useState(null);
  const [msgComment, setMsgComment] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setSelected(null);
    reTryStuff().then(() => setRefreshing(false));
  };

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const createSuccessButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Success', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const approveTagNotification = async v => {
    if (selected) return;

    setSelected(v);

    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/approve/post/${v?._id}/${v?.post}`,
        {
          method: 'POST',
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
      setSelected(null);
      if (parsedJson?.e) {
        createThreeButtonAlert(parsedJson?.m);
        return;
      }

      const indexx = notification.filter(b => b?._id != v?._id);
      setNotification(indexx);
      // remove the notfication and reset the arr
      // reTryStuff();
      // console.log('parsedJson notification =>> ', parsedJson);
    } catch (error) {
      setSelected(null);
      console.log('error approving tag for notification! => ', error);
      createThreeButtonAlert('Network request failed');
    }
  };

  // const careBackHandler = async (v) => {
  //   if (selected) return;
  //   setSelected(v);

  //   // setTimeout(() => {

  //   //   setSelected(null);
  //   // }, 2000);

  //   console.log(`${CTX.systemConfig?.p}account/user/profile/toggle/care/${v.user._id}`);

  //   try {
  //     const fetching = await fetch(
  //       `${CTX.systemConfig?.p}account/user/profile/toggle/care/${v.user._id}`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `bearer ${CTX.sessionToken}`,
  //         },
  //       },
  //     );
  //     const parsedJson = await fetching.json();
  //     if (parsedJson?.isRemoved) {
  //       return CTX.logoutUser();
  //     }
  //     setSelected(null);
  //     if (parsedJson?.e) {
  //       createThreeButtonAlert(parsedJson?.m);
  //       return;
  //     }

  //     // const indexx = notification.filter(b => b?._id != v?._id);
  //     // setNotification(indexx);

  //     console.log('parsedJson notification =>> ', parsedJson);
  //   } catch (error) {
  //     setSelected(null);
  //     console.log('error approving tag for notification! => ', error);
  //     createThreeButtonAlert('Network request failed');
  //   }
  // };

  const careBackHandler = useCallback(async v => {
    if (selected) return;
    setSelected(v);
    try {
      // console.log(
      //   `${CTX.systemConfig?.p}account/user/profile/toggle/care/${parsedID}`,
      // );
      const fetchUser = await fetch(
        `${CTX.url}account/profile/check/followBack/${v.user._id}/${v._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CTX.sessionToken}`,
          },
        },
      );
      const jsoned = await fetchUser?.json();
      setSelected(null);
      if (jsoned?.e) {
        createThreeButtonAlert(jsoned?.m);
        return;
      }

      const indexx = notification.filter(b => b?._id != v?._id);
      setNotification(indexx);

      // console.log('jsoned HERE!! =>> ', jsoned);
    } catch (error) {
      console.log('error toggling careHandler HERE! => ', error);
      createThreeButtonAlert('Network request failed');
      setSelected(null);
    }
  }, []);

  const deleteAllNotification = async () => {
    const allIDs = await notification.map(v => {
      return v._id;
    });

    // console.log('allIDs ==>> ', allIDs);
    setLoading(true);
    setShowMsg(false);
    setErrMsg('');
    try {
      const fetching = await fetch(
        `${CTX.url}account/profile/user/notification`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },

          body: JSON.stringify({ allIDs }),
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
      setShowMsg(false);
      setErrMsg('');
      reTryStuff();
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for getAllNotification! => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  const sendMessageHere = async () => {
    setLoadingMsg(true);

    try {
      const msgId = Math.random().toString().split('.')[1];

      const replyingObj = {
        replyTo: replying?.msgObj?.user?.username,
        msg: replying?.msgObj?.content,
        replyId: replying?.msgObj?._id,
      };

      const msgObj = {
        _id: msgId,
        replyingObj: replyingObj,
        createdAt: new Date().toISOString(),
        content: msgComment,

        user: {
          _id: CTX?.userObj?._id,
          username: CTX?.userObj?.username,
          verify: CTX?.userObj?.verify,
          photo: CTX?.userObj?.photo,
        },
      };

      const fetching = await fetch(
        `${CTX.url}account/profile/comment/notification/reply/${replying.post}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({ msgObj }),
        },
      );
      const parsedJson = await fetching.json();

      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }

      if (parsedJson?.e) {
        setErrMsg(parsedJson?.m);
        createThreeButtonAlert(parsedJson?.m);
        setLoadingMsg(false);
        setShowMsg(true);
        return;
      }

      setReplying(null);
      setLoadingMsg(false);
      createSuccessButtonAlert(
        `You have successfully replied to @${replying?.msgObj?.replyingObj?.replyTo}. Remember, you can chat with @${replying?.msgObj?.replyingObj?.replyTo} privately instead of going back and forth in the comments.`,
      );

      // console.log("parsedJson HERE!! =>> ", parsedJson);
    } catch (error) {
      setLoadingMsg(false);
      console.log('error approving tag for notification! => ', error);
      createThreeButtonAlert('Network request failed');
    }
  };

  return (
    <ScrollView
      style={{
        ...styles.containerCover,
        backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
      }}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* <View style={styles.coverSearchHere}>
        <AntDesign name="search1" color="#262626" size={24} />
        <TextInput
          style={styles.innerTextInput}
          placeholder="Search"
          placeholderTextColor={'#262626'}
        />
      </View> */}

      <View style={styles.coverFollowingMessage}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setText('all')}
          style={{
            ...styles.eachBtnCover,
            backgroundColor: text == 'all' ? '#262626' : '#efefef',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              ...styles.eachBtnText,
              color: text === 'all' ? '#fff' : '#262626',
              fontFamily: 'Gilroy-Bold',
            }}
          >
            {topIndex}
          </Text>

          <Entypo
            name="flow-parallel"
            size={19}
            color={text === 'all' ? '#fff' : '#262626'}
            style={{ marginLeft: 3 }}
          />
        </TouchableOpacity>
        {notification.length > 0 && (
          <>
            <Text
              onPress={deleteAllNotification}
              style={{ ...styles.clearAll, fontFamily: 'Gilroy-Bold' }}
            >
              {loading ? (
                <View
                  style={{
                    ...styles.lazyLoad,
                    backgroundColor: '#efefef',
                    width: 60,
                    height: 18,
                  }}
                >
                  {/* <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                    <SkeletonPlaceholder.Item width={60} height={18} />
                  </SkeletonPlaceholder> */}
                </View>
              ) : (
                'Clear all'
              )}
            </Text>
            <View
              style={{
                ...styles.eachBtnCover,
                marginLeft: 20,
                paddingHorizontal: 10,
              }}
            >
              {loading ? (
                <View
                  style={{
                    ...styles.lazyLoad,
                    backgroundColor: '#efefef',
                    width: 40,
                    height: 40,
                  }}
                >
                  {/* <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                    <SkeletonPlaceholder.Item width={40} height={40} />
                  </SkeletonPlaceholder> */}
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={showBottomSheetHandler}
                >
                  <Feather name="settings" size={23} color="#262626" />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>

      {/* <Suspense
          fallback={
            // <Fallback />
            <View style={styles.activityCover}>
              <ActivityIndicator color={'#0a171e53'} size={40} />
            </View>
          }> */}
      <EachNotification
        loading={loading}
        showMsg={showMsg}
        errMsg={errMsg}
        notification={notification}
        reTryStuff={reTryStuff}
        topIndex={topIndex}
        selected={selected}
        approveTagNotification={approveTagNotification}
        setMsgComment={setMsgComment}
        msgComment={msgComment}
        loadingMsg={loadingMsg}
        replying={replying}
        setReplying={setReplying}
        sendMessageHere={sendMessageHere}
        careBackHandler={careBackHandler}
      />
      {/* </Suspense> */}
      <View style={{ height: 40 }}></View>
    </ScrollView>
  );
};

export default Notification;
