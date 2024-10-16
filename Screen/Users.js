import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const Users = ({ route }) => {
  const { userId } = route.params || {};
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserImage = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://192.168.0.104:3000/users/${userId}`);
        if (response.ok) {
          const user = await response.json();
          setImageUri(user.imageUri);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.log('Error fetching user image:', error);
      }
      setLoading(false);
    };
  
    if (userId) {
      fetchUserImage();
    }
  }, [userId]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        saveImage(uri);
      }
    });
  };

  const saveImage = async (uri) => {
    const userData = { imageUri: uri };

    try {
      const response = await fetch(`http://192.168.0.104:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('Image updated successfully');
      } else {
        console.log('Error updating image:', await response.text());
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imageContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.addPhotoText}>Thêm ảnh</Text>
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.userNameText}>ID người dùng: {userId}</Text>
      <TouchableOpacity style={styles.bookingButton} onPress={() => navigation.navigate('BookingSucces')}>
        <Text style={styles.bookingButtonText}>Đã đặt sân</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  addPhotoText: {
    color: '#333',
  },
  userNameText: {
    fontSize: 16,
    marginTop: 10,
  },
  bookingButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    borderWidth: 1,
    borderBlockColor: 'black',
  },
  bookingButtonText: {
    color: 'black',
    fontSize: 16,
  },
});
