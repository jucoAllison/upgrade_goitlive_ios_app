import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet,
  } from 'react-native';
  import React, {useState} from 'react';
  import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  import LinearGradient from 'react-native-linear-gradient';
  // import styles from './post.styles';
  
  import {TruncateText} from '../../helper/truncateText';
  import animationData from '../../assets/json/cryingHeart.json';
  import sadHeart from '../../assets/json/sadHeart.json';
  /** component for containning the all to gether both=tom details HERE */
  const Bottom = ({
    user,
    desc,
    announcement = true,
    announcement_details = {name: 'FCMB'},
    bold = false,
    VideoLoad,
    item,
    setParentScrollEnabled,
    //   progressPressHandler,
    //   progress,
    //   duration,
  }) => {
    const [isShowMore, setIsShowMore] = useState(false);
    // const handleScrollViewTouchStart = event => {
    //   // Prevent touch event from propagating to parent FlatList
    //   event.stopPropagation();
    // };
  
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 8,
          width: '100%',
        }}>
          <LinearGradient
            // colors={['#00000000', '#00000015']}
            colors={['#00000000', '#00000015']}
            style={{
              height: 20, // Adjust the height to control the fading effect
            }}
          />
        <View style={styles.bottomContainer}>
        {/* <View> */}
          <View style={{width: '85%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{...styles.handle, fontFamily: 'Overpass-Regular'}}>
                {item?.user?.username ? '@' + item?.user?.username : ' '}
              </Text>
  
              {item?.user?.verify[0] && (
                <MaterialIcons
                  style={{marginLeft: 6}}
                  name="verified"
                  color="#91ff91"
                  size={17}
                />
              )}
            </View>
            <ScrollView
              fadingEdgeLength={100}
              // onScroll={handleScrollViewTouchStart}
              // onTouchStart={handleScrollViewTouchStart}
              style={{
                padding: 4,
                paddingBottom: 0,
              }}>
              <Text
                style={{
                  ...styles.videoDesc,
                  // height: '100%',
                }}>
                {isShowMore ? item?.note : TruncateText(item?.note, 100)}
              </Text>
              {item?.note?.length > 100 && (
                <Text
                  onPress={() => {
                    setIsShowMore(!isShowMore)
                    // setParentScrollEnabled(isShowMore)
                  }}
                  style={{
                    ...styles.videoDesc,
                    paddingVertical: 10,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  {isShowMore ? 'Show less' : 'Show more'}
                </Text>
              )}
            </ScrollView>
  
            {/* {announcement && (
              <View style={styles.sponsored}>
                <FontAwesome5
                  name="first-aid"
                  size={19}
                  color={bold ? '#ccc' : '#e20154'}
                  style={{marginRight: 8}}
                />
                <Text
                  style={{
                    ...styles.taggedPeople,
                    color: bold ? '#ccc' : '#e20154',
                    fontWeight: bold ? 'bold' : '400',
                  }}>
                  @{announcement_details?.name}
                </Text>
              </View>
            )} */}
          </View>
  
          {/* {announcement && ( */}
  
          {/* )} */}
        </View>
        {/* {VideoLoad && (
          <View style={styles.coverVideoLoading}>
            <Text style={{fontSize: 15, color: 'white'}}>
              Video Is loading, please wait...
            </Text>
          </View>
        )} */}
      </View>
    );
  };
  
  export default Bottom;
  

  const styles = StyleSheet.create({
    
  bottomContainer: {
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#00000015',
  },
  handle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoDesc: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Overpass-Regular',
    fontWeight: '300',
  },
  });