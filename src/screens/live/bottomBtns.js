import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import React, { Suspense, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5Pro from 'react-native-vector-icons/Entypo';
import Menu from './menu';
import CommentInput from './commentInput';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { useAgoraEngine } from '../../../AgoraEngineContext';
// import AbbrNum from '../../helper/abbrev';
// import Feather from 'react-native-vector-icons/Feather';

const BottomBtns = ({
  isJoined,
  join,
  leaveChannel,
  setIsJoined,
  participantCount,
  messages,
  room,
  setMessages,
  scrollToBottom,
  isJoining,
  setIsJoining,
  scrollViewRef,
  timer,
}) => {
  const [toogleVideo, setToogleVideo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isToComment, setIsToComment] = useState(false);
  const agoraEngine = useAgoraEngine();

  const offVideo = () => {
    if (toogleVideo) {
      setToogleVideo(!toogleVideo);
      agoraEngine?.enableVideo();
    } else {
      setToogleVideo(!toogleVideo);
      agoraEngine?.disableVideo();
    }
  };

  const checkIfLive = () => {
    if (isJoined) {
      agoraEngine?.switchCamera();
    }
  };

  const checkIfLiveForMenu = () => {
    if (isJoined) {
      setShowMenu(!showMenu);
    }
  };

  const userObj = {
    username: 'revers',
    img: 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
    verify: true,
  };

  const comment = [
    {
      _id: Math.random(),
      user: userObj,
      msg: "content.trim() all the adsklasdk dasnn love ooo aaah eeeh don't waste my time",
    },
    {
      _id: Math.random(),
      user: userObj,
      msg: "content.trim() all the adsklasdk dasnn love ooo aaah eeeh don't waste my time",
    },
    {
      _id: Math.random(),
      user: userObj,
      msg: "content.trim() all the adsklasdk dasnn love ooo aaah eeeh don't waste my time",
    },
    {
      _id: Math.random(),
      user: userObj,
      msg: "content.trim() all the adsklasdk dasnn love ooo aaah eeeh don't waste my time",
    },
    {
      _id: Math.random(),
      user: userObj,
      msg: "content.trim() all the adsklasdk dasnn love ooo aaah eeeh don't waste my time",
    },
    {
      _id: Math.random(),
      user: userObj,
      msg: "content.trim() all the adsklasdk dasnn love ooo aaah eeeh don't waste my time",
    },
    {
      _id: Math.random(),
      user: userObj,
      msg: "content.trim() all the adsklasdk dasnn love ooo aaah eeeh don't waste my time",
    },

    {
      _id: Math.random(),
      user: userObj,
      msg: "content.trim() all the adsklasdk dasnn love oooewre aaah eeeh don't waste my time",
    },
  ];

  const mappedScroll = messages.map((item, i) => (
    // const mappedScroll = comment.map((item, i) => (
    <View
      key={i}
      style={{
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'flex-start',
        overflow: 'hidden',
      }}
    >
      {item?.user?.img?.length > 3 && (
        <Image style={styles.styleImage} source={{ uri: item?.user?.img }} />
      )}
      <View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 9,
            color: '#ffffff99',
            fontFamily: 'Overpass-Regular',
          }}
        >
          {item?.user?.username}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: '#fff',
            fontFamily: 'Overpass-Regular',
            paddingRight: 20,
          }}
        >
          {item?.msg}
        </Text>
      </View>
    </View>
  ));

  return (
    <>
      {timer < 1 && (
        <View
          style={{
            width: '100%',
            backgroundColor: '#00000018',
            // borderRadius: 19,
            position: 'absolute',
            height: '30%',
            bottom: 0,
            paddingBottom: 0,
            zIndex: 200,
          }}
        >
          <View style={{ marginTop: -20 }}>
            <LinearGradient
              colors={['#00000000', '#00000018']}
              style={{
                // position: 'absolute',
                // top: 0,
                // left: 0,
                // right: 0,
                height: 20, // Adjust the height to control the fading effect
              }}
            />
          </View>
          <View style={styles.bottomBtnsCover}>
            {isToComment ? (
              <Suspense fallback={null}>
                <CommentInput
                  setIsToComment={setIsToComment}
                  room={room}
                  messages={messages}
                  setMessages={setMessages}
                  scrollToBottom={scrollToBottom}
                />
              </Suspense>
            ) : (
              <View style={styles.paddingInner}>
                {showMenu && (
                  <View style={styles.menuCover}>
                    <Menu
                      offVideo={offVideo}
                      toogleVideo={toogleVideo}
                      setIsToComment={setIsToComment}
                      isToComment={isToComment}
                      messages={messages}
                    />
                  </View>
                )}

                {/* <TouchableOpacity
              activeOpacity={0.8}
              style={styles.addComment}
              onPress={() => setIsToComment(!isToComment)}
              // onPress={checkIfLive}
            >
              <Text
                style={{
                  color: '#ffffff99',
                  // fontWeight: 'bold',
                  marginLeft: 4,
                }}>
                Add comment...
              </Text>
            </TouchableOpacity> */}

                <View
                  style={{
                    width: '85%',
                    // backgroundColor: 'blue',
                  }}
                >
                  <ScrollView
                    ref={scrollViewRef}
                    style={{
                      height: '100%',
                      width: '100%',
                      paddingRight: 20,
                    }}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                  >
                    {mappedScroll}
                  </ScrollView>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                  {/* <TouchableOpacity
                activeOpacity={0.8}
                style={styles.offVideo}
                onPress={offVideo}>
                <View style={{...styles.boxStuff, marginLeft: 'auto'}}>
                  {!toogleVideo ? (
                    <Feather name="video-off" size={20} color="#ffffff99" />
                  ) : (
                    <Feather name="video" size={20} color="#dd000099" />
                  )}
                </View>
              </TouchableOpacity> */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.offVideo}
                    onPress={checkIfLive}
                  >
                    <View style={{ ...styles.boxStuff, marginLeft: 'auto' }}>
                      <MaterialCommunityIcons
                        name="camera-flip"
                        size={22}
                        color={'#ffffff99'}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                {/* <View style={styles.coverBothTime}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={checkPress}
                style={{
                  ...styles.startCallHere,
                  backgroundColor: isJoined ? '#dd000099' : '#00000099',
                }}>
                {isJoining ? (
                  <ActivityIndicator color={'#fff'} size={20} />
                ) : (
                  <>
                    {isJoined ? (
                      <Fontisto name="phone" color="#fff" size={19} />
                    ) : (
                      <Fontisto name="livestream" color="#fff" size={19} />
                    )}
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        marginLeft: 4,
                      }}>
                      {isJoined ? 'Leave' : 'Go live'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={checkIfLiveForMenu}>
                <MaterialIcons
                  name={!showMenu ? 'menu' : 'menu-open'}
                  size={23}
                  color="#fff"
                />
              </TouchableOpacity>
            </View> */}
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default BottomBtns;

const styles = StyleSheet.create({
  bottomBtnsCover: {
    // marginTop: 'auto',
    width: '100%',
    // height: '50%',
    // height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    // bottom: 9,
  },
  paddingInner: {
    width: '90%',
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuCover: {
    position: 'absolute',
    width: 80,
    height: 214,
    bottom: 60,
    padding: 14,
    right: -17,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    // flexDirection: 'row',
    // flexWrap: "wrap",
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: '#5b5b5b48',
  },
  addComment: {
    backgroundColor: '#5b5b5b38',
    // width: 130,
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingRight: 35,
    borderRadius: 18,
  },
  offVideo: {
    width: 38,
    height: 38,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  styleImage: {
    width: 33,
    height: 33,
    marginRight: 7,
    borderRadius: 30,
  },

  timeCover: {
    color: '#fff',
  },
  coverBothTime: {
    height: 45,
    width: '20%',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7b7b7b49',
    paddingRight: 17,
  },
  startCallHere: {
    backgroundColor: '#00000099',
    width: '68%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    borderRadius: 18,
  },
  boxStuff: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    // backgroundColor: "#ffffff",
    // borderColor: '#fff',
    // borderRadius: 100,
    // borderWidth: 2,
  },
});
