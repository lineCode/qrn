'use strict';

var React = require('react-native');
var InputWithLable = require('../component/InputWithLabel');
var DivideBorder = require('../component/DivideBorder');
var NavHeader = require('../component/NavHeader');

var {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView
} = React;

var BlackList = React.createClass({
  _back: function(){
    this.props.navigator.pop();
  },
  render: function(){
    return (
      <View style={styles.container}>
        <NavHeader title="黑名单" onPress={this._back} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfcf5',
    flex: 1
  }
});

module.exports = BlackList;

