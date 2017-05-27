/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  TouchableHighlight,
  TextInput
} from 'react-native';
import Datastore  from 'react-native-local-mongodb';
const db = new Datastore({ filename: 'asyncStorageKey' });
import List from './List';
var tts = require('react-native-android-speech');
import RadioForm from 'react-native-simple-radio-button';

export default class App extends Component {
  state = {
    modalVisible: false,
    list: [],
    deleteItemConfirm: false,
    sortBy: 'alphabet'
  };

  constructor(props) {
    super(props);

    db.loadDatabase(() => {
      this.loadList();
    });
  }

  loadList() {
    db.find({}, (err, docs) => {
      this.setState({
        list: docs
      });
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    setTimeout(() => {
      visible && this.englishWord.setNativeProps({text: ''});
      visible && this.translate.setNativeProps({text: ''});
      visible && this.englishWord.focus();
    });
  }

  deleteItemModal = (item) => {
    this.setState({deleteItemConfirm: true, deleteItem: item});
  };

  addWord = () => {
    const {list} = this.state;
    const englishWord = this.state.englishWord;
    const translate = this.state.translate;
    if (!englishWord || !translate) {
      alert('All fields are required!');
      return;
    }
    const found = list.find((item) => {
      return item.englishWord === englishWord;
    });

    if (!found) {
      db.insert({ englishWord, translate, date: new Date().getTime() }, (err, newDocs) => {
        this.setModalVisible(false);
        this.loadList();
      });
    } else {
      alert('Thi word already exists!');
    }
  };

  search = (text) => {
    db.find({englishWord: {$regex: new RegExp(text)}}, (err, docs) => {
      this.setState({
        list: docs
      });
    });
  };

  speak = (word) => {
    tts.speak({
      text: word, // Mandatory
      language : 'en', // Optional Paramenter Default is en you can provide any supported lang by TTS
      country : 'GB' // Optional Paramenter Default is null, it provoques that system selects its default
    }).then(isSpeaking=>{
      console.log(isSpeaking);
    }).catch(error=>{
      //Errror Callback
      console.log(error)
    });
  };

  deleteItem = () => {
    db.remove({ _id: this.state.deleteItem._id }, {}, () => {
      this.closeConfirm();
      this.loadList();
    });
  };

  closeConfirm = () => {
    this.setState({deleteItemConfirm: false});
  };

  render() {
    const {list, sortBy} = this.state;
    const radio_props = [
      {label: 'Alphabet ', value: 'alphabet'},
      {label: 'Date', value: 'date'}
    ];
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Your english
        </Text>
        <Button onPress={() => {
              this.setModalVisible(true)
            }}
            title="Add a word"
            color="#004D40"
            accessibilityLabel="Add a word"/>
        <TextInput onChangeText={this.search}
                   style={styles.textInput}
                   placeholder="Search"/>
        <Text>Words count: {list.length}</Text>
        <View>
          <RadioForm
            radio_props={radio_props}
            initial={0}
            buttonColor={'#004D40'}
            formHorizontal={true}
            onPress={(value) => {this.setState({sortBy:value})}}
          />
        </View>

        <List list={list} sortBy={sortBy} deleteItemModal={this.deleteItemModal}/>

        <Modal animationType={"slide"}
               transparent={false}
               visible={this.state.deleteItemConfirm}
               onRequestClose={this.closeConfirm}>
          {this.state.deleteItem && <View style={{marginTop: 22}}>
            <Text style={styles.textDetails}>{this.state.deleteItem.englishWord} - {this.state.deleteItem.translate}</Text>
            <View>
              <Button onPress={this.speak.bind(null, this.state.deleteItem.englishWord)}
                      title="Pronounce"
                      color="#009688"
                      accessibilityLabel="Pronounce"/>
            </View>
            <Text>Delete this word?</Text>
            <View>
              <Button onPress={this.deleteItem}
                      title="Delete"
                      color="#009688"
                      accessibilityLabel="Delete"/>
            </View>
            <View style={styles.buttonClose}>
              <Button onPress={this.closeConfirm}
                      title="Close"
                      color="#80CBC4"
                      accessibilityLabel="Close"/>
            </View>
          </View>}
        </Modal>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible)
                      }}
        >
          <View style={{marginTop: 22}}>
            <View>
              <Text>Add a new word!</Text>
              <TextInput onChangeText={(englishWord) => this.setState({englishWord})}
                         value={this.state.englishWord}
                         style={styles.textInput}
                         ref={component => this.englishWord = component}
                         placeholder="English Word"/>
              <TextInput onChangeText={(translate) => this.setState({translate})}
                         value={this.state.translate}
                         style={styles.textInput}
                         ref={component => this.translate = component}
                         placeholder="Translation"/>
              <Button onPress={this.addWord}
                      title="Add a word"
                      color="#009688"
                      accessibilityLabel="Add a word"/>
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
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 5
  },
  textInput: {
    padding: 10,
    height: 50
  },
  buttonClose: {
    paddingTop: 20,
    bottom: 0
  },
  textDetails: {
    fontSize: 18
  }
});
