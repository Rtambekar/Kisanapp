import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useTranslation } from 'react-i18next';
import CommonButton from '../components/CommonButton';


const RegisterPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'User registered successfully!');
      navigation.navigate('Login'); // Navigate back to Login Page after successful registration
    } catch (error) {
      console.error(error.message);
      Alert.alert('Error', error.message);
    }
  };
 

  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
                  <Text style={styles.wish}>{t('createAccount')}</Text>
                  <Text style={styles.title}>{t('signupHeadline')}</Text>
                </View>
      
       {/* <Text style={styles.wish}>{t('createAccount')}</Text>
       <Text style={styles.title}>{t('signupHeadline')}</Text> */}
       
      <TextInput
        style={styles.input}
        placeholder={t('email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder={t('confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
        <CommonButton title={t('signup')} onPress={handleRegister} />
      <CommonButton
        title= {t('alreadyUser')}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },

  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 16,

    paddingHorizontal: 8,
    borderRadius: 4,
  },
  wish: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    color: '#666',
    fontWeight: '600',
  },
});

export default RegisterPage;