/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * 
 */
import 'react-native-gesture-handler';
import React, { Component, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar, KeyboardAvoidingView, Platform
} from 'react-native';
import AppNavigator, { navigationRef }  from "~/navigators/AppNavigator";
import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { ApplicationProvider as ProviderKitten} from '@ui-kitten/components';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';
import customMapping from "~/app_mapping.json";
import OneSignal from 'react-native-onesignal';
import { useNavigation, useRoute , useIsFocused } from '@react-navigation/native';
import { settings } from '~/config';
const defaultAPP = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <Header />
                    {global.HermesInternal == null ? null : (
                        <View style={styles.engine}>
                            <Text style={styles.footer}>Engine: Hermes</Text>
                        </View>
                    )}
                    <View style={styles.body}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Step One</Text>
                            <Text style={styles.sectionDescription}>
                                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>See Your Changes</Text>
                            <Text style={styles.sectionDescription}>
                                <ReloadInstructions />
                            </Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Debug</Text>
                            <Text style={styles.sectionDescription}>
                                <DebugInstructions />
                            </Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Learn More</Text>
                            <Text style={styles.sectionDescription}>
                                Read the docs to discover what to do next:
              </Text>
                        </View>
                        <LearnMoreLinks />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});
const AppContainer = () => {
    
    // constructor(props) {
    //     super(props);
        
    // }
    // componentWillUnmount() {
    //     OneSignal.removeEventListener('received', this._onReceived);
    //     OneSignal.removeEventListener('opened', this._onOpened);
    //     OneSignal.removeEventListener('ids', this._onIds);
    // }
   
    useEffect(() => {
        OneSignal.init(settings.oneSignalKey);
        OneSignal.addEventListener('received', _onReceived);
        OneSignal.addEventListener('opened', _onOpened);
        OneSignal.addEventListener('ids', _onIds);
    }, []);

    function _onReceived(notification) {
        console.log("Notification received: ", notification);
    }

    function _onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        if(openResult.notification.payload.additionalData){
            const newURL = openResult.notification.payload.additionalData.url
            // console.log( );
            navigationRef.current?.navigate('DashboardDetail', {targetUrl: newURL})
           
            // navigation.navigate('DashboardDetail', {targetUrl: newURL})
        }
    }
    function _onIds(device) {
        console.log('Device info: ', device);
        let {pushToken , userId} = device;
        settings.pushToken = pushToken;
        settings.userId = userId;
    }
  
    return (
        <>
        <StatusBar barStyle="light-content" />
        <ProviderKitten mapping={mapping} 
            customMapping={customMapping} 
            theme={lightTheme} 
        > 
            <AppNavigator />
        </ProviderKitten>
    </>
    )   
}
export default AppContainer;

