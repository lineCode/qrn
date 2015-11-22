'use strict';

var React = require('react-native');

var {
  Text,
  View,
  ActivityIndicatorIOS,
} = React;

var LoadingPage = React.createClass({
  render: function(){
    return (
      <View style={{flex: 1, backgroundColor: "#48b8a7", alignItems: "center", justifyContent: "center"}}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
          <ActivityIndicatorIOS color="white"/>
          <Text style={{color: "white"}}> 加载中…</Text>
        </View>
      </View>
    );
  },
});

module.exports = LoadingPage;
