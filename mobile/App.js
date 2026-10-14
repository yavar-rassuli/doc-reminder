import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput,Button } from 'react-native';
import { API_URL } from './config';
import DocumentsScreen from './screens/DocumentsScreen';
import LoginScreen from './screens/LoginScreen';



export default function App() {
  const [token, setToken] = useState("");


if (token) {
  return <DocumentsScreen token={token} />;
}

  return <LoginScreen onLogin={setToken}/>;   
 
  
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
