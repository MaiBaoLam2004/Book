import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Favourite = ({ favorites, setFavorites, userId }) => {
  const navigation = useNavigation();

  const updateFavorites = async (updatedFavorites) => {
    if (!userId) {
      console.error('User ID is undefined.');
      return false;
    }

    try {
      const response = await fetch(
        `http://192.168.0.104:3000/users/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favorites: updatedFavorites,
          }),
        }
      );

      if (response.ok) {
        setFavorites(updatedFavorites);
        return true;
      } else {
        console.error(`Error updating favorites: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('Error connecting to the server:', error);
      return false;
    }
  };

  const toggleFavorite = async (item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== item.id);
    } else {
      updatedFavorites = [...favorites, item];
    }

    const success = await updateFavorites(updatedFavorites);

    if (success) {
      console.log(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } else {
      Alert.alert(
        'Lỗi',
        `Không thể ${isFavorite ? 'xóa khỏi' : 'thêm vào'} danh sách yêu thích. Vui lòng thử lại sau.`
      );
    }
  };

  const navigateToDetail = (item) => {
    navigation.navigate('Detail', { product: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToDetail(item)}>
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.text}>Tên sân: {item.name}</Text>
          <Text style={styles.text}>Địa điểm: {item.location}</Text>
          <Text style={styles.text}>Giá mỗi giờ: {item.price_per_hour} VND</Text>
          <Text style={styles.text}>Loại mặt sân: {item.surface_type}</Text>
        </View>
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={() => toggleFavorite(item)}>
          <Text style={{ fontSize: 35, color: 'red' }}>❤️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listContent: {
    paddingVertical: 10,
  },
  itemContainer: {
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  infoContainer: {
    paddingHorizontal: 5,
  },
  heartIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    //backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Favourite;