import React, { Component, useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Image,
    ImageBackground,
    SafeAreaView, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from '~/config';

const header = props => {
    const navigation = useNavigation();
    const route = useRoute();
    const {isRoot} = route.params || true ;
    return <View style={[styles.header]}>
        <View style={[styles.headerLeft]}>
        {<TouchableOpacity
                onPress={ () => navigation.goBack() }
            >
                <View style={styles.backbtn}>
                    <Text style={styles.btnTxt}>
                        {!isRoot &&  <Icon name="angle-left" size={30}  />}
                        {!!isRoot && <Icon name="angle-left" size={30}  />}
                    </Text>
                    <Text style={[styles.btnTxt, { paddingTop: 3, paddingLeft: 3}]}>
                        {!isRoot && 'Trở lại'}
                        {!!isRoot && 'Trở lại'}
                    </Text>
                </View>
            </TouchableOpacity>}
        </View>
    </View>
} 
export default header;

const styles = StyleSheet.create({
    header: {
        backgroundColor: "transparent",
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: 50
    },
    backbtn: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "blue",
        paddingVertical: 10
    },
    btnTxt: {
        fontSize: 16,
        paddingHorizontal: 5,
        color: color.primary,
    }

});

