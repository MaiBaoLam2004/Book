import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Favourite = ({ favorites, setFavorites, userId , route  }) => {
  const navigation = useNavigation();
  console.log('Favourite User ID:', userId);

  const deleteFavorite = async (itemId) => {
    // Lọc các mục yêu thích để loại bỏ mục có id bằng itemId
    const updatedFavorites = favorites.filter(fav => fav.id !== itemId);
    setFavorites(updatedFavorites); // Cập nhật danh sách yêu thích cục bộ
  
    if (!userId) {
      console.error('User ID is undefined.');
      return;
    }
  
    try {
      // Gửi yêu cầu PATCH để cập nhật mục favorites trong db.json
      const response = await fetch(`http://192.168.0.104:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favorites: updatedFavorites, // Cập nhật danh sách yêu thích mới
        }),
      });
  
      if (response.ok) {
        console.log('Deleted favorite successfully');
      } else {
        console.error(`Error deleting favorite: ${response.status}`);
        setFavorites(favorites); // Hoàn tác cập nhật nếu lỗi từ server
      }
    } catch (error) {
      console.error('Error connecting to the server:', error);
      setFavorites(favorites); // Hoàn tác cập nhật nếu có lỗi kết nối
    }
  };
  

  const toggleFavorite = async (item) => {
    const isFavorite = favorites.find(fav => fav.id === item.id);
    if (isFavorite) {
      await deleteFavorite(item.id); // Gọi hàm xóa yêu thích
    } else {
      const updatedFavorites = [...favorites, item];
      setFavorites(updatedFavorites);
  
      if (!userId) {
        console.error('User ID is undefined.');
        return;
      }
  
      try {
        const response = await fetch(`http://192.168.0.104:3000/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favorites: updatedFavorites,
          }),
        });
  
        if (response.ok) {
          console.log('Added favorite successfully');
        } else {
          console.error('Error adding favorite:', response.status);
          setFavorites(favorites); // Hoàn tác cập nhật nếu lỗi từ server
        }
      } catch (error) {
        console.error('Error connecting to the server:', error);
        setFavorites(favorites); // Hoàn tác cập nhật nếu có lỗi kết nối
      }
    }
  };
  

  const navigateToDetail = (item) => {
    navigation.navigate('Detail', { product: item });
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.noFavoritesContainer}>
          <Text style={styles.noFavoritesText}>
            Không có sân nào trong danh sách yêu thích.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToDetail(item)}>
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.image_url }} style={styles.image} resizeMode='cover' />
                <View>
                  <Text style={styles.text}>Tên sân: {item.name}</Text>
                  <Text style={styles.text}>Địa điểm: {item.location}</Text>
                  <Text style={styles.text}>
                    Giá mỗi giờ: {item.price_per_hour} VND
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.heartIcon}
                  onPress={() => toggleFavorite(item)}>
                  <Text style={{ fontSize: 35, color: 'red' }}>{favorites.some(fav => fav.id === item.id) ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()} // Chỉ dùng item.id
        />
      )}
    </View>
  );
};

export default Favourite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  noFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavoritesText: {
    color: 'black',
    fontSize: 16,
  },
  itemContainer: {
    margin: 6,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#fff', // Thêm màu nền cho item
  },
  image: {
    width: 350,
    height: 200,
    marginBottom: 10,
    borderRadius: 20,
  },
  heartIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
  },
});
