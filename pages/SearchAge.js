'use strict';

var React = require('react-native');
var SearchItem = require('../component/SearchItem');

var {
	StyleSheet,
	View,
	Image,
	Text,
	ScrollView,
	PixelRatio
} = React;

var SearchAge = React.createClass({
	render: function(){
		return (
			<View style={styles.container}>
				<View style={styles.topicRow}>
					<SearchItem source={require('image!Find_Age_but_Prepare-pregnant_default')} label="备 孕" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Age_but_Pregnancy_default')} label="孕 期" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Age_but_0m,6m_default')} label="0-6个月" navigator={this.props.navigator} />
				</View>
				<View style={styles.topicRow}>
					<SearchItem source={require('image!Find_Age_but_6m,1Y_default')} label="6个月－1岁" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Age_but_0y,1y_default')} label="0-1岁" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Age_but_0y,3y_default')} label="0-3岁" navigator={this.props.navigator} />
				</View>
				<View style={styles.topicRow}>
					<SearchItem source={require('image!Find_Age_but_1y,3y_default')} label="1岁-3岁" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Age_but_1y,6y_default')} label="1岁-6岁" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Age_but_3y,6y_default')} label="3岁－6岁" navigator={this.props.navigator} />
				</View>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		backgroundColor: '#fcfcf5',
		flex: 1
	},
	topicRow: {
		flexDirection: 'row',
		marginTop: 12,
		marginBottom: 10
	}
});

module.exports = SearchAge;
