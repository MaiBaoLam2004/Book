import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const WellCome = () => {
    return (
      <View style={styles.container}>
        <Image
          resizeMode='center'
          style={styles.logoapp}
          source={require('../Images/icon_logo.png')}
        />
        {/* <Text style={styles.tf}>Đặt lịch sân bóng đá</Text> */}
      </View>
    );
}

export default WellCome

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  logoapp: {
    width: 500,
    height: 400,
  },
  tf: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
    fontStyle: 'italic' // Thêm thuộc tính này để chữ nghiêng
  }
})