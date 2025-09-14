import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TruncateText} from '../../../../../helper/truncateText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {MainContext} from '../../../../../../App';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../../../../../components/button';

const Tags = React.lazy(() => import('./tags'));
const EventTags = ({tag, _id, resetTagg, closeModalPress}) => {
  const [innerTag, setInnerTag] = useState([])
  const opacity = useSharedValue(0);
  const CTX = useContext(MainContext);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // console.log("innerTag HERE!!! =>> ", innerTag);
  
  

  // Set the opacity value to animate between 0 and 1
  opacity.value = withRepeat(
    withTiming(1, {duration: 1000, easing: Easing.ease}),
    -1,
    true,
  );
  const Anistyle = useAnimatedStyle(() => ({opacity: opacity.value}), []);

  const confirmTagHandler = v => {
    if (CTX.userObj?.username == v.username && !v.active) {
      setModalVisible(true);
    }
  };

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

    const createSuccessButtonAlert = (msg = 'Unable to complete request') =>
      Alert.alert('Success!', msg, [
        {
          text: 'Close',
          onPress: () => console.log('Close pressed'),
        },
      ]);

  const approveHandler = async () => {
    setLoading(true);
    setShowMsg(false);
    setErrMsg('');
    console.log(
      `${CTX.systemConfig?.p}get/account/user/post/tag/approve/${_id}`,
    );
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}get/account/user/post/tag/approve/${_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();
      // if (parsedJson?.isRemoved) {
      //   return CTX.logoutUser();
      // }
      setLoading(false);
      setShowMsg(false);
      setErrMsg('');
      if (parsedJson?.e) {
        createThreeButtonAlert(parsedJson?.m);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      // reset tagg here
      // resetTagg(parsedJson?.data);
      setInnerTag(parsedJson?.data);
      setModalVisible(false);
      createSuccessButtonAlert("You have successfully approved this post you are tagged in")
      // closeModalPress();
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for getThePost! => ', error);
      createThreeButtonAlert('Network request failed');
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  const mappedOtherDatas = innerTag.map((v, i) => (
    <Animated.View
      style={CTX.userObj?.username == v.username && !v.active && Anistyle}
      key={i}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.mappedDatasCover}
        onPress={() => confirmTagHandler(v)}
        // onPress={() => setPressedTagHandler(v)}
      >
        <Image
          style={styles.styleImage}
          source={{
            uri: v?.photo
              ? v?.photo
              : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
          }}
        />
        <View>
          <Text style={styles.mappedDatasCoverFullname}>
            {TruncateText(v?.full_name, 24)}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.mappedDatasCoverUsername}>
              @{TruncateText(v?.username, 24)}
            </Text>
            {v?.verified && (
              <MaterialIcons
                style={{marginLeft: 5}}
                name="verified"
                color="#91ff91"
                size={17}
              />
            )}
          </View>
        </View>

        {v?.active ? (
          <View
            style={{
              ...styles.clickable,
              backgroundColor: '#086e4657',
            }}>
            <MaterialCommunityIcons
              color={'#086e4699'}
              name="check-circle-outline"
              size={25}
            />
          </View>
        ) : (
          <View
            style={{
              ...styles.clickable,
              backgroundColor: '#041b2b67',
            }}>
            <MaterialCommunityIcons
              color={'#041b2b77'}
              name="clock-time-four-outline"
              size={25}
            />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  ));

  useEffect(() => {
    setInnerTag(tag)
  },[])

  return (
    <>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <Pressable style={styles.anocenteredView}>
          <View style={{...styles.anomodalView}}>
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  // setPauseOverRide(true);
                }}
                style={styles.closeHere}>
                <AntDesign name="close" size={20} color="#555" />
              </TouchableOpacity>

              <Text
                style={{
                  color: '#555',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                Approve
              </Text>

              <Text style={styles.mainTextHere}>
                You were tagged in these post
              </Text>

              <Button
                onPress={approveHandler}
                // loading={leaving}
                label={'Approve'}
                loading={loading}
                style={{
                  width: '100%',
                  // backgroundColor: '#ee6666',
                  marginTop: 30,
                  height: 50,
                }}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>
      <Pressable
        onPress={() => {
          return null;
        }}
        style={{height: '100%'}}>
        <Suspense
          fallback={
            <View style={styles.activityCover}>
              <ActivityIndicator color={'#0a171e53'} size={40} />
            </View>
          }>
          <Tags mappedOtherDatas={mappedOtherDatas} />
        </Suspense>
      </Pressable>
    </>
  );
};

export default EventTags;

const styles = StyleSheet.create({
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  mappedDatasCover: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  styleImage: {
    width: 43,
    height: 43,
    marginRight: 7,
    borderRadius: 30,
  },
  mappedDatasCoverFullname: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#000',
    fontFamily: 'Overpass-Regular',
    textTransform: 'capitalize',
  },
  mappedDatasCoverUsername: {
    fontSize: 13,
    color: '#000',
    textTransform: 'lowercase',
  },
  clickable: {
    width: 30,
    height: 30,
    borderRadius: 45,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    borderColor: '#00000022',
    borderWidth: 1,
  },
  anocenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    // marginTop: 22,
    backgroundColor: '#00000066',
  },
  anomodalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 7,
    // height: "90%",
    padding: 15,
    width: '90%',
    paddingTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    color: '#939393',
    fontFamily: 'Optimistic Display',
    textAlign: 'center',
  },
  closeHere: {
    justifyContent: 'center',
    zIndex: 3,
    alignItems: 'center',
    position: 'absolute',
    top: 5,
    right: 5,
    width: 34,
    height: 34,
  },
  mainTextHere: {
    color: '#555',
    fontWeight: '300',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Overpass-Regular',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});
