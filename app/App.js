/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Button,
  Modal,
  TouchableHighlight,
  TextInput
} from 'react-native';
import Datastore  from 'react-native-local-mongodb';
const db = new Datastore({ filename: 'asyncStorageKey' });

export default class App extends Component {
  state = {
    modalVisible: false,
    list: []
  };

  componentWillMount() {
    db.loadDatabase((err) => {    // Callback is optional
      db.find({}, (err, docs) => {
        this.setState({
          list: docs
        });
      });
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  addWord = () => {
    const {list} = this.state;
    const englishWord = this.state.englishWord;
    const translate = this.state.translate;
    db.insert({ englishWord, translate }, (err, newDocs) => {
      list.push(newDocs);
      this.setState({
        list: list,
        englishWord: '',
        translate: ''
      });
      this.setModalVisible(false);
    });
  };

  search = (text) => {
    db.find({englishWord: {$regex: new RegExp(text)}}, (err, docs) => {
      this.setState({
        list: docs
      });
    });
  };

  render() {
    const {list} = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Your english
        </Text>
        <Button onPress={() => {
          this.setModalVisible(true)
        }}
                title="Add word"
                color="#004D40"
                accessibilityLabel="Add word"/>
        <TextInput onChangeText={this.search}
                   style={styles.textInput}
                   placeholder="Search"/>
        <Text>Words count: {list.length}</Text>
        <ScrollView>
          {list.map(function (item, index) {
            return (<Text key={index}>
              {item.englishWord} - {item.translate}
            </Text>);
          })}
        </ScrollView>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <View style={{marginTop: 22}}>
            <View>
              <Text>Add new word!</Text>
              <TextInput onChangeText={(englishWord) => this.setState({englishWord})}
                         value={this.state.englishWord}
                         style={styles.textInput}
                         placeholder="English Word"/>
              <TextInput onChangeText={(translate) => this.setState({translate})}
                         value={this.state.translate}
                         style={styles.textInput}
                         placeholder="Translate"/>
              <Button onPress={this.addWord}
                      title="Add word"
                      color="#009688"
                      accessibilityLabel="Add word"/>
              <View style={styles.buttonClose}>
                <Button onPress={() => {
                        this.setModalVisible(!this.state.modalVisible)
                      }}
                        title="Close"
                        color="#80CBC4"
                        accessibilityLabel="Close"/>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 5,
  },
  textInput: {
    padding: 10,
    height: 50
  },
  buttonClose: {
    paddingTop: 20,
    bottom: 0
  }
});
