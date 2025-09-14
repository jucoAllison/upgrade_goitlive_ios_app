import {MainContext} from '../../../../../../App';
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

const Stats = React.lazy(() => import('./stats'));
const EventStats = ({obj}) => {
  const CTX = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [lastComments, setLastComments] = useState({
    watchedToCompletion: 0,
    views: 0,
  });
  // const navigation = useNavigation();
  // {userID: user._id, privateId: _id}
  const getLastComments = async () => {
    setShowMsg(false);
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}get/account/post/stats/${obj.userID}/${obj.privateId}`,
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

      setLoading(false);
      setShowMsg(false);
      setLastComments(parsedJson.data);
    } catch (error) {
      // setLoading(false);
      console.log('error liking a private => ', error);
      // setErrMsg('Network request failed');
      setLoading(false);
      setShowMsg(true);
    }
  };

  useEffect(() => {
    getLastComments();
  }, []);

  return (
    <Pressable
      onPress={() => {
        return null;
      }}
      style={styles.coverScrollView}
      // style={{height: 30}}
    >
      <>
        {showMsg ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={getLastComments}
            style={styles.activiityCover}>
            <FontAwesome5 size={40} color="#262626" name="holly-berry" />
            <Text style={styles.pleaseRetry}>
              Error happened, click to retry
            </Text>
          </TouchableOpacity>
        ) : (
          <Suspense fallback={null}>
            <Stats lastComments={lastComments} loading={loading} />
          </Suspense>
        )}
      </>
    </Pressable>
  );
};

export default EventStats;

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
