import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
  FlatList,
  TextInput,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';

import UserProfiles from './userProfiles';
import { MainContext } from '../../../App';
import Button from '../../components/button';
const EventUserProfiles = () => {
  const CTX = useContext(MainContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [userObj, setUserObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAbsolute, setShowAbsolute] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['30%', '40%'], []);
  const [isWhat, setIsWhat] = useState(null);
  const [blockLoading, setBlockLoading] = useState(false);
  const listCate = [
    { name: 'Violent & hateful entities' },
    { name: 'Impersonation' },
    { name: 'Spam' },
    { name: 'Privacy' },
    { name: 'Child safety' },
    { name: 'Sensitive or disturbing media' },
    { name: 'Hate' },
    { name: 'Violent speech' },
    { name: 'Suicide or self-harm' },
    { name: 'Abuse & Harassment' },
  ];
  const [topIndex, setIndex] = useState(null);
  const [reportingNote, setReportingNote] = useState(false);
  const [note, setNote] = useState('');

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  const allButtonHandler = async () => {
    try {
      if (isWhat == 'report' && !reportingNote) {
        setReportingNote(true);
        return;
      }

      if (blockLoading) {
        return null;
      }

      if (isWhat == 'report' && note.length < 3) {
        createThreeButtonAlert(
          'Write down reason for reporting ' + '@' + route?.params?.username,
        );
        return;
      }

      const url =
        isWhat == 'report'
          ? `${CTX.url}account/profile/report/user/${route?.params?._id}`
          : `${CTX.url}account/profile/toggle/block/${route?.params?._id}`;

      setBlockLoading(true);
      const fetchUser = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CTX.sessionToken}`,
        },
        body: JSON.stringify({
          reason: note,
        }),
      });
      const jsoned = await fetchUser?.json();

      if (jsoned?.e) {
        createThreeButtonAlert(jsoned?.m);
        return;
      }

      setIsWhat(null);
      setIndex(null);
      setReportingNote(false);
      setNote('');
      navigation.replace('Navigation', { screen: 'Profile' });
      setBlockLoading(false);
    } catch (error) {
      console.log('error verifying create account => ', error);
      createThreeButtonAlert('Network request failed');
      setBlockLoading(false);
    }
  };

  const getUserDetails = useCallback(async () => {
    try {
      // if (loading) {
      //   return null;
      // }

      setLoading(true);
      // console.log(" `${CTX.url}account/profile/get/details` ===>>>> ", `${CTX.url}account/profile/get/details`);
      const fetchUser = await fetch(
        `${CTX.systemConfig?.p}get/account/profile/details/${route?.params?._id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CTX.sessionToken}`,
          },
        },
      );
      const jsoned = await fetchUser?.json();

      if (jsoned?.e) {
        createThreeButtonAlert(jsoned?.m);
        return;
      }

      // console.log('jsoned?.data from getUserDetails =>> ', jsoned?.data);

      setUserObj(jsoned?.data);

      const anotherFetchUser = await fetch(
        `${CTX.url}account/profile/get/details`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CTX.sessionToken}`,
          },
        },
      );
      const anoJsoned = await anotherFetchUser?.json();

      CTX.setUserObj(anoJsoned?.data);
      navigation.setOptions({
        title: route?.params?.username,
        headerTitleStyle: {
          color: CTX.isDarkMode ? '#fff' : '#000', // <-- your custom color here
          fontSize: 18, // optional, custom size
          fontFamily: 'Gilroy-Bold',
        },
        headerStyle: {
          backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
        },
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            // onPress={() => alert('Icon pressed!')}>
            onPress={showBottomSheetHandler}
          >
            <Entypo
              name="dots-three-vertical"
              size={24}
              color={CTX.isDarkMode ? '#fff' : 'black'}
            />
          </TouchableOpacity>
        ),
      });
      setLoading(false);
    } catch (error) {
      console.log('error verifying create account => ', error);
      createThreeButtonAlert('Network request failed');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (route?.params._id == CTX.userObj._id) {
      // navigation.navigate("Profile")
      // navigation.navigate("Profile");

      navigation.navigate('Navigation', { screen: 'Profile' });
    } else {
      navigation.setOptions({
        title: route?.params?.username,
        // headerRight: () => (
        //   <TouchableOpacity
        //     style={{marginRight: 10}}
        //     // onPress={() => alert('Icon pressed!')}>
        //     onPress={showBottomSheetHandler}>
        //     <Entypo name="dots-three-vertical" size={24} color="black" />
        //   </TouchableOpacity>
        // ),
      });
      // route?.params?.title = "1xBet"
      setUserObj(route?.params);
      getUserDetails();
    }
  }, [route?.params]);

  const showBottomSheetHandler = useCallback(() => {
    setShowAbsolute(true);
    bottomSheetModalRef.current?.present();
  }, []);

  const closeModalPress = useCallback(() => {
    try {
      setShowAbsolute(false);
      bottomSheetModalRef.current?.close();
    } catch (error) {
      console.log('error from closeModalPress =>> ', error);
    }
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isWhat !== null}
        onRequestClose={() => {
          setIsWhat(null);
          setIndex(null);
          setReportingNote(false);
          setNote('');
        }}
      >
        <Pressable style={styles.anocenteredView}>
          <View style={{ ...styles.anomodalView }}>
            <>
              {isWhat == 'report' && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setIsWhat(null);
                      setIndex(null);
                      setReportingNote(false);
                      setNote('');
                    }}
                    style={styles.closeLine}
                  >
                    <Ionicons color={'#838289'} name="close" size={23} />
                  </TouchableOpacity>
                </View>
              )}
              <Text
                style={{
                  color: '#555',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                }}
              >
                {isWhat == 'report' ? 'Data Collection' : 'Confirmation!'}
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                {isWhat == 'report' ? (
                  <>
                    {reportingNote
                      ? 'Reason for reporting'
                      : 'What type of issue are you reporting?'}
                  </>
                ) : (
                  "Are you sure you want to block this user? They will no longer be able to interact with you, and you won't see their content anymore."
                )}
              </Text>

              {isWhat == 'report' && (
                <>
                  {reportingNote ? (
                    <View style={styles.textAreaStyle}>
                      <TextInput
                        style={{
                          ...styles.messageInput,
                          fontSize: 13,
                          textAlignVertical: 'top',
                          fontFamily: 'Overpass-Regular',
                        }}
                        multiline={true}
                        placeholder="Share your thought . . . "
                        placeholderTextColor={'#00000062'}
                        numberOfLines={27}
                        onChangeText={e => {
                          if (note.length > 2200) {
                            return;
                          }
                          setNote(e);
                        }}
                        value={note}
                      />
                    </View>
                  ) : (
                    <FlatList
                      style={{ marginTop: 20 }}
                      data={listCate}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => setIndex(index)}
                          key={index}
                          style={styles.coverUserCommentSection}
                        >
                          <Text style={styles.sortText}>{item.name}</Text>
                          <View
                            style={{
                              ...styles.clickable,
                              backgroundColor:
                                index == topIndex ? '#e20154' : '#fff',
                            }}
                          >
                            <View style={styles.innerCircle}></View>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </>
              )}

              {isWhat == 'block' && (
                <Text
                  style={styles.learnMore}
                  onPress={() => {
                    setIsWhat(null);
                    setIndex(null);
                    setReportingNote(false);
                    setNote('');
                  }}
                >
                  Cancel
                </Text>
              )}
              <Button
                loading={blockLoading}
                onPress={allButtonHandler}
                disable={isWhat == 'block' ? false : !topIndex}
                label={
                  isWhat == 'block' &&
                  CTX.userObj?.blocked?.some(v => v == route?.params?._id)
                    ? 'Unblock'
                    : isWhat == 'block'
                    ? 'Block'
                    : isWhat == 'report' && !reportingNote
                    ? 'Next'
                    : 'Report'
                }
                style={{ width: '100%', marginTop: 17, height: 50 }}
              />
            </>
          </View>
        </Pressable>
      </Modal>

      {showAbsolute && (
        <Pressable
          onPress={closeModalPress}
          style={{
            ...styles.showAbsolute,
            // display: showAbsolute ? 'flex' : 'none',
          }}
        >
          <BottomSheet
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            // onChange={handleSheetChange}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}>
                <Text style={{ ...styles.reactionText, color: '#fff' }}>
                  {/* {route?.params?.username} */}
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
            <BottomSheetScrollView style={{ width: '100%', height: '100%' }}>
              <Pressable
                onPress={() => {
                  return null;
                }}
                style={{ height: '100%' }}
              >
                <View style={{ padding: 20 }}>
                  <TouchableOpacity
                    style={{
                      marginTop: 20,
                      marginBottom: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      setIsWhat('block');
                      closeModalPress();
                    }}
                  >
                    <Text
                      style={{
                        color: 'red',
                        fontSize: 17,
                      }}
                    >
                      {CTX.userObj?.blocked?.filter(
                        v => v == route?.params?._id,
                      )?.length > 0 ? (
                        <>Unblock @{route?.params?.username}</>
                      ) : (
                        <>Block @{route?.params?.username}</>
                      )}
                    </Text>

                    <Entypo name="block" size={19} color="red" />
                  </TouchableOpacity>
                  <View
                    style={{
                      borderStyle: 'solid',
                      borderTopColor: '#999',
                      borderTopWidth: 1,
                    }}
                  ></View>

                  <TouchableOpacity
                    style={{
                      marginTop: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      setIsWhat('report');
                      closeModalPress();
                    }}
                  >
                    <Text style={{ color: 'red', fontSize: 17 }}>
                      Report @{route?.params?.username}
                    </Text>

                    <Ionicons name="warning-outline" size={23} color="red" />
                  </TouchableOpacity>
                </View>
              </Pressable>
            </BottomSheetScrollView>
          </BottomSheet>
        </Pressable>
      )}

      <UserProfiles
        userObj={userObj}
        getUserDetails={getUserDetails}
        loading={loading}
      />
    </>
  );
};

export default EventUserProfiles;

const styles = StyleSheet.create({
  messageInput: {
    textAlign: 'left',
    height: 180,
    color: '#000',
    justifyContent: 'flex-start',
  },
  textAreaStyle: {
    // borderBottomColor: '#e2015429',
    borderColor: '#00000022',
    borderWidth: 1,
    borderRadius: 17,
    padding: 20,
    marginTop: 30,
    width: '100%',
    marginBottom: 15,
  },
  coverUserCommentSection: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    marginBottom: 1,
    // paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortText: {
    color: '#111',
    fontSize: 16,
  },
  clickable: {
    width: 30,
    height: 30,
    borderRadius: 45,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: '#00000022',
    borderWidth: 1,
  },
  innerCircle: {
    width: 13,
    marginLeft: 0,
    height: 13,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  anocenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    backgroundColor: '#00000099',
  },
  anomodalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 7,
    padding: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  learnMore: {
    color: '#555',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 30,
  },

  renderInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  showAbsolute: {
    position: 'absolute',
    // backgroundColor: '#e010b400',
    backgroundColor: '#00003330',
    width: '100%',
    height: '100%',
    zIndex: 22,
  },
  handleComponentStyle: {
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    backgroundColor: '#e20154',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 2,
  },
  reactionText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeLine: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#e1e1e1',
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 'auto',
    justifyContent: 'center',
  },
  sendIconCover: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#e1e1e1',
    width: 42,
    height: 42,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 'auto',
    justifyContent: 'center',
  },
  coverScrollView: {
    backgroundColor: '#efefef',
    // backgroundColor: 'red',
    height: '100%',
    padding: 20,
    paddingTop: 0,
  },
});
