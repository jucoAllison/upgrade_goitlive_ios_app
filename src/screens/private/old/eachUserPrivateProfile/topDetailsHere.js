import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {Suspense, useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/core';
import LinearGradient from 'react-native-linear-gradient';
import AbbrNum from '../../../../helper/abbrev';


const TopDetailsHere = ({leaveChannel, isJoined, messages, timer}) => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);

  const closeHandler = () => {
    if (isJoined) {
      leaveChannel();
    } else {
      navigation.goBack();
    }
  };

  // useEffect(() => {
  //   if (flatListRef) {
  //     if (comments?.length > 0) {
  //       flatListRef.current?.scrollToIndex({
  //         index,
  //         animated: true,
  //       });
  //     }
  //   }
  // }, [index]);

  return (
    <>
      <View style={styles.mainTopCover}>
        {timer < 1 && <>
        {isJoined && (
          <TouchableOpacity activeOpacity={0.8} style={styles.offVideoTotal}>
            <Feather name={'eye'} size={12} color="#fff" />
            <Text style={{color: '#ffffff99', marginLeft: 5}}>
              {AbbrNum(messages[messages.length - 1]?.totalUsers - 1 || 0, 0)}
            </Text>
          </TouchableOpacity>
        )}
        </>}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={closeHandler}
          style={styles.offVideo}>
          <Ionicons name="close" size={27} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 0}}>
        <LinearGradient
          colors={['#00000019', '#00000000']}
          style={{
            // position: 'absolute',
            // top: 0,
            // left: 0,
            // right: 0,
            height: 20, // Adjust the height to control the fading effect
          }}
        />
      </View>
    </>
  );
};

export default TopDetailsHere;

const styles = StyleSheet.create({
  mainTopCover: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00000019',
              paddingTop: 40,
    paddingHorizontal: 20,
    width: '100%',
    // backgroundColor: 'red',
  },
  offVideo: {
    // backgroundColor: '#00000019',
    width: 45,
    height: 45,
    // position: 'absolute',
    // right: 0,
    // borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  offVideoTotal: {
    flexDirection: 'row',
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: '#000',
    alignItems: 'center',
  },
});

//  {/* <FlatList
//           ref={flatListRef}
//           keyExtractor={item => Math.random()}
//           // initialScrollIndex={index}
//           // inverted
//           data={messages}
//           renderItem={({item, index}) => (
//             <View
//               style={{
//                 marginVertical: 6,
//                 flexDirection: 'row',
//                 alignItems: 'flex-start',
//                 overflow: 'hidden',
//               }}>
//               {item?.user?.img?.length > 3 && (
//                 <Image
//                   style={styles.styleImage}
//                   source={{uri: item?.user?.img}}
//                 />
//               )}
//               <View>
//                 <Text
//                   style={{
//                     fontWeight: 'bold',
//                     fontSize: 9,
//                     color: '#ccc',
//                     fontFamily: 'Overpass-Regular',
//                   }}>
//                   {item?.user?.username}
//                 </Text>
//                 <Text
//                   style={{
//                     fontSize: 12,
//                     color: '#fff',
//                     fontFamily: 'Overpass-Regular',
//                   }}>
//                   {item?.msg}
//                 </Text>
//               </View>
//             </View>
//           )}
//           showsVerticalScrollIndicator={false}
//           pagingEnabled
//           scrollEnabled={true}
//           // onScrollToIndexFailed={info => {
//           //   const wait = new Promise(resolve => setTimeout(resolve, 500));
//           //   wait.then(() => {
//           //     flatListRef.current?.scrollToIndex({
//           //       index: info.index,
//           //       animated: true,
//           //     });
//           //   });
//           // }}
//         /> */}
