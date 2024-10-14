import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Payok from '../Screen/Payok';
import Payment from '../Screen/Payment';
import BannerAd from '../Screen/BannerAd';
import BookingSucces from '../Screen/BookingSucces';
import Favourite from '../Screen/Favourite';
import Users from '../Screen/Users';
import Notification from '../Screen/Notification';
import Detail from '../Screen/Detail';
import ForgotPassword from '../Screen/ForgotPassword';
import Admin from '../Screen/Admin';
import Login from '../Screen/Login';
import Register from '../Screen/Register';
import WellCome from '../Screen/WellCome';
import Home from '../Screen/Home';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNav() {
  return (
    <Tab.Navigator
      // screenOptions={() => ({
      //   tabBarIcon: ({focused, color, size}) => {
      //     let iconName;

      //     if (route.name === 'Trang chủ') {
      //       iconName = focused ? 'home' : 'home-outline';
      //     } else if (route.name === 'Yêu thích') {
      //       iconName = focused ? 'heart' : 'heart-outline';
      //     } else if (route.name === 'Thông báo') {
      //       iconName = focused ? 'notifications' : 'notifications-outline';
      //     } else if (route.name === 'Tài khoản') {
      //       iconName = focused ? 'people' : 'people-outline';
      //     }
      //     return <Icon name={iconName} size={size} color={color} />;
      //   },
      //   tabBarActiveTintColor: 'red',
      //   tabBarInactiveTintColor: 'black',
      //   headerShown: false,
      // })}
      screenOptions={{
        tabBarActiveTintColor: '#D17842',
        tabBarInactiveBackgroundColor: 'white',
        tabBarActiveBackgroundColor: 'white',
      }}
      >
      <Tab.Screen name="Trang chủ" component={Home}/>
      <Tab.Screen name="Yêu thích" component={Favourite}/>
      <Tab.Screen name="Thông báo" component={Notification} />
      <Tab.Screen name="Tài khoản" component={Users}/>
    </Tab.Navigator>
  );
}

function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {paddingTop: 0},
        }}
        initialRouteName="WellCome">
        <Stack.Screen name="WellCome" component={WellCome} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="BottomTabNav" component={BottomTabNav} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Favourite" component={Favourite} />
        <Stack.Screen name="BookingSucces" component={BookingSucces} />
        <Stack.Screen name="BannerAd" component={BannerAd} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Payok" component={Payok} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
