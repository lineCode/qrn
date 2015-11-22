'use strict';

var React = require('react-native');

var {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
} = React;

var NavHeader = React.createClass({
	render: function(){
		return (
			<View style={styles.header}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Image style={styles.back} source={require("image!Profile2_but_Back_white")} />
        </TouchableOpacity>
        <Text style={styles.headerTxt}>{this.props.title}</Text>
        {this.props.children}
      </View>
		);
	}
});

var styles = StyleSheet.create({
	header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#48b8a7'
  },
  back: {
  	width: 44,
  	height: 44,
  },
  headerTxt: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    paddingLeft: -44,
    height: 32
  },
});

module.exports = NavHeader;
