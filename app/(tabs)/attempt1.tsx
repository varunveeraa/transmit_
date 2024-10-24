import { useEffect } from "react";
import { Text, View } from "react-native";
import { storeKey, getKey } from "@/components/keyPairStore";
import { generateKeyPair } from "@/components/enDecrypt";

export default function attempt1 () {
    useEffect(() => {
        function simulateKeyGenStore () {
            const bobKeyPair = generateKeyPair('Bob');
            storeKey("publicKey", bobKeyPair.publicKey);
            storeKey("privateKey", bobKeyPair.privateKey);
            getKey("bobPrivateKey");
        }

        // simulateKeyGenStore();
        
      }, []);

    return(
        <View>
            <Text style={{color: "white"}}>Hey HEllo!</Text>
        </View>
    )
}

