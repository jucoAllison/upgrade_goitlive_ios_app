import {View, Dimensions, StyleSheet} from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  containerCover: {
    width: '100%',
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
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
  innerTextInput: {
    color: '#262626',
    marginLeft: 10,
    width: '80%',
  },
  topNavHere: {
    flexDirection: 'row',
  },
  coverFollowingMessage: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: "center",
    // justifyContent: 'space-between',
  },
  eachBtnCover: {
    backgroundColor: '#efefef',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#262626',
    fontWeight: 'bold',
    alignItems: "center",
    textAlign: 'center',
    textTransform: "capitalize",
    fontSize: 15,
  },
  clearAll: {
    // position: 'absolute',
            marginLeft: 'auto',
            // top:   30,
    // right: 30,
    fontWeight: 'bold',
    color: '#e20154',
  },
  activityCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  activiityCover: {
    width: '80%',
    height: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  lazyLoad: {
    borderRadius: 5,
    overflow: 'hidden',
  },
});
export default styles;
