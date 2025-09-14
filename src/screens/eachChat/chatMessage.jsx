import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  PanResponder,
  Animated,
  Dimensions,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {useRoute} from '@react-navigation/native';

import {MainContext} from '../../../App';
const ChatMessage = ({
  message,
  replyTo,
  setIndex,
  findReplyIndex,
  isBlockVisible,
  selectedArr,
  setSelectedArr,
  setIsBlockVisible,
  setReplying,
  // route,
  // msg = 'Am so glad we made it, look how for we have come my babby, Am so glad we made it, look how for we have come my babby Am so glad we made it, look how for we have come my babby Am so glad we made it, look how for we have come my babby',
}) => {
  // console.log("message._id", message._id);
  
  const CTX = useContext(MainContext);
  const route = useRoute();
  var maxLength = 130;
  var result = message?.replyingTo?.content?.substring(0, maxLength) + '...';

  // const pan = useRef(new Animated.ValueXY()).current;
  // const screenWidth = Dimensions.get('window').width;

  // const panResponder = PanResponder.create({
  //   onStartShouldSetPanResponder: () => true,
  //   // onPanResponderGrant: () => {
  //   //   // This is where you can handle the start of the slide
  //   //   console.log('Slide started!');
  //   //   replyTo({
  //   //     content: message?.content,
  //   //     username: message?.user?.username,
  //   //     _id: message?._id,
  //   //   });
  //   // },
  //   onPanResponderMove: (_, gesture) => {
  //     Animated.event([null, {dx: pan.x}], {useNativeDriver: false})(_, gesture);
  //   },
  //   onPanResponderRelease: () => {
  //     // Add a spring animation to return the view to its original position
  //     Animated.spring(pan, {
  //       toValue: {x: 0, y: 0},
  //       useNativeDriver: false,
  //     }).start();

  // replyTo({
  //   content: message?.content,
  //   username: message?.user?.username,
  //   _id: message?._id,
  // });
  //   },
  // });

  // const slideStyle = {
  //   transform: [{translateX: pan.x}],
  // };

  const isMyMessage = () => {
    return message?.user?._id == CTX.userObj._id;
  };

  const pan = useRef(new Animated.ValueXY()).current;
  const screenWidth = Dimensions.get('window').width;
  const [startTime, setStartTime] = useState(null);
  let timeOut;

  const panResponder = PanResponder.create({
    // onPanResponderGrant: () => {
    //   timeOut = setTimeout(() => {
    //   // setTimeout(() => {
    //     //   // if (isBlockVisible) return null;

    //     //   // const spread = [...selectedArr];
    //     //   // spread.push(message);
    //     //   // setSelectedArr(spread);

    //     setIsBlockVisible(true);
    //     onPressHandler(message);
    //   }, 1000);

    //   setStartTime(new Date());
    // },
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      Animated.event([null, {dx: pan.x}], {useNativeDriver: false})(_, gesture);
    },
    onPanResponderRelease: (_, gesture) => {
      // Add a spring animation to return the view to its original position
      Animated.spring(pan, {
        toValue: {x: 0, y: 0},
        useNativeDriver: false,
      }).start();

      // clearTimeout(timeOut);
      // const endTime = new Date();
      // const durationInSeconds = (endTime - startTime) / 1000;

      // console.log('durationInSeconds ==>> ', durationInSeconds);

      // if (durationInSeconds < 1) {
      //   onPressHandler(message);
      // } else {
      //   setIsBlockVisible(true);
      //   onPressHandler(message);
      // }

      const swipeDirection = gesture.dx > 0 ? 'right' : 'left';
      // Check if the slide is close to its initial position
      const threshold = 10; // Adjust this threshold as needed
      if (Math.abs(gesture.dx) < threshold) {
        // The slide is close to its initial position, consider it a cancellation
        // Alert.alert('slide is close to its initial position, consider it a cancellation!');
        return;
      } else {
        if (swipeDirection === 'right') {
          // Handle right swipe action
          console.log('Swiped right!');
          // setReplying(null);
          setIsBlockVisible(true);
          onPressHandler(message);
        } else if (swipeDirection === 'left') {
          // Handle left swipe action
          console.log('Swiped left!');
          replyTo({
            content: message?.content,
            username: isMyMessage()
              ? CTX.userObj?.username
              : route.params?.username,
            _id: message?._id,
          });
          setSelectedArr([]);
        }
      }
    },
  });

  // const panResponder = PanResponder.create({
  //   onStartShouldSetPanResponder: () => true,
  //   onPanResponderMove: (_, gesture) => {
  //     const swipeDistance = Math.abs(gesture.dx);
  //     const threshold = 20; // Adjust this threshold as needed

  //     if (swipeDistance < threshold) {
  //       // Swipe is close to its initial position, consider it a cancellation
  //       console.log('Swipe is close to its initial position');
  //       // Handle "return to normal" action
  //       console.log('Returning to normal position');
  //     } else {
  //       Animated.event([null, {dx: pan.x}], {useNativeDriver: false})(
  //         _,
  //         gesture,
  //       );
  //     }
  //   },
  //   onPanResponderRelease: (_, gesture) => {
  //     // Add a spring animation to return the view to its original position
  //     Animated.spring(pan, {
  //       toValue: {x: 0, y: 0},
  //       useNativeDriver: false,
  //     }).start();

  //     // Check the direction of the swipe
  // const swipeDirection = gesture.dx > 0 ? 'right' : 'left';
  //     console.log('Swipe direction:', swipeDirection);

  // if (swipeDirection === 'right') {
  //   // Handle right swipe action
  //   console.log('Swiped right!');
  // } else if (swipeDirection === 'left') {
  //   // Handle left swipe action
  //   console.log('Swiped left!');
  // }
  //   },
  // });

  const onPressHandler = data => {
    if (isBlockVisible) {
      const spread = [...selectedArr];
      const check = spread.some(
        a => a?._id?.toString() === data?._id?.toString(),
      );
      if (check) {
        // remove the obj from selectedTags arr
        const filterOut = spread.filter(
          b => b?._id?.toString() !== data?._id?.toString(),
        );
        setSelectedArr(filterOut);
        return;
      }
      spread.push(data);
      setSelectedArr(spread);
      return;
    }
  };

  const slideStyle = {
    transform: [{translateX: pan.x}],
  };

  // useEffect(() => {
  //   if (selectedArr.length < 1) {
  //     setIsBlockVisible(false);
  //   }
  // }, [selectedArr]);

  // console.log(' ==>> > ', message?.isDeleted);

  return (
    <>
      <View
        style={{
          width: '100%',
          // backgroundColor: "red"
        }}
        // onLongPress={() =>
        // replyTo({
        //   content: message?.content,
        //   username: message?.user?.username,
        //   _id: message?._id,
        // })
        // }
      >
        {selectedArr.some(
          f => f._id?.toString() == message._id?.toString(),
        ) && <View style={styles.selectedArr}></View>}
        <View
          style={{
            alignSelf: 'flex-start',
            width: '100%',
            position: 'relative',
          }}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              {
                alignSelf: isMyMessage() ? 'flex-end' : 'flex-start',
                marginVertical: 4,
              },
              slideStyle,
            ]}>
            <View
              style={[
                styles.messageBox,
                {
                  backgroundColor: isMyMessage() ? '#e20154' : '#202d34',
                  alignSelf: 'flex-start',
                  paddingTop: 11,
                  minWidth: Dimensions.get('window').width - 278,
                  maxWidth: Dimensions.get('window').width - 130,
                },
              ]}>
              {/* {!isMyMessage() && (
            <Text style={styles.name}>{message?.user?.username}</Text>
          )} */}

              {message?.replyingTo && (
                <Pressable
                  onPress={() => findReplyIndex(message?.replyingTo?._id)}
                  style={{
                    ...styles.replyingTo,
                    width: '100%',
                    minWidth: Dimensions.get('window').width - 180,
                    maxWidth: Dimensions.get('window').width - 130,
                    // marginTop: isMyMessage() ? 8 : 0,
                  }}>
                  {message?.replyingTo?.user == CTX.userObj._id ? (
                    <Text
                      style={{
                        ...styles.time,
                        left: 4,
                        fontFamily: 'Gilroy-Bold',
                        color: '#fff',
                        width: '100%',
                      }}>
                      You
                    </Text>
                  ) : (
                    <Text
                      style={{
                        ...styles.time,
                        left: 4,
                        fontFamily: 'Gilroy-Bold',
                        color: '#fff',
                        width: '100%',
                      }}>
                      @{route.params?.username
}
                    </Text>
                  )}
                  {/* <Pressable
              style={styles.closeCover}
              // onPress={() => setReplying(null)}
            >
              <Text style={styles.close}>X</Text>
            </Pressable> */}
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Gilroy-Medium',
                      fontSize: 13,
                    }}>
                    {message?.replyingTo?.content?.length > maxLength
                      ? result
                      : message?.replyingTo?.content}
                  </Text>

                  {/* <View
                    style={{
                      height: 3,
                      width: '100%',
                      marginTop: 'auto',
                    }}></View> */}
                </Pressable>
              )}

              {message?.base64 && (
                <View style={styles.replyingTo}>
                  {message?.base64?.username == CTX.userObj.username ? (
                    <Text style={styles.time}>You</Text>
                  ) : (
                    <Text style={styles.time}>
                      @{message?.base64?.username}
                    </Text>
                  )}
                  <Pressable
                    style={styles.closeCover}
                    onPress={() => setReplying(null)}>
                    <Text style={styles.close}>X</Text>
                  </Pressable>
                  <Text style={{color: '#999', fontSize: 13}}>
                    {message?.base64?.where}
                  </Text>

                  <View
                    style={{
                      width: 100,
                      height: 58,
                      position: 'absolute',
                      right: 0,
                      marginLeft: 'auto',
                    }}>
                    <Image
                      source={{uri: message?.base64?.blobUri}}
                      style={{width: '100%', height: '100%'}}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              )}

              <Text
                style={{
                  ...styles.message,
                  marginTop: message?.base64 || message?.replyingTo ? 10 : 0,
                  fontFamily: 'Gilroy-Medium',
                }}>
                {message?.content}
              </Text>
              <Text
                style={{
                  ...styles.time,
                  fontFamily: 'Gilroy-Regular',
                  color: '#fff',
                }}>
                {moment(message?.date).format('LT')}
              </Text>
            </View>
          </Animated.View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  messageCover: {
    paddingHorizontal: 20,
    paddingVertical: 3,
  },
  selectedArr: {
    width: '100%',
    height: '110%',
    position: 'absolute',
    top: 1,
    left: 0,
    zIndex: 10,
    backgroundColor: '#fe99af49',
  },
  messageBox: {
    borderRadius: 13,
    padding: 8,
  },
  name: {
    fontFamily: 'Overpass-Regular',
    color: '#9e005d',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  message: {
    color: '#fff',
    fontFamily: 'Overpass-Regular',
  },
  time: {
    alignSelf: 'flex-end',
    // color: '#0a171e',
    position: 'absolute',
    top: 3,
    fontFamily: 'Overpass-Regular',
    right: 4,
    color: '#999',
    fontSize: 9,
  },
  myTime: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 3,
    left: 4,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  close: {
    color: '#999',
    marginLeft: 'auto',
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
  replyingTo: {
    // backgroundColor: '#0a171e',
    backgroundColor: '#ffffff36',
    width: '100%',
    borderRadius: 5,
    marginBottom: -7,
    borderLeftWidth: 4,
    position: 'relative',
    borderLeftColor: '#9e005d89',
    padding: 8,
    paddingLeft: 4,
    paddingTop: 20,
  },
});

export default ChatMessage;
