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
import {MainContext} from '../../../../../App';

const CommentInput = ({
  setIsToComment,
  room,
  messages,
  setMessages,
  scrollToBottom,
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const CTX = useContext(MainContext);
  const textInputRef = useRef();
  const trimText = async () => {
    try {
      if (content.trim().length < 1) {
        return setIsToComment(false);
      }

      const userObj = {
        username: CTX.userObj?.username,
        img:
          CTX.userObj?.photo?.length > 4
            ? CTX.userObj?.photo
            : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
        verify: CTX.userObj?.verify,
      };
      await CTX.socketObj?.emit('private-room-message', {
        room,
        user: userObj,
        // _id: Math.random(),
        msg: content.trim(),
      });

      const spread =  [...messages];
      spread.push({
        _id: Math.random(),
        user: userObj,
        msg: content.trim(),
      });
      setMessages(spread);
      await setContent('');
      await scrollToBottom();
    } catch (error) {
      console.log('error from trimText HERE!! ==>> ', error);
    }
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
          multiline={true}
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
  mainWriteUpCover: {
    position: 'absolute',
    // width: '100%',
    // paddingHorizontal: 20,
    // // backgroundColor: '#0a171e',
    // backgroundColor: '#e20154',
    // justifyContent: 'center',
    // alignItems: 'center',
    // bottom: 20,
    width: '100%',
    height: '10%',
    backgroundColor: '#e20154',
    bottom: 0,
    // marginTop: "auto",
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    // zIndex: 10,
  },
  writeUpCover: {
    width: '100%',
    // paddingVertical: 7,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#202d34',
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
    backgroundColor: '#9e005d99',
    width: 40,
    height: 40,
    position: 'relative',
    alignSelf: 'flex-end',
    marginRight: 7,
    marginLeft: 'auto',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  time: {
    alignSelf: 'flex-end',
    // color: '#0a171e',
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
    // color: '#0a171e',
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
    borderLeftColor: '#9e005d89',
    padding: 8,
    paddingTop: 24,
  },
});
