// import React from 'react';
// import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
// import ProgressBar from 'react-native-progress/Bar';

// const ProgressBarCom = ({duration, videoRef, progress, setPause}) => {
//   const progressPressHandler = e => {
//     const position = e.nativeEvent.locationX;
//     const progressing = (position / 250) * duration;
//     // videoRef?.current?.seek(progressing);
//   };

//   return (
//     <View style={styles.noCoverProgressBaroo}>
//       <TouchableWithoutFeedback
//         onPress={async e => {
//           const position = await e.nativeEvent.locationX;
//           const progressing = (await (position / 320)) * duration;
//           videoRef?.seek(progressing);
//           setPause(false)
//         }}>
//         <View
//           style={{
//             alignItems: 'center',
//             justifyContent: 'center',
//             height: 30,
//             // backgroundColor: '#ff000044',
//           }}>
//           <ProgressBar
//             progress={progress}
//             color="#e20154"
//             unfilledColor="#ffffff55"
//             width={320}
//             height={4}
//             borderColor="#ffffff55"
//           />
//         </View>
//       </TouchableWithoutFeedback>
//     </View>
//   );
// };

// export default ProgressBarCom;

import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import React, {memo, useState} from 'react';
import Slider from '@react-native-community/slider';
import Entypo from 'react-native-vector-icons/Entypo';

const ProgressBar = ({
  duration,
  videoRef,
  progress,
  //   setSwipeEnabled,
  pauseOverRide,
  hasWatchedToCompleted,
}) => {
  const [opacity, setOpacity] = useState(0.7);

  // console.log('hasWatchedToCompleted HERE!!  ==.> ', hasWatchedToCompleted);

  const setShadowRadiusHandler = e => {
    if (pauseOverRide) return;
    const re = e / 100;
    // console.log('re ==>> ', re);
    videoRef?.seek(re * duration);
  };

  return (
    <View
      style={{...styles.noCoverProgressBaroo, justifyContent: 'space-between'}}>
      {/* <TouchableWithoutFeedback
        // onPressIn={() => {
          // setOpacity(0.7);
          //   setSwipeEnabled(false);
        // }}
        // onPressOut={() => {
        //   // setOpacity(0);
        // //   setSwipeEnabled(true);
        // }}
      > */}
      {/* <Slider
          step={1}
          value={progress * 100}
          onSlidingComplete={setShadowRadiusHandler}
          style={{
            width: hasWatchedToCompleted ? '90%' : '100%',
            // opacity,
            height: 40,
          }}
          // style={{width:'90%', opacity}}
          // label="shadowRadius"
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#fff"
          thumbTintColor="#fff"
        /> */}

      {/* <Slider
          style={{width: 200, height: 40}}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#d00"
          maximumTrackTintColor="#0d0"
        />
      </TouchableWithoutFeedback>
      {hasWatchedToCompleted && (
        
      )} */}

      <Slider
        style={{width: '100%'}}
        step={1}
        value={progress * 100 || 0}
        onSlidingComplete={setShadowRadiusHandler}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#fff"
        thumbTintColor="#fff"
      />
      {hasWatchedToCompleted && <Entypo
          name="dot-single"
          color="#ee6666"
          size={33}
          style={{marginRight: 2, zIndex: 32, position: "absolute", right: -10 }}
        />}
    </View>
  );
};

// export default memo(ProgressBar);
export default ProgressBar;

const styles = StyleSheet.create({
  noCoverProgressBaroo: {
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#00000015',
    // backgroundColor: '#d00',
    // height: 200,
    flexDirection: 'row',
    width: '100%',
    zIndex: 3,
    // backgroundColor: 'red',
    position: 'absolute',
    // flexDirection
  },
});
