import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ImageBackground,
  Dimensions,
  Pressable,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MainContext } from '../../../App';
import { NORMAL_GIFTS, SPECIAL_GIFTS } from '../../data/gifts';
import Button from '../../components/button';
import imgData from '../../assets/iosBackground.jpeg';
import animationData from '../../assets/json/cryingHeart.json';

const giftStreamer = ({
  setErrMsg,
  streamer,
  setShowMsg,
  leave,
  random,
  setGiftOverride,
  messages,
  setMessages,
  closeModalPress
}) => {
  const CTX = useContext(MainContext);
  const [text, setText] = useState('Normal');
  const subs = ['Normal', 'Special'];
  const [selected, setSelected] = useState(null);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const giftHandler = async v => {
    if (selected) return;
    setSelected(v);
    try {
      const leaving = await fetch(
        `${CTX.systemConfig?.p}account/user/gift/streamer/funds/${streamer?.owner?._id}/${streamer?._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
          body: JSON.stringify({
            // display_name: CTX.userObj?.username,
            display_name: `Anonymous_${random?.toString().slice(-4)}`,
            price: v?.price,
            gift: {
              name: v?.name,
              price: v?.price,
              json: v?.emoji,
              category: v?.category,
            },
          }),
        },
      );
      const parsedJson = await leaving.json();
      setSelected(null);

      if (parsedJson?.e) {
        setLoading(false);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      if (parsedJson?.shouldBlock) {
        setModalVisible(parsedJson?.shouldBlock);
        return;
      }

      // const userObj = {
      //   username: `${CTX.userObj?.username}`,
      //   img: CTX.userObj?.photo
      //     ? CTX.userObj?.photo
      //     : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
      //   verify: CTX.userObj?.verify,
      // };

      const content = `🎉 @Anonymous_${random?.toString().slice(-4)} gifted ${
        v?.emoji
      } ${v?.name?.toUpperCase()}!`;

      CTX.socketObj?.emit('private-room-message', {
        room: streamer?._id,
        user: {
          _id: random,
          username: `Anonymous_${random?.toString().slice(-4)}`,
          verify: CTX?.userObj?.verify,
        },
        // user: userObj,
        msg: content.trim(),
      });

      CTX.socketObj?.emit('emit-gift-message', {
        room: streamer?._id,
        gift: {
          type: 'gift',
          from: `Anonymous_${random?.toString().slice(-4)}`,
          to: streamer?.owner?.username,
          gift: {
            name: v?.name?.toUpperCase(),
            emoji: v?.emoji,
            price: v?.price,
          },
        },
      });

      setGiftOverride({
        type: 'gift',
        from: `Anonymous_${random?.toString().slice(-4)}`,
        to: streamer?.owner?.username,
        gift: {
          name: v?.name?.toUpperCase(),
          emoji: v?.emoji,
          price: v?.price,
        },
      });

      const spread = [...messages];
      spread.push({
        _id: Math.random(),
        user: {_id: random, username: `Anonymous_${random?.toString().slice(-4)}`},
        msg: content.trim(),
      });
      setMessages(spread);

      closeModalPress()
    } catch (error) {
      setSelected(null);
      console.log('error from giftHandler for gifting HERE! => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  const mappNormal = NORMAL_GIFTS.map((v, i) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => giftHandler({ ...v, category: 'normal' })}
      key={i}
      style={{
        flexDirection: 'column',
        position: 'relative',
        width: '20%', // 👈 100/4 = 25%
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {selected?.name == v?.name && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: 60,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#00000002',
            justifyContent: 'center',
            borderRadius: 660,
            zIndex: 999999999,
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size={32} color={'#e20154'} />
        </View>
      )}
      <>
        <Text style={{ fontSize: 40 }}>{v?.emoji}</Text>
        <Text
          style={{
            fontFamily: 'Gilroy-Thin',
            paddingVertical: 2,
            fonSize: 4,
            color: '#262626',
          }}
        >
          ₦{v?.price?.toLocaleString()}
        </Text>
        <Text
          style={{
            fontFamily: 'Gilroy-Bold',
            color: '#262626',
            textTransform: 'capitalize',
          }}
        >
          {v?.name}
        </Text>
      </>
    </TouchableOpacity>
  ));

  const mappSpecial = SPECIAL_GIFTS.map((v, i) => (
    <TouchableOpacity
      activeOpacity={0.8}
      key={i}
      onPress={() => giftHandler({ ...v, category: 'special' })}
      style={{
        flexDirection: 'column',
        position: 'relative',
        width: '20%', // 👈 100/4 = 25%
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {selected?.name == v?.name && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: 60,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#00000002',
            justifyContent: 'center',
            borderRadius: 660,
            zIndex: 999999999,
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size={32} color={'#e20154'} />
        </View>
      )}
      <>
        <Text style={{ fontSize: 40 }}>{v?.emoji}</Text>

        <Text
          style={{
            fontFamily: 'Gilroy-Thin',
            paddingVertical: 2,
            fonSize: 4,
            color: '#262626',
          }}
        >
          ₦{v?.price?.toLocaleString()}
        </Text>

        {/* <Text
          style={{ fontFamily: 'Gilroy-Thin', fonSize: 11, color: '#262626' }}
        >
          {v?.price?.toLocaleString()}
        </Text> */}
        <Text
          style={{
            fontFamily: 'Gilroy-Bold',
            color: '#262626',
            textTransform: 'capitalize',
          }}
        >
          {v?.name}
        </Text>
      </>
    </TouchableOpacity>
  ));
  //

  const mappedHeaders = subs.map((item, i) => (
    <View
      style={{
        alignSelf: 'flex-start',
      }}
      key={i}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setText(item);
        }}
      >
        <View
          style={{
            ...styles.eachBtnCover,
            backgroundColor:
              text == item
                ? '#e20154'
                : CTX.isDarkMode
                ? '#202d3489'
                : '#efefef',
          }}
        >
          <Text
            style={{
              ...styles.eachBtnText,
              color:
                text == item ? '#fff' : CTX.isDarkMode ? '#fff' : '#262626',
              fontFamily: 'Gilroy-Bold',
            }}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  ));

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(true)}
      >
        <ImageBackground
          source={imgData}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            overflow: 'hidden',
          }}
          blurRadius={30}
        >
          <Pressable style={styles.anocenteredView}>
            <View style={{ ...styles.anomodalView }}>
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                  style={styles.closeHere}
                >
                  <AntDesign name="close" size={20} color="#555" />
                </TouchableOpacity>

                <Lottie
                  style={styles.Lottie}
                  source={animationData}
                  autoPlay
                  loop
                />

                <Text style={styles.mainTextHere}>
                  You don't have enough funds to gift @
                  {streamer?.owner?.username}. Please fund your account to
                  continue.
                </Text>

                <Button
                  // loading={leaving}
                  onPress={() => {
                    setModalVisible(false);
                    leave();
                    navigation.navigate('DepositScreen');
                  }}
                  label={'Fund account'}
                  style={{
                    width: '100%',
                    backgroundColor: '#ee6666',
                    marginTop: 30,
                    height: 50,
                  }}
                />
              </>
              {/* )} */}
            </View>
          </Pressable>
        </ImageBackground>
      </Modal>

      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          paddingTop: 10,
          paddingRight: 20,
          paddingBottom: 20,
          paddingLeft: 20,
          alignItems: 'center',
        }}
      >
        {mappedHeaders}
      </View>
      <View
        style={{
          gap: 1,
          // paddingTop: 10,
          paddingRight: 20,
          paddingBottom: 20,
          paddingLeft: 20,
          alignItems: 'center',
        }}
      >
        {text == 'Normal' ? (
          <View
            style={{
              gap: 10,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {mappNormal}
          </View>
        ) : (
          <View
            style={{
              gap: 10,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {mappSpecial}
          </View>
        )}
      </View>
    </>
  );
};

export default giftStreamer;

const styles = StyleSheet.create({
  eachBtnCover: {
    backgroundColor: '#efefef',
    paddingHorizontal: 25,
    borderRadius: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
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
  Lottie: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mainTextHere: {
    color: '#555',
    fontWeight: '300',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Gilroy-Medium',
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
    paddingTop: 100,
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
});
