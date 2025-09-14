import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {TruncateText} from '../../helper/truncateText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AbbrNum from '../../helper/abbrev';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AmassPostFeed = ({v, amassDetails}) => {
  const navigation = useNavigation();
  const [toggle, setToggle] = useState(false);

  return (
    <View style={{...styles.lineBottom, marginTop: 20}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (v?.owner?.status?.length > 0) {
              navigation.navigate('StatusMenu', {
                _id: v?.owner._id,
              });
              return;
            } else {
              navigation.navigate('userProfiles', {
                ...v?.owner,
              });
            }
          }}
          style={{
            ...styles.coverStatusRound,
            borderWidth: v?.owner?.status?.length > 0 ? 1 : 0,
          }}>
          <Image
            style={styles.styleImage}
            source={{
              uri: v?.owner?.photo
                ? v?.owner?.photo
                : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
            }}
          />
          {v?.owner?.active && <View style={styles.isActive}></View>}
        </TouchableOpacity>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              onPress={() => {
                navigation.navigate('userProfiles', {
                  ...v?.owner,
                });
              }}
              style={styles.mappedDatasCoverFullname}>
              {TruncateText(v?.owner?.full_name, 24)}
            </Text>
            {v?.owner?.verify && (
              <MaterialIcons
                style={{marginLeft: 5}}
                name="verified"
                color="#91ff91"
                size={17}
              />
            )}
          </View>
          <Text style={styles.mappedDatasCoverUsername}>
            @{TruncateText(v?.owner?.username, 24)}
          </Text>
        </View>
      </View>
      <View style={{position: 'relative'}}>
        <Text style={styles.postWriteup}>
          {v?.postWriteUp?.length < 1
            ? 'No data'
            : toggle
            ? v?.postWriteUp
            : TruncateText(v?.postWriteUp, 114)}
        </Text>
        {v?.postWriteUp?.length > 110 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setToggle(!toggle)}
            style={styles.smallFollowingCover}>
            <Text style={styles.smallFollowing}>
              {toggle ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{position: 'relative'}}>
        <Pressable
          onPress={() =>
            navigation.navigate('EachAmassPost', {
              ...v,
              amass_id: {...amassDetails},
            })
          }>
          <Image
            style={styles.postImage}
            source={{
              uri: v?.postUrl
                ? // ? v?.postUrl+"/tr:q-50,lo-true"
                  v?.postUrl + '/tr:q-50,h-350,w-350,c-at_least'
                : 'https://cdn.dribbble.com/users/544452/avatars/normal/75871bc6158481115dda331f4817e329.jpg?1652874301',
            }}
          />
        </Pressable>
        <View style={styles.likeCover}>
          <AntDesign name="like1" color="#fff" />
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 12,
              marginLeft: 2,
            }}>
            {AbbrNum(v?.like?.length, 0)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AmassPostFeed;

const styles = StyleSheet.create({
  styleImage: {
    width: 42,
    height: 42,
    borderRadius: 50,
    marginRight: 3,
  },
  mappedDatasCoverFullname: {
    fontWeight: 'bold',
    fontSize: 11,
    fontFamily: 'Overpass-Regular',
    textTransform: 'capitalize',
    color: '#000000',
  },
  mappedDatasCoverUsername: {
    fontSize: 13,
    color: '#26262689',
    textTransform: 'lowercase',
  },
  postWriteup: {
    fontSize: 13,
    color: '#222',
    fontFamily: 'Overpass-Regular',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  postImage: {
    width: '100%',
    height: 260,
  },
  lineBottom: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#7c90b069',
  },
  smallFollowing: {
    color: '#e20154',
    fontWeight: 'bold',
    fontSize: 12,
  },
  smallFollowingCover: {
    position: 'absolute',
    bottom: 15,
    right: 13,
    // backgroundColor: 'yellow',
    paddingVertical: 7,
    paddingLeft: 12,
  },
  likeCover: {
    position: 'absolute',
    bottom: 15,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  coverStatusRound: {
    marginRight: 13,
    padding: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderBottomColor: '#9e005d98',
    borderBottomEndRadius: 30,
    // botop
    borderRightColor: '#9e005d',
  },
  isActive: {
    width: 13,
    height: 13,
    backgroundColor: '#3cca0b',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    position: 'absolute',
    top: 7,
    left: -4,
  },
});
