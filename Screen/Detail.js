import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import thư viện icon

const Detail = ({ route }) => {
  const navigation = useNavigation();
  const { product } = route.params;
  const [isFavorite, setIsFavorite] = useState(false); // State to manage favorite status

  const handleBooking = () => {
    // Thêm logic đặt sân ở đây
    Alert.alert('Đặt sân thành công!');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add logic to update favorite status in your backend or state management
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image_url }} style={styles.image} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={toggleFavorite} style={styles.heartButton}>
            <Text style={{ fontSize: 25, color: isFavorite ? 'red' : 'gray' }}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={{ margin: 10 }}>
          <Text style={styles.itemText}>Tên sân: {product.name}</Text>
          <Text style={styles.itemText}>Địa điểm: {product.location}</Text>
          <Text style={styles.itemText}>
            Giá mỗi giờ: {product.price_per_hour} VND
          </Text>
          <Text style={styles.itemText}>
            Tình trạng: {product.availability}
          </Text>
          <Text style={styles.itemText}>
            Loại mặt sân: {product.surface_type}
          </Text>
          <Text style={styles.itemText}>
            Số lượng người chơi tối đa: {product.max_players}
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.bookButton} onPress={() => navigation.navigate('SetTime')}>
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
    //padding: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    resizeMode: 'stretch'
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 6,
    // borderColor:'black',
    // borderWidth:1,
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 6,
  },
  itemText: {
    marginBottom: 10,
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
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
