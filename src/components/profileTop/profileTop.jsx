import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Linking,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5Pro';
import { useNavigation } from '@react-navigation/core';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Lottie from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

// import animationData from '../../../../assets/json/loading.json';
import animationData from '../../assets/json/withLoading.json';
import happyEyes from '../../assets/json/happyEyes.json';
import waves from '../../assets/json/waves.json';
import cryingEyes from '../../assets/json/Crying_emoji.json';
//   import sadHeart from '../../assets/json/sadHeart.json';
import AbbrNum from '../../helper/abbrev';
import styles from './profileTop.styles';
import { MainContext } from '../../../App';
//   import ErrMessage from '../errMessage/errMessage';
import Entypo from 'react-native-vector-icons/Entypo';

// all profile top profile picture with the total posted
const Profile = ({ profileDetails, loading, toggleCheckCaring }) => {
  const navigator = useNavigation();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [bigImg, setBigImg] = useState({ _id: '', img: '' });
  const [loadingImg, setLoadingImg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const CTX = useContext(MainContext);

  const getFullImg = async () => {
    setLoadingImg(true);
    setShowMsg(false);
    setErrMsg('');
    try {
      const getsmth = await fetch(
        `${CTX.url}account/get/big/image/${profileDetails?._id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await getsmth.json();
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      if (parsedJson?.error) {
        setErrMsg(parsedJson?.msg);
        setLoadingImg(false);
        setShowMsg(true);
        return;
      }
      // console.log('IMAGE!!! parsedJson?.data! => ', parsedJson?.data);
      setBigImg(parsedJson?.data);
      setLoadingImg(false);
    } catch (error) {
      setLoadingImg(false);
      console.log('error fetching data for getFullImg! => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  // const navigateUserToPrivate = useCallback(() => {
  //   if (profileDetails?.private_life) {
  //     navigator.navigate('Private', { _id: profileDetails?._id });
  //   } else {
  //     return;
  //   }
  // }, []);

  useEffect(() => {
    if (isModalDelete) {
      if (bigImg._id != profileDetails?._id) {
        getFullImg();
      }
    }
  }, [isModalDelete]);

  const { width } = Dimensions.get('window');

  const imageSize = width; // since aspectRatio = 1 → square

  const linearColor = CTX?.isDarkMode ? '#0f0f0f' : 'white';

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalDelete}
        onRequestClose={() => setIsModalDelete(!isModalDelete)}
      >
        <Pressable
          onPress={() => setIsModalDelete(!isModalDelete)}
          style={styles.anocenteredView}
        >
          <View style={{ ...styles.anomodalView }}>
            <>
              {loadingImg ? (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lottie
                    style={styles.Lottie}
                    source={animationData}
                    autoPlay
                    loop
                  />
                </View>
              ) : (
                <Image
                  source={{ uri: profileDetails?.photo || bigImg.img }}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </>
          </View>
        </Pressable>
      </Modal>

      <View>
        <Pressable style={{ position: 'relative' }}>
          <View style={{ position: 'relative' }}>
            <Image
              source={{
                uri: profileDetails?.photo
                  ? `${profileDetails?.photo}`
                  : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
              }}
              style={{
                ...styles.topImage,
              }}
            />
            <LinearGradient
              colors={['transparent', linearColor]} // transparent at top → black (background) at bottom
              style={{
                position: 'absolute',
                bottom: 0,
                width: width,
                height: 15, // size of blending area
              }}
            />
          </View>
        </Pressable>

        <View style={styles.topCoverHere}>
          {loading ? (
            <View style={styles.lazyLoad}>
              <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                <SkeletonPlaceholder.Item width={55} height={69} />
              </SkeletonPlaceholder>
            </View>
          ) : (
            <Pressable
              onPress={() =>
                navigator.navigate('CaringSection', {
                  username: profileDetails?.username,
                  isCaring: false,
                  _id: profileDetails?._id,
                  caring: profileDetails?.caring,
                  cared: profileDetails?.cared,
                })
              }
              style={styles.coverCommentHere}
            >
              <Text
                style={{
                  ...styles.commentOwner,
                  color: CTX.isDarkMode ? '#f5f5f5' : '#3b3b3b',
                }}
              >
                {AbbrNum(
                  profileDetails?.caring ? profileDetails?.caring : 0,
                  0,
                )}
              </Text>
              <Text
                style={{
                  ...styles.comment,
                  color: CTX.isDarkMode ? '#f5f5f5' : '#3b3b3b',
                }}
              >
                cared
              </Text>
            </Pressable>
          )}

          {loading ? (
            <View style={styles.lazyLoad}>
              <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                <SkeletonPlaceholder.Item width={55} height={69} />
              </SkeletonPlaceholder>
            </View>
          ) : (
            <Pressable
              onPress={() =>
                navigator.navigate('CaringSection', {
                  username: profileDetails?.username,
                  isCaring: true,
                  _id: profileDetails?._id,
                  caring: profileDetails?.caring,
                  cared: profileDetails?.cared,
                })
              }
              style={styles.coverCommentHere}
            >
              <Text
                style={{
                  ...styles.commentOwner,
                  color: CTX.isDarkMode ? '#f5f5f5' : '#3b3b3b',
                }}
              >
                {AbbrNum(profileDetails?.cared ? profileDetails?.cared : 0, 0)}
              </Text>
              <Text
                style={{
                  ...styles.comment,
                  color: CTX.isDarkMode ? '#f5f5f5' : '#3b3b3b',
                }}
              >
                caring
              </Text>
            </Pressable>
          )}

          {loading ? (
            <View style={styles.lazyLoad}>
              <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                <SkeletonPlaceholder.Item width={55} height={69} />
              </SkeletonPlaceholder>
            </View>
          ) : profileDetails?._id == CTX.userObj._id ? (
            <Pressable
              onPress={() => navigator.navigate('EditProfile')}
              style={{
                ...styles.eachCoverBTN,
                backgroundColor: '#616161',
              }}
            >
              <MaterialIcons name="edit-road" size={26} color="#fff" />
            </Pressable>
          ) : profileDetails?.checkCaring ? (
            <Pressable
              onPress={toggleCheckCaring}
              style={{
                ...styles.eachCoverBTN,
                backgroundColor: '#28A74599',
              }}
            >
              <Lottie
                source={happyEyes}
                autoPlay
                loop
                style={{ width: 50, height: 50 }}
              />
            </Pressable>
          ) : (
            <Pressable
              onPress={toggleCheckCaring}
              style={{
                ...styles.eachCoverBTN,
                backgroundColor: '#DC354599',
              }}
            >
              <Lottie
                source={cryingEyes}
                autoPlay
                loop
                style={{ width: 44, height: 44 }}
              />
            </Pressable>
          )}

          {loading ? (
            <></>
          ) : (
            profileDetails?.isPublicLive && (
              <Pressable
                // onPress={() =>
                //   navigator.navigate('CaringSection', {
                //     username: profileDetails.username,
                //     isCaring: true,
                //     _id: profileDetails._id,
                //     caring: profileDetails.caring,
                //     cared: profileDetails.cared,
                //   })
                // }
                style={{
                  ...styles.eachCoverBTN,
                  backgroundColor: '#2190fe89',
                  overflow: 'hidden',
                }}
              >
                <Lottie
                  source={waves}
                  autoPlay
                  loop
                  style={{ width: 100, height: 100 }}
                />

                <MaterialIcons
                  name="stream"
                  size={35}
                  color="#f5f5f5"
                  style={{
                    position: 'absolute',
                  }}
                />
              </Pressable>
            )
          )}

          {loading ? (
            <></>
          ) : (
            profileDetails?.isPrivateLive && (
              <Pressable
                // onPress={() =>
                //   navigator.navigate('CaringSection', {
                //     username: profileDetails.username,
                //     isCaring: true,
                //     _id: profileDetails._id,
                //     caring: profileDetails.caring,
                //     cared: profileDetails.cared,
                //   })
                // }
                style={{
                  ...styles.eachCoverBTN,
                  backgroundColor: '#2190fe89',
                  overflow: 'hidden',
                }}
              >
                <Lottie
                  source={waves}
                  autoPlay
                  loop
                  style={{ width: 100, height: 100 }}
                />
                <MaterialIcons
                  name="lock-outline"
                  size={32}
                  color="#f5f5f5"
                  style={{
                    position: 'absolute',
                  }}
                />
              </Pressable>
            )
          )}

          {loading ? (
            <View style={styles.lazyLoad}>
              <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                <SkeletonPlaceholder.Item width={55} height={69} />
              </SkeletonPlaceholder>
            </View>
          ) : (
            profileDetails?._id != CTX.userObj._id && (
              <Pressable
                onPress={() =>
                  navigator.navigate('MainChat', {
                    ...profileDetails,
                    isChat: false,
                  })
                }
                style={{
                  ...styles.eachCoverBTN,
                  backgroundColor: '#ff6765',
                }}
              >
                <Feather
                  name="message-circle"
                  size={35}
                  color="#fff"
                  style={{
                    transform: [{ rotate: '-90deg' }],
                    // marginTop: 4,
                    // marginRight: 4,
                  }}
                />
              </Pressable>
            )
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 17,
            paddingHorizontal: 15,
          }}
        >
          {loading ? (
            <View style={styles.lazyLoad}>
              <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                <SkeletonPlaceholder.Item width={190} height={20} />
              </SkeletonPlaceholder>
            </View>
          ) : (
            <Text
              style={[
                styles.commentOwner,
                {
                  fontSize: 16,
                  textAlign: 'left',
                  color: CTX.isDarkMode ? '#fff' : '#3b3b3b',
                },
              ]}
            >
              {profileDetails?.full_name}
            </Text>
          )}
          {profileDetails?.verify && (
            <MaterialIcons
              style={{ marginLeft: 5 }}
              name="verified"
              color="#91ff91"
              size={17}
            />
          )}
        </View>
        {loading ? (
          <View style={{ ...styles.lazyLoad, marginVertical: 8 }}>
            <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
              <SkeletonPlaceholder.Item width={190} height={20} />
            </SkeletonPlaceholder>
          </View>
        ) : (
          <Text
            style={[
              styles.comment,
              {
                fontSize: 16,
                textAlign: 'left',
                color: CTX.isDarkMode ? '#fff' : '#000',
                marginTop: 8,
                paddingHorizontal: 15,
                fontFamily: 'Gilroy-Thin',
              },
            ]}
          >
            {profileDetails?.category
              ? profileDetails?.category
              : 'No category'}
          </Text>
        )}

        {loading ? (
          <View style={styles.lazyLoad}>
            <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
              <SkeletonPlaceholder.Item width={270} height={60} />
            </SkeletonPlaceholder>
          </View>
        ) : (
          <Text
            style={[
              styles.commentOwner,
              {
                fontSize: 16,
                fontWeight: '400',
                textAlign: 'left',
                width: 300,
                color: CTX.isDarkMode ? '#fff' : '#26262688',
                fontFamily: 'Gilroy-Medium',
                paddingHorizontal: 15,
                marginTop: 4,
              },
            ]}
          >
            {profileDetails?.bio}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 50,
            paddingHorizontal: 15,
            justifyContent: 'space-between',
          }}
        >
          {profileDetails?.external_links?.some(
            v => v.social == 'instagram',
          ) && (
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `${
                    profileDetails?.external_links.filter(
                      v => v.social == 'instagram',
                    )[0]?.link
                  }`,
                )
              }
            >
              <FontAwesome5Brands
                name="instagram-square"
                size={32}
                color={CTX?.isDarkMode ? '#f5f5f5' : '#3b3b3b'}
              />
            </Pressable>
          )}

          {profileDetails?.external_links?.some(v => v.social == 'tiktok') && (
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `${
                    profileDetails?.external_links.filter(
                      v => v.social == 'tiktok',
                    )[0]?.link
                  }`,
                )
              }
            >
              <FontAwesome5Brands
                name="tiktok"
                size={32}
                color={CTX?.isDarkMode ? '#f5f5f5' : '#3b3b3b'}
              />
            </Pressable>
          )}

          {profileDetails?.external_links?.some(v => v.social == 'youtube') && (
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `${
                    profileDetails?.external_links.filter(
                      v => v.social == 'youtube',
                    )[0]?.link
                  }`,
                )
              }
            >
              <FontAwesome5Brands
                name="youtube"
                size={32}
                color={CTX?.isDarkMode ? '#f5f5f5' : '#3b3b3b'}
              />
            </Pressable>
          )}

          {profileDetails?.external_links?.some(
            v => v.social == 'facebook',
          ) && (
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `${
                    profileDetails?.external_links.filter(
                      v => v.social == 'facebook',
                    )[0]?.link
                  }`,
                )
              }
            >
              <FontAwesome5Brands
                name="facebook-f"
                size={32}
                color={CTX?.isDarkMode ? '#f5f5f5' : '#3b3b3b'}
              />
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
};

export default memo(Profile);
