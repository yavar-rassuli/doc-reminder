import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput,Button } from 'react-native';
import { API_URL } from './config';
import DocumentsScreen from './screens/DocumentsScreen';
import LoginScreen from './screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {
  const [token, setToken] = useState("");
  const handleLogin = (newToken) => {
  // in den State
     setToken(newToken); 

  // in den Aktenschrank
  AsyncStorage.setItem('token', newToken);

};

useEffect(() => {
  const loadToken = async () => {
    const savedToken = await AsyncStorage.getItem( 'token' );
    if (savedToken) {
      setToken(savedToken); 
    }
  };
  loadToken();
}, []);



if (token) {
  return <DocumentsScreen token={token} />;
}

  return <LoginScreen onLogin={handleLogin}/>;   
 
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },

});
