import React, {Component} from 'react';
import {FlatList, Keyboard, StyleSheet, Switch, View} from 'react-native';
import {Badge, Icon, ListItem, SearchBar, Text, Tooltip} from 'react-native-elements';
import {connect} from 'react-redux';
import {GradientMask} from "../components/GradientMask";
import {Grid, StackedAreaChart, XAxis, YAxis} from "react-native-svg-charts";
import * as shape from 'd3-shape'
import TouchableScale from 'react-native-touchable-scale';

var moment = require('moment');


class Statistics extends Component {
  constructor(props) {
    super(props);

    this.props.data.regions.sort((a, b) => (b.infected - a.infected));

    this.state = {
        loading: false,
        data: this.props.data.regions,
        selected_region_id: 'world',
        selected_region_name: 'World',
        first_date: moment(),
        chart_data:  [],
        error: null,
        keyboard_visible: false,
        show_world: false
    };

      this.arrayholder = this.props.data.regions;
      this.world_history = {};
      this.chart_colors = ['#de7119', '#e8f044'];
      this.keys = ['deaths_region' ,'cases_region']; // lila, blau, orange, gelb
  }

  toggle_show_world = (value) => {
      if (value === true) {
          this.keys = ['deaths_region' ,'deaths_world', 'cases_region', 'cases_world'];
          this.chart_colors = ['#de7119', '#4d089a', '#e8f044','#dc2ade'];
      } else {
          this.keys = ['deaths_region' ,'cases_region'];
          this.chart_colors = ['#de7119', '#e8f044'];
      }
      this.setState({show_world: value});
  };

  getMaxChartValue() {
      let maximum = 0;

      if (this.state.show_world && this.state.selected_region_id !== 'world') {
          const get_maximum_cases_world = (element) => {
                if (maximum < Number(element.cases_world))
                    maximum = Number(element.cases_world)
          };
          this.state.chart_data.forEach(get_maximum_cases_world);
      } else {
          const get_maximum_cases_region = (element) => {
              if (maximum < Number(element.cases_region))
                  maximum = Number(element.cases_region)
          };
          this.state.chart_data.forEach(get_maximum_cases_region);
      }
      return [0, maximum]
  }

  componentDidMount(){
      this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this._keyboardDidShow.bind(this),
      );
      this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this._keyboardDidHide.bind(this),
      );
      this.get_chart_data('world');
  }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        this.setState({ keyboard_visible: true });
    }

    _keyboardDidHide() {
        this.setState({ keyboard_visible: false });
    }

    get_chart_data = (geo_id) => {
        this.setState({ selected_region_id: geo_id });
        let region_name = this.state.data.filter(function (element) {
            return element.key === geo_id;
        })[0].region;
        this.setState({ selected_region_name: region_name});
        this.setState({ loading: true });
        fetch('https://coronawatch-firebase.firebaseio.com/history/.json')
            .then(response => response.json())
            .then(responseJson => responseJson)
            .then(json => {
                var history_json = json[Object.keys(json)[0]][geo_id];
                var history = [];

                const add_to_history = (date) => {
                    history.push({
                        date: date,
                        cases_region: history_json[date].cases,
                        deaths_region: history_json[date].deaths,
                        cases_world: this.world_history[date].cases,
                        deaths_world: this.world_history[date].deaths
                    })
                };
                const add_to_world_history = (date) => {
                    this.world_history[date] = {
                        cases: history_json[date].cases,
                        deaths: history_json[date].deaths,
                    };
                    history.push({
                        date: date,
                        cases_region: history_json[date].cases,
                        deaths_region: history_json[date].deaths,
                        cases_world: 0,
                        deaths_world: 0,
                    })
                };
                if (geo_id === 'world') {
                    Object.keys(history_json).forEach(add_to_world_history);
                }
                else {
                    Object.keys(history_json).forEach(add_to_history);
                }
                history.sort(function(a, b) {
                    return moment(a.date, 'YYYY-MM-DD') - moment(b.date, 'YYYY-MM-DD')
                });

                this.setState({first_date: moment(history[0].date, 'YYYY-MM-DD')});
                this.setState(previousState => {
                        previousState.chart_data = history;
                        return previousState;
                    }
                );
            })
            .catch((error) => console.warn(error)
            ).finally(() => this.setState({ loading: false }));
    };

  renderSeparator = () => {
    return (
        <View
            style={{
                height: 1,
                backgroundColor: '#CED0CE',
                marginLeft: 5,
                marginRight: 5,
            }}
        />
    );
  };

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

      const newData = this.arrayholder.filter(item => {
          const itemData = item.region.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      this.setState({
          data: newData,
      });
  };

  renderHeader = () => {
    return (
        <SearchBar
            placeholder="Land / Region"
            containerStyle={{backgroundColor: '#222831'}}
            round
            onChangeText={text => this.searchFilterFunction(text)}
            autoCorrect={false}
            value={this.state.value}
        />
    );
  };


    render() {
        return (
            <View style={{ flex: 1}}>
                {(this.state.keyboard_visible === false) ? (
                        <View style={styles.chartContainer}>
                            <View style={styles.chartWidthContainer}>
                                <GradientMask/>
                                <View style={styles.chartHeader}>
                                    <Tooltip
                                        height={100}
                                        width={250}
                                        backgroundColor={'#393e46'}
                                        popover={
                                            <View>
                                                <Text style={styles.chartText}>Gelb: Infizierte in Region {'\n'}
                                                Orange: Tote in Region {'\n'}
                                                Pink: Infizierte weltweit {'\n'}
                                                LILA: Tote weltweit {'\n'}
                                                Schalter: Weltweite Daten anzeigen {'\n'}{'\n'}
                                                (Die Werte sind als Personen pro Tag zu lesen)</Text>
                                            </View>
                                        }
                                    >
                                        <Icon
                                            name='info-circle'
                                            type='font-awesome'
                                            color='#eeeeee'
                                        />
                                    </Tooltip>
                                    <View>
                                        <Text style={styles.regionName}>
                                            {this.state.selected_region_name}
                                        </Text>
                                    </View>
                                    <View style={styles.switchRow}>
                                        <Switch
                                            onValueChange={this.toggle_show_world}
                                            value = {this.state.show_world}
                                        />
                                        <Text style={{marginRight: 5, color: '#eeeeee'}}>Welt</Text>
                                    </View>

                                </View>
                                <View style={styles.chartAxisContainer}>
                                    <GradientMask/>
                                    <YAxis
                                        data={this.getMaxChartValue()}
                                        contentInset={{ top: 20, bottom: 20 }}
                                        formatLabel={(value, index) => {
                                            if (value >= 1000) {
                                                return (value / 1000).toLocaleString() + 'k';
                                            } else {
                                                return value.toLocaleString();
                                            }
                                        }}
                                        svg={{
                                            fill: '#eeeeee',
                                            fontSize: 10,
                                        }}
                                    />
                                    <StackedAreaChart
                                        style={styles.chart}
                                        data={this.state.chart_data}
                                        keys={this.keys}
                                        colors={this.chart_colors}
                                        showGrid={false}
                                        animate={true}
                                        animationDuration={1000}
                                        curve={shape.curveNatural}
                                    >
                                    </StackedAreaChart>
                                </View>

                                <XAxis
                                    style={{ marginHorizontal: -10 }}
                                    data={this.state.chart_data}
                                    formatLabel={(value, index) => {
                                        let scale = Math.floor(this.state.chart_data.length / 6);
                                        if (index % scale === 0) {
                                            return moment(this.state.first_date).add(index, 'days').format('DD.MM');
                                        } else {
                                            return null;
                                        }
                                    }
                                    }
                                    contentInset={{ left: 40, right: 15 }}
                                    svg={{
                                        fontSize: 10,
                                        fill: '#eeeeee'
                                    }}
                                    />
                            </View>
                        </View>
                ): (<View/>)}
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <TouchableScale>
                            <ListItem
                                title={item.region}
                                rightElement={
                                    <View style={{flexDirection: 'row'}}>
                                        <Badge value={item.infected} badgeStyle={{backgroundColor: '#00adb5'}}/>
                                        <Badge value={item.deaths} badgeStyle={{backgroundColor: '#393e46'}}/>
                                    </View>
                                }

                                onPress={() => {
                                    this.get_chart_data(item.key)
                                }}
                                active={(item.key === this.state.selected_region_id)}
                                style={((item.key === this.state.selected_region_id)) ? styles.listItemActive : styles.listItemInactive}
                                chevron={{color: '#00adb5'}}
                            />
                        </TouchableScale>
                    )}
                    extraData={this.state.selected_region_id}
                    keyExtractor={item => item.key}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                    style={styles.searchableList}
                />
        </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { data } = state;
  return { data }
};

export default connect(mapStateToProps)(Statistics);

const styles = StyleSheet.create({
    chartContainer: {
        padding: 10,
        backgroundColor: '#393e46',
    },
    chartWidthContainer: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#00adb5",
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        zIndex: 10,
        alignItems: 'center',
    },
    chartAxisContainer: {
        flexDirection: 'row',
    },
    switchRow: {
        zIndex: 20,
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    chart: {
        height: 181,
        paddingVertical: 15,
        flex: 1,
    },
    chartText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 10,
        color: '#eeeeee'
    },
    regionName: {
        fontSize: 12,
        color: '#eeeeee',
        marginLeft: '25%',
        alignSelf: 'center'
    },
    searchableList: {
        backgroundColor: '#393e46',
        paddingLeft: 7,
        paddingRight: 7,
    },
    listItemActive: {
        borderWidth: 1.5,
        borderColor: '#00adb5',
        borderRadius: 3,
    },
    listItemInactive: {
        paddingLeft: 3,
        paddingRight: 3,
    },
});
