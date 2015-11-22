'use strict';

var React = require('react-native');

var {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity
} = React;

var SearchItem = React.createClass({
	render: function(){
		return (
			<TouchableOpacity style={styles.item} onPress={(e) => this.props.navigator.push({id: "searchTopicList", keyWord: this.props.label, isTag: true})}>
				<Image
					source={this.props.source}
					style={styles.itemImg} />
				<Text style={styles.itemTxt}>{this.props.label}</Text>
			</TouchableOpacity>
		);
	}
});

var styles = StyleSheet.create({
	item: {
		flex: 1,
		alignItems: 'center'
	},
	itemImg: {
		width: 60,
		height: 60,
		marginBottom: 10
	},
	itemTxt: {
		fontSize: 14,
		color: '#223e4d',
		opacity: 0.8
	}
});

module.exports = SearchItem;
