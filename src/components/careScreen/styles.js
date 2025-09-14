import {View, Dimensions, StyleSheet} from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
    marginVertical: 4,
  },
  Image: {
    borderWidth: 3,
    borderColor: '#e20154',
    borderRadius: 58,
    width:  52,
    height: 52,
    marginRight: 14,
  },
  username: {
    color: '#3b3b3b',
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily: 'Gilroy-Regular',
  },
  userFollow: {
    color: 'blue',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  eachBtnCover: {
    backgroundColor: '#efefef',
    // width: 100,
    paddingHorizontal: 16,
    borderRadius: 15,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#262626',
    fontWeight: 'bold',
    // fontFamily: 'satoshiblack',
    textAlign: 'center',
    fontSize: 15,
  },
  userFullname: {
    fontSize: 13,
    color: '#9f9f9f',
    fontFamily: 'Overpass-Regular',
    fontWeight: 'bold',
    fontFamily: 'Gilroy-Bold',

  },
  actionBtn: {
    backgroundColor: '#efefef',
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 'auto',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
export default styles;
