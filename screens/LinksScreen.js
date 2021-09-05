import React from 'react';
import { ScrollView, StyleSheet, View, TextInput, Text, TouchableOpacity, Keyboard } from 'react-native';

import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { addChannel, setChannel } from "../action/index"

class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  state = {
    text: '',
    filteredChannels: []
  }

  componentDidUpdate(newProps) {
    if (this.props.profile.channels !== newProps.channels) {
      firebase.database().ref('/usernames/' + this.props.profile.username).once('value', o => {
        firebase.database().ref('/users/' + o.val() + '/channels').set(this.props.profile.channels);
      });
    }
  }

  addChannel(channel) {
    this.props.addChannel(channel)
    this.setState({ text: '', filteredChannels: [] })
    Keyboard.dismiss();
    this.props.navigation.navigate('Chat');
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.textInput}>
          <TextInput
            autoCorrect={false}
            onChangeText={(text) => {
              firebase.database().ref('/channels/').once('value', o => {
                let arr = []
                o.forEach(j => {
                  if (j.key.toLowerCase().startsWith(text.toLowerCase())) {
                    arr.push(j.key)
                  }
                })
                if (text === '') {
                  arr = [];
                }
                this.setState({ filteredChannels: arr })
              })
              this.setState({text})
            }}
            value={this.state.text}
          />
        </View>
        <View style={styles.results}>
          {this.state.text !== '' && !this.state.filteredChannels.map(e => e.toLowerCase()).includes(this.state.text.toLowerCase()) &&
            <TouchableOpacity style={styles.result} onPress={() => {
              this.addChannel(this.state.text)
            }}>
              <Text style={styles.resultText}>
                <Text style={{color: 'skyblue'}}>
                  {"Create channel: "}
                </Text>
                {this.state.text}
              </Text>
            </TouchableOpacity>
          }
          {this.state.text !== '' ? 
            this.state.filteredChannels.map((chan, i) =>
              <TouchableOpacity key={i} style={styles.result} onPress={() => {
                this.addChannel(chan)
              }}>
                <Text style={styles.resultText}>
                  <Text style={{color: 'rebeccapurple'}}>
                    {"Join channel: "}
                  </Text>
                  {chan}
                </Text>
              </TouchableOpacity>
            )
          :
            this.props.profile.channels && 
            this.props.profile.channels.map((chan, i) =>
              <TouchableOpacity key={i} style={styles.result} onPress={() => {
                this.props.setChannel(chan);
                this.props.navigation.navigate('Chat');
              }}>
                <Text style={styles.resultText}>{chan}</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgrey',
    backgroundColor: '#fbfbfb'
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  results: {
    padding: 15
  },
  result: {
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5
  },
  resultText: {
    fontSize: 20
  }
});

const mapDispatchToProps = dispatch => ({
  addChannel: channel => dispatch(addChannel(channel)),
  setChannel: channel => dispatch(setChannel(channel))
});

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, mapDispatchToProps)(LinksScreen)
