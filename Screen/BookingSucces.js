import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { URL } from './Home';

const BookingSucces = ({ route, navigation }) => {
  const { userId } = route.params;
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Lấy thông tin thanh toán cho người dùng
    fetch(`${URL}:3000/payments?userId=${userId}`)
      .then(response => response.json())
      .then(data => {
        setPayments(data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy thông tin thanh toán:', error);
      });
  }, [userId]);

  const renderPayment = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.text}>Sân: {item.fieldId.name}</Text>
      <Text style={styles.text}>Loại sân: {item.fieldType}</Text>
      <Text style={styles.text}>Ngày & Giờ: {item.time}</Text>
      <Text style={styles.text}>Giá: {item.fieldId.price_per_hour}</Text>
      <Text style={[styles.text, item.status ? styles.successText : styles.cancelledText]}>
        {item.status ? 'Đặt thành công' : 'Đã huỷ'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Trạng thái đặt sân</Text>
      </View>
      <FlatList
        data={payments}
        renderItem={renderPayment}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.paymentList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BookingSucces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 6,
    zIndex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentList: {
    width: '100%',
  },
  paymentItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    borderColor: 'black',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
  },
  text: {
    color: '#333',
    marginBottom: 5,
    left: 0,
  },
  successText: {
    color: 'green',
  },
  cancelledText: {
    color: 'red',
  },
});
