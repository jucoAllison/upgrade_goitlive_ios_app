import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';

import SplashScreen from './src/screens/splash/splash';
import UnderManten from './src/screens/underMaintenance/underMainten';
import EventEmail from './src/screens/email/eventEmail';
import EventNumber from './src/screens/number/eventNumber';
import Verification from './src/screens/verification/eventVerification';
import loginWithBackupCode from './src/screens/loginWithBackupCode/loginWithBackupCode';
import SerialCode from './src/screens/SerialCode/SerialCode';
import FromForgottenBackup from './src/screens/fromForgottenBackupCode/fromForgottenBackupCode';
import EventCreateAccount from './src/screens/createAccount/eventCreateAccount';
import EmailVerification from './src/screens/emailVerification/emailVerification';
import EventForgotBackupCode from './src/screens/forgotBackUpCode/eventForgotBackUpCode';
import ExternalLink from './src/screens/addExternalLink/addExternalLink';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EachChat from './src/screens/eachChat/eventEachChat';
import BottomTabNavigation from './bottomTabNavigation';
import EventUserProfiles from './src/screens/userProfiles/eventUserProfiles';
import EventEditProfile from './src/screens/editProfile/eventEditProfile';
import ManageFunds from './src/screens/manageFunds/eventManage';
import Deposit from './src/screens/deposit/eventDeposit';
import Withdraw from './src/screens/withdraw/eventWithdrawal';
import EventRequestNewBackup from './src/screens/requestNewBackup/eventRequestNewBackup';
import CaringSection from './src/screens/caring/index';
import RequestVerification from './src/screens/requestVerification/eventRequestVerification';
import AccountNotification from './src/screens/notification/eventNotification';
import SettingsScreen from './src/screens/settings/settiings';
import EventPublishLive from './src/screens/publishLive/eventPublishLive';
import EventActivityStatus from './src/screens/activityStatus/eventActivityStatus';
import EventShowHint from './src/screens/showHint/eventShowHint';
import EventDeletePrivateAccount from './src/screens/deletePrivateAccount/eventDeletePrivateAccount';
import MailDelete from './src/screens/mainDelete/eventMainDelete';
import DeleteAccount from './src/screens/deleteAccount/deleteAccount';
import EventFeatures from './src/screens/features/eventFeatures';
import EventBlockedAccount from './src/screens/blockedAccount/eventBlockedAccount';
import EventPrivacy from './src/screens/privacy/eventPrivacy';

import { createStackNavigator } from '@react-navigation/stack';
import { MainContext } from './App';

const Stack = createStackNavigator();

function CustomBackButton({ navigation, color = '#e20154' }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.goBack()}
      style={{
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="chevron-back" size={26} color={color} />
      <Text style={{ color, fontFamily: 'Gilroy-Bold' }}>Back</Text>
    </TouchableOpacity>
  );
}

const StackNavigation = () => {
  const CTX = useContext(MainContext);

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      // screenOptions={{
      //   lazy: true,
      // }}
    >
      <Stack.Screen
        name="Splash"
        options={({ route }) => ({
          headerShown: false,
        })}
        component={SplashScreen}
      />

      <Stack.Screen
        name="UnderManten"
        options={({ route }) => ({
          headerShown: false,
        })}
        component={UnderManten}
      />
      <Stack.Screen
        name="Number"
        options={({ route }) => ({
          headerShown: false,
        })}
        component={EventEmail}
      />
      <Stack.Screen
        name="Verification"
        options={({ route }) => ({
          headerShown: false,
        })}
        component={Verification}
      />
      <Stack.Screen
        name="CreateAccount"
        options={({ route }) => ({
          headerShown: false,
        })}
        component={EventCreateAccount}
      />
      <Stack.Screen
        name="SerialCode"
        options={({ route }) => ({
          headerShown: false,
        })}
        component={SerialCode}
      />
      <Stack.Screen
        name="FromForgottenBackup"
        options={({ route }) => ({
          headerShown: false,
        })}
        component={FromForgottenBackup}
      />
      <Stack.Screen
        name="LoginWithSerial"
        options={({ route }) => ({
          headerShown: false,
        })}
        component={loginWithBackupCode}
      />

      <Stack.Screen
        name="ForgotBackupCode"
        options={({ route }) => ({
          headerShown: false,
          title: '',
        })}
        component={EventForgotBackupCode}
      />
      <Stack.Screen
        name="EmailVerification"
        options={({ route }) => ({
          headerShown: false,
        })}
        component={EmailVerification}
      />
      {/* NAVIGAGTION HERE!! */}
      {/* NAVIGAGTION HERE!! */}
      {/* NAVIGAGTION HERE!! */}
      {/* NAVIGAGTION HERE!! */}
      <Stack.Screen
        name="Navigation"
        options={({ route }) => ({
          headerShown: false,
        })}
        component={BottomTabNavigation}
      />
      <Stack.Screen
        name="MainChat"
        options={({ route }) => ({
          unmountOnBlur: true,
          headerShown: false,
          // title: 'Each Chat HERE',
        })}
        component={EachChat}
      />
      <Stack.Screen
        name="HELLO_WORLD"
        options={({ route, navigation }) => ({
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          unmountOnBlur: true,
          title: '',
          headerStyle: { backgroundColor: 'transparent' },
        })}
        component={EventUserProfiles}
      />
      <Stack.Screen
        name="ExternalLink"
        options={({ route, navigation }) => ({
          title: 'External link',
          headerTitleStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })}
        component={ExternalLink}
      />
      <Stack.Screen
        name="EditProfile"
        options={({ route, navigation }) => ({
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          title: 'Edit profile',
          headerTitleStyle: {
            color: CTX.isDarkMode ? '#fff' : '#0f0f0f', // title text color
            fontFamily: 'Gilroy-Bold',
          },
          headerStyle: {
            backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
          },
        })}
        component={EventEditProfile}
      />
      <Stack.Screen
        name="RequestVerification"
        options={({ route, navigation }) => ({
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          headerTitleStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          // headerShown: false,
          title: 'Request Verification',
        })}
        component={RequestVerification}
      />
      <Stack.Screen
        name="ManageFunds"
        options={({ route, navigation }) => ({
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          headerTitleStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          title: 'Manage funds',
        })}
        component={ManageFunds}
      />
      <Stack.Screen
        name="DepositScreen"
        options={({ route, navigation }) => ({
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          headerTitleStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          title: 'Recharge',
        })}
        component={Deposit}
      />
      <Stack.Screen
        name="WithdrawalScreen"
        options={({ route, navigation }) => ({
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          headerTitleStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          title: 'Withdraw your funds',
        })}
        component={Withdraw}
      />
      <Stack.Screen
        name="RequestNewBackup"
        options={({ route }) => ({
          headerShown: false,
          title: '',
        })}
        component={EventRequestNewBackup}
      />
      <Stack.Screen
        name="CaringSection"
        options={({ route, navigation }) => ({
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          title: route?.params?.username,
          headerTitleStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            shadowColor: '#fff',
            borderBottomColor: '#fff',
            borderBottomWidth: 0,
          },
        })}
        component={CaringSection}
      />
      <Stack.Screen
        name="AccountNotification"
        options={({ route, navigation }) => ({
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          title: 'Notification',
          headerTitleStyle: {
            color: CTX.isDarkMode ? '#fff' : '#0f0f0f', // title text color
            fontFamily: 'Gilroy-Bold',
          },
          headerStyle: {
            backgroundColor: CTX.isDarkMode ? '#0f0f0f' : '#fff',
            elevation: 0,
            shadowOpacity: 0,
            shadowColor: '#fff',
            borderBottomColor: '#fff',
            borderBottomWidth: 0,
          },
        })}
        component={AccountNotification}
      />
      <Stack.Screen
        name="SettingsScreen"
        options={({ route, navigation }) => ({
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          headerTitleStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          title: 'Settings',
        })}
        component={SettingsScreen}
      />
      <Stack.Screen
        name="TogglePublishLive"
        options={({ route }) => ({
          headerShown: false,
          title: '',
        })}
        component={EventPublishLive}
      />
      <Stack.Screen
        name="ToggleActivityStatus"
        options={({ route }) => ({
          headerShown: false,
          title: '',
        })}
        component={EventActivityStatus}
      />
      <Stack.Screen
        name="ToggleShowHint"
        options={({ route }) => ({
          headerShown: false,
          title: '',
        })}
        component={EventShowHint}
      />
      <Stack.Screen
        name="TogglePrivacyStatus"
        options={({ route }) => ({
          headerShown: false,
          title: '',
        })}
        component={EventPrivacy}
      />
      <Stack.Screen
        name="MainDeleteAccount"
        options={({ route }) => ({
          headerShown: false,
          title: '',
        })}
        component={MailDelete}
      />
      <Stack.Screen
        name="DeleteAccount"
        options={({ route }) => ({
          headerShown: false,
          title: '',
        })}
        component={DeleteAccount}
      />
      <Stack.Screen
        name="DeletePrivateAccount"
        options={({ route }) => ({
          headerShown: false,
          title: '',
        })}
        component={EventDeletePrivateAccount}
      />
      <Stack.Screen
        name="AppEventFeatures"
        options={({ route }) => ({
          headerShown: false,
          title: '',
        })}
        component={EventFeatures}
      />
      <Stack.Screen
        name="BlockedAccount"
        options={({ route, navigation }) => ({
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          headerTitleStyle: {
            fontFamily: 'Gilroy-Bold',
          },
          title: 'Blocked',
        })}
        component={EventBlockedAccount}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;

const AnotherOne = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Text style={{ color: 'red' }}>EventUserProfiles</Text>
      <Text style={{ color: 'red' }}>EventUserProfiles</Text>
      <Text style={{ color: 'red' }}>EventUserProfiles</Text>
      <Text style={{ color: 'red' }}>EventUserProfiles</Text>
      <Text style={{ color: 'red' }}>EventUserProfiles</Text>
      <Text style={{ color: 'red' }}>EventUserProfiles</Text>
    </View>
  );
};
