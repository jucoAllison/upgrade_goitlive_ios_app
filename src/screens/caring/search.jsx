// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';

// import {MainContext} from '../../../App';
// const Search = ([
//   searchType,
//   loading,
//   setLoading,
//   setParent,
//   userID,
//   setErrMsg,
//   setShowMsg,
// ]) => {
//   const CTX = useContext(MainContext);
//   const [text, setText] = useState('');
//   const [showBtn, setShowBtn] = useState(true);

//   // const onChangeTextHandler = async e => {
//   //   setText(e);
//   //   setShowBtn(e.length > 2);
//   // };

//   // const searchUserHandler = async () => {
//   //   if (loading) return;

//   //   setLoading(true);
//   // setErrMsg('');
//   //     setShowMsg(false);
//   //   try {
//   //     let urlHere = `${CTX.systemConfig?.p}user/profile/search/care/${userID}/${searchType}/${text}`;

//   //     const fetching = await fetch(
//   //       urlHere, // we get three fetching here as
//   //       {
//   //         method: 'GET',
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //           Authorization: `bearer ${CTX.sessionToken}`,
//   //         },
//   //       },
//   //     );
//   //     const response = await fetching.json();
//   //     if (response?.isRemoved) {
//   //       return CTX.logoutUser();
//   //     }

//   //     if (response.error) {
//   //       setShowMsg(true);
//   //       setLoading(false);
//   //       setErrMsg(response.data?.msg);
//   //       console.log('error from searchUserHandler ==>> ', response.data?.msg);

//   //       return;
//   //     }
//   //     console.log('...searchUserHandler ==>>> ', response?.data);
//   //   } catch (error) {
//   //     console.log('error from searchUserHandler ==>> ', error);
//   //     setErrMsg('Error searching, click to retry');
//   //     setShowMsg(true);
//   //     setLoading(false);
//   //   }
//   // };

//   return (
//     <View style={styles.coverSearchHere}>
//       <AntDesign name="search1" color="#262626" size={24} />
//       <TextInput
//         style={styles.innerTextInput}
//         placeholder="Search"
//         // value={text}
//         placeholderTextColor={'#262626'}
//         // onChangeText={e => onChangeTextHandler(e)}
//       />

//       {showBtn && (
//         <TouchableOpacity activeOpacity={0.8}
//           // onPress={searchUserHandler}
//           style={styles.sendIconCover}>
//           {loading ? (
//             <ActivityIndicator size={24} color={'#e20154'} />
//           ) : (
//             <Ionicons
//               style={styles.Ionicons}
//               name="send"
//               size={24}
//               color={'#e20154'}
//             />
//           )}
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default Search;

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MainContext} from '../../../App';

const Search = ({
  setErrMsg,
  setParent,
  userID,
  setShowMsg,
  searchType,
  lookup,
  reGetHere,
}) => {
  const CTX = useContext(MainContext);
  const [text, setText] = useState('');
  const [showBtn, setShowBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeTextHandler = e => {
    setText(e);
    setShowBtn(e.length > 2);

    // if (e.length < 2) {
    //   reGetHere();
    // }
  };

  const searchUserHandler = async () => {
    if (loading) return;

    setLoading(true);
    setErrMsg('');
    setShowMsg(false);
    try {
      let urlHere = `${CTX.systemConfig?.p}user/profile/search/care/${userID}/${searchType}/${lookup}/${text}`;

      const fetching = await fetch(
        urlHere, // we get three fetching here as
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const response = await fetching.json();
      if (response?.isRemoved) {
        return CTX.logoutUser();
      }

      if (response.error) {
        setShowMsg(true);
        setLoading(false);
        setErrMsg(response?.msg);
        console.log('error from searchUserHandler ==>> ', response.data?.msg);

        return;
      }

      // console.log('...searchUserHandler ==>>> ', response?.data?.data);
      // refactor here
      // const refactorMap = await response?.data?.data.map(v => {
      //   return {
      //     ...v,
      //     [lookup]: {
      //       _id: v?.[lookup]?._id[0],
      //       full_name: v?.[lookup]?.full_name[0],
      //       active: v?.[lookup]?.active[0],
      //       monetize: v?.[lookup]?.monetize[0],
      //       username: v?.[lookup]?.username[0],
      //       verify: v?.[lookup]?.verify[0],
      //     },
      //   };
      // });
      console.log('...searchUserHandler ==>>> ', response?.data?.data);

      // if(response?.data?.data?.length < 1) {

      // }

      setParent(response?.data?.data);
      setLoading(false);
      setErrMsg('');
      setShowMsg(false);
    } catch (error) {
      console.log('error from searchUserHandler ==>> ', error);
      setErrMsg('Error searching, click to retry');
      setShowMsg(true);
      setLoading(false);
    }
  };

  return (
    <View style={styles.coverSearchHere}>
      <AntDesign name="search1" color="#262626" size={24} />
      <TextInput
        style={styles.innerTextInput}
        placeholder="Search"
        value={text}
        placeholderTextColor={'#262626'}
        onChangeText={e => onChangeTextHandler(e)}
      />

      {showBtn && (
        <TouchableOpacity activeOpacity={0.8}
          onPress={searchUserHandler}
          style={styles.sendIconCover}>
          {loading ? (
            <ActivityIndicator size={21} color={'#e20154'} />
          ) : (
            <Ionicons
              style={styles.Ionicons}
              name="send"
              size={21}
              color={'#e20154'}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  coverSearchHere: {
    backgroundColor: '#efefef',
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 25,
    height: 50,
    // height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#d1d1d1',
    // borderBottomWidth: 2,
  },
  innerTextInput: {
    color: '#262626',
    marginLeft: 10,
    width: '77%',
    fontFamily: 'Gilroy-Regular',
  },
  sendIconCover: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#e1e1e1',
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 'auto',
    justifyContent: 'center',
  },
});
