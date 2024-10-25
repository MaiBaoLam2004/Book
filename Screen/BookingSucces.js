import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
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

  const handleCancel = (paymentId) => {
    Alert.alert(
      'Xác nhận huỷ',
      'Bạn có chắc chắn muốn huỷ đặt sân này không?',
      [
        { text: 'Không', style: 'cancel' },
        { text: 'Có', onPress: () => cancelBooking(paymentId) },
      ],
      { cancelable: false }
    );
  };

  const cancelBooking = (paymentId) => {
    fetch(`${URL}:3000/payments/${paymentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: false }),
    })
      .then(response => response.json())
      .then(data => {
        setPayments(payments.map(payment => 
          payment.id === paymentId ? { ...payment, status: false } : payment
        ));
      })
      .catch(error => {
        console.error('Lỗi khi huỷ đặt sân:', error);
      });
  };

  const renderPayment = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.text}>Sân: {item.fieldId.name}</Text>
      <Text style={styles.text}>Loại sân: {item.fieldType}</Text>
      <Text style={styles.text}>Ngày & Giờ: {item.time}</Text>
      <Text style={styles.text}>Giá: {item.fieldId.price_per_hour}</Text>
      <Text style={[styles.text, item.status ? styles.successText : styles.cancelledText]}>
        {item.status ? 'Đặt thành công' : 'Đã huỷ'}
      </Text>
      {item.status && (
        <TouchableOpacity onPress={() => handleCancel(item.id)} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Huỷ đặt sân</Text>
        </TouchableOpacity>
      )}
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
    color: 'black',
    marginBottom: 5,
    left: 0,
    fontSize: 17,
  },
  successText: {
    color: 'green',
  },
  cancelledText: {
    color: 'red',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center', // Thêm dòng này để căn giữa nút
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
