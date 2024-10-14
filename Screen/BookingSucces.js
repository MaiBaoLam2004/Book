import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const BookingSucces = ({ route }) => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  //const { userId } = route.params; // Assuming userId is passed via route params

  useEffect(() => {
    fetchBookings(
      //userId
    );
  }, 
  //[userId]
);

  const fetchBookings = async (userId) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://192.168.0.104:3000/users/${userId}/bookingsucces`);
      const data = await response.json();
      setBookings(data.bookingsucces);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Text>{item.location}</Text>
      <Text>{item.price_per_hour} VND/hour</Text>
      <Text>{item.availability}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>BookingSucces</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </View>
  );
};

export default BookingSucces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 6,
  },
  list: {
    marginTop: 20,
    width: '100%',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});