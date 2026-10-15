import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { API_URL } from '../config';
import { COLORS } from '../theme';
import Logo  from '../Logo';

export default function LoginScreen({ onLogin }) {
  // useState für email, password, error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //  handleLogin
  const handleLogin = async () => {
    const response = await fetch(API_URL + '/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError("Email or Password  is wrong");
      return;
    }

    onLogin(data.token);


  };

  // das Login-Formular
  return (
    <View style={styles.screen}>
        <View style={styles.box}>
            <Logo />
      <View style={styles.form}>

        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='E-Mail' />
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder='Password' secureTextEntry />
        <Pressable onPress={handleLogin} style={styles.addButton}>
          <Text style={styles.addButtonText}>Login → </Text>
        </Pressable>

        {error && <Text>{error}</Text>}
      </View>
        </View>
    

    </View>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1, backgroundColor: COLORS.paper,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',

  },

  box: {
    maxWidth: 500,
width: '100%',
  },

  form: {
    marginTop: 12,
    padding: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.line,
  },
  formTitle: { fontSize: 16, fontWeight: '800', color: COLORS.ink, marginBottom: 12 },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ink,
    paddingVertical: 10,
    marginBottom: 14,
    fontSize: 15,
    color: COLORS.ink,
  },
  addButton: {
    backgroundColor: COLORS.ink,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: { color: COLORS.paper, fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },

});

