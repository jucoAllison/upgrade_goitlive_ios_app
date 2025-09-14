import {
  View,
  Text,
  StatusBar,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {TruncateText} from '../../helper/truncateText';
const BlockedAccount = ({CTX, getMembersHere, mainData, navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    getMembersHere().then(() => setRefreshing(false));
  };
  const [blockLoading, setBlockLoading] = useState(null);

  const unblockHandler = async _id => {
    try {
      if (blockLoading) {
        return null;
      }
      setBlockLoading(_id);

      const url = `${CTX.url}account/profile/toggle/block/${_id}`;

      const fetchUser = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CTX.sessionToken}`,
        },
      });
      const jsoned = await fetchUser?.json();

      if (jsoned?.e) {
        createThreeButtonAlert(jsoned?.m);
        return;
      }

      const anotherFetchUser = await fetch(
        `${CTX.url}account/profile/get/details`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CTX.sessionToken}`,
          },
        },
      );
      const anoJsoned = await anotherFetchUser?.json();

      CTX.setUserObj(anoJsoned?.data);
      navigation.navigate('SettingsScreen');
      setBlockLoading(null);
    } catch (error) {
      console.log('error verifying create account => ', error);
      createThreeButtonAlert('Network request failed');
      setBlockLoading(null);
    }
  };

  const mapMainData = mainData?.map((item, i) => (
    <View key={i} style={styles.coverNot}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (item?.owner?.status?.length > 0) {
            navigation.navigate('StatusMenu', {
              _id: item?.owner?._id,
            });
          }
        }}
        style={{
          ...styles.coverStatusRound,
          borderWidth: item?.owner?.status?.length > 0 ? 1 : 0,
        }}>
        <Image
          style={styles.styleImage}
          source={{
            uri: item?.owner?.photo
              ? `${item.owner.photo}`
              : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
          }}
        />
        {item?.owner?.active && <View style={styles.isActive}></View>}
      </TouchableOpacity>
      <View style={{marginLeft: 5}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.mappedDatasCoverFullname}>
            {TruncateText(item?.full_name, 24)}
          </Text>
          {item?.owner?.verify && (
            <MaterialIcons
              style={{marginLeft: 5}}
              name="verified"
              color="#91ff91"
              size={17}
            />
          )}
        </View>
        <Text style={styles.mappedDatasCoverUsername}>
          @{TruncateText(item?.username, 24)}
        </Text>
      </View>

      {item?._id != CTX.userObj?._id && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => unblockHandler(item?._id)}
          style={{marginLeft: 'auto', paddingLeft: 10}}>
          {blockLoading == item?._id ? (
            <ActivityIndicator color={'#000'} size={20} />
          ) : (
            <Text style={{color: '#000', fontWeight: 'bold'}}>Unblock</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  ));

  return (
    <ScrollView
      style={{backgroundColor: '#fff', padding: 20, paddingTop: 0}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        translucent={false}
        barStyle={'dark-content'}
      />

      <View style={{height: 9}}></View>
      {mapMainData.length < 1 ? (
        <>
          <View style={{...styles.activityCover}}>
            <View style={{alignItems: 'center'}}>
              <FontAwesome5 size={40} color="#000" name="holly-berry" />
              <Text style={{...styles.pleaseRetry, marginTop: 10}}>
                There is no blocked user found
              </Text>
            </View>
          </View>
        </>
      ) : (
        mapMainData
      )}
    </ScrollView>
  );
};

export default BlockedAccount;

const styles = StyleSheet.create({
  coverNot: {
    flexDirection: 'row',
    marginTop: 20,
    paddingLeft: 2,
    alignItems: 'center',
  },
  eachImg: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },
  username: {
    color: '#3b3b3b',
    fontWeight: 'bold',
    fontFamily: 'Overpass-Regular',
    fontSize: 18,
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
    zIndex: 10,
  },
  coverStatusRound: {
    marginRight: 8,
    padding: 1,
    borderRadius: 100,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderBottomColor: '#9e005d98',
    borderBottomEndRadius: 30,
    borderRightColor: '#9e005d',
  },
  mappedDatasCoverFullname: {
    fontWeight: 'bold',
    fontSize: 11,
    fontFamily: 'Overpass-Regular',
    textTransform: 'capitalize',
    color: '#000',
  },
  mappedDatasCoverUsername: {
    fontSize: 13,
    textTransform: 'lowercase',
    fontFamily: 'Overpass-Regular',
    color: '#ccc',
  },
  styleImage: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },
  activityCover: {
    width: '100%',
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pleaseRetry: {
    color: '#000',
    fontFamily: 'Overpass-Regular',
    textAlign: 'center',
  },
  coverSearchHere: {
    backgroundColor: '#efefef',
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
  },
  coverAnt: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7c90b069',
    marginTop: 10,
    flexDirection: 'row',
  },
  innerTextInput: {
    color: '#262626',
    marginLeft: 10,
    width: '80%',
  },

  clearAll: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
});
