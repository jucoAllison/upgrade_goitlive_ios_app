import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
  RefreshControl,
} from 'react-native';
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './profile.styles';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { MainContext } from '../../../App';
import Fallback from '../../components/fallback/fallback';
import { useNavigation } from '@react-navigation/native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useWebSocket } from '../../../WebSocketContext';

const Funds = React.lazy(() => import('./funds'));
const ProfileTop = React.lazy(() =>
  import('../../components/profileTop/eventProfileTop'),
);
const LastLogin = React.lazy(() => import('./lastLogin'));
const Menu = React.lazy(() => import('./menu'));
// const Suggested = React.lazy(() => import('./suggested'));
// const EventPersonalPics = React.lazy(() =>
//   import('./amassPics/eventAmassPics'),
// );
const Profile = ({ isFocused, loading }) => {
  const CTX = useContext(MainContext);
  const [showAbsolute, setShowAbsolute] = useState(false);
  const [isSession, setIsSession] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const [shouldRefresh, setShouldRefresh] = useState({ ran: Math.random() });
  const [refreshing, setRefreshing] = useState(false);
  const navigator = useNavigation();
  const snapping = isSession ? ['25%', '40%', '70%'] : ['65%', '65%'];
  const snapPoints = useMemo(() => [...snapping], []);
  // const [profileDetails, setProfileDetails] = useState(null);

  // useEffect(() => {
  //   if (latestMessage) {
  //     setProfileDetails(latestMessage);
  //   }
  // }, [latestMessage]);

  // const onRefresh = () => {
  //   // getProfileDetails();
  //   setShouldRefresh({ ran: Math.random() });
  //   setRefreshing(true);
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 700);
  // };

  // pressing menu btn
  const showBottomSheetHandler = useCallback(() => {
    setShowAbsolute(true);
    setIsSession(false);
    // if (bottomSheetModalRef.current) {
    //   bottomSheetModalRef.current?.present();
    // }
    // navigator.navigate('PrivateLive', {_id: '6360edbc637a4fa9bdeb0ef3'});
  }, []);

  // pressing username
  const showSessionsHandler = useCallback(() => {
    setShowAbsolute(true);
    setIsSession(true);
    // if (bottomSheetModalRef.current) {
    //   bottomSheetModalRef.current?.present();
    // }
    // navigator.navigate('PrivateLive', {_id: '6360edbc637a4fa9bdeb0ef3'});
  }, []);

  const closeModalPress = useCallback(() => {
    setShowAbsolute(false);
    bottomSheetModalRef.current?.close();
  }, []);

  // renders
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    [],
  );

  return (
    <>
      {showAbsolute && (
        <Pressable
          onPress={closeModalPress}
          style={{
            ...styles.showAbsolute,
          }}
        >
          <BottomSheet
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}>
                <Text style={{ ...styles.reactionText, color: '#fff' }}>
                  {isSession ? 'Devices' : 'Menu'}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={closeModalPress}
                  style={styles.closeLine}
                >
                  <Ionicons color={'#838289'} name="close" size={23} />
                </TouchableOpacity>
              </View>
            )}
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                return null;
              }}
            >
              {!isSession && (
                <Suspense
                  fallback={
                    <Fallback />
                    // null
                    // <View style={styles.activityCover}>
                    //   <ActivityIndicator color={'#fff'} size={40} />
                    // </View>
                  }
                >
                  <Menu profileData={CTX?.userObj} />
                </Suspense>
              )}
              {isSession && (
                <Suspense
                  fallback={
                    <Fallback />
                    // null
                    // <View style={styles.activityCover}>
                    //   <ActivityIndicator color={'#fff'} size={40} />
                    // </View>
                  }
                >
                  <LastLogin isSession={isSession} />
                </Suspense>
              )}
            </Pressable>
          </BottomSheet>
        </Pressable>
      )}
      <ScrollView
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff' }}
      >
        <StatusBar
          // barStyle={'#fff'}
          backgroundColor={CTX.statusBarColor}
          // hidden={true}
          barStyle={CTX.isDarkMode ? 'light-content' : 'dark-content'} // text/icons color: "dark-content" or "light-content"
        />

        
        {/* header */}
        <View style={styles.headerHere}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={showSessionsHandler}
          >
            <Text
              style={{
                ...styles.headerTextStyle,
                color: CTX.isDarkMode ? '#fff' : '#3b3b3b',
              }}
            >
              {CTX?.userObj?.username}
            </Text>
            {/* {!params && ( */}
            <Entypo
              name="chevron-down"
              color={CTX.isDarkMode ? '#fff' : '#171717'}
              size={20}
            />
            {/* )} */}
          </TouchableOpacity>

          <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
            {/* {!CTX.userObj?.verify && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigator.navigate('RequestVerification')}
              >
                <MaterialIcons
                  style={{ paddingRight: 0 }}
                  name="verified"
                  color={CTX.isDarkMode ? '#fff' : '#171717'}
                  size={26}
                />
              </TouchableOpacity>
            )} */}

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigator.navigate('AccountNotification')}
              >
                <Ionicons
                  style={{ paddingRight: 0 }}
                  name="notifications-circle-outline"
                  color={CTX.isDarkMode ? '#fff' : '#171717'}
                  size={26}
                />
              </TouchableOpacity>

            {CTX?.userObj?.is_deleting_account && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigator.navigate('MainDeleteAccount')}
              >
                <MaterialIcons
                  style={{ marginLeft: 17 }}
                  name="timelapse"
                  color="#dd0000"
                  size={27}
                />
              </TouchableOpacity>
            )}

            {CTX.userObj?.is_deleting_amass && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigator.navigate('DeleteAmassAccount')}
              >
                <FontAwesome6
                  style={{ marginLeft: 17 }}
                  name="building-circle-exclamation"
                  color="#ee6666"
                  size={22}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={showBottomSheetHandler}
            >
              <Feather
                name="menu"
                style={{ marginLeft: 17 }}
                color={CTX.isDarkMode ? '#fff' : '#171717'}
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile TOP */}
        {CTX?.userObj && (
          <View>
            <Suspense fallback={<Fallback />}>
              <ProfileTop profileDetails={CTX?.userObj} />
            </Suspense>
          </View>
        )}

        {CTX?.userObj && (
          <View style={{ paddingVertical: 20, marginBottom: 20 }}>
            <Suspense fallback={null}>
              {/* <Suggested navigation={navigator} shouldRefresh={shouldRefresh} /> */}
              <Funds
                loading={loading}
                onPress={() => navigator.navigate('ManageFunds')}
              />
            </Suspense>
          </View>
        )}

        {/* {CTX?.userObj && (
          <View style={{paddingVertical: 20}}>
            <Suspense fallback={null}>
            </Suspense>
          </View>
        )} */}

        {/* <View>
          <Suspense fallback={null}>
            <EventPersonalPics
              // userID={CTX.userObj._id}
              isFocused={isFocused}
              navigation={navigator}
              shouldRefresh={shouldRefresh}
            />
          </Suspense>
        </View> */}
      </ScrollView>
    </>
  );
};

export default Profile;
