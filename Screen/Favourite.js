import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library
import { URL } from './Home';

const Favourite = ({ route }) => {
  const { userId } = route.params || { userId: null }; // Provide a default userId as null
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const navigation = useNavigation();

  const fetchFavorites = async () => {
    if (!userId) return; // Check if userId is valid
    try {
      const response = await fetch(`${URL}:3000/favorites?userId=${userId}`);
      const data = await response.json();
      // Sort the data by created_at in descending order
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setFavorites(sortedData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    //console.log('Current userId:', userId); // In ra giá trị của userId
    fetchFavorites();
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [favorites]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const toggleFavorite = async (item) => {
    if (loading) return; // Prevent multiple deletions at the same time
    setLoading(true);

    const isFavorite = favorites.find(fav => fav.id === item.id);

    if (isFavorite) {
      // Optimistically update the UI
      const updatedFavorites = favorites.filter(fav => fav.id !== item.id);
      setFavorites(updatedFavorites);

      try {
        const response = await fetch(`${URL}:3000/favorites/${isFavorite.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete favorite');
        }
        // Fetch updated favorites list
        fetchFavorites();
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
        const response = await fetch(`${URL}:3000/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFavorite),
        });

        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }
        // Fetch updated favorites list
        fetchFavorites();
      } catch (error) {
        console.error('Error adding favorite:', error);
        // Revert the UI change
        setFavorites(favorites.filter(fav => fav.id !== item.id));
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('BottomTabNav')} style={styles.backButton}>
          <Icon name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Danh sách yêu thích</Text>
      </View>
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
            <TouchableOpacity onPress={() => navigation.navigate('Detail', { product: item, userId })}>
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
                  onPress={() => toggleFavorite(item)}
                  disabled={loading} // Disable button while loading
                >
                  <Text style={{ fontSize: 30, color: 'red' }}>{favorites.some(fav => fav.id === item.id) ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()} // Chỉ dùng item.id
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default Favourite;

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
    left: 0,
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
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#fff', // Thêm màu nền cho item
  },
  image: {
    width: 300,
    height: 150,
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
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
  },
});