import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { Button, View, Text, TextInput, Alert } from 'react-native';

const checkSubscriptionStatus = async (email: string) => {
  console.log('Checking subscription status for email:', email);
  if (!email) {
    Alert.alert('Error', 'Email not provided or invalid.');
    return;
  }

  try {
    const response = await fetch('https://strype.onrender.com/check-subscription-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log('Response from backend:', data);

    const { subscriptionStatus, error } = data;

    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Subscription Status', `Your subscription status is: ${subscriptionStatus}`);
    }
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    Alert.alert('Error', 'Failed to fetch subscription status.');
  }
};

const cancelSubscription = async (email: string) => {
  console.log('Canceling subscription for email:', email);
  if (!email) {
    Alert.alert('Error', 'Email not provided or invalid.');
    return;
  }

  try {
    const response = await fetch('https://strype.onrender.com/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log('Response from backend:', data);

    const { message, error } = data;

    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Subscription Status', message);
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    Alert.alert('Error', 'Failed to cancel subscription.');
  }
};

const WebViewPayment: React.FC<{ email: string }> = ({ email }) => {
  return (
    <WebView
      source={{ uri: `https://buy.stripe.com/28oeXjcfY2ZSgMMeUU?prefilled_email=${email}` }}
      onNavigationStateChange={(navState) => {
        if (navState.url.includes('success')) {
          // Atualize o status do usuário no frontend
        }
      }}
    />
  );
};

const App: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Subscription App</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }}
      />
      <Button title="Check Subscription Status" onPress={() => checkSubscriptionStatus(email)} />
      <Button title="Cancel Subscription" onPress={() => cancelSubscription(email)} />
      {email && <WebViewPayment email={email} />}
    </View>
  );
};

export default App;
