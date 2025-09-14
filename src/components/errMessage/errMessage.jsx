import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  useSharedValue,
} from 'react-native-reanimated';
import roundLogo from '../../assets/round-colored-logo.png';

const ErrMessage = ({delay = 100, closeErr, msg = ''}) => {
  // var maxLength = 40;
  // var result = msg.substring(0, maxLength) + '...';
  // const [enlargeText, setEnlargeText] = useState(false);

  // const translateY = useSharedValue(-200); // Start above screen

  // useEffect(() => {
  //   translateY.value = withSequence(
  //     withTiming(0, { duration: 500 }),               // Slide in
  //     withDelay(2000, withTiming(-200, { duration: 500 })) // After 2s, slide out (up)
  //   );
  //   // Automatically close after 2.4 seconds
  //   const timeout = setTimeout(() => {
  //     closeErr(); // hide parent component
  //   }, 3000);

  //   return () => clearTimeout(timeout);
  // }, []);

  // const animatedStyles = useAnimatedStyle(() => ({
  //   transform: [{ translateY: translateY.value }],
  // }));

  const translateY = useSharedValue(-200);
  const timeoutRef = useRef(null);
  const dismissedRef = useRef(false); // To avoid double close

  useEffect(() => {
    translateY.value = withSequence(
      withTiming(0, {duration: 500}),
      withDelay(3000, withTiming(-200, {duration: 500})),
    );

    timeoutRef.current = setTimeout(() => {
      if (!dismissedRef.current) {
        closeErr();
      }
    }, 4000);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDismiss = () => {
    if (dismissedRef.current) return;

    dismissedRef.current = true;
    clearTimeout(timeoutRef.current);

    // Slide out immediately
    translateY.value = withTiming(-200, {duration: 400});

    // Wait for slide out to finish before unmounting
    setTimeout(() => {
      closeErr();
    }, 400);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  // const animatedStyles = useAnimatedStyle(() => ({
  //   transform: [
  //     {
  //       translateY: withSequence(
  //         withTiming(-85),
  //         withDelay(delay, withTiming(34)),
  //       ),
  //     },
  //   ],
  // }));

  const animatedImage = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withRepeat(
          withSequence(
            withTiming(-5),
            withDelay(1000, withTiming(5)),
            withTiming(-5),
          ),
          -1,
        ),
      },
    ],
  }));

  return (
    <>
      {/* {msg.length > 7 && ( */}
      <Animated.View style={[styles.coverall, animatedStyles]}>
        <Pressable
          // onPress={() => {
          //   return setEnlargeText(true);
          // }}

          // onPress={() => {
          //   return closeErr();
          // }}

          onPress={handleDismiss}
          style={styles.notificationCover}>
          {/* <View style={styles.caution}>
              <MaterialCommunityIcons
                name="sign-caution"
                color={'#fff'}
                size={17}
              />
            </View> */}

          <Animated.View style={[styles.roundLogoCover, animatedImage]}>
            <Image source={roundLogo} style={styles.roundImage} />
          </Animated.View>

          {/* <Pressable
            onPress={() => {
              return closeErr();
            }}
            style={{
              height: '100%',
              justifyContent: 'center',
            }}>
            <AntDesign
              size={19}
              color="#aaa"
              style={{marginRight: 3}}
              name="closesquare"
            />
          </Pressable> */}

          <Text style={{color: '#aaa', marginRight: 8}}>|</Text>
          <Text
            style={{
              ...styles.msgText,
              // height: enlargeText ? 63 : 23,
              // height: enlargeText ? '100%' : 19,
              // height: '100%',
              // textAlignVertical: 'center',
            }}>
            {/* {enlargeText ? (
              msg
            ) : ( */}
            {/* // <> {msg.length > maxLength ? result : msg}</> */}
            {msg}
            {/* )} */}
          </Text>
        </Pressable>
      </Animated.View>
      {/* )} */}
    </>
  );
};

const styles = StyleSheet.create({
  coverall: {
    position: 'absolute',
    width: '100%',
    top: 50,
    zIndex: 100,
  },
  notificationCover: {
    width: '95%',
    marginLeft: 'auto',
    borderRadius: 150,
    marginRight: 'auto',
    backgroundColor: '#33333393',
    justifyContent: 'center',
    // blurRadius: 10,
    // justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    // paddingHorizontal: 17,
    paddingRight: 0,
    paddingVertical: 10,
    position: 'relative',
    // marginLeft: 10
  },
  caution: {
    backgroundColor: '#e20154',
    width: 25,
    height: 25,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  msgText: {
    color: '#fff',
    fontFamily: 'Gilroy-Bold',
    width: '80%',
    fontSize: 14,
    // marginRight: 8,
  },
  roundLogoCover: {
    alignContent: 'center',
    justifyContent: 'center',
    // marginTop: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    borderRadius: 90,
  },
  roundImage: {
    width: 32,
    height: 32,
    marginTop: -4,
  },
});

export default ErrMessage;
