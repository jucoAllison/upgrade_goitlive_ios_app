// import {View, Dimensions, StyleSheet} from 'react-native';
// import React from 'react';

// const styles = StyleSheet.create({
//   Lottie: {
//     width: 150,
//     height: 150,
//   },
//   anocenteredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: Dimensions.get('window').height,
//     backgroundColor: '#00000099',
//   },
//   anomodalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 7,
//     padding: 0,
//     width: '100%',
//     height: 420,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },

//   topCoverHere: {
//     flexDirection: 'row',
//     marginTop: 5,
//     marginBottom: 8,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   topImage: {
//     borderWidth: 3,
//     width: 105,
//     height: 105,
//     borderRadius: 100,
//   },
//   coverCommentHere: {
//     justifyContent: 'center',
//   },
//   commentOwner: {
//     // fontWeight: 'bold',
//     fontSize: 25,
//     textAlign: 'center',
//     fontFamily: 'satoshiblack',
//     color: '#000',
//   },
//   comment: {
//     color: '#3b3b3b',
//     textAlign: 'center',
//     fontSize: 15,
//   },
//   coverFollowingMessage: {
//     flexDirection: 'row',
//     // marginTop: 20,
//     justifyContent: 'space-between',
//   },
//   eachBtnCover: {
//     // backgroundColor: '#efefef',
//     borderWidth: 1,
//     borderColor: "#bfbfbf",
//     // width: 100,
//     paddingHorizontal: 23,
//     paddingVertical: 12,
//     borderRadius: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   lazyLoad: {
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   eachBtnText: {
//     color: '#3b3b3b',
//     fontFamily: 'satoshiblack',
//     // fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 15,
//   },
//   reservedLive: {
//     alignItems: 'center',
//     marginVertical: 30,
//     borderBottomWidth: 1,
//     borderColor: '#d1d1d1',
//     paddingBottom: 5,
//     justifyContent: 'center',
//     flexDirection: 'row',
//     // elevation: 1,
//     // shadowOpacity: 0,
//     // shadowColor: '#000',
//     // borderBottomColor: '#000',
//     // borderBottomWidth: 0,
//   },
//   eachBtnTextReserved: {
//     fontSize: 15,
//     color: '#262626',
//     fontFamily: 'Overpass-Regular',
//     marginRight: 20,
//     fontWeight: '400',
//   },

//   // video HERE
//   app: {
//     marginTop: 10,
//   },
//   itemVideoHere: {
//     flex: 1,
//     maxWidth: '33.3%', // 100% devided by the number of rows you want
//     alignItems: 'center',
//     height: 200,
//     // backgroundColor: 'rgba(249, 180, 45, 0.25)',
//     backgroundColor: '#443344',
//     borderWidth: 1.5,
//     borderColor: '#fff',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderElement: {
//     width: 100,
//     height: 20,
//     marginBottom: 12,
//     borderRadius: 4,
//   },
//   closeLine: {
//     position: 'absolute',
//     top: 8,
//     right: 5,
//     backgroundColor: '#e1e1e1',
//     width: 34,
//     height: 34,
//     borderRadius: 20,
//     alignItems: 'center',
//     marginLeft: 'auto',
//     zIndex: 200,
//     // backgroundColor: "red",
//     justifyContent: 'center',
//   },
//   plusAdd: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 50,
//     height: 50,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#999',
//   },
//   iconCoverHere: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 50,
//     height: 50,
//     borderRadius: 20,
//     backgroundColor: "red",
//     overflow: "hidden"
//   }
// });

// export default styles;

import { View, Dimensions, StyleSheet } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  Lottie: {
    width: 150,
    height: 150,
  },
  anocenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    backgroundColor: '#00000099',
  },
  anomodalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 7,
    padding: 0,
    width: '90%',
    height: 300,
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

  topCoverHere: {
    flexDirection: 'row',
    marginTop: 27,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  topImage: {
    // borderWidth: 3,
    // width: 105,
    // height: 105,
    // borderRadius: 100,
    width: '100%', // take full width
    height: undefined, // let the height be calculated automatically
    aspectRatio: 1, // or the actual aspect ratio of your image
    resizeMode: 'contain',
  },
  coverCommentHere: {
    justifyContent: 'center',
  },
  eachCoverBTN: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    borderRadius: 8,
    height: 62,
  },
  commentOwner: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'Gilroy-Bold',
    color: '#3b3b3b',
  },
  comment: {
    color: '#3b3b3b',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Gilroy-Medium',
  },
  coverFollowingMessage: {
    flexDirection: 'row',
    // marginTop: 20,
    justifyContent: 'space-between',
  },
  eachBtnCover: {
    backgroundColor: '#efefef',
    // width: 100,
    paddingHorizontal: 16,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  lazyLoad: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  eachBtnText: {
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  reservedLive: {
    alignItems: 'center',
    marginVertical: 30,
    borderBottomWidth: 1,
    borderColor: '#d1d1d1',
    paddingBottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    // elevation: 1,
    // shadowOpacity: 0,
    // shadowColor: '#000',
    // borderBottomColor: '#000',
    // borderBottomWidth: 0,
  },
  eachBtnTextReserved: {
    fontSize: 15,
    color: '#262626',
    fontFamily: 'Overpass-Regular',
    marginRight: 20,
    fontWeight: '400',
  },

  // video HERE
  app: {
    marginTop: 10,
  },
  itemVideoHere: {
    flex: 1,
    maxWidth: '33.3%', // 100% devided by the number of rows you want
    alignItems: 'center',
    height: 200,
    // backgroundColor: 'rgba(249, 180, 45, 0.25)',
    backgroundColor: '#443344',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderElement: {
    width: 100,
    height: 20,
    marginBottom: 12,
    borderRadius: 4,
  },
  closeLine: {
    position: 'absolute',
    top: 8,
    right: 5,
    backgroundColor: '#e1e1e1',
    width: 34,
    height: 34,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 'auto',
    zIndex: 200,
    // backgroundColor: "red",
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    top: -10, // Adjust based on the status bar height
    right: 20,
    zIndex: 900,
  },
});

export default styles;
