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

var SearchTopic = React.createClass({
	render: function(){
		return (
			<View style={styles.container}>
				<View style={styles.topicRow}>
					<SearchItem source={require('image!Find_Topic_but_Education_default')} label="亲子教育" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Topic_but_Family_default')} label="家 庭" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Topic_but_Sleep_default')} label="睡 眠" navigator={this.props.navigator} />
				</View>
				<View style={styles.topicRow}>
					<SearchItem source={require('image!Find_Topic_but_Diet_default')} label="营养饮食" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Topic_but_Grow_default')} label="成长发育" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Topic_but_Hot_default')} label="辣妈攻略" navigator={this.props.navigator} />
				</View>
				<View style={styles.topicRow}>
					<SearchItem source={require('image!Find_Age_but_0m,6m_default')} label="母乳奶粉" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Topic_but_Play_default')} label="绘本游戏" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Topic_but_Healthy_default')} label="护 理" navigator={this.props.navigator} />
				</View>
				<View style={styles.topicRow}>
					<SearchItem source={require('image!Find_Topic_but_Life_default')} label="出 行" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Topic_but_Product_default')} label="好物分享" navigator={this.props.navigator} />
					<SearchItem source={require('image!Find_Topic_but_Other_default')} label="其 他" navigator={this.props.navigator} />
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

module.exports = SearchTopic;
