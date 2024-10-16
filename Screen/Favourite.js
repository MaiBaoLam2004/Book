import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library

const Favourite = ({ route }) => {
  const { userId } = route.params; // Provide a default empty object
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  const fetchFavorites = async () => {
    if (!userId) return; // Check if userId is valid
    try {
      const response = await fetch(`http://192.168.0.104:3000/favorites?userId=${userId}`);
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  const toggleFavorite = async (item) => {
    const isFavorite = favorites.find(fav => fav.id === item.id);
  
    if (isFavorite) {
      // Optimistically update the UI
      const updatedFavorites = favorites.filter(fav => fav.id !== item.id);
      setFavorites(updatedFavorites);
  
      try {
        const response = await fetch(`http://192.168.0.104:3000/favorites/${isFavorite.id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete favorite');
        }
      } catch (error) {
        console.error('Error deleting favorite:', error);
        // Revert the UI change
        setFavorites([...updatedFavorites, item]);
      }
    } else {
      const newFavorite = { ...item, userId };
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
  
      try {
        const response = await fetch(`http://192.168.0.104:3000/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFavorite),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
        // Revert the UI change
        setFavorites(favorites.filter(fav => fav.id !== item.id));
      }
    }
  };

  const navigateToDetail = (item) => {
    navigation.navigate('Detail', { product: item });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 6,
    zIndex: 1,
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
