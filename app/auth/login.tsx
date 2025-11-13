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

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { signInWithGoogle } = useGoogleAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      await login({ username: username.trim(), password });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error instanceof Error ? error.message : 'Invalid credentials. Please try again.'
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
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.title}>Back</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <Ionicons
              name="person-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
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
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <View style={styles.buttonRow}>
            <Text style={styles.buttonLabel}>Sign In</Text>
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
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
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="logo-google" size={24} color="#fff" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Bottom Links */}
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
              <Text style={styles.linkText}>Forget Password?</Text>
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
    backgroundColor: '#1a3a52',
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
    width: 300,
    height: 300,
    backgroundColor: '#2d5875',
    top: -50,
    left: -100,
  },
  shape2: {
    width: 250,
    height: 250,
    backgroundColor: '#5eb3d6',
    top: 100,
    right: -80,
  },
  shape3: {
    width: 200,
    height: 200,
    backgroundColor: '#87ceeb',
    top: 50,
    right: 50,
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
    marginBottom: 80,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
  signInButton: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
