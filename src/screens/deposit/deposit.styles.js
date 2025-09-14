import {View, Dimensions, StyleSheet} from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  containerCover: {
    width: '100%',
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  innerTextInput: {
    color: '#262626',
    paddingRight: 40,
    width: '100%',
    marginLeft: 10,
  },
  eachBtnCover: {
    backgroundColor: '#9e005d',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 55,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  upperText: {
    color: '#9f9f9f',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 10,
  },

  coverSearchHere: {
    backgroundColor: '#efefef',
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 45,
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'row',
  },
  sortedByDefault: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    marginTop: 20,
  },
  coverFundsHere: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'center',
  },
  eachBtnText: {
    color:
      '#fff                                                                                                                ',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default styles;
