import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const Users = ({ route }) => {
  const { userId } = route.params || {}; // Nhận userId từ route.params
  const [imageUri, setImageUri] = useState(null);
  const navigation = useNavigation(); // Hook for navigation

  useEffect(() => {
    // Lấy ảnh từ server khi component được mount
    const fetchUserImage = async () => {
      console.log("Fetching user image for ID:", userId); // Log userId
      try {
        const response = await fetch(`http://192.168.0.104:3000/users/${userId}`);
        console.log("Response status:", response.status); // Log status response
        if (response.ok) {
          const user = await response.json();
          setImageUri(user.imageUri); // Giả sử server trả về imageUri
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.log('Error fetching user image:', error);
      }
    };

    fetchUserImage();
  }, [userId]);

  const pickImage = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  const saveImage = async (uri) => {
    const userData = { imageUri: uri }; // Đường dẫn của ảnh

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
        const errorText = await response.text();
        console.log('Error updating image:', errorText);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const navigateToBookingSuccess = () => {
    navigation.navigate('BookingSucces');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.addPhotoText}>Thêm ảnh</Text>
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.userNameText}>ID người dùng: {userId}</Text>
      <TouchableOpacity style={styles.button} onPress={navigateToBookingSuccess}>
        <Text style={styles.buttonText}>Đã đặt sân</Text>
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
    //justifyContent: 'center', // Center the content vertically
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
    color: '#333', // Change text color for better visibility
  },
  userNameText: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
