import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Favourite = ({ favorites, setFavorites, userId }) => {
  const toggleFavorite = async (item) => {
    const isFavorite = favorites.find(fav => fav.id === item.id);

    if (isFavorite) {
      try {
        console.log('Removing favorite:', item);
        const response = await fetch(`http://192.168.1.10:3000/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favorites: favorites.filter(fav => fav.id !== item.id), // Cập nhật danh sách yêu thích
          }),
        });
   
        if (response.ok) {
          const updatedFavorites = favorites.filter(fav => fav.id !== item.id);
          setFavorites(updatedFavorites);
          console.log('Favorite removed successfully:', item);
        } else {
          const errorText = await response.text();
          console.error('Failed to remove favorite:', errorText);
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    
  
    } else {
      // Nếu chưa phải yêu thích, thêm vào danh sách
      try {
        const response = await fetch(`http://192.168.1.10:3000/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favorites: [...favorites, item], // Cập nhật danh sách yêu thích
          }),
        });

        if (response.ok) {
          const updatedFavorites = [...favorites, item];
          setFavorites(updatedFavorites);
        } else {
          const errorText = await response.text();
          console.error('Failed to add favorite:', errorText);
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text>Không có sân nào trong danh sách yêu thích.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image_url }} style={styles.image} />
              <Text>Tên sân: {item.name}</Text>
              <Text>Địa điểm: {item.location}</Text>
              <Text>Giá mỗi giờ: {item.price_per_hour} VND</Text>
              <Text>Tình trạng: {item.availability}</Text>
              <Text>Loại mặt sân: {item.surface_type}</Text>
              <Text>Số lượng người chơi tối đa: {item.max_players}</Text>
              <TouchableOpacity
                style={styles.heartIcon}
                onPress={() => toggleFavorite(item)}
              >
                <Text style={{ fontSize: 20 }}>❤️</Text>
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
    justifyContent: 'center',
  },
  itemContainer: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  heartIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
});
