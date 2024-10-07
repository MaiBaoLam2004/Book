import { StyleSheet, Text, View, Button, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';


const Detail = ({route}) => {
  const navigation = useNavigation();
  const { product } = route.params;

  const handleBooking = () => {
    // Thêm logic đặt sân ở đây
    Alert.alert('Đặt sân thành công!');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topbar}>
          <Button title="Quay lại" onPress={() => navigation.navigate('BottomTabNav')} />
        </View>
        <Image source={{ uri: product.image_url }} style={styles.image} />
        <Text style={styles.itemText}>Tên sân: {product.name}</Text>
        <Text style={styles.itemText}>Địa điểm: {product.location}</Text>
        <Text style={styles.itemText}>Giá mỗi giờ: {product.price_per_hour} VND</Text>
        <Text style={styles.itemText}>Tình trạng: {product.availability}</Text>
        <Text style={styles.itemText}>Loại mặt sân: {product.surface_type}</Text>
        <Text style={styles.itemText}>Số lượng người chơi tối đa: {product.max_players}</Text>
      </ScrollView>
      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Đặt sân</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  itemText: {
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
  },
  bookButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});