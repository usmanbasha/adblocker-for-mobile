import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { clientAuth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleLogout = async () => {
    await AsyncStorage.removeItem("doc-qToken");
    await signOut(clientAuth)
    .then(async () => {
        console.log("User Signed Out");
    })
    .catch((error) => {
        console.log(error);
    });
}

function Logout() {
    const [user, setUser] = useState(true);
    useEffect(() => {
        clientAuth.onAuthStateChanged(async (user) => {
            if (!user) {
                setUser(false);
            }
        });
    }, []);

    return (
        <View className="p-8  bg-white rounded-t-3xl">
            <View classname="flex-row justify-center items-center mb-4">
                {user ? <Text onPress={handleLogout}>
                    Logout
                </Text>
                    :
                    <Text>
                        No user Signed In
                    </Text>
                }
            </View>
        </View>
    )
}

export default Logout