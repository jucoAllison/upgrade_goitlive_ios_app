// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   FlatList,
//   ActivityIndicator,
// } from 'react-native';
// import React, {useCallback, useContext, useState} from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
// import EachComment from '../../../../../components//eachComment';

// import styles from '../styles';
// import {MainContext} from '../../../../../../App';

// const Comments = ({
//   lastComments,
//   msgComment,
//   setMsgComment,
//   loadingMsg,
//   loading,
//   sendMessages,
// }) => {
//   const CTX = useContext(MainContext);

//   // render
//   const renderItem = useCallback(
//     (item, index) => (
//       <EachComment key={index} item={item} />
//     ),
//     [],
//   );

//   return (
//     <View>
//       <View style={styles.rememberTextCover}>
//         <Text style={styles.rememberText}>
//           Remember to keep comments respectful and to follow our
//           <Text style={{color: '#00d', paddingLeft: 4}}>
//             {' '}
//             Community Guideline
//           </Text>
//         </Text>
//       </View>
//       <View style={styles.coverUserCommentSection}>
//         <Image
//           source={{
//             uri: CTX.userObj?.photo
//               ? CTX.userObj?.photo
//               : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
//           }}
//           style={styles.commentImage}
//         />

//         <TextInput
//           style={styles.commentInput}
//           multiline={true}
//           placeholder="Add a comment..."
//           placeholderTextColor={'#333'}
//           numberOfLines={3}
//           onChangeText={setMsgComment}
//           value={msgComment}
//         />
//         <TouchableOpacity activeOpacity={0.8} onPress={sendMessages} style={styles.sendIconCover}>
//           {loadingMsg ? (
//             <ActivityIndicator size={24} color={'#e20154'} />
//           ) : (
//             <Ionicons
//               style={styles.Ionicons}
//               name="send"
//               size={24}
//               color={'#e20154'}
//             />
//           )}
//         </TouchableOpacity>
//       </View>

//       <Pressable
//         onPress={() => {
//           return null;
//         }}
//         style={styles.coverScrollView}>
//         {loading ? (
//           <View style={styles.activiityCover}>
//             <ActivityIndicator color={'#0a171e'} size={27} />
//           </View>
//         ) : (
//           <>
//             {lastComments.length < 1 ? (
//               <View style={styles.activiityCover}>
//                 <FontAwesome5 size={40} color="#0a171e" name="holly-berry" />
//                 <Text style={styles.pleaseRetry}>
//                   Empty comment, add a comment above
//                 </Text>
//               </View>
//             ) : (
//               <BottomSheetScrollView
//               onScrollEndDrag={() => console.log("end have reach")}
//                 contentContainerStyle={styles.contentContainer}>
//                 <Pressable
//                   onPress={() => {
//                     return null;
//                   }}>
//                   {lastComments.map(renderItem)}
//                 </Pressable>
//                 <View style={{height: 240, width: "100%"}}></View>
//               </BottomSheetScrollView>
//             )}
//           </>
//         )}

//         {/* <FlatList
//           data={lastComments}
//           // data={comments}
//           renderItem={({item}) => <EachComment item={item} />}
//           // renderItem={({item}) => (
//           //   <ChatMessage
//           //     setIndex={setIndex}
//           //     message={item}
//           //     replyTo={replyTo}
//           //     findReplyIndex={findReplyIndex}
//           //   />
//           // )}
//           showsVerticalScrollIndicator={false}
//         /> */}
//       </Pressable>
//     </View>
//   );
// };

// export default Comments;


import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import EachComment from '../../../../../components/eachComment';

import styles from '../../../../eachAmassPost/eachAmassPost.styles';
import {MainContext} from '../../../../../../App';

const Comments = ({
  lastComments,
  msgComment,
  setMsgComment,
  loadingMsg,
  loading,
  sendMessages,
  replying,
  setReplying,
}) => {
  const CTX = useContext(MainContext);
  var maxLength = 130;
  var result = replying?.content.substring(0, maxLength) + '...';

  // render
  const renderItem = useCallback(
    (item, index) => (
      <EachComment key={index} item={item} showReply onPressReply={e => setReplying(e)} />
    ),
    [],
  );

  return (
    <View>
      <View style={styles.rememberTextCover}>
        <Text style={styles.rememberText}>
          Remember to keep comments respectful and to follow our
          <Text style={{color: '#00d', paddingLeft: 4}}>
            {' '}
            Community Guideline
          </Text>
        </Text>
      </View>

      {replying && (
        <View style={styles.replyingTo}>
          {replying?.user?.username == CTX.userObj.username ? (
            <Text style={styles.time}>You</Text>
          ) : (
            <Text style={styles.time}>@{replying?.user?.username}</Text>
          )}
          <Pressable
            style={{...styles.closeCover, color: '#000'}}
            onPress={() => setReplying(null)}>
            <Text style={{color: '#0a171e'}}>X</Text>
          </Pressable>
          <Text style={{color: '#999', fontSize: 13}}>
            {replying?.content?.length > maxLength ? result : replying?.content}
            {/* {replying?.content} */}
          </Text>
        </View>
      )}
      <View style={styles.coverUserCommentSection}>
        <Image
          source={{
            uri: CTX.userObj?.photo
              ? `${CTX.userObj?.photo}`
              : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
          }}
          style={styles.commentImage}
        />

        <TextInput
          style={styles.commentInput}
          multiline={true}
          placeholder="Add a comment..."
          placeholderTextColor={'#333'}
          autoFocus
          numberOfLines={3}
          onChangeText={setMsgComment}
          value={msgComment}
        />
        <TouchableOpacity activeOpacity={0.8} onPress={sendMessages} style={styles.sendIconCover}>
          {loadingMsg ? (
            <ActivityIndicator size={24} color={'#e20154'} />
          ) : (
            <Ionicons
              style={styles.Ionicons}
              name="send"
              size={24}
              color={'#e20154'}
            />
          )}
        </TouchableOpacity>
      </View>

      <Pressable
        onPress={() => {
          return null;
        }}
        style={styles.coverScrollView}>
        {loading ? (
          <View style={styles.activiityCover}>
            <ActivityIndicator color={'#0a171e'} size={27} />
          </View>
        ) : (
          <>
            {lastComments?.length < 1 ? (
              <View style={styles.activiityCover}>
                <FontAwesome5 size={40} color="#0a171e" name="holly-berry" />
                <Text style={styles.pleaseRetry}>
                  Empty comment, add a comment above
                </Text>
              </View>
            ) : (
              <BottomSheetScrollView
              onScrollEndDrag={() => console.log("end have reach")}
                contentContainerStyle={styles.contentContainer}>
                <Pressable
                  onPress={() => {
                    return null;
                  }}>
                  {lastComments?.map(renderItem)}
                </Pressable>
                <View style={{height: 240, width: "100%"}}></View>
              </BottomSheetScrollView>
            )}
          </>
        )}

        {/* <FlatList
          data={lastComments}
          // data={comments}
          renderItem={({item}) => <EachComment item={item} />}
          // renderItem={({item}) => (
          //   <ChatMessage
          //     setIndex={setIndex}
          //     message={item}
          //     replyTo={replyTo}
          //     findReplyIndex={findReplyIndex}
          //   />
          // )}
          showsVerticalScrollIndicator={false}
        /> */}
      </Pressable>
    </View>
  );
};

export default Comments;
