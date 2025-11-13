import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth Configuration
// You'll need to get these from Google Cloud Console
const GOOGLE_CLIENT_ID_WEB = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '';
const GOOGLE_CLIENT_ID_IOS = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '';
const GOOGLE_CLIENT_ID_ANDROID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID_WEB,
    iosClientId: GOOGLE_CLIENT_ID_IOS,
    androidClientId: GOOGLE_CLIENT_ID_ANDROID,
    redirectUri: makeRedirectUri({
      scheme: 'safechem',
      path: 'auth/callback',
    }),
    scopes: ['profile', 'email'],
  });

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      
      if (result.type === 'success') {
        const { authentication } = result;
        
        if (authentication?.accessToken) {
          // Fetch user info from Google
          const userInfoResponse = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
              headers: { Authorization: `Bearer ${authentication.accessToken}` },
            }
          );
          
          const userInfo: GoogleUserInfo = await userInfoResponse.json();
          return userInfo;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  return {
    signInWithGoogle,
    request,
  };
};
