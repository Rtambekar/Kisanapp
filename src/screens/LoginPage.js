import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import CommonButton from '../components/CommonButton';
import SelectLangModal from '../components/SelectLangModal';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectLanguage, setSelectLanguage] = useState('English');
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        navigation.replace('Listing');
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  useEffect(() => {
    checkLng();
  }, []);

  const checkLng = async () => {
    const x = await AsyncStorage.getItem('LANG');
    if (x != null) {
      i18n.changeLanguage(x);
      let lng =
        x == 'en'
          ? 'English'
          : x == 'hi'
            ? 'हिंदी'
            : x == 'pa'
              ? 'ਪੰਜਾਬੀ'
              : 'தமிழ்';
      setSelectLanguage(lng);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));
      Alert.alert('Success', 'User logged in successfully!');
      navigation.replace('Listing');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Language Selector */}
          <TouchableOpacity
            style={styles.langView}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.lang}>{selectLanguage}</Text>
            <Image 
              source={require('../images/dropdown.png')} 
              style={styles.icon} 
            />
          </TouchableOpacity>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.wish}>{t('welcome')}</Text>
            <Text style={styles.title}>{t('signInHeadline')}</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('email')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('password')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <CommonButton 
                title={t('login')} 
                onPress={handleLogin}
                style={styles.loginButton}
              />
              
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>{t('or')}</Text>
                <View style={styles.divider} />
              </View>

              <CommonButton
                title={t('createNewUser')}
                onPress={() => navigation.navigate('Register')}
                style={styles.registerButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SelectLangModal
        visible={showModal}
        selectedLang={selectLanguage}
        onClose={() => setShowModal(false)}
        onSelect={async lang => {
          let lng =
            lang == 'English'
              ? 'en'
              : lang == 'हिंदी'
                ? 'hi'
                : lang == 'ਪੰਜਾਬੀ'
                  ? 'pa'
                  : 'ta';
          await AsyncStorage.setItem('LANG', lng);
          i18n.changeLanguage(lng);
          setSelectLanguage(lang);
          setShowModal(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  langView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  lang: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    width: 16,
    height: 16,
    marginLeft: 8,
    tintColor: '#666',
  },
  welcomeSection: {
    marginBottom: 40,
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
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 16,
  },
  loginButton: {
    backgroundColor: '#0066CC',
    borderRadius: 12,
    paddingVertical: 16,
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0066CC',
    borderRadius: 12,
    paddingVertical: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginPage;