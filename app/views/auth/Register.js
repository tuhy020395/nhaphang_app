import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    ImageBackground,
    RefreshControl,
    SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import { getRegister, getLogin  } from '~/api/AccountHandler';
import {AuthContext} from '~/context/AuthController';
import Header from './AuthHeader';
import {color} from '~/config';


const useInputState = (initialValue = '') => {
    const [value, setValue] = React.useState(initialValue);
    return { value, onChangeText: setValue };
};
const Register = props =>{
    const {signIn, state: authState } = React.useContext(AuthContext);


    const [isLoading, setLoading] = React.useState(false);
    const [refreshing, setrefreshing] = React.useState(false);
    const [stateForm, setstateForm] = React.useState('');

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
        }
    }, {
        UserName: '',
        FirstName: '',
        LastName: '',
        Address: '',
        Phone: '',
        Email: '',
        BirthDay: '',
        Gender: 1,
        Password: '',
        ConfirmPassword: '',
    })
    const _onChangeText = (key, value) =>{
        console.log(key, ':' ,value);
        dispatchData({type: key, value: value})
    }
    const _onEndEditing = e => {
        
    }
    const onRefresh = async () =>{
        setrefreshing(true);
        await getData()
        setrefreshing(false);
    }
    const getData = async () => {
        try {
            
           
            
        } catch (error) {
            Alert.alert('Thông Báo', error)
        }
        
    }
    const _registerAsync = async () => {
        for (const key in stateData) {
            if (stateData.hasOwnProperty(key)) {
                const element = stateData[key];
                if(element === ''){
                    if('UserName FirstName LastName Phone Email Password Address'.includes(key)){
                        return Alert.alert('Thông báo', key + ' không được trống');
                    }
                    
                }
            }
        }
        if(stateData.Password !== stateData.ConfirmPassword){
            return Alert.alert('Thông báo', "Mật khẩu xác nhận chưa chính xác");
        }
        try {
            const res = await getRegister(stateData);
            console.log(res);
            if(res.Code === "102"){
                try {
                    const resLogin = await getLogin({username: stateData.UserName, password: stateData.Password});
                    if(resLogin.Code === '102'){
                   
                            signIn({ ...resLogin.Account, ...{Key: resLogin.Key} }); // dispath to app stack
                       
                        
                    } else {
                        //logih fail
                        Alert.alert('Thông Báo', "Đăng nhập thất bại, vui lòng kiểm tra lại tên đăng nhập và mật khẩu");
                    }
                } catch (error) {
                    
                }

            } else if(res.Code === "101"){
                Alert.alert('Thông Báo', res.Message)
            }
        } catch (error) {
            Alert.alert('Thông Báo', error)
        }
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
    
        <Header />
        <View style={styles.container}>
            <ScrollView
                refreshControl={ 
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> 
                } 
            >
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <Image
                        resizeMode="contain"
                        source={require('~/assets/ic_logo.png')}
                        style={{ width: '70%', height: 100 }}
                    />
                </View>
                <View style={ styles.formWrap } >
                    <View style={ styles.frow }>
                        <View style={styles.hasLbInline}>
                            <Text style={[styles.inputLbInline,{fontSize: 16}]}>USERNAME:</Text>
                            <TextInput 
                                style={[styles.input, {flexGrow: 1}]}
                                placeholderTextColor="#888" 
                                placeholder="Tên đăng nhập"
                                // value={''}
                                onChangeText={ value => _onChangeText('UserName', value) }
                                onEndEditing={_onEndEditing}
                                editable={!isLoading}
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
                                // value={''}
                                onChangeText={ value => _onChangeText('LastName', value) }
                                onEndEditing={_onEndEditing}
                                editable={!isLoading}
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
                                // value={''}
                                onChangeText={ value => _onChangeText('FirstName', value) }
                                onEndEditing={_onEndEditing}
                                editable={!isLoading}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                    <View style={ styles.frow }>
                        <View style={styles.hasLbInline}>
                            <Text style={[styles.inputLbInline,{fontSize: 16}]}>Địa chỉ:</Text>
                            <TextInput 
                                style={[styles.input, {flexGrow: 1}]}
                                placeholderTextColor="#888" 
                                placeholder="Địa chỉ"
                                // value={''}
                                onChangeText={ value => _onChangeText('Address', value) }
                                editable={!isLoading} 
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
                                // value={''}
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
                                // value={''}
                                onChangeText={ value => _onChangeText('Email', value) }
                                onEndEditing={_onEndEditing}
                                editable={!isLoading}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                    <View style={ styles.frow }>
                        <View style={styles.hasLbInline}>
                            <Text style={[styles.inputLbInline,{fontSize: 16}]}>Mật khẩu:</Text>
                            <TextInput 
                                style={[styles.input, {flexGrow: 1}]}
                                placeholderTextColor="#888" 
                                placeholder="Mật khẩu"
                                // value={''}
                                onChangeText={ value => _onChangeText('Password', value) }
                                onEndEditing={_onEndEditing}
                                editable={!isLoading}
                                autoCapitalize="none"
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                    <View style={ styles.frow }>
                        <View style={styles.hasLbInline}>
                            <Text style={[styles.inputLbInline,{fontSize: 16}]}>Xác nhận MK:</Text>
                            <TextInput 
                                style={[styles.input, {flexGrow: 1}]}
                                placeholderTextColor="#888" 
                                placeholder="Xác nhận mật khẩu"
                                // value={''}
                                onChangeText={ value => _onChangeText('ConfirmPassword', value) }
                                onEndEditing={_onEndEditing}
                                editable={!isLoading}
                                autoCapitalize="none"
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                    <View style={[styles.frow, {alignItems: "center"}]}>
                        <TouchableOpacity
                            style={{ width: '100%'}}
                            onPress={_registerAsync}
                        >
                            {isLoading ? <View style={[styles.btn, styles.btnPrimary]} >
                                <ActivityIndicator color="#fff" />
                            </View> : <Text style={[styles.btn, styles.btnPrimary]}>
                                ĐĂNG KÝ
                            </Text>}
                        </TouchableOpacity>
                        
                    </View>
                </View>
                

            </ScrollView>
        </View>
        
    </KeyboardAvoidingView>
    </SafeAreaView></View>
}
export default Register;

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