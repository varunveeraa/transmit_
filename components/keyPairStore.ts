import * as SecureStore from 'expo-secure-store';

async function storeKey(keyName: string, key: string) {
  try {
    await SecureStore.setItemAsync(keyName, key);
    console.log('Private key stored successfully.');
  } catch (error) {
    console.error('Error storing private key:', error);
  }
}

async function getKey(keyName: string) {
  try {
    const key = await SecureStore.getItemAsync(keyName);
    if (key) {
      return key;
    } else {
      console.log('No private key found.');
    }
  } catch (error) {
    console.error('Error retrieving private key:', error);
  }
}

export { storeKey, getKey }