import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale';

import * as rssParser from 'react-native-rss-parser';
import {connect} from "react-redux";
import {Linking} from "expo";

class NewsFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            items: [],
        }
    }
    componentDidMount(): void {
        return fetch('https://www.rki.de/SiteGlobals/Functions/RSSFeed/RSSGenerator_nCoV.xml')
            .then((response) => response.text())
            .then((responseData) => rssParser.parse(responseData))
            .then((rss) => {
                this.setState({
                    title: rss.title,
                    items: rss.items,
                });
            });
    }


    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.items.map(item => (
                    <ListItem
                        key={item.title}
                        Component={TouchableScale}
                        title={item.title}
                        subtitle={item.description}
                        onPress={() => {
                            if (item.source !== '') {
                                Linking.openURL(item.links[0].url).catch(err => alert("Die URL: " + item.links[0].url + " konnte nicht aufgerufen werden"))
                            }
                        }}
                        bottomDivider
                        chevron={{color: '#00adb5'}}
                        style={styles.listItem}
                    />
                ))}
            </ScrollView>
        );
    }
}

NewsFeed.navigationOptions = {
    header: null,
};

const mapStateToProps = (state) => {
    const { data } = state;
    return { data }
};

export default connect(mapStateToProps)(NewsFeed);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#393e46',
        padding: 10,
    },
    listItem: {
        margin: 2,

    },
});
