import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { URL } from './Home';

const Notification = ({ route }) => {
  const { userId } = route.params;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${URL}:3000/notification?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          // Sort notifications by date in descending order
          const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setNotifications(sortedData);
        } else {
          console.error('Error fetching notifications:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 60000); // Fetch notifications every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.notificationTitle}>Danh sách thông báo</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Text style={styles.notificationTitle1}>Thông báo</Text>
              <Text style={styles.notificationText}>{item.message}</Text>
              <Text style={styles.notificationText}>Tên sân: {item.name}</Text>
              <Text style={styles.notificationText}>Ngày đặt: {new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.notificationText}>Thời gian đặt: {new Date(item.date).toLocaleTimeString()}</Text>
              <Text style={styles.notificationText}>Giờ của sân: {item.time}</Text>
            </View>
          )}
        />
      ) : (
        <Text>Không có thông báo</Text>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderRadius: 20,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 10,
  },
  notificationTitle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,
  },
  notificationTitle1: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 21,
  },
  notificationText: {
    color: 'black',
    fontSize: 17,
  },
});
