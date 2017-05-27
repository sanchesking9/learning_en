import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class ListItem extends Component {
  render() {
    const {item} = this.props; 
    return (<View style={styles.listItem}>
      <Text>
        {item.englishWord} - {item.translate}
      </Text>
    </View>);
  }
}

const styles = StyleSheet.create({
  listItem: {
    padding: 10,
    borderBottomWidth: 1
  }
});
