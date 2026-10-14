import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput,Button } from 'react-native';
import { API_URL } from '../config';

//daysLeft und getColor
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

export default function DocumentsScreen({ token }) {
    const [documents, setDocuments] =  useState([]);
  
  
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
  
  return (
    // hier: die Liste (das, was jetzt im if (token) steht)
    
       <View style={styles.container}>
            {documents.map(function (doc) {
        return <Text key={doc.id} style= {{ color: getColor(doc) }}>{doc.name} - {doc.expires_at}</Text>;
      })}
  

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

