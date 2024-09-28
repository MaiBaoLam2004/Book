import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const Favourite = ({favorites, setFavorites, userId}) => {
  const toggleFavorite = async item => {
    const isFavorite = favorites.find(fav => fav.id === item.id);

    if (isFavorite) {
      // Nếu đã yêu thích, xóa khỏi danh sách
      const updatedFavorites = favorites.filter(fav => fav.id !== item.id);
      setFavorites(updatedFavorites); // Cập nhật danh sách ngay lập tức

      try {
        const response = await fetch(
          `http://192.168.1.10:3000/users/${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              favorites: updatedFavorites, // Cập nhật danh sách yêu thích
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to remove favorite:', errorText);
          // Khôi phục lại danh sách yêu thích nếu có lỗi
          setFavorites([...updatedFavorites, item]);
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
        // Khôi phục lại danh sách yêu thích nếu có lỗi
        setFavorites([...updatedFavorites, item]);
      }
    } else {
      // Nếu chưa phải yêu thích, thêm vào danh sách
      const updatedFavorites = [...favorites, item];
      setFavorites(updatedFavorites); // Cập nhật danh sách ngay lập tức

      try {
        const response = await fetch(
          `http://192.168.1.10:3000/users/${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              favorites: updatedFavorites, // Cập nhật danh sách yêu thích
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to add favorite:', errorText);
          // Khôi phục lại danh sách yêu thích nếu có lỗi
          setFavorites(favorites);
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
        // Khôi phục lại danh sách yêu thích nếu có lỗi
        setFavorites(favorites);
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
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Image source={{uri: item.image_url}} style={styles.image} 
              //resizeMode='center' 
              />
              <View>
                <Text style={styles.text}>Tên sân: {item.name}</Text>
                <Text style={styles.text}>Địa điểm: {item.location}</Text>
                <Text style={styles.text}>
                  Giá mỗi giờ: {item.price_per_hour} VND
                </Text>
                <Text style={styles.text}>Tình trạng: {item.availability}</Text>
                <Text style={styles.text}>
                  Loại mặt sân: {item.surface_type}
                </Text>
                <Text style={styles.text}>
                  Số lượng người chơi tối đa: {item.max_players}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.heartIcon}
                onPress={() => toggleFavorite(item)}>
                <Text style={{fontSize: 30}}>❤️</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
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
    //justifyContent: 'center',
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
