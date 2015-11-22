'use strict';

var React = require('react-native');
var Swiper = require('react-native-swiper')

var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} = React;

var FirstOpenPage = React.createClass({
  _jumpLogin: function(){
    this.props.navigator.push({id: "login"});
  },
  render: function(){
    return (
        <Swiper showsButtons={false} loop={false}>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>在萌芽</Text>
            <Text>我们科学的孕期讨论</Text>
          </View>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>在萌芽</Text>
            <Text>我们分享宝宝的成长经历</Text>
          </View>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>在萌芽</Text>
            <Text>我们关注0-6岁宝宝成长</Text>
          <TouchableOpacity onPress={this._jumpLogin}>
            <Text>立即体验</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    );
  }
});
module.exports = FirstOpenPage
