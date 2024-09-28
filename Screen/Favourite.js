import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const Favourite = ({ favorites, setFavorites, userId }) => {
  // Kiểm tra và log userId
  console.log('User ID:', userId);

  const deleteFavorite = async itemId => {
    // Lọc danh sách yêu thích để xóa mục
    const updatedFavorites = favorites.filter(fav => fav.id !== itemId);
    setFavorites(updatedFavorites); // Cập nhật danh sách cục bộ ngay lập tức
  
    try {
      if (!userId) {
        console.error("User ID is undefined.");
        return;
      }
  
      // Gửi yêu cầu PATCH để cập nhật favorites trên server
      const response = await fetch(`http://192.168.1.10:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favorites: updatedFavorites, // Cập nhật danh sách yêu thích
        }),
      });
  
      if (response.ok) {
        console.log('Deleted favorite successfully');
      } else {
        const errorText = await response.text(); // Log nội dung lỗi
        console.error(`Error deleting favorite: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error connecting to the server:', error);
      // Nếu có lỗi, phục hồi lại trạng thái danh sách yêu thích
      setFavorites(favorites); // Undo để đảm bảo không mất dữ liệu
    }
  };
  

  const toggleFavorite = async itemId => {
    const isFavorite = favorites.find(fav => fav.id === itemId);
  
    if (isFavorite) {
      // Nếu là yêu thích, gọi deleteFavorite
      deleteFavorite(itemId);
    } else {
      // Nếu không phải yêu thích, thêm vào danh sách
      const newFavorite = {
        id: itemId, // ID của sân
        name: 'Sân A', // Cập nhật theo thông tin thực tế
        location: '123 Đường Chính, Hà Nội',
        price_per_hour: 100,
        image_url: 'https://vecgroup.vn/upload_images/images/2021/12/09/kich-thuoc-san-bong-11-nguoi(1).png',
      };
  
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
  
      try {
        const response = await fetch(`http://192.168.1.10:3000/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favorites: updatedFavorites, // Cập nhật danh sách yêu thích
          }),
        });
  
        if (response.ok) {
          console.log('Added favorite successfully');
        } else {
          const errorText = await response.text();
          console.error('Error adding favorite:', errorText);
        }
      } catch (error) {
        console.error('Error connecting to the server:', error);
        setFavorites(favorites); // Undo để không mất dữ liệu
      }
    }
  };
  

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.noFavoritesContainer}>
          <Text style={styles.noFavoritesText}>Không có sân nào trong danh sách yêu thích.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image_url }} style={styles.image} />
              <View>
                <Text style={styles.text}>Tên sân: {item.name}</Text>
                <Text style={styles.text}>Địa điểm: {item.location}</Text>
                <Text style={styles.text}>Giá mỗi giờ: {item.price_per_hour} VND</Text>
              </View>
              <TouchableOpacity
                style={styles.heartIcon}
                onPress={() => toggleFavorite(item.id)}>
                <Text style={{ fontSize: 30, color: 'red' }}>❤️</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Đảm bảo khóa là duy nhất
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
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    top: 10,
  },
  image: {
    width: 290,
    height: 150,
    marginBottom: 10,
  },
  heartIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
});
