import { View, Dimensions, StyleSheet } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  containerCover: {
    width: '100%',
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  coverUserCommentSection: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',

    height: 60,
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 1,
  },
  sortText: {
    color: '#3b3b3b',
    fontFamily: 'Gilroy-Regular',
    marginLeft: 10,
    fontSize: 16,
  },
  smallFollowing: {
    color: '#555555',
    fontSize: 9,
    fontFamily: 'Overpass-Regular',
    marginTop: 27,
  },

  anomodalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 7,
    // height: "90%",
    padding: 15,
    width: '90%',
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

  anocenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    // marginTop: 22,
    backgroundColor: '#00000066',
  },
});
export default styles;
