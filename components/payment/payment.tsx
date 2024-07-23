import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { Button, Alert, View } from 'react-native';
/* import { API_URL } from '@env'; */

const STRIPE_KEY = process.env.STRIPE_PUBLISHABLE_KEY as string;

const Payment = () => {
    const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();
    const [ready, setReady] = useState(false);

    const fetchPaymentSheetParams = async () => {
        try {
            console.log('Fetching payment sheet params from:', 'https://strype.onrender.com');
            const response = await fetch(`https://strype.onrender.com/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: 1000, // valor em centavos (10 USD)
                    currency: 'usd',
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const { paymentIntent, ephemeralKey, customer } = await response.json();
            console.log('Received from backend:', { paymentIntent, ephemeralKey, customer });

            return {
                paymentIntent,
                ephemeralKey,
                customer
            };
        } catch (error) {
            console.error('Error fetching payment sheet params:', error);
            Alert.alert('Error', 'Failed to fetch payment sheet parameters. Please try again later.');
            return {};
        }
    };

    const initialisePaymentSheet = async () => {
        const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

        if (!paymentIntent || !ephemeralKey || !customer) {
            console.error('Missing necessary payment sheet parameters:', { paymentIntent, ephemeralKey, customer });
            Alert.alert('Error', 'Failed to fetch payment sheet parameters. Please try again later.');
            return;
        }

        const { error } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            merchantDisplayName: 'Exemplo',
            allowsDelayedPaymentMethods: true,
            returnURL: 'stripe-example://stripe-redirect',
            applePay: {
                merchantCountryCode: 'US',
            },
            googlePay: {
                merchantCountryCode: 'US',
                testEnv: true,
                currencyCode: 'usd',
            },
        });

        if (error) {
            console.error('Error initializing payment sheet:', error);
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            setReady(true);
        }
    };

    useEffect(() => {
        initialisePaymentSheet();
    }, []);

    const buy = async () => {
        if (!ready) {
            Alert.alert('Error', 'Failed to initialize payment sheet. Please try again later.');
            return;
        }

        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'The payment was confirmed successfully');
        }
    };

    return (
        <View>
            <StripeProvider
                publishableKey={STRIPE_KEY}
                merchantIdentifier="merchant.com.example"  // Substitua pelo seu Merchant ID
            >
                <Button title="Buy" onPress={buy} disabled={loading} />
            </StripeProvider>
        </View>
    );
};

export default Payment;
