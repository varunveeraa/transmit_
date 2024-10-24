import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { getKey } from '@/components/keyPairStore'; // Custom key storage

export default function HomeScreen() {
  const router = useRouter();
  const [isKeyChecked, setIsKeyChecked] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(-100))[0];

  // Fade-in and slide-in animations for screen load
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Check if keys exist and navigate accordingly
  useEffect(() => {
    const checkKeys = async () => {
      const privateKey = await getKey('privateKey');
      const publicKey = await getKey('publicKey');

      if (!privateKey && publicKey) {
        router.replace('/(tabs)'); // Navigate to the tab if keys exist
      } else {
        setIsKeyChecked(true); // Set the flag to true after checking keys
      }
    };

    checkKeys();
  }, []);

  // Render loading screen until key check is done
  if (!isKeyChecked) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initializing your secure world...</Text>
      </View>
    );
  }

  // Main Screen UI
  return (
    <View style={styles.container}>
      {/* Full top section */}
      <View style={styles.topSection}>
        {/* Logo with subtle pulsating animation */}
        <Animated.View style={styles.logoContainer}>
          <Text style={styles.logo}>T</Text>
        </Animated.View>

        {/* Welcome message */}
        <Text style={styles.title}>
          Welcome to <Text style={styles.transmitBrand}>Transmit</Text>
        </Text>
      </View>

      {/* Lower bottom half section for buttons */}
      <View style={styles.middleSection}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
          ]}
          onPress={() => router.push('/userSignUp')}
        >
          <Text style={styles.buttonText}>Create an Anonymous Identity</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.outlineButton,
            pressed ? styles.outlineButtonPressed : null,
          ]}
          onPress={() => router.push('/(tabs)/attempt1')}
        >
          <Text style={styles.outlineButtonText}>I Have an Account</Text>
        </Pressable>
      </View>

      {/* Footer at the full bottom */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your privacy is our priority. Start secure, stay secure.
        </Text>
      </View>
    </View>
  );
}

// Styling for a clean, modern UI with pitch-black background and creative elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pitch-black background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#00A86B',
    fontSize: 18,
    fontStyle: 'italic',
  },
  topSection: {
    flex: 2, // Top section takes a small portion of the screen
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  middleSection: {
    flex: 2, // Buttons in the lower bottom half
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 50,
  },
  footer: {
    flex: 0.5, // Footer at the very bottom of the screen
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00A86B',
    borderRadius: 50,
    width: 100,
    height: 100,
    padding: 10, // Add padding to ensure the "T" has some space around it
  },
  logo: {
    fontSize: 60, // Adjust font size if needed
    fontWeight: 'bold',
    color: '#00A86B', // Bright green logo
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 60, // Set line height to center the text vertically
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // White for clean contrast
    marginBottom: 10,
  },
  transmitBrand: {
    color: '#00A86B', // Green color for the word "Transmit"
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: '900', // Bold font weight for a strong brand presence
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#00A86B', // Green button
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#00A86B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  outlineButton: {
    borderColor: '#00A86B', // Green outline
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00A86B',
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: '#148F45',
  },
  outlineButtonPressed: {
    transform: [{ scale: 0.96 }],
    borderColor: '#148F45',
  },
  footerText: {
    fontSize: 14,
    color: '#00A86B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
