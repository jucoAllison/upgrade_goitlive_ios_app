import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
// import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import FontAwesome5Pro from 'react-native-vector-icons/Entypo';
import AbbrNum from '../../helper/abbrev';

const Menu = ({
  offVideo,
  toogleVideo,
  setIsToComment,
  isToComment,
  messages,
}) => {
  return (
    <>
      <View
        style={{
          ...styles.coverMenu,
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <Feather name={'eye'} size={12} color="#fff" />
        <Text style={{...styles.reactionText}}>
          {AbbrNum(messages[messages.length - 1]?.totalUsers - 1 || 0, 0)}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          ...styles.coverMenu,
          backgroundColor: toogleVideo ? '#00dd0099' : '#dd000099',
        }}
        >
        
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.coverMenu}>
        <MaterialCommunityIcons name="message-text" size={25} color={'#fff'} />
      </TouchableOpacity>
    </>
  );
};

export default Menu;

const styles = StyleSheet.create({
  coverMenu: {
    width: 40,
    height: 40,
    backgroundColor: '#dd000099',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
  },
  reactionText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 1,
    // textAlign: 'center',
    fontWeight: 'bold',
  },
  flexTopHere: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
