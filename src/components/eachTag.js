import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EachComment = ({
  header = 'huncho here!',
  comment = '4 minutes ago',
  showLove = false,
  uri = 'https://cdn.dribbble.com/users/585028/avatars/normal/d10550e123919c05fed7c3d5f3dde131.jpg?1645304642',
}) => {
  return (
    <View style={styles.eachCommentCover}>
      <Image
        source={{
          uri,
        }}
        style={styles.Image}
      />
      <View style={styles.coverCommentHere}>
        <Text style={styles.commentOwner}>{header}</Text>
        <Text style={styles.comment}>{comment}</Text>
      </View>
      {showLove && (
        <View style={styles.loveHere}>
          <Ionicons name="ios-heart-sharp" size={20} color={'#838289'} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eachCommentCover: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    // paddingHorizontal: 20,
    marginBottom: 5,
    paddingRight: 60,
    alignItems: 'center',

    flexDirection: 'row',
  },
  commentOwner: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#262626',
  },
  comment: {
    color: '#262626',
    fontSize: 15,
  },
  Image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  loveHere: {
    position: 'absolute',
    right: 12,
  },
});

export default EachComment;
