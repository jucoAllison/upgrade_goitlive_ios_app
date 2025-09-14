import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  containerCover: {
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
  },
  commentOwner: {
    fontWeight: 'bold',
    marginTop: 30,
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'Satoshi',
    color: '#3b3b3b',
  },
  upperText: {
    color: '#9f9f9f',
    fontSize: 18,
  },
  comment: {
    color: '#3b3b3b',
    fontSize: 19,
  },
  linkSection: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    paddingBottom: 3,
  },
  sideText: {
    color: '#3b3b3b',
    marginLeft: 'auto',
  },
  textInputLinkCover: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: '#9f9f9f',
    paddingLeft: 20,
  },
  inputTextInput: {
    paddingLeft: 20,
    width: '100%',
    color: '#3b3b3b',
    height: 50,
    paddingRight: 15,
  },
  sortText: {
    marginTop: 20,
    color: '#111',
    fontSize: 16,
  },
  viewCover: {
    width: '100%',
    height: 35,
  },
  mainText: {
    color: '#3b3b3b',
    height: 50,
    width: '100%',
    fontSize: 20,
  },
  eachNameCover: {
    borderBottomColor: '#cccccc89',
    borderBottomWidth: 2,
    paddingBottom: 3,
    marginTop: 10,
  },
  eachBtnCover: {
    backgroundColor: '#efefef',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#262626',
    fontWeight: 'bold',
    fontFamily: 'Satoshi',
    textAlign: 'center',
    fontSize: 15,
  },
  isVerified: {
    width: '100%',
    margin: 'auto',
    backgroundColor: '#91ff91',
    paddingVertical: 10,
  },
  isVerifiedText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Satoshi',
    fontWeight: 'bold',
  },
});
export default styles;
