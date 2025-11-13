import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../contexts/AuthContext';
import { useGoogleAuth } from '../../services/googleAuth';
import { authApi } from '../../services/authApi';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const { signInWithGoogle } = useGoogleAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      await signUp({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Sign Up Failed',
        error instanceof Error ? error.message : 'Failed to create account. Please try again.'
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const userInfo = await signInWithGoogle();
      
      if (userInfo) {
        // Send Google user info to backend
        await authApi.googleLogin({
          googleId: userInfo.id,
          email: userInfo.email,
          fullName: userInfo.name,
          picture: userInfo.picture,
        });
        
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert(
        'Google Sign-In Failed',
        error instanceof Error ? error.message : 'Failed to sign in with Google'
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background with organic shapes */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.shape, styles.shape1]} />
        <View style={[styles.shape, styles.shape2]} />
        <View style={[styles.shape, styles.shape3]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create</Text>
          <Text style={styles.title}>Account</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            <Ionicons
              name="person-outline"
              size={20}
              color="rgba(255, 255, 255, 0.8)"
              style={styles.inputIcon}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Ionicons
              name="mail-outline"
              size={20}
              color="rgba(255, 255, 255, 0.8)"
              style={styles.inputIcon}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.inputIcon}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="rgba(255, 255, 255, 0.8)"
              />
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <View style={styles.buttonRow}>
            <Text style={styles.buttonLabel}>Sign Up</Text>
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="arrow-forward" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color="#2d5875" />
            ) : (
              <>
                <Ionicons name="logo-google" size={24} color="#2d5875" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Bottom Link */}
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d6b8a',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shape: {
    position: 'absolute',
    borderRadius: 999,
  },
  shape1: {
    width: 350,
    height: 350,
    backgroundColor: '#4a7a9a',
    top: -50,
    right: -100,
  },
  shape2: {
    width: 300,
    height: 300,
    backgroundColor: '#6bb5d8',
    top: 150,
    right: -50,
  },
  shape3: {
    width: 400,
    height: 400,
    backgroundColor: '#87ceeb',
    bottom: -100,
    left: -150,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    marginTop: 40,
    marginBottom: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 50,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  inputIcon: {
    marginLeft: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  signUpButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2d5875',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  linksContainer: {
    paddingHorizontal: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#fff',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5875',
  },
});
