import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import Map from '../screens/Map';
import Statistics from '../screens/Statistics';
import Advices from "../screens/Advices";
import {StyleSheet} from "react-native";
import NewsFeed from "../screens/NewsFeed";

const BottomTab = createMaterialBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'map';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator
        initialRouteName={INITIAL_ROUTE_NAME}
        barStyle={styles.navigator}
        labeled={false}
    >
      <BottomTab.Screen
        name="map"
        component={Map}
        options={{
          title: 'Karte',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-map" />,
        }}
      />
        <BottomTab.Screen
            name="information"
            component={Advices}
            options={{
                title: 'Informationen',
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-checkmark-circle" />,
            }}
        />
        <BottomTab.Screen
            name="statistics"
            component={Statistics}
            options={{
                title: 'Statistiken',
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-analytics"/>,
            }}
        />
        <BottomTab.Screen
            name="newsFeed"
            component={NewsFeed}
            options={{
                title: 'News vom Robert-Koch-Institut',
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-paper"/>,
            }}
        />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {

        case 'map':
            return 'Live Karte';
        case 'statistics':
            return 'Statistiken';
        case 'information':
            return 'Informationen';
        case 'newsFeed':
            return 'News vom Robert-Koch-Institut';
    }
}

const styles = StyleSheet.create({
    navigator: {
        backgroundColor: '#eeeeee'
    },
});
