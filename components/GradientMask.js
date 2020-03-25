import React from 'react';
import {Defs, LinearGradient, Rect, Stop, Svg} from 'react-native-svg';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const GradientMask: React.FunctionComponent = () => (
    <Wrapper style={{zIndex: 10}}>
        <Svg height="100%" width="100%">
            <Defs>
                <LinearGradient id="grad" x1="50%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="transparent" stopOpacity="0.01" />
                    <Stop offset="25%" stopColor="white" stopOpacity="0.05" />
                    <Stop offset="100%" stopColor="transparent" stopOpacity="0.01" />
                </LinearGradient>
            </Defs>

            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
    </Wrapper>
);
