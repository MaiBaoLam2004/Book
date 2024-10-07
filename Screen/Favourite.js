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

const Favourite = ({favorites, setFavorites, userId}) => {
  const navigation = useNavigation();

  const deleteFavorite = async itemId => {
    const updatedFavorites = favorites.filter(fav => fav.id !== itemId);
    setFavorites(updatedFavorites);

    try {
      if (!userId) {
        console.error('User ID is undefined.');
        return;
      }

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
        console.log('Deleted favorite successfully');
      } else {
        const errorText = await response.text();
        console.error(`Error deleting favorite: ${response.status} - ${errorText}`);
        setFavorites(favorites); // Undo the local update if the server update fails
      }
    } catch (error) {
      console.error('Error connecting to the server:', error);
      setFavorites(favorites); // Undo the local update if there's a connection error
    }
  };

  const toggleFavorite = async itemId => {
    const isFavorite = favorites.find(fav => fav.id === itemId);

    if (isFavorite) {
      deleteFavorite(itemId);
    } else {
      const updatedFavorites = [...favorites];
      setFavorites(updatedFavorites);

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
          },
        );

        if (response.ok) {
          console.log('Added favorite successfully');
        } else {
          const errorText = await response.text();
          console.error('Error adding favorite:', errorText);
          setFavorites(favorites); // Undo the local update if the server update fails
        }
      } catch (error) {
        console.error('Error connecting to the server:', error);
        setFavorites(favorites); // Undo the local update if there's a connection error
      }
    }
  };

  const navigateToDetail = item => {
    navigation.navigate('Detail', {product: item});
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
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => navigateToDetail(item)}>
              <View style={styles.itemContainer}>
                <Image source={{uri: item.image_url}} style={styles.image} 
                resizeMode='cover'/>
                <View>
                  <Text style={styles.text}>Tên sân: {item.name}</Text>
                  <Text style={styles.text}>Địa điểm: {item.location}</Text>
                  <Text style={styles.text}>
                    Giá mỗi giờ: {item.price_per_hour} VND
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.heartIcon}
                  onPress={() => toggleFavorite(item.id)}>
                  <Text style={{fontSize: 35, color: 'red'}}>❤️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
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

    margin: 6,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
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
    top: 0,
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
  },
});
