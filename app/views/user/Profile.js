import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    ImageBackground,
    RefreshControl,
    SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Layout, Button, Avatar } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';

import {AuthContext} from '~/context/AuthController';
import { NavContext } from '~/context/NavController';
import {color} from '~/config';
import { getAppMeta } from '~/api/AccountHandler'
import Icon from 'react-native-vector-icons/FontAwesome';
const Profile = props => {
    const {signOut, state: authState } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();

    const [isLoading, setLoading] = React.useState(false);
    const [refreshing, setrefreshing] = React.useState(false);

    const [stateData, dispatchData] = React.useReducer((prevState, action) => {
        
        switch (action.type) {
            case 'FirstName':
                return {
                    ...prevState,
                    FirstName: action.value
                };
            case 'LastName':
                return {
                    ...prevState,
                    LastName: action.value
                };
            case 'Address':
                return {
                    ...prevState,
                    Address: action.value
                };
            case 'Phone':
                return{
                    ...prevState,
                    Phone: action.value
                };
            case 'Email':
                return{
                    ...prevState,
                    Email: action.value
                };
            case 'BirthDay':
                return{
                    ...prevState,
                    BirthDay: action.value
                };
            case 'Gender':
                return{
                    ...prevState,
                    Gender: action.value
                };
            case 'UserName':
                return{
                    ...prevState,
                    UserName: action.value
                };
            case 'Password':
                return{
                    ...prevState,
                    Password: action.value
                };
            case 'ConfirmPassword':
                return{
                    ...prevState,
                    ConfirmPassword: action.value
                };
            case 'all': 
                return{
                    ...prevState,
                    ...action.value
                }
        }
    }, {
        UserName: '',
        FirstName: '',
        LastName: '',
        // Address: '',
        Phone: '',
        Email: '',
        // BirthDay: '',
        // Gender: 1,
        Password: '',
        ConfirmPassword: '',
    })
    React.useEffect(() => {
        getData();
    },[])
    const _onChangeText = (key, value) =>{
        console.log(key, ':' ,value);
        dispatchData({type: key, value: value})
    }

    const onRefresh = async () =>{
        setrefreshing(true);
        await getData()
        setrefreshing(false);
    }
    const getData = async () => {
        setLoading(true);
        try {
            const res = await getAppMeta();
            console.log('Profile screen data:', res);
            if(res.Code === "102"){
                dispatchData({type: 'all', value: res.Info})
                
            } else if(res.Code === "101"){
                
            } else {
                Alert.alert('Thông Báo', res)
            }

        } catch (error) {
            Alert.alert('Thông Báo', error)
        }
        setLoading(false);
    }

    
    return <View style={styles.container}>
            <ImageBackground
                imageStyle={{ resizeMode: 'cover' }}
                source={require('~/assets/ic_login_bg.png')}
                style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}
            />
        <SafeAreaView style={styles.container}>
            
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{flexGrow: 1}} keyboardVerticalOffset={80}
            >  

            <View style={styles.container}>
                <ScrollView
                    refreshControl={ 
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> 
                    } 
                >
                    
                    <View style={ styles.formWrap } >
                        <View style={[ styles.frow, { alignItems: 'center', width: '100%' }]}>
                            <Image
                                resizeMode="contain"
                                source={require('~/assets/ic_logo.png')}
                                style={{ width: 150, height: 100 }}
                            />
                        </View>
                        <View style={ styles.frow }>
                            <View style={styles.hasLbInline}>
                                <Text style={[styles.inputLbInline,{fontSize: 16}]}>USERNAME:</Text>
                                <TextInput 
                                    style={[styles.input, {flexGrow: 1}]}
                                    placeholderTextColor="#888" 
                                    placeholder="Tên đăng nhập"
                                    value={stateData.Username}
                                    onChangeText={ value => _onChangeText('UserName', value) }
                                   
                                    editable={false}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        <View style={ styles.frow }>
                            <View style={styles.hasLbInline}>
                                <Text style={[styles.inputLbInline,{fontSize: 16}]}>Tên:</Text>
                                <TextInput 
                                    style={[styles.input, {flexGrow: 1}]}
                                    placeholderTextColor="#888" 
                                    placeholder="Tên"
                                    value={stateData.LastName}
                                    onChangeText={ value => _onChangeText('LastName', value) }
                                    
                                    editable={false}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        <View style={ styles.frow }>
                            <View style={styles.hasLbInline}>
                                <Text style={[styles.inputLbInline,{fontSize: 16}]}>Họ:</Text>
                                <TextInput 
                                    style={[styles.input, {flexGrow: 1}]}
                                    placeholderTextColor="#888" 
                                    placeholder="Họ"
                                    value={stateData.FirstName}
                                    onChangeText={ value => _onChangeText('FirstName', value) }
                                   
                                    editable={false}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        <View style={ styles.frow }>
                            <View style={styles.hasLbInline}>
                                <Text style={[styles.inputLbInline,{fontSize: 16}]}>Điện thoại:</Text>
                                <TextInput 
                                    style={[styles.input, {flexGrow: 1}]}
                                    placeholderTextColor="#888" 
                                    placeholder="Số điện thoại"
                                    value={stateData.Phone}
                                    keyboardType="phone-pad"
                                    onChangeText={ value => _onChangeText('Phone', value) }
                                    editable={!isLoading} 
                                />
                            </View>
                        </View>
                        <View style={ styles.frow }>
                            <View style={styles.hasLbInline}>
                                <Text style={[styles.inputLbInline,{fontSize: 16}]}>Email:</Text>
                                <TextInput 
                                    style={[styles.input, {flexGrow: 1}]}
                                    placeholderTextColor="#888" 
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    value={stateData.Email}
                                    onChangeText={ value => _onChangeText('Email', value) }
                                    editable={false}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        <View style={ styles.frow }>
                            <TouchableOpacity style={[styles.hasLbInline, {justifyContent: "space-between", flexDirection: "row", alignItems: "center", width: "100%"}]}
                                onPress={()=> navigation.navigate('ChangePassword')}
                            >
                                
                                <Text style={[styles.inputLbInline,{fontSize: 16}]}>Đổi mật khẩu </Text>
                                <Text style={[styles.input, {}]}> <Icon  name='angle-right' size={18}  /> </Text>
                                
                            </TouchableOpacity>
                        </View>
                      
                    </View>
                    

                </ScrollView>
            </View>
            
        </KeyboardAvoidingView>
        </SafeAreaView>
    </View>
}
export default Profile;

const useInputState = (initialValue = '') => {
    const [value, setValue] = React.useState(initialValue);
    return { value, onChangeText: setValue };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    formWrap: {
        alignItems: "stretch",
        padding: 15,
        backgroundColor: "transparent",
        marginTop: 30,
        marginTop: 10,
        borderRadius: 30,

    },
    frow: {
        marginBottom: 10,
        // backgroundColor: 'blue'
    },
    input: {
        
        backgroundColor: '#f6f6f6',
        color: '#000',
        fontSize: 16,
        paddingVertical: 15,
        paddingHorizontal: 15,
        lineHeight: 20,
        paddingLeft: 5
    },
    btn:{
        textAlign: "center",
        color: color.second,
        fontSize: 16,
        lineHeight: 20,
        padding: 15,
        fontWeight: "bold"
    },
    btnPrimary: {
        backgroundColor: color.primary,
        color: '#fff',
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    hasLbInline: {
        backgroundColor: '#f6f6f6',
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
    },
    inputLbInline: {
        width: 105
    },
    invalidTxt: {
        color: 'red'
    }
});