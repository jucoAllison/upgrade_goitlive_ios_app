import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  styleLandingLogo: {
    width: '100%',
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  coverHere: {
    width: '100%',
    padding: 20,
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  eachInputHereTextInput: {
    width: 50,
    height: 50,
    overflow: 'hidden',
    color: '#3b3b3b',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    paddingLeft: 20,
  },

  positionAbsoluteView: {
    width: '100%',
    // height: 400,
    // marginTop: -140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: 20,
    // backgroundColor: 'blue',
  },
  whatsYourNumber: {
    fontWeight: 'bold',
    fontFamily: "Gilroy-Bold",
    marginBottom: 30,
    fontSize: 30,
    color: '#fff',
  },
  positionAbsolute: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  textInputLinkCover: {
    width: '100%',
    borderRadius: 53,
    height: 47,
    borderWidth: 2,
    backgroundColor: '#fff',
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 10,
    alignItems: 'center',
    borderColor: '#fff',
    position: "relative",
    paddingLeft: 20,

  },
  inputTextInput: {
    paddingLeft: 20,
    color: '#3b3b3b',
    textTransform: 'uppercase',
              fontFamily: 'Gilroy-Medium',
    width: '100%',
    paddingRight: 15,
  },
  backTouchableOpacity: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#0a171e',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    top: 20,
  },
  copyHandler: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#e20154',
    height: '100%',
    position: "absolute",
    right: 0,
  },
  eachBtnCover: {
    backgroundColor: '#e20154',
    paddingHorizontal: 20,
    borderRadius: 60,
    height: 47,
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

  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 60,
    backgroundColor: '#fff',
    color: '#3b3b3b',
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
export default styles;
