import React, { Component} from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { color } from '~/config';
const AuthLoadingScreen = props => {

    return (
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color={`${color.primary}`} />
        </View>
    );

}
export default AuthLoadingScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
})