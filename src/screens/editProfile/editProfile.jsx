import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, {
  memo,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';

import styles from './editProfile.styles';
import { MainContext } from '../../../App';
import Fallback from '../../components/fallback/fallback';
import { useWebSocket } from '../../../WebSocketContext';
const Category = React.lazy(() => import('./category'));
const EditProfile = ({
  editProfileHandler,
  loading,
  full_name,
  setFull_name,
  username,
  setUsername,
  bio,
  setBio,
  usernameLoading,
  clearAllUsername,
  usernameErr,
  selectImageHandler,
  sendToServer,
  loadingImg,
  label,
}) => {
  const CTX = useContext(MainContext);
  const [showAbsolute, setShowAbsolute] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const navigator = useNavigation();
  const snapPoints = useMemo(() => ['100%', '100%'], []);
  const { latestMessage, connectionStatus } = useWebSocket();
  const [profileDetails, setProfileDetails] = useState(null);

  useEffect(() => {
    if (latestMessage) {
      setProfileDetails(latestMessage);
    }
  }, [latestMessage]);

  // console.log("profileDetails.photo =>>> ", profileDetails.photo);

  const showBottomSheetHandler = useCallback(() => {
    setShowAbsolute(true);
    bottomSheetModalRef.current?.present();
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
            // onChange={handleSheetChange}
            handleComponent={() => (
              <View style={styles.handleComponentStyle}></View>
            )}
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                return null;
              }}
            >
              <Suspense fallback={<Fallback />}>
                <Category
                  closeBottomSheet={closeModalPress}
                  sendToServer={sendToServer}
                />
              </Suspense>
            </Pressable>
          </BottomSheet>
        </Pressable>
      )}

      <StatusBar
        barStyle={CTX.isDarkMode ? 'light-content' : 'dark-content'} // text/icons color: "dark-content" or "light-content"
        backgroundColor={CTX.statusBarColor}
        translucent={false}
      />

      <ScrollView
        style={{
          ...styles.containerCover,
          backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <View style={styles.profileImgCover}>
              {profileDetails?.photo ? (
                <Image
                  style={styles.profileImg}
                  source={{
                    uri: profileDetails?.photo,
                  }}
                />
              ) : (
                <Image
                  style={styles.profileImg}
                  source={{
                    uri: 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
                  }}
                />
              )}
              {loadingImg && (
                <View style={styles.profileImgLoaderCover}>
                  <ActivityIndicator color={'#fff'} size={'small'} />
                </View>
              )}
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={selectImageHandler}>
              <Text style={styles.uploadNew}>Upload new profile</Text>
            </TouchableOpacity>
          </View>
          <View style={{ padding: 20, marginLeft: 'auto' }}>
            {/* <Pressable style={styles.linkSection}>
              <Text style={styles.sideText}>Share profile</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color="#9f9f9f"
              />
            </Pressable> */}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={showBottomSheetHandler}
              style={styles.linkSection}
            >
              <Text
                style={{
                  ...styles.sideText,
                  color: CTX?.isDarkMode ? '#fff' : '#3b3b3b',
                }}
              >
                Edit category
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color="#9f9f9f"
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigator.navigate('ExternalLink')}
              style={styles.linkSection}
            >
              <Text
                style={{
                  ...styles.sideText,
                  color: CTX?.isDarkMode ? '#fff' : '#3b3b3b',
                }}
              >
                Add external link
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color="#9f9f9f"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ padding: 20 }}>
          <Pressable style={styles.eachNameCover}>
            <Text
              style={{
                ...styles.upperText,
                color: CTX.isDarkMode ? '#fff' : '#9f9f9f',
              }}
            >
              Display name
            </Text>
            <View style={styles.viewCover}>
              <TextInput
                style={{
                  ...styles.mainText,
                  fontFamily: 'Gilroy-Regular',
                  color: CTX.isDarkMode ? '#fff' : '#3b3b3b',
                }}
                value={full_name}
                editable={!profileDetails?.verify}
                onChangeText={setFull_name}
                placeholderTextColor={CTX.isDarkMode ? '#fff' : '#3b3b3b'}
                placeholder={profileDetails?.full_name}
              />
            </View>
          </Pressable>

          <Pressable
            style={{
              ...styles.eachNameCover,
              borderBottomColor: usernameErr ? '#f00' : '#ccc',
              marginTop: 20,
            }}
          >
            <Text
              style={{
                ...styles.upperText,
                color: CTX.isDarkMode ? '#fff' : '#9f9f9f',
              }}
            >
              Username
            </Text>
            <View
              style={{
                ...styles.viewCover,
                flexDirection: 'row',
                position: 'relative',
              }}
            >
              <TextInput
                style={{
                  ...styles.mainText,
                  fontFamily: 'Gilroy-Regular',
                  color: usernameErr
                    ? '#f00'
                    : CTX.isDarkMode
                    ? '#fff'
                    : '#3b3b3b',
                }}
                placeholderTextColor={CTX.isDarkMode ? '#fff' : '#3b3b3b'}
                editable={!profileDetails?.verify}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholder={profileDetails?.username}
              />
              {/* {usernameLoading && (
              <ActivityIndicator
                // color="#9e005d"
                color={CTX.isDarkMode ? '#fff' : '#000'}
                size={20}
                style={{ position: 'absolute', right: 10 }}
              />
              )} */}
              {/* {username.length == 1 && (
                <Text
                  onPress={clearAllUsername}
                  style={{
                    color: '#9e005d',
                    fontWeight: 'bold',
                    marginLeft: 'auto',
                    marginRight: 20,
                  }}
                >
                  Clear all
                </Text>
              )} */}
            </View>
          </Pressable>
          {usernameErr && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // paddingHorizontal: 10,
                marginTop: 5,
              }}
            >
              <Ionicons
                name="warning"
                color="#d00"
                size={17}
                style={{ marginRight: 7 }}
              />

              <Text style={{ color: '#d00', fontSize: 11 }}>{usernameErr}</Text>
            </View>
          )}

          <Pressable style={{ ...styles.eachNameCover, marginTop: 20 }}>
            <Text
              style={{
                ...styles.upperText,
                color: CTX.isDarkMode ? '#fff' : '#9f9f9f',
              }}
            >
              Bio
            </Text>

            <View style={{ ...styles.viewCover, height: 130 }}>
              <TextInput
                style={{
                  ...styles.mainText,
                  height: '100%',
                  fontSize: 16,
                  fontFamily: 'Gilroy-Regular',
                  textAlignVertical: 'top',
                  color: CTX.isDarkMode ? '#fff' : '#3b3b3b',
                }}
                placeholderTextColor="#3b3b3b"
                placeholder={
                  profileDetails?.bio
                    ? profileDetails?.bio
                    : 'Write something...'
                }
                multiline={true}
                numberOfLines={3}
                value={bio}
                onChangeText={setBio}
              />
            </View>
          </Pressable>

          <Text style={{ ...styles.upperText, marginTop: 10 }}>
            You can only edit your profile twice within 14 days
          </Text>

          {/* <Text
            style={{
              color: 'blue',
              fontSize: 15,
              // fontWeight: 'bold',
              marginTop: 0,
                  fontFamily: 'Gilroy-Bold',

            }}>
            Learn more
          </Text> */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => editProfileHandler()}
            style={{ paddingTop: 50 }}
          >
            <View style={styles.eachBtnCover}>
              {loading ? (
                <ActivityIndicator color="#262626" size={30} />
              ) : (
                <Text style={styles.eachBtnText}>{label}</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default EditProfile;
