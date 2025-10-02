import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
import {MainContext} from '../../../../App';

const CommentInput = ({
  setIsToComment,
  room,
  messages,
  setMessages,
  scrollToBottom,
  isPrivateLive,
  dis_name
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const CTX = useContext(MainContext);
  const textInputRef = useRef();
  const trimText = () => {
    if (content.trim().length < 1) {
      return setIsToComment(false);
    }

    if (isPrivateLive) {
      const random = Math.random();
      CTX.socketObj?.emit('private-room-message', {
        room,
        user: {_id: random, username: `Anonymous ${dis_name?.toString().slice(-4)}`, verify: CTX?.userObj?.verify},
        _id: Math.random(),
        msg: content.trim(),
      });

      const spread = [...messages];
      spread.push({
        _id: Math.random(),
        user: {_id: random, username: `Anonymous ${dis_name?.toString().slice(-4)}`},
        msg: content.trim(),
      });
      setContent('');
      setMessages(spread);
      scrollToBottom();
      return;
    }

    const userObj = {
      username: `${CTX.userObj?.username}`,
      img: CTX.userObj?.photo
        ? CTX.userObj?.photo
        : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
      verify: CTX.userObj?.verify,
    };
    CTX.socketObj?.emit('private-room-message', {
      room,
      user: userObj,
      // _id: Math.random(),
      msg: content.trim(),
    });

    const spread = [...messages];
    spread.push({
      _id: Math.random(),
      user: userObj,
      msg: content.trim(),
    });
    setContent('');
    setMessages(spread);
    scrollToBottom();
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}>
      <View style={styles.writeUpCover}>
        <TextInput
          style={styles.styleTextInput}
          placeholder={'Type something...'}
          ref={textInputRef}
          value={content}
          autoFocus
          onChangeText={setContent}
          // multiline={true}
          placeholderTextColor="#848d9d"
        />

        <Pressable onPress={trimText} style={styles.sendHereBG}>
          {loading ? (
            <ActivityIndicator
              size={23}
              color="#fff"
              style={{position: 'absolute'}}
            />
          ) : (
            <>
              {content.length < 1 ? (
                <MaterialIcons size={25} name={'cancel'} color={'#fff'} />
              ) : (
                <Ionicons size={20} name={'send'} color={'#fff'} />
              )}
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default CommentInput;

const styles = StyleSheet.create({
  writeUpCover: {
    width: '100%',
    // paddingVertical: 7,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#202d34',
    paddingTop:4,
    // marginTop: -28,
    zIndex: 10,
    borderRadius: 35,
  },
  styleTextInput: {
    marginLeft: 30,
    color: '#fff',
    width: '70%',
    fontFamily: 'Overpass-Regular',
    textAlignVertical: 'top',
  },

  sendHereBG: {
    // backgroundColor: '#9e005d99',
    backgroundColor: '#e20154',
    width: 40,
    height: 40,
    position: 'relative',
    alignSelf: 'flex-end',
    marginRight: 7,
    // marginTop: 2,
    marginLeft: 'auto',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },

  close: {
    color: '#999',
    marginLeft: 'auto',
    fontSize: 11,
  },
  replyingTo: {
    // backgroundColor: '#0a171e',
    backgroundColor: '#ffffff36',
    width: '100%',
    borderRadius: 5,
    marginBottom: -7,
    borderLeftWidth: 4,
    borderLeftColor: '#9e005d89',
    padding: 8,
    paddingTop: 24,
  },
});
