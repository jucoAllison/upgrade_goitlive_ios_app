import { View, Dimensions, StyleSheet } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  containerCover: {
    width: '100%',
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  topCoverHere: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  upperText: {
    color: '#9f9f9f',
    fontFamily: 'Gilroy-Regular',
    fontSize: 13,
  },
  topImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  coverCommentHere: {
    justifyContent: 'center',
  },
  commentOwner: {
    fontSize: 20,
    fontFamily: 'Gilroy-Bold',
    textAlign: 'center',
    color: '#3b3b3b',
  },
  comment: {
    color: '#3b3b3b',
    textAlign: 'center',
            fontFamily: 'Gilroy-Medium',

    fontSize: 15,
  },
  coverFundsHere: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
  },
  coverFollowingMessage: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  eachBtnCover: {
    borderWidth: 1,
    borderColor: '#bfbfbf',
    paddingHorizontal: 23,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#262626',
            fontFamily: 'Gilroy-Bold',

    textAlign: 'center',
    fontSize: 15,
  },
  showAbsolute: {
    position: 'absolute',
    backgroundColor: '#00003330',
    width: '100%',
    height: '100%',
    zIndex: 22,
  },
  handleComponentStyle: {
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    backgroundColor: '#e20154',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 2,
  },
  reactionText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeLine: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#e1e1e1',
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 'auto',
    justifyContent: 'center',
  },
  centerImage: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  DoyouKnow: {
    margin: 'auto',
    width: 270,
    height: 270,
  },

  coverUserCommentSection: {
    width: '100%',
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },

  sortText: {
    color: '#3b3b3b',
    fontSize: 18,
  },
  clickable: {
    width: 36,
    height: 36,
    borderRadius: 45,
    backgroundColor: '#e20154',
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: '#d1d1d1',
    borderWidth: 2,
  },
  innerCircle: {
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
});

export default styles;
