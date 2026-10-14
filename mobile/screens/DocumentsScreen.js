import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { API_URL } from '../config';

//daysLeft und getColor
const daysLeft = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
const getColor = (doc) => {
    const days = daysLeft(doc.expires_at);

    if (days < 0) {
        return 'red';
    } else if (days <= doc.remind_days_before) {
        return 'orange';
    } else {
        return 'green';
    }

};

export default function DocumentsScreen({ token, onLogout }) {
    const [documents, setDocuments] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [expiresAt, setExpiresAt] = useState("");


    const loadDocuments = async () => {
        const response = await fetch(API_URL + '/documents', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            }

        });

        const docs = await response.json();
        if (response.status === 401) {
            onLogout();
            return;
        }
        if (!response.ok) {
            console.log('Error loading documents:', docs);
            return;
        }
        setDocuments(docs);

    };
    useEffect(() => {
        if (token) {
            loadDocuments()
        }
    }, [token]);


    const handleAddDocument = async () => {
        const response = await fetch(API_URL + '/documents', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ name: name, type: type, expires_at: expiresAt }),


        });

        const docs = await response.json();
        if (response.status === 401) {
            onLogout();
            return;
        }
        if (response.ok) {
            loadDocuments();
            setName("");
            setType("");
            setExpiresAt("");
        }

    };



    return (


        <View style={styles.container}>
            <Button style={styles.container} title="Logout" onPress={onLogout} />
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder='Name' />
            <TextInput style={styles.input} value={type} onChangeText={setType} placeholder='e.g Passport' />
            <TextInput style={styles.input} value={expiresAt} onChangeText={setExpiresAt} placeholder='Expires at (YYYY-MM-DD)' />
            <Button title="Save" onPress={handleAddDocument} />

            {documents.map(function (doc) {
                return <Text key={doc.id} style={{ color: getColor(doc) }}>{doc.name} - {doc.expires_at}</Text>;
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        width: 200,
        marginBottom: 8,
        marginTop: 8,

    }
});

