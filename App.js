import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import WellCome from './Screen/WellCome';
import Register from './Screen/Register';
import Login from './Screen/Login';
import Admin from './Screen/Admin';
import ForgotPassword from './Screen/ForgotPassword';
import Detail from './Screen/Detail';
import Notification from './Screen/Notification';
import Users from './Screen/Users';
import Favourite from './Screen/Favourite';
import BookingSucces from './Screen/BookingSucces';
import Home from './Screen/Home';
import BannerAd from './Screen/BannerAd';
import Payment from './Screen/Payment';
import Payok from './Screen/Payok';
import SetTime from './Screen/SetTime';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNav({ route }) {
  const { userId, favorites } = route.params || {}; // Thêm kiểm tra sự tồn tại
  const [userFavorites, setUserFavorites] = useState(favorites || []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Trang chủ') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Yêu thích') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Thông báo') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Tài khoản') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
      })}>
      <Tab.Screen name="Trang chủ">
        {props => (
          <Home
            {...props}
            userId={userId}
            favorites={userFavorites}
            setFavorites={setUserFavorites}
          />
        )}
      </Tab.Screen>
      {/* <Tab.Screen name="Yêu thích">
        {props => (
          <Favourite
            {...props}
            userId={userId}
            favorites={userFavorites}
            setFavorites={setUserFavorites}
          />
        )}
      </Tab.Screen> */}
      <Tab.Screen name="Thông báo" component={Notification} />
      <Tab.Screen name="Tài khoản">
        {props => (
          <Users
            {...props}
            userId={userId}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { paddingTop: 0 },
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
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="Favourite" component={Favourite} />
        <Stack.Screen name="BookingSucces" component={BookingSucces} />
        <Stack.Screen name="BannerAd" component={BannerAd} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Payok" component={Payok} />
        <Stack.Screen name="SetTime" component={SetTime} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;