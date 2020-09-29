import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, Image, 
    SafeAreaView, ImageBackground, Dimensions, ActivityIndicator, StatusBar 
} from 'react-native';
import { Menu, Button, Avatar } from '@ui-kitten/components';
import {color} from '~/config';

const UserMenuView = props =>{
    const { data } = props
    const { IMGUser, Level,  FirstName, LastName, Wallet, title} = data   
    return (
        
        <View style={styles.container}>
            <Avatar style={styles.userAvata}  source={{uri: IMGUser || ''}} defaultSource={require('~/assets/image-outline.png')} resizeMode="contain" />
            <Text style={styles.userName}>{FirstName} {LastName}</Text>
            <Text style={styles.mtLabel}>
                <Text style={{}}>Số tiền: </Text> 
                <Text style={styles.text}>{Wallet}</Text>
                {' '}|{' '}
                <Text style={{}}>Level: </Text> 
                <Text style={styles.texthl}>{Level}</Text>
            </Text>
            <View style={styles.fillWrap}>
                <View  style={[styles.fill, {width: `${ title }%`}]} />
            </View>
        </View>
    )
}

export default UserMenuView;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 15,
    },
    fillWrap: {
        marginTop: 10,
        width: '100%',
        backgroundColor: 'rgba(255,255,255, 0.1)',
        height: 8,
        borderRadius: 4,
        overflow: "hidden"
    },
    fill: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: color.primary
    },
    userAvata: {
        width: 80,
        height: 80,
        
    },
    userName: {
        color: '#fff',
        fontWeight: "bold",
        paddingVertical: 5,
        fontSize: 18,
    },
    text: {
        color: '#fff'
    },
    texthl: {
        color: color.primary
    },
    mtLabel: {
        color: "#b7b7b7",
        fontWeight: "500"
    }
})