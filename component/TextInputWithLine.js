// 登录，注册组件

'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  TextInput,
} = React;


var TextInputWithLine = React.createClass({
  propTypes: {
    style: View.propTypes.style,
    elementStyle: View.propTypes.style,
  },
  render : function(){
    return (
      <View style= {this.props.style}>
        <Text>this.props.</Text>
      </View>
    );
  },

});
