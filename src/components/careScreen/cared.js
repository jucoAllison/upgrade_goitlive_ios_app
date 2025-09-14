import {View, Text, Image, TouchableOpacity, Pressable} from 'react-native';
import React, {useContext, useState} from 'react';
import Lottie from 'lottie-react-native';
import {useNavigation} from '@react-navigation/core';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// import happyEyes from '../../assets/json/happyEyes.json';
// import sadHeart from '../../assets/json/sadHeart.json';
import styles from './styles';
import {MainContext} from '../../../App';
const Cared = ({username = 'cared_username_here_no_spacing_here', data}) => {
  const navigation = useNavigation();
  const CTX = useContext(MainContext);
  var maxLength = 17;
  var result = data?.carer?.username?.substring(0, maxLength);
  var fulnema = data?.carer?.full_name?.substring(0, maxLength);
  const [isUserCaring, setIsUserCaring] = useState(false);
  const [showCare, setShowCare] = useState(true)

  // console.log('data ==> ', data);
  // let sds = {
  //   _id: '64bbf58ad0dec1161c4668f3',
  //   caring: {
  //     _id: '649dfac1d77ef446c8fecc49',
  //     active: true,
  //     full_name: 'Skyline ',
  //     monetize: false,
  //     username: 'skyline',
  //     verify: false,
  //   },
  // };

  const careHandler = async (stat, _id) => {
    setIsUserCaring(!isUserCaring);
    let URLHere = stat
      ? `${CTX.systemConfig?.p}user/profile/uncare/${_id}`
      : `${CTX.systemConfig?.p}user/profile/care/${_id}`;
    // uncare Here
    try {
      const fetching = await fetch(URLHere, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
      });
      const parsedJson = await fetching.json();

      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }

      console.log('error from careHandler => ', parsedJson);
      // resetUpperArr(parsedJson.data);
    } catch (error) {
      // setLoading(false);
      console.log('error from careHandler => ', error);
      // setErrMsg('Network request failed');
      // setShowMsg(true);
    }
  };

  return (
    <Pressable
      onPress={() => {
        navigation.replace('HELLO_WORLD', {
          ...data?.carer,
          // isCaring: item?.isCaring,
        });

        // navigation.replace('EachUserProfile', {
        //   user: data?.carer,
        //   username: data?.carer?.username,
        //   isCaring: false,
        // });
      }}
      style={styles.container}>
      <Image
        source={{
          // uri: 'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
          uri: data?.carer?.photo
            ? data?.carer?.photo
            : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
        }}
        style={styles.Image}
      />
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.username}>
            {fulnema?.length > 16 ? fulnema + '...' : fulnema}
          </Text>
          {data?.carer?.verify && (
            <MaterialIcons
              style={{marginLeft: 5}}
              name="verified"
              color="#91ff91"
              size={16}
            />
          )}
        </View>
        <Text style={{...styles.userFullname, 
        }}>
          @{result?.length > 16 ? result + '...' : result}
        </Text>
      </View>

      {/* <TouchableOpacity activeOpacity={0.8}
        onPress={() => careHandler(isUserCaring, data?.carer?._id)}
        style={{
          ...styles.eachBtnCover,
          position: 'relative',
          paddingRight: 10,
          marginLeft: 'auto',
        }}>
        <Text style={styles.eachBtnText}>
          Care back
        </Text> */}
        {/* {isUserCaring ? (
          <View style={{marginLeft: 4, width: 36, height: 36}}>
            <Lottie source={happyEyes} autoPlay loop />
          </View>
        ) : ( */}
          {/* <View style={{marginLeft: 4, width: 36, height: 36}}>
            <Lottie source={sadHeart} autoPlay loop />
          </View> */}
        {/* )} */}
      {/* </TouchableOpacity> */}
    </Pressable>
  );
};

export default Cared;
