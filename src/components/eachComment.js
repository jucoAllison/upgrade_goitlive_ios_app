import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {MainContext} from '../../App';
const EachComment = ({item, replyTo, onPressToNav, showReply, onPressReply}) => {
  const CTX = useContext(MainContext);
  var maxLength = 130;
  var result = item?.replyingObj?.msg?.substring(0, maxLength) + '...';

  const isMyMessage = () => {
    return item?.user._id == CTX.userObj._id;
  };

  return (
    <>
      {item.replyingObj && (
        <Pressable
          // onPress={() => findReplyIndex(message?.replyingObj?.replyId)}
          style={{
            ...styles.replyingTo,
            marginTop: isMyMessage() ? 8 : 0,
          }}>
          {item?.replyingObj?.replyTo == CTX.userObj.username ? (
            <Text style={styles.time}>You</Text>
          ) : (
            <Text style={styles.time}>@{item?.replyingObj?.replyTo}</Text>
          )}
          {/* <Pressable
                style={styles.closeCover}
                // onPress={() => setReplying(null)}
              >
                <Text style={styles.close}>X</Text>
              </Pressable> */}
          <Text style={{color: '#999', fontSize: 13}}>
            {item?.replyingObj?.msg?.length > maxLength
              ? result
              : item?.replyingObj?.msg}
          </Text>

          <View style={{height: 3, width: '100%', marginTop: 'auto'}}></View>
        </Pressable>
      )}
      <TouchableWithoutFeedback
        style={styles.eachCommentCover}
        onPress={onPressToNav}
        onLongPress={() =>
          replyTo({
            content: item?.content,
            username: item?.user?.username,
            _id: item?._id,
          })
        }>
        <View style={styles.eachCommentCover}>
          <Image
            source={{
              uri: item?.user?.photo
                ? `${item?.user?.photo}/tr:q-60,h-150,w-150,c-at_least`
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
            style={styles.Image}
          />
          <View style={styles.coverCommentHere}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.commentOwner}>@{item?.user?.username}</Text>
              {item?.user?.verify && (
                <MaterialIcons
                  style={{marginLeft: 5}}
                  name="verified"
                  color="#999"
                  size={15}
                />
              )}
            </View>
            <Text style={styles.comment}>{item?.content}</Text>
          </View>
          {showReply && <TouchableOpacity onPress={() => onPressReply(item)} style={styles.loveHere}>
            <Fontisto name="reply" size={20} color={'#838289'} />
          </TouchableOpacity>}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  eachCommentCover: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 8,
    // paddingHorizontal: 20,
    marginBottom: 5,
    paddingRight: 60,
    alignItems: 'center',
    flexDirection: 'row',
  },
  time: {
    // alignSelf: 'flex-end',
    color: '#0a171e',
    // position: 'absolute',
    // top: 9,
    // left: 30,
    fontWeight: 'bold',
    fontSize: 11,
  },
  commentOwner: {
    // fontWeight: 'bold',
    fontSize: 13,
    color: '#262626',
    fontFamily: 'satoshiblack',
  },
  comment: {
    color: '#262626',
    fontSize: 13,
    fontFamily: 'Overpass-Regular',
  },
  Image: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginRight: 10,
  },
  //   coverCommentHere: {
  //     // paddingRight: 10,
  //     // backgroundColor: "red"
  //   },
  loveHere: {
    position: 'absolute',
    right: 12,
  },
});

export default EachComment;
