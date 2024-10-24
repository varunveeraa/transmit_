import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../config/firebaseConfig'; // Import Firebase Firestore
import { getDoc, doc } from 'firebase/firestore'; // Firestore methods
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [publicID, setPublicID] = useState('');
  const [users, setUsers] = useState<{ displayName: string; publicKey: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to check if the user exists in Firestore
  const checkUserExists = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', publicID);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const fetchedUser = {
          displayName: userData.displayName,
          publicKey: publicID,
        };

        // Add user to the flatlist
        setUsers([...users, fetchedUser]);
        setModalVisible(false);
        setPublicID('');
      } else {
        alert('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle chat opening
  const handleChatOpen = (user: { displayName: string; publicKey: string }) => {
    router.push({
      pathname: '/chat',
      params: {
        displayName: user.displayName,
        publicKey: user.publicKey,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#121212" /> 

      <FlatList
        data={users}
        keyExtractor={(item) => item.publicKey}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChatOpen(item)} style={styles.card}>
            <Text style={styles.cardText}>{item.displayName}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Public ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter public ID"
              placeholderTextColor="#888"
              value={publicID}
              onChangeText={setPublicID}
            />
            <Pressable style={styles.button} onPress={checkUserExists}>
              <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Next'}</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles for Home Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 4,
  },
  cardText: {
    fontSize: 18,
    color: '#FFF',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#00A86B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  floatingButtonText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#00A86B',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});
