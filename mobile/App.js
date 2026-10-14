import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput,Button } from 'react-native';

const API_URL = 'https://glorious-space-memory-wxww4jpqwr4c57ww-8000.app.github.dev/api';

const daysLeft = (expiresAt) => {
  const diff = new Date(expiresAt) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
const getColor = (doc) => {         
  const days = daysLeft(doc.expires_at);

  if(days < 0){
    return 'red';
  }else if(days <= doc.remind_days_before){
     return 'orange';
  }else{
      return 'green';
  }
 
};

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [documents, setDocuments] =  useState([]);

  const handleLogin = async () => {
  const response = await fetch(API_URL + '/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, password: password}),
  });

  const data = await response.json();

  if (!response.ok) {
    setError("Email or Password  is wrong");
    return;
  }

  console.log(data);
  setToken(data.token);
};

const loadDocuments = async () => {
  const response = await fetch(API_URL + '/documents' ,{
    method: 'GET',
    headers:{
       'Accept': 'application/json',
       'Authorization': 'Bearer ' + token,
    }

  });

    const docs = await response.json();
    setDocuments(docs);

};
    useEffect(() => {
      if (token) {
        loadDocuments ()      
      }
            }, [token]);

   if (token){
     return <View style={styles.container}>
          {documents.map(function (doc) {
      return <Text key={doc.id} style= {{ color: getColor(doc) }}>{doc.name} - {doc.expires_at}</Text>;
    })}


     </View>;}


    return (
      <View style={styles.container}>
        <Text>DocReminder 📄</Text>

        <TextInput style={styles.input} value={email}  onChangeText={setEmail} placeholder='E-Mail'/>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder='Password' secureTextEntry/>
        <Button title="Login" onPress={handleLogin} />

      {error && <Text>{error}</Text>}
    
        <StatusBar style="auto" />
      </View>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  input:{
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 200, 
    marginBottom: 8,

  }
});
