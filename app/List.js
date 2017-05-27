import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Text,
  View
} from 'react-native';
import ListItem from './ListItem';

export default class List extends Component {
  state = {
    list: []
  };

  componentWillReceiveProps(nextProps) {
    const {sortBy} = nextProps;
    switch (sortBy) {
      case 'alphabet':
        nextProps.list.sort(function (a, b) {
          if (a.englishWord > b.englishWord) {
            return 1;
          }
          if (a.englishWord < b.englishWord) {
            return -1;
          }
          return 0;
        });
        break;
      case 'date':
        nextProps.list.sort(function (a, b) {
          a.date = a.date ? a.date : 0;
          b.date = b.date ? b.date : 0;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        break;
      default:
        break;
    }

    this.setState({
      list: nextProps.list
    });
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.list !== this.state.list) || (nextProps.sortBy !== this.props.sortBy);
  }

  render() {
    const {list} = this.state;
    let lastWord = '';

    return (<ScrollView style={styles.listView}>
      {list.map((item, index) => {
        let charset = lastWord[0] !== item.englishWord[0] ? item.englishWord[0] : '';
        lastWord = item.englishWord;
        return (<View key={index}>
          {this.props.sortBy === 'alphabet' && <Text style={styles.charset}>{charset}</Text>}
          <TouchableHighlight onPress={() => this.props.deleteItemModal(item)}>
            <View>
              <ListItem item={item} />
            </View>
          </TouchableHighlight>
        </View>);
      })}
    </ScrollView>);
  }
}

const styles = StyleSheet.create({
  listView: {
    flex: 1
  },
  charset: {
    fontSize: 20,
    paddingLeft: 10
  }
});
