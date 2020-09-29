import React, { useState, useRef } from 'react';
import { StyleSheet, View, RefreshControl, Text, SafeAreaView, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Layout, Button, Avatar } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

import {AuthContext} from '~/context/AuthController';
import { NavContext } from '~/context/NavController';

import HeaderApp from '~/components/HeaderNav';
import {webViewRoot, webViewURLs, color} from '~/config';

const WebviewListScreen = props =>{
    const navigation = useNavigation();

    return <ScrollView style={styles.container}>
        <View style={styles.orderPageList}>
            <View style={styles.btnPageorder}>
                <TouchableOpacity style={styles.btnImgWrap} onPress={()=> navigation.navigate('WebviewDetail',
                        {
                            ...webViewURLs['taobao'],
                            title: "TAOBAO",
                        }
                    )} 
                >
                    <Image source={require('~/assets/ic-btn-taobao.png')} style={styles.imgBtnOrder} />
                </TouchableOpacity>
            </View>
            <View style={styles.btnPageorder}>
                <TouchableOpacity style={styles.btnImgWrap} onPress={()=> navigation.navigate('WebviewDetail',
                        {
                            ...webViewURLs['tmall'],
                            title: "TMALL",
                        }
                    )} 
                >
                    <Image source={require('~/assets/ic-btn-tmall.png')} style={styles.imgBtnOrder}  />
                </TouchableOpacity>
            </View>
            <View style={styles.btnPageorder}>
                <TouchableOpacity style={styles.btnImgWrap} onPress={()=> navigation.navigate('WebviewDetail',
                        {
                            ...webViewURLs['1688'],
                            title: "1688",
                        }
                    )} 
                >
                    <Image source={require('~/assets/ic-btn-1688.png')} style={styles.imgBtnOrder}  />
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>
}
export default WebviewListScreen;
const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10
    },
    orderPageList: {

    },
    btnPageorder: {
        padding: 5,
        
    },
    btnImgWrap: {
        aspectRatio: 3.2, 
    },
    imgBtnOrder: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain'
    },
})