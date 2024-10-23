import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const Users = ({route}) => {
  const {userId} = route.params || {};
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserImage = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://10.24.36.153:3000/users/${userId}`,
        );
        if (response.ok) {
          const user = await response.json();
          setImageUri(user.imageUri);
          setUsername(user.username);
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
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const uri = response.assets[0].uri;
          Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn đổi ảnh?',
            [
              {
                text: 'Hủy',
                style: 'cancel',
              },
              {
                text: 'Đồng ý',
                onPress: () => {
                  setImageUri(uri);
                  saveImage(uri);
                },
              },
            ],
            {cancelable: false},
          );
        }
      },
    );
  };

  const saveImage = async uri => {
    const userData = {imageUri: uri};

    try {
      const response = await fetch(
        `http://10.24.36.153:3000/users/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
      );

      if (response.ok) {
        console.log('Image updated successfully');
      } else {
        console.log('Error updating image:', await response.text());
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => {
            console.log('User logged out');
            navigation.navigate('Login'); // Navigate to the login screen
          },
        },
      ],
      {cancelable: false},
    );
  };
  

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white',}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.imageContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : imageUri ? (
              <Image source={{uri: imageUri}} style={styles.image} />
            ) : (
              <Text style={styles.addPhotoText}>Thêm ảnh</Text>
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.userNameText}>ID người dùng: {userId}</Text>
        <Text style={styles.userNameText}>Tên người dùng: {username}</Text>
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => navigation.navigate('BookingSucces')}>
          <Text style={styles.bookingButtonText}>Đã đặt sân</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Image source={{uri: imageUri}} style={styles.modalImage} />
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setModalVisible(!modalVisible);
              pickImage();
            }}>
            <Text style={styles.editButtonText}>Chỉnh ảnh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  addPhotoText: {
    color: '#333',
  },
  userNameText: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
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
  logoutButton: {
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
  logoutButtonText: {
    color: 'black',
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImage: {
    width: 350,
    height: 350,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  editButton: {
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
  editButtonText: {
    color: 'black',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
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
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
});
