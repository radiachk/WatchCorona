import * as React from 'react';
import {Icon} from 'react-native-elements'

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
      <Icon
          name={props.name}
          size={35}
          type='ionicon'
          color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          iconStyle={{width: 35}}
          />

  );
}
