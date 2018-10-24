import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Text
} from 'react-native';

import * as firebase from 'firebase';

import { connect } from 'react-redux';

import { setChannel } from '../action/index';

class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'Join a channel!': navigation.state.params.title,
  });

  state = {
    text: '',
    messages: []
  }

  componentDidUpdate(prevProps) {
    if (prevProps.channel !== this.props.channel) {
      this.props.navigation.setParams({ title: this.props.channel })
      this.setState({ messages: [] })

      if (this.ref)
        this.ref.off();
        
      this.ref = firebase.database().ref('/channels/' + this.props.channel)
      this.ref.on('child_added', snap => {
        var messages = Array.from(this.state.messages);
        messages.push(snap.val());
        this.setState({ messages })
      })
    }
  }

  componentDidMount() {
    if (this.props.channel && this.props.channel !== '') {
      this.props.navigation.setParams({ title: this.props.channel })

      this.ref = firebase.database().ref('/channels/' + this.props.channel)
      this.ref.on('child_added', snap => {
        var messages = Array.from(this.state.messages);
        messages.push(snap.val());
        this.setState({ messages })
      })
    } else {
      if (this.props.profile.channels && this.props.profile.channels.length !== 0) {
        this.props.setChannel(this.props.profile.channels[this.props.profile.channels.length - 1])
      } else {
        this.props.navigation.navigate('Links');
      }
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          ref={ref => this.scrollView = ref}
          onContentSizeChange={() => {
            this.scrollView.scrollToEnd({animated: true});
          }}
        >
          {this.props.channel === '' &&
            <View style={styles.leftMessageBox}>
              <View style={styles.leftMessageText}>
                <Text>
                  Join a channel clicking the "Search" icon on the tab bar.
                </Text>
              </View>
            </View>
          }
          {this.state.messages && this.state.messages.map((elm, i) => 
            <View key={i} style={this.props.profile.username === elm.author ? styles.rightMessageBox : styles.leftMessageBox}>
              <Text style={{
                fontSize: 10,
                color: 'grey',
                margin: 1
              }}>
                {elm.author}
              </Text>

              <View style={this.props.profile.username === elm.author ? styles.rightMessageText : styles.leftMessageText}>
                <Text>
                  {elm.message}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
        <View style={styles.textInput}>
          <TextInput
            editable={this.props.channel !== ''}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            onSubmitEditing={() => {
              let time = firebase.database.ServerValue.TIMESTAMP;

              if (this.state.text !== '')
                firebase.database().ref('/channels/' + this.props.channel).push({ 
                  message: this.state.text,
                  author: this.props.profile.username,
                  time
                })
              this.setState({ text: '' })
            }}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'stretch'
  },
  contentContainer: {
    paddingTop: 30,
  },
  textInput: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgrey',
    backgroundColor: '#fbfbfb'
  },
  leftMessageText: {
    padding: 10,
    marginTop: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'lightgrey',
    maxWidth: 200,
    alignSelf: 'flex-start'
  },
  leftMessageBox: {
    alignSelf: 'flex-start',
    margin: 10,
  },
  rightMessageText: {
    padding: 10,
    marginTop: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'lightblue',
    maxWidth: 200,
    alignSelf: 'flex-end'
  },
  rightMessageBox: {
    alignSelf: 'flex-end',
    margin: 10,
  }
});


const mapStateToProps = state => {
  console.log(state)
  return({
  profile: state.profile,
  channel: state.channel
})}

const mapDispatchToProps = dispatch => ({
  setChannel: channel => dispatch(setChannel(channel))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
