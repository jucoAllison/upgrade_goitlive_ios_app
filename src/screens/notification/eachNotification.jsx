import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useContext, useState } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/core';
import { MainContext } from '../../../App';

const EachNotification = ({
  showMsg,
  errMsg,
  loading,
  notification,
  reTryStuff,
  topIndex,
}) => {
  const navigation = useNavigation();
  const CTX = useContext(MainContext);
  var maxLength = 130;
  const [data, setData] = useState([
    {
      user: {
        photo:
          'https://cdn.dribbble.com/users/159815/avatars/normal/care.jpg?1care444519773',
        username: 'hello_world',
      },
      note: 'cared you',
      type: 'care',
      date: '2h ago',
    },
    {
      user: {
        photo:
          'https://cdn.dribbble.com/users/4394/avatars/normal/274c3c3b6ad9adec0888c9c9c722a4d6.jpg?1522413391',
        username: 'hello_world',
      },
      note: 'tagged you on his post',
      type: 'tag',
      date: '14h ago',
    },
    {
      user: {
        photo:
          'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
        username: 'hello_world',
      },
      note: 'cared you',
      type: 'care',
      date: '2h ago',
    },
    {
      user: {
        photo:
          'https://cdn.dribbble.com/users/4394/avatars/normal/274c3c3b6ad9adec0888c9c9c722a4d6.jpg?1522413391',
        username: 'hello_world',
      },
      note: 'cared you',
      type: 'care',
      date: '2h ago',
    },
    {
      user: {
        photo:
          'https://cdn.dribbble.com/users/377878/avatars/normal/b5baa50ac2ab81d10bdfa989361ceeba.jpg?1457901250',
        username: 'hello_world',
      },
      note: 'cared you',
      type: 'care',
      date: '2h ago',
    },
  ]);

  const mapEachNot = notification
    .filter(v => {
      if (topIndex == 'all') {
        return notification;
      } else {
        return v.type == topIndex;
      }
    })
    .map((v, i) => {
      var result = v?.msgObj?.replyingObj?.msg?.substring(0, maxLength) + '...';

      return (
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#bbb',
            paddingBottom: 10,
          }}
          key={i}
        >
          <View style={styles.coverNot} key={i}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (v?.user?.status?.length > 0) {
                  navigation.navigate('StatusMenu', {
                    _id: v?.user?._id,
                  });
                }
              }}
              style={{
                ...styles.coverStatusRound,
                borderWidth: v?.user?.status?.length > 0 ? 1 : 0,
              }}
            >
              <Image
                source={{
                  uri: v?.user?.photo
                    ? v?.user?.photo
                    : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
                }}
                style={styles.eachImg}
              />
              {v?.user?.active && <View style={styles.isActive}></View>}
            </TouchableOpacity>

            <View
              style={{
                width: '100%',
                paddingRight: 40.4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('userProfiles', {
                      ...v?.user,
                    });
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.username}>{v?.user?.username}</Text>
                    {v?.user?.verify && (
                      <MaterialIcons
                        style={{ marginLeft: 2 }}
                        name="verified"
                        color="#999"
                        size={15}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    ...styles.username,
                    color: '#9f9f9f',
                    fontSize: 14,
                    fontWeight: '300',
                    fontFamily: 'Gilroy-Regular',

                    // backgroundColor: "red",

                    marginLeft: 5,
                  }}
                >
                  {v?.note}
                </Text>
              </View>
              {v?.msgObj ? (
                <View
                  style={{
                    backgroundColor: '#efefef',
                    padding: 2,
                    paddingLeft: 9,
                  }}
                >
                  {v?.msgObj?.replyingObj && (
                    <>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text style={styles.time}>You</Text>

                        {/* <Text style={{...styles.time}}>X</Text> */}
                      </View>
                      <Text
                        style={{
                          color: '#999',
                          fontSize: 13,
                          fontFamily: 'Gilroy-Regular',
                        }}
                      >
                        {v?.msgObj?.replyingObj?.msg?.length > maxLength
                          ? result
                          : v?.msgObj?.replyingObj?.msg}
                      </Text>

                      <View
                        style={{
                          height: 3,
                          width: '100%',
                          marginTop: 'auto',
                        }}
                      ></View>
                    </>
                  )}
                  {/* <View style={styles.eachCommentCover}>
                      <View style={styles.eachCommentCover}> */}
                  <View style={styles.coverCommentHere}>
                    <Text style={styles.comment}>{v?.msgObj?.content}</Text>
                  </View>
                  {/* <View style={styles.loveHere}>
          <Ionicons name="ios-heart-sharp" size={20} color={'#838289'} />
        </View> */}
                  {/* </View>
                    </View> */}
                </View>
              ) : (
                <Text style={styles.dateText}>{v?.date}</Text>
              )}
            </View>
          </View>

          {/* depending on the notification type, these is where we buttons go */}
          {/* {v.type === 'care' && (
            <TouchableOpacity activeOpacity={0.8} style={styles.eachBtnCover}>
              <Text style={styles.eachBtnText}>Care back</Text>
            </TouchableOpacity>
          )} */}
          {v.type === 'tag' && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.eachBtnCover}
              onPress={() =>
                navigation.push('TaggedPostScreen', { _id: v?.post })
              }
            >
              <Text style={styles.eachBtnText}>Accept</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    });

  //
  const mapLoading = Array(5)
    .fill('sds')
    .map((v, i) => {
      return (
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#bbb',
            //   paddingBottom: 10,
          }}
          key={i}
        >
          <View style={styles.coverNot} key={i}>
            <View style={styles.loadingImg}>
              <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                <SkeletonPlaceholder.Item width={44} height={44} />
              </SkeletonPlaceholder>
            </View>

            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginBottom: 3 }}>
                  <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                    <SkeletonPlaceholder.Item width={85} height={16} />
                  </SkeletonPlaceholder>
                </View>
              </View>
              <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
                <SkeletonPlaceholder.Item width={65} height={13} />
              </SkeletonPlaceholder>
            </View>
          </View>

          {/* depending on the notification type, these is where we buttons go */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.loadingEachBtnCover}
          >
            <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
              <SkeletonPlaceholder.Item width={125} height={37} />
            </SkeletonPlaceholder>
          </TouchableOpacity>
        </View>
      );
    });

  return (
    <View>
      {loading ? (
        mapLoading
      ) : showMsg ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={reTryStuff}
          style={{ marginTop: 60, ...styles.activiityCover }}
        >
          <FontAwesome5 size={40} color="#262626" name="holly-berry" />
          <Text style={{ ...styles.username, marginTop: 6 }}>{errMsg}</Text>
          <Text style={styles.dateText}>Click to retry</Text>
        </TouchableOpacity>
      ) : mapEachNot.length > 0 ? (
        mapEachNot
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ marginTop: 60, ...styles.activiityCover }}
        >
          <FontAwesome5 size={40} color="#262626" name="holly-berry" />
          <Text style={{ ...styles.username, marginTop: 6 }}>
            No notifications yet
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  coverNot: {
    flexDirection: 'row',
    marginTop: 20,
    paddingLeft: 2,
    alignItems: 'center',
  },
  eachImg: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },
  username: {
    color: '#3b3b3b',
    fontWeight: 'bold',
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
  },
  isActive: {
    width: 13,
    height: 13,
    backgroundColor: '#3cca0b',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    position: 'absolute',
    top: 7,
    left: -4,
    zIndex: 10,
  },
  dateText: {
    fontFamily: 'Gilroy-Regular',
    color: '#9f9f9f',
    fontSize: 14,
  },
  eachBtnCover: {
    backgroundColor: '#e20154',
    paddingHorizontal: 14,
    borderRadius: 5,
    height: 36,
    alignItems: 'center',
    marginTop: -20,
    marginLeft: 'auto',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingEachBtnCover: {
    borderRadius: 5,
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 14,
    marginTop: -20,
    marginLeft: 'auto',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Overpass-Regular',
    fontSize: 14,
  },
  coverStatusRound: {
    marginRight: 8,
    padding: 1,
    borderRadius: 100,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderBottomColor: '#9e005d98',
    borderBottomEndRadius: 30,
    borderRightColor: '#9e005d',
  },
  loadingImg: {
    width: 42,
    height: 42,
    overflow: 'hidden',
    borderRadius: 50,
    borderBottomEndRadius: 20,
    marginRight: 10,
  },
  activiityCover: {
    width: '80%',
    height: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  eachCommentCover: {
    width: '100%',
    // borderRadius: 5,
    backgroundColor: '#fff',
    // paddingVertical: 8,
    // paddingHorizontal: 20,
    marginBottom: 5,
    paddingRight: 60,
    alignItems: 'center',
    flexDirection: 'row',
  },
  commentOwner: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#262626',
  },
  comment: {
    color: '#262626',
    fontSize: 13,
    fontFamily: 'Gilroy-Regular',
  },
  Image: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginRight: 10,
  },
  //   coverCommentHere: {
  //     // paddingRight: 10,
  //     // backgroundColor: "red"
  //   },
  loveHere: {
    position: 'absolute',
    right: 12,
  },
  replyingTo: {
    // backgroundColor: '#0a171e',
    // backgroundColor: '#ffffff36',
    backgroundColor: '#efefef',
    width: '100%',
    borderRadius: 5,
    marginBottom: -7,
    // borderLeftWidth: 4,
    // borderLeftColor: '#9e005d89',
    // padding: 8,
    // paddingLeft: 30,
    paddingTop: 25,
  },
  time: {
    alignSelf: 'flex-end',
    color: '#0a171e',
    fontWeight: 'bold',
    // width: "100%",
    fontSize: 11,
  },
  closeCover: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 3,
    right: 7,
    width: 40,
    height: 40,
    fontWeight: 'bold',
  },
});

export default EachNotification;
