/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  NavigatorIOS,
  StatusBarIOS,
} = React;

var Login = require('./component/Login');

var LoginBar = React.createClass({
  getInitialState: function(){
    return {
      navigationBarHidden: false
    }
  },

  toggleNav: function(){
    this.setState({
      navigationBarHidden: !this.state.navigationBarHidden
    });
  },

  render: function(){
    console.log(this.state.navigationBarHidden);
    return (
        <NavigatorIOS
          ref="nav"
          style={styles.nav}
          itemWrapperStyle={styles.navWrap}
          navigationBarHidden={this.state.navigationBarHidden}
          initialRoute={{
            component: Login,
            rightButtonTitle: '跳过',
            title: '登录页面',
            passProps: {
              toggleNav: this.toggleNav,
            }
          }} />
    );
  },

});

var styles = StyleSheet.create({
  navWrap: {
     flex: 1,
     marginTop: 70
   },
   nav: {
     flex: 1,
   },
});

module.exports = LoginBar;
