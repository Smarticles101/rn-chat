import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import * as firebase from 'firebase';

export default class LoginScreen extends React.Component {

  state = {
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    register: false,
    userDetails: false,
    login: false
  }

  login() {
    if (!this.state.login)
        this.setState({ login: true })
    else
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => this.setState({ error: error.message }))
  }

  register() {
    if (!this.state.register)
        this.setState({ register: true })
    else if (this.state.username === "")
        this.setState({ error: "Username is invalid!" })
    else
        firebase.database().ref('/usernames/' + this.state.username).once("value", (snap) => {
            if (snap.val() !== null)
                this.setState({ error: "Username already taken!" })
            else if (this.state.password !== this.state.confirmPassword)
                this.setState({ error: "Passwords don't match!" })
            else
                firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((o) => {
                    firebase.database().ref('/usernames/' + this.state.username).set(o.user.uid);
                    firebase.database().ref('/users/' + o.user.uid).set({
                        username: this.state.username,
                        email: this.state.email
                    })
                })
                .catch((error) => this.setState({ error: error.message }))
        
        })
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} enabled behavior="padding">

        <Text style={styles.error}>
            {this.state.error}
        </Text>

        {(this.state.login || this.state.register) && 
        <View style={styles.inputs}>
            <Text style={styles.labels}>Email:</Text>
            <TextInput 
                style={styles.input}
                onChangeText={(email) => this.setState({email})} 
                value={this.state.email}
            />
            <Text style={styles.labels}>Password:</Text>
            <TextInput 
                style={styles.input}
                onChangeText={(password) => this.setState({password})} 
                value={this.state.password}
                secureTextEntry
            />

            {this.state.register &&
                <View>
                    <Text style={styles.labels}>Confirm Password:</Text>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(confirmPassword) => this.setState({confirmPassword})} 
                        value={this.state.confirmPassword}
                        secureTextEntry
                    />

                    <Text style={styles.labels}>Username:</Text>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(username) => this.setState({username})} 
                        value={this.state.username}
                    />
                </View>
            }
        </View>
        }

        {!this.state.login && 
        <TouchableOpacity
            style={styles.button}
            onPress={this.register.bind(this)}
        >
          <Text>Register</Text>
        </TouchableOpacity>
        }
        {!this.state.register &&
        <TouchableOpacity
            style={styles.button}
            onPress={this.login.bind(this)}
        >
          <Text>Login</Text>
        </TouchableOpacity>
        }
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    minWidth: 100,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    borderColor: 'lightgrey',
    backgroundColor: '#fbfbfb'
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  inputs: {
      alignItems: 'stretch'
  },
  button: {
      alignItems: 'center',
      backgroundColor: 'lightgrey',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
  }
});
