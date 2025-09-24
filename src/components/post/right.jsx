import {View, Text, Image} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {styles} from './post.styles';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import {MainContext} from '../../../App';
import {useNavigation} from '@react-navigation/native';
import sadHeart from '../../assets/json/sadHeart.json';
import AbbrNum from '../../helper/abbrev';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Lottie from 'lottie-react-native';
import Feather from 'react-native-vector-icons/Feather';
import Logo from '../../assets/ic_launcher.png';
import {PostContext} from '../../../postVideoCTX';

const Right = ({
  onVideoPress,
  item,
  showComment,
  showTags,
  heartScale,
  // setLikeNum,
  // likesArrState,
  likeNum,
  isUserLiked,
  onPressLike,
  showUpload,
  showStats,
  onPressUpload,
  onPressStats,
  personalPost,
}) => {
  const CTX = useContext(MainContext);
  const navigation = useNavigation();
  const [refactoredUser, setRefactoredUser] = useState(null);
  const PostCTX = useContext(PostContext);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: heartScale.value}],
    };
  });

  // useEffect(() => {
  //   setRefactoredUser({
  //     _id: item?.user?._id[0],
  //     username: item?.user?.username[0],
  //     email: item?.user?.email[0],
  //     full_name: item?.user?.full_name[0],
  //     photo: item?.user?.photo[0],
  //     active: item?.user?.active[0],
  //     monetize: item?.user?.monetize[0],
  //     verify: item?.user?.verify[0],
  //   });
  // }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withSequence(
            withTiming(0.7),
            withDelay(700, withTiming(0.1)),
            withTiming(0.7),
            // withTiming(1)
          ),
          -1,
        ),
      },
    ],
  }));

  // console.log("item HRERE!! =>> ", item);

  return (
    <>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{marginBottom: 12, position: 'relative', alignItems: 'center'}}
          onPress={() => {
            // console.log("dsfdsf sdgdsg");

            navigation.navigate('HELLO_WORLD', {
              ...item?.user,
              isCaring: item?.isCaring,
            });
          }}>
          <Image
            style={styles.profileImage}
            source={{
              uri: item?.user?.photo
                ? `${item?.user?.photo}`
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
          />
          {/* 
          {CTX.userObj._id !== item?.user?._id && (
            <>
              {!item?.isCaring && ( */}
          <View
            style={{
              position: 'absolute',
              width: 30,
              height: 30,
              // top: -10,
              // left: -10,
              zIndex: 434,
            }}>
            <Lottie source={sadHeart} autoPlay loop />
          </View>
          {/* )}
            </>
          )} */}
          {/* {parseInt(viewCounts) > 0 && ( */}
          {/* <View
            style={{
              // position: 'absolute',
              // top: 15,
              // right: 20,
              zIndex: 20,
              fontWeight: 'bold',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Feather name={'eye'} size={15} color="#fff" />
            <Text style={{color: '#fff', marginLeft: 2, fontWeight: 'bold'}}>
              {viewCounts}
            </Text>
          </View> */}
          {/* )} */}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressLike}
          style={styles.iconContainer}>
          <Animated.View style={[animatedStyle]}>
            <AntDesign
              name="heart"
              size={35}
              color={isUserLiked ? '#d00' : '#fff'}
            />
          </Animated.View>
          <Text style={styles.iconText}>{AbbrNum(likeNum, 0)}</Text>
        </TouchableOpacity>

        {!PostCTX.upLoading && <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            showComment({userID: item?.user?._id, privateId: item?._id})
          }
          style={styles.iconContainer}>
          {personalPost ? (
            <Ionicons name="stats-chart" size={35} color="#fff" />
          ) : (
            <MaterialCommunityIcons
              name="comment-processing"
              size={35}
              color="#fff"
            />
          )}
          {!personalPost && (
            <Text style={styles.iconText}>
              {AbbrNum(item?.totalComments, 0)}
            </Text>
          )}
        </TouchableOpacity>}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (item?.tags?.length < 1) {
              return null;
            } else {
              showTags({tags: item?.tags, _id: item?._id});
            }
          }}
          style={styles.iconContainer}>
          <FontAwesome name="tags" size={34} color="#fff" />
          <Text style={styles.iconText}>{item?.tags?.length}</Text>
        </TouchableOpacity>

        {personalPost && !PostCTX.upLoading && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onVideoPress()
              console.log("dsfsdfsd fdsfd");
              setTimeout(() => {
                PostCTX?.setIsUploadingNew(true)
              }, 300);
            }}
            style={styles.iconContainer}>
            <MaterialIcons name="edit-square" size={34} color="#fff" />
          </TouchableOpacity>
        )}

        {/* {!PostCTX.upLoading && (
          <>
            {showUpload && (
              <TouchableOpacity
                onPress={onPressUpload}
                activeOpacity={0.8}
                style={styles.iconContainer}>
                <FontAwesome6 name="upload" size={31} color="#fff" />
              </TouchableOpacity>
            )}
          </>
        )}

        {!PostCTX.upLoading && (
          <>
            {showStats && (
              <TouchableOpacity
                onPress={() =>
                  onPressStats({userID: item?.user?._id, privateId: item?._id})
                }
                activeOpacity={0.8}
                style={styles.iconContainer}>
                <Ionicons name="stats-chart" size={31} color="#fff" />
              </TouchableOpacity>
            )}
          </>
        )} */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('AppEventFeatures', {scrollTo: 0})
          }>
          <Animated.View style={[animatedStyles]}>
            <Image
              style={styles.taggedImage}
              source={
                // {
                // uri: 'https://cdn.dribbble.com/userupload/8176940/file/original-c3094d420bb6a4c393de96b020034708.png?compress=1&resize=752x',
                // uri: 'https://cdn.dribbble.com/users/1667332/avatars/normal/edd45777913e5de4434a1a1b812c76cf.png?1566878129',ic_launcher.png
                // uri:
                Logo
                // }
              }
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Right;
