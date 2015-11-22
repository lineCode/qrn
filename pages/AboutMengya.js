'use strict';

var React = require('react-native');
var NavHeader = require('../component/NavHeader');
var settings = require('../utils/settings');

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	ScrollView
} = React;

var AboutMengya = React.createClass({
	_back: function(){
		this.props.navigator.pop();
	},
	alertVersion: function(){
		fetch(settings.serverAddress + "/api/config/proj/version/")
		.then(res => {
			console.log(res);
			return res.json();
		})
		.then(resJson => {
			alert(JSON.stringify(resJson));
		})
		.catch(e => console.log(e))
		.done();
	},
	render: function(){
		return (
			<View style={styles.container}>
				<NavHeader title="关于" onPress={this._back} />
				<ScrollView style={styles.scrollView}>
					<View style={styles.content}>
						<Image style={styles.image} source={require('image!about')} />
						<View>
							<Text style={styles.titleTxt}>关注0-6岁宝宝成长</Text>
						</View>
						<View>
							<Text style={styles.version}>版本</Text>
						</View>
						<TouchableHighlight onLongPress={() => this.alertVersion()} underlayColor="#fcfcf5" delayLongPress={5000}>
							<View>
								<Text style={styles.versionNo}>V1.0.0</Text>
								<Text style={styles.versionNo}>V12200354</Text>
							</View>
						</TouchableHighlight>
					</View>
				</ScrollView>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		backgroundColor: '#fcfcf5',
		flex: 1
	},
	scrollView: {
		backgroundColor: '#fcfcf5'
	},
	content: {
		alignItems: 'center',
		paddingTop: 30
	},
	image: {
		width: 130,
		height: 136,
		marginBottom: 54
	},
	titleTxt: {
		fontSize: 24,
		color: '#48b8a7',
		marginBottom: 70
	},
	version: {
		fontSize: 15,
		color: '#bab9a8'
	},
	versionNo: {
		fontSize: 20,
		color: '#bab9a8'
	}
});

module.exports = AboutMengya;
