import {View, Text, Image, TouchableOpacity, Pressable} from 'react-native';
import React, {useContext, useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Lottie from 'lottie-react-native';
import {useNavigation} from '@react-navigation/core';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import happyEyes from '../../assets/json/happyEyes.json';
import Ebere from '../../assets/ebere.webp';
import sadHeart from '../../assets/json/sadHeart.json';
import styles from './styles';
import {MainContext} from '../../../App';
const Caring = ({
  username = 'cared_username_here_no_spacing_here',
  data,
  route,
}) => {
  const CTX = useContext(MainContext);
  const navigation = useNavigation();
  var maxLength = 17;
  var result = data?.caring?.username?.substring(0, maxLength);
  var fulnema = data?.caring?.full_name?.substring(0, maxLength);
  const [isUserCaring, setIsUserCaring] = useState(
    route?.params?.username === CTX.userObj.username,
  );

  // console.log('data ==> ', data);
  // let sds = {
  //   __v: 0,
  //   _id: '64bd319101ba36bf72c5b604',
  //   carer: {
  //     _id: '649dfac1d77ef446c8fecc49',
  //     active: true,
  //     full_name: 'Skyline ',
  //     monetize: false,
  //     username: 'skyline',
  //     verify: false,
  //   },
  //   caring: '649dfac1d77ef446c8fecc49',
  //   created_at: '2023-07-23T13:56:33.707Z',
  //   updated_at: '2023-07-23T13:56:33.707Z',
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
          ...data?.caring,
          // isCaring: item?.isCaring,
        });


        // navigation.replace('EachUserProfile', {
        //   user: data?.caring,
        //   username: data?.caring?.username,
        //   isCaring: false,
        // });
      }}
      style={styles.container}>
      <Image
        source={{
          // uri: 'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
          uri: data?.caring?.photo
            ? data?.caring?.photo
            : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
        }}
        style={styles.Image}
      />
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.username}>
            {fulnema.length > 16 ? fulnema + '...' : fulnema}
          </Text>
          {data?.caring?.verify && (
            <MaterialIcons
              style={{marginLeft: 5}}
              name="verified"
              color="#91ff91"
              size={16}
            />
          )}
        </View>
        <Text style={{...styles.userFullname,}}>
          @{result.length > 16 ? result + '...' : result}
        </Text>
      </View>

      {/* <TouchableOpacity activeOpacity={0.8}
        onPress={() => careHandler(isUserCaring, data?.caring?._id)}
        style={{
          ...styles.eachBtnCover,
          position: 'relative',
          paddingRight: 10,
          marginLeft: 'auto',
          flexDirection:"row",
          alignItems: "center"
        }}>
        <Text style={styles.eachBtnText}>
          {isUserCaring ? 'Caring' : 'Care'}
        </Text>
        {isUserCaring ? (
          <View style={{marginLeft: 4, width: 36, height: 36}}>
            <Lottie source={happyEyes} autoPlay loop />
          </View>
        ) : (
          <View style={{marginLeft: 4,  marginTop: 13, width: 36, height: 36}}>
             <Lottie source={sadHeart} autoPlay loop  /> 
            <Image source={Ebere} style={{width: 24, height: 24}} resizeMode='cover' />
          </View>
        )}
      </TouchableOpacity> */}

      {/* <TouchableOpacity activeOpacity={0.8} style={{marginLeft: 20}}>
        <Entypo name="dots-three-vertical" size={25} color="#3b3b3b" />
      </TouchableOpacity> */}
    </Pressable>
  );
};

export default Caring;
