import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {MainContext} from '../../../App';
import {useIsFocused} from '@react-navigation/native';

const ManageFunds = React.lazy(() => import('./manage'));
const EventManage = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [history, setHistoory] = useState([]);

  const createThreeButtonAlert = (msg = 'Unable to complete request') =>
    Alert.alert('Error', msg, [
      {
        text: 'Close',
        onPress: () => console.log('Close pressed'),
      },
    ]);

  //   const getTransactiionsHere = async toWere => {

  //   };

  const getTransactiionsHere = useCallback(async toWere => {
    if (loading) {
      return null;
    }
    // console.log(`${CTX.systemConfig?.p}get/account/history/${toWere} =>>`);

    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.systemConfig?.p}get/account/history/${toWere}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.sessionToken}`,
          },
        },
      );
      const parsedJson = await fetching.json();

      setLoading(false);

      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }

      // console.log("parsedJson HELLO!! =>> ", parsedJson);

      if (parsedJson?.e) {
        createThreeButtonAlert(parsedJson?.m);
        return;
      }
      setHistoory(parsedJson?.data);
      setShowDeposit(true);
    } catch (error) {
      setLoading(false);
      console.log('error verifying create account => ', error);
      createThreeButtonAlert('Network request failed');
    }
  }, []);

  useEffect(() => {
    CTX.setStatusBarColor('#fff');
    if (selected) {
      getTransactiionsHere(selected);
    }
  }, [selected]);




  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={CTX.statusBarColor}
        // hidden={true}
        barStyle="dark-content"
      />
      <Suspense
        fallback={
          <View style={styles.activityCover}>
            <ActivityIndicator color={'#fff'} size={40} />
          </View>
        }>
        <ManageFunds
          history={history}
          setSelected={e => setSelected(e)}
          loading={loading}
          showDeposit={showDeposit}
          setShowDeposit={setShowDeposit}
        />
      </Suspense>
    </>
  );
};

export default EventManage;

const styles = StyleSheet.create({
  coverMain: {
    flex: 1,
    width: '100%',
    heigth: '100%',
    backgroundColor: '#000',
  },
  activityCover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#0a171e53',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
