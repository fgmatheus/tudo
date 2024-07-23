import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ActivityIndicator, TextInput, Alert, Modal, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ButtonLogIn';
import { useOAuth, useUser, useAuth } from '@clerk/clerk-expo';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import uuid from 'react-native-uuid';
import { ButtonRefresh } from '@/components/ButtonRefresh';
import { ButtonSave } from '@/components/ButtonSave';
import { ButtonModal } from '@/components/ButtonModal';
import { ButtonConfirm } from '@/components/ButtonConfirm';
import { ButtonWaze } from '@/components/ButtonWaze';
import { useSubscription } from '../components/SubscriptionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWebViewLoading, setIsWebViewLoading] = useState(false);  // Estado para controle da WebView
  const [showWebView, setShowWebView] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [unlinkModalVisible, setUnlinkModalVisible] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [inputEmail, setInputEmail] = useState<string>('');
  const [deviceUUID, setDeviceUUID] = useState<string>('');
  const [password, setPassword] = useState<string | null>(null);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { subscriptionStatus, setSubscriptionStatus } = useSubscription;

  useEffect(() => {
    const loadEmailAndUUID = async () => {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      const savedPassword = await AsyncStorage.getItem('savedPassword');
      let storedUUID = await AsyncStorage.getItem('deviceUUID');

      if (!storedUUID) {
        storedUUID = uuid.v4() as string;
        await AsyncStorage.setItem('deviceUUID', storedUUID);
      }

      setDeviceUUID(storedUUID);

      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setInputEmail(savedEmail);
        setPassword(savedPassword);
        await fetchSubscriptionStatus(savedEmail, savedPassword, storedUUID);
      } else if (user?.primaryEmailAddress) {
        setEmail(user.primaryEmailAddress.emailAddress);
        setInputEmail(user.primaryEmailAddress.emailAddress);
      }
    };

    loadEmailAndUUID();
  }, [user]);

  const fetchSubscriptionStatus = async (emailToCheck: string, passwordToCheck: string, uuidToCheck: string) => {
    setIsLoading(true); // Iniciar o indicador de carregamento
    try {
      const response = await fetch('/check-subscription-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToCheck, uuid: uuidToCheck, password: passwordToCheck }),
      });

      const data = await response.json();
      const { subscriptionStatus, error } = data;
      if (!error) {
        setSubscriptionStatus(subscriptionStatus);
        if (subscriptionStatus === 'active') {
          await AsyncStorage.setItem('savedEmail', emailToCheck);
          await AsyncStorage.setItem('savedPassword', passwordToCheck);
        } else {
          if (subscriptionStatus !== 'active') {
            Alert.alert('Aviso', 'Assinatura não está ativa.');
          }
        }
      } else {
        setSubscriptionStatus('Não Ativo');
        Alert.alert('Error', error);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscriptionStatus('Não Ativo');
    } finally {
      setIsLoading(false); // Parar o indicador de carregamento
    }
  };

  async function onGoogleSignIn() {
    try {
      setIsLoading(true);

      const redirectUrl = Linking.createURL('/profileScreen');
      const oAuthFlow = await startOAuthFlow({ redirectUrl });

      if (oAuthFlow.authSessionResult?.type === 'success') {
        if (oAuthFlow.setActive) {
          await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId });
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const confirmEmail = async () => {
    if (!newPassword) {
      Alert.alert('Aviso', 'Por favor, crie uma senha.');
      return;
    }
    const response = await fetchSubscriptionStatus(inputEmail, newPassword, deviceUUID);
    if (response && response.subscriptionStatus === 'active') {
      setEmail(inputEmail);
      setPassword(newPassword);
    }
  };

  const saveEmail = async () => {
    try {
      await AsyncStorage.setItem('savedEmail', inputEmail);
      setEmail(inputEmail);
      Alert.alert('Success', 'Email salvo com sucesso.');
    } catch (error) {
      console.error('Error saving email:', error);
      Alert.alert('Error', 'Falha ao salvar o email.');
    }
  };

  const clearEmail = async () => {
    try {
      await AsyncStorage.removeItem('savedEmail');
      await AsyncStorage.removeItem('savedPassword');
      setEmail('');
      setPassword(null);
      if (user?.primaryEmailAddress) {
        setInputEmail(user.primaryEmailAddress.emailAddress);
      } else {
        setInputEmail('');
      }
      Alert.alert('Success', 'Email e senha apagados com sucesso.');
    } catch (error) {
      console.error('Error clearing email:', error);
      Alert.alert('Error', 'Falha ao apagar o email.');
    }
  };

  const cancelSubscription = async () => {
    if (!inputPassword) {
      Alert.alert('Aviso', 'Por favor, forneça sua senha.');
      return;
    }
    try {
      const response = await fetch('/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, uuid: deviceUUID, password: inputPassword }),
      });

      const data = await response.json();
      const { message, error } = data;

      if (!error) {
        Alert.alert('Subscription Status', message);
        setSubscriptionStatus('Não Ativo');
        setCancelModalVisible(false);
      } else {
        Alert.alert('Error', error);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      Alert.alert('Error', 'Failed to cancel subscription.');
    }
  };

  const unlinkUUID = async () => {
    if (!inputPassword) {
      Alert.alert('Aviso', 'Por favor, forneça sua senha.');
      return;
    }
    try {
      const response = await fetch('/unlink-uuid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, uuid: deviceUUID, password: inputPassword }),
      });

      const data = await response.json();
      const { message, error } = data;

      if (!error) {
        Alert.alert('Success', message);
        setSubscriptionStatus('Não Ativo');
        setUnlinkModalVisible(false);
      } else {
        Alert.alert('Error', error);
      }
    } catch (error) {
      console.error('Error unlinking UUID:', error);
      Alert.alert('Error', 'Failed to unlink UUID.');
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (showWebView) {
    return (
      <View style={styles.webViewContainer}>
        <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
          <ButtonSave
            title={''}
            icon='arrow-back'
            onPress={() => setShowWebView(false)}
          />
        </View>
        {isWebViewLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <WebView
          source={{ uri: `https://buy.stripe.com/28oeXjcfY2ZSgMMeUU?prefilled_email=${email}` }}
          style={{ flex: 1 }}
          onLoadStart={() => setIsWebViewLoading(true)}
          onLoadEnd={() => setIsWebViewLoading(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.inicialViewText}>
      <View style={styles.buttonContainer}>
        {user ? (
          <>
            <View style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
              <View style={{ width: '40%' }}>
                <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
                <Text style={{ fontSize: 20 }}>{user.fullName}</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'flex-end', width: '35%' }}>
                <Button icon='exit' title='Sair' onPress={() => signOut()} />
              </View>
            </View>
            <View style={{ marginTop: 50, gap: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Email utilizado: {email || 'nenhum email vinculado'}</Text>
              <Text>Status da Assinatura: {isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : (subscriptionStatus === 'active' ? 'Active' : 'Não Ativo')}</Text>
            </View>
            
            {subscriptionStatus !== 'active' && (
              <Button icon='card' title="Abrir WebView" onPress={() => setShowWebView(true)}/>
            )}
            
            <Button icon='information-circle' title="Informações da Conta" onPress={() => setModalVisible(true)} />
          </>
        ) : (
          <>
            <Button
              icon='logo-google'
              title='Entrar com Google'
              onPress={onGoogleSignIn}
              isLoading={isLoading}
            />
          </>
        )}
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Termos de utilização</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Informações da Conta</Text>
          
              <Text style={{fontSize: 12, marginTop: 20}}>Email que fez a assinatura:</Text>
              <TextInput
                placeholder="Enter your email"
                value={inputEmail}
                onChangeText={setInputEmail}
                style={{ borderWidth: 1, borderRadius: 10, padding: 8, width: 200, marginBottom: 10 }}
              />

            {subscriptionStatus !== 'active' && (
              <>
              <Text style={{fontSize: 12}}>Crie uma Senha:</Text>
              <TextInput
                placeholder="0000"
                value={newPassword}
                onChangeText={setNewPassword}
                style={{ borderWidth: 1, borderRadius: 10, padding: 8, width: 100, marginBottom: 10, textAlign: 'center' }}
                keyboardType="numeric"
                maxLength={4}
              />
              <ButtonConfirm 
              icon='log-in' 
              title="Confirmar" 
              onPress={() => { confirmEmail(); saveEmail(); }} 
              />
              </>
            )}

          {password && (
            <Text style={{ textAlign: 'center', marginVertical: 10 }}>
              Senha: {password}
            </Text>
          )}
          <View style={{ flexDirection: 'row', maxWidth: '90%', gap: 10 }}>
            <ButtonWaze icon='close-circle' title="Cancelar Assinatura" onPress={() => setCancelModalVisible(true)} />
            <ButtonWaze icon='unlink' title="Desvincular Celular" onPress={() => setUnlinkModalVisible(true)} />
          </View>
          <TouchableOpacity style={{ position: 'absolute', top: 0, right: 15, zIndex: 2, padding: 10 }} onPress={() => setModalVisible(!modalVisible)}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'red' }}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={cancelModalVisible}
        onRequestClose={() => {
          setCancelModalVisible(!cancelModalVisible);
        }}>
        <View style={styles.modalView}>
          <Text>Tem certeza que deseja cancelar a assinatura?</Text>
          <TextInput
            placeholder="Digite sua senha"
            value={inputPassword}
            onChangeText={setInputPassword}
            style={{ borderWidth: 1, borderRadius: 10, padding: 8, marginVertical: 10 }}
            keyboardType="numeric"
            maxLength={4}
          />
          <View style={{ flexDirection: 'row', gap: 10, width: '80%' }}>
            <ButtonModal 
            icon='close' 
            title="Não" 
            onPress={() => setCancelModalVisible(false)} 
            />
            <ButtonModal 
            icon='checkmark-circle' 
            title="Sim" 
            onPress={() => {cancelSubscription(); clearEmail();}} 
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={unlinkModalVisible}
        onRequestClose={() => {
          setUnlinkModalVisible(!unlinkModalVisible);
        }}>
        <View style={styles.modalView}>
          <Text>Tem certeza que deseja desvincular o UUID?</Text>
          <TextInput
            placeholder="Digite sua senha"
            value={inputPassword}
            onChangeText={setInputPassword}
            style={{ borderWidth: 1, borderRadius: 10, padding: 8, marginVertical: 10 }}
            keyboardType="numeric"
            maxLength={4}
          />
          
          <View style={{ flexDirection: 'row', gap: 10, width: '80%'}}>
            <ButtonModal 
            icon='close' 
            title="Não" 
            onPress={() => setUnlinkModalVisible(false)} 
            />
            <ButtonModal 
            icon='checkmark-circle' 
            title="Sim" 
            onPress={() => {unlinkUUID(); clearEmail();}} 
            />
          </View>

        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  inicialViewText: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    textAlign: 'right',
    marginRight: 30,
    marginTop: 60,
    color: 'black',
  },
  buttonContainer: {
    flex: 1,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalView: {
    margin: 'auto',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
