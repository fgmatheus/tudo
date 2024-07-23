// Create a new file PaymentStatus.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const PaymentStatus = () => {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://strype.onrender.com/payment-status')
        .then((response) => response.json())
        .then((data) => setStatus(data.status));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {status === 'pending' ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text>Payment Status: {status}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentStatus;
