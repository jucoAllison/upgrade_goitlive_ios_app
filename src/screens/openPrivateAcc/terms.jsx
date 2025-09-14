import {useNavigation} from '@react-navigation/core';
import React, {memo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Button from '../../components/button';
import MyCheckbox from '../../components/checkbox';

const Terms = () => {
  const [checked, setChecked] = useState(true);
  const navigation = useNavigation();

  console.log(
    'just checking rerendering here with one log on Terms and conditions page inside private =>> new',
  );

  return (
    <View style={{flex: 1, width: '100%'}}>
      <ScrollView>
        <View style={styles.firstVersion}>
          <Text style={styles.headerTerms}>Terms of Services</Text>
          <Text style={styles.bodyTerms}>
            The following outlines the terms of use of the Private Life in Goit
            Live. Before using note content maybe sensitive, explict and rated
            18years plus. you required to read, understand and agree to these
            terms
          </Text>
        </View>
        <View style={styles.secondVersion}>
          <Text style={styles.secondVersionHeader}>
            Must Read Have Before Continuing
          </Text>
          <Text style={styles.secondVersionBody}>
            For these notice to be showing, means that you have not open up a
            private account with us before. It is stated that before you can
            view other peoples private life account you must have your own
            account. In other to have a private life account, you must upload a
            1 minute video that best describes you. Unless you are monetize, you
            can now upload more videos to your private live account and connect
            with more people to make money.
          </Text>
        </View>

        <View style={{...styles.secondVersion, height: '100%'}}>
          <Text style={styles.secondVersionHeader}>Updating These Terms</Text>
          <Text style={styles.secondVersionBody}>
            We can change these rules whenever we like by posting an update on
            our terms and conditions, whether you notice it or not
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomAgree}>
        <View style={styles.checkboxWrapper}>
          <MyCheckbox checked={checked} onChange={setChecked} />
          <Text style={{...styles.secondVersionBody, marginLeft: 8}}>
            I agree to the Terms of Services
          </Text>
        </View>
        <Button
          label="Agree and Continue"
          pressableStyle={{width: 200, marginTop: 7}}
          onPress={() => navigation.navigate('UploadPrivate')}
          disable={!checked}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  firstVersion: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
  },
  headerTerms: {
    color: '#222',
    fontSize: 30,
    paddingVertical: 6,
    fontWeight: 'bold',
    fontFamily: 'Optimistic Display',
  },
  bodyTerms: {
    fontFamily: 'Optimistic Display',
    color: '#939393',
    // fontSize: 25,
  },
  secondVersion: {
    backgroundColor: '#f2f2f2',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    width: '100%',
    padding: 20,
  },
  secondVersionHeader: {
    color: '#333',
    paddingBottom: 16,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Optimistic Display',
  },
  secondVersionBody: {
    color: '#939393',
    fontFamily: 'Optimistic Display',
  },
  bottomAgree: {
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    // backgroundColor: '#f2f2f2',
    backgroundColor: '#fff',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default memo(Terms);
