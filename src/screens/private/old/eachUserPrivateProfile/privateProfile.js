import React, {Suspense, useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MainContext} from '../../../../../App';

// const EventPersonalPics = React.lazy(() =>
//   import('../../../myProfile/personalPics/eventPersonalPics'),
// );
const ProfileTop = React.lazy(() =>
  import('../../../../components/profileTop/profileTop'),
);
const PrivateProfile = ({
  user,
  isUserCaring,
  loading,
  setIsUserCaring,
  navigation,
  isFocused,
  getProfileDetails,
}) => {
  const CTX = useContext(MainContext);
  const [shouldRefresh, setShouldRefresh] = useState({ran: Math.random()});
  const [refreshing, setRefreshing] = useState(false);
  // console.log("'user?._id HHERE ==>> ", user?._id);

  const careHandler = async stat => {
    setIsUserCaring(!isUserCaring);
    let URLHere = stat
      ? `${CTX.systemConfig?.p}user/profile/uncare/${user?._id}`
      : `${CTX.systemConfig?.p}user/profile/care/${user?._id}`;
    // uncare Here
    try {
      const fetching = await fetch(URLHere, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
      });
      const parsedJson = await fetching.json();

      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }

      console.log('error from careHandler => ', parsedJson);
      // resetUpperArr(parsedJson.data);
    } catch (error) {
      // setLoading(false);
      console.log('error from careHandler => ', error);
      // setErrMsg('Network request failed');
      // setShowMsg(true);
    }
  };

  const onRefresh = () => {
    setShouldRefresh({ran: Math.random()});
    setRefreshing(true);
    getProfileDetails().then(() => setRefreshing(false));
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{padding: 20, height: '100%', width: '100%'}}>
        <Suspense
          fallback={
            <View style={styles.activityCover}>
              <ActivityIndicator color={'#0a171e53'} size={40} />
            </View>
          }>
          <ProfileTop
            profileDetails={user}
            isUserCaring={isUserCaring}
            careHandler={careHandler}
            loading={loading}
          />
        </Suspense>

        <View style={{height: 30}}></View>
        {/* <Suspense fallback={null}>
          <EventPersonalPics
            isFocused={isFocused}
            navigation={navigation}
            shouldRefresh={shouldRefresh}
            userID={user?._id}
          />
        </Suspense> */}
      </ScrollView>
    </>
  );
};

export default PrivateProfile;

const styles = StyleSheet.create({
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  activiityCover: {
    width: '80%',
    height: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    // justifyContent: 'center',
    alignItems: 'center',
  },

  pleaseRetry: {
    color: '#0a171e',
    textAlign: 'center',
  },
});
