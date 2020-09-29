
import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, Image, processColor,
    SafeAreaView, ImageBackground, Dimensions, ActivityIndicator, StatusBar 
} from 'react-native';
import { TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';
import { Menu, Button, Avatar } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavContext } from '~/context/NavController';
import { AuthContext } from '~/context/AuthController'
import { color, settings } from '~/config';
import {getMenu} from '~/api/AccountHandler';

const MenuView = props =>{
    const {setState: setMenuState} = React.useContext(NavContext);
    const {state: authState } = React.useContext(AuthContext);

    const navigation = useNavigation();
    const {data} = props;
    
    const getSubArrayByGroup = groupId => data.filter(item =>{
        if(groupId === item.GroupID && item.Parent > 0){
            return true;
        }
    }).map(item => ({ 
        title: item.ItemName,
        icon: item.Icon,
        link: item.Link,
        type: item.ShowType,
        id: item.GroupID
    }))
    const parentData = data.filter(item => {
        if(item.Parent === 0){
            return true
        }
    }).map(item => ({
        title: item.ItemName,
        icon: item.Icon,
        link: item.Link,
        type: item.ShowType,
        id: item.GroupID,
        subItems: getSubArrayByGroup(item.GroupID)
    }))
    authState.userToken  &&  parentData.push({
            title: "Tài khoản",
            icon: "~/assets/ic_user.png",
            link: "",
            type: 1,
            id: 999,
            subItems: [
                {title: "THÔNG TIN TÀI KHOẢN", icon: "", link: "", type: 2, id: 2},
                {title: "ĐỔI MẬT KHẨU", icon: "", link: "", type: 2, id: 2}
            ]
        })

    const [selectedinex, setSelected] = React.useState([]);
    React.useEffect(() => {
       
    }, []);
    _touchMenulink = item => {
        
        const hasChild = item.subItems ? item.subItems.length > 0 : false;
        console.log(authState);

        if(!hasChild && item.type === 1){
            // open webview
            setMenuState({echoURL: item.link, action: 'webview'})
           
        } else if(!hasChild && item.type === 2){
            // navigate to other screen base on ID
            console.log(item.id, item.title);
            if(item.id === 1 && item.title.toUpperCase() === "ĐẶT HÀNG"){
                navigation.navigate('WebviewList')
            }
            if(item.id === 2 && item.title.toUpperCase() === "THÔNG TIN TÀI KHOẢN"){
                navigation.navigate('ProfileUser')
            }
            if(item.id === 2 && item.title.toUpperCase() === "ĐỔI MẬT KHẨU"){
                navigation.navigate('ChangePassword')
            }
            
        } else {
            
        }
    }

    _renderSectionTitle = section => {
        return <View style={{height: 1, backgroundColor: "#555"}}></View>
    };
    _renderHeader = (section, index, isActive) => {
        const hasChild = section.subItems.length > 0;
        const Img_source = () => {
            if(section.icon.includes('~/assets/')){
            
                return <Avatar style={styles.menuIcon} source={require('~/assets/ic_user.png')} resizeMode="contain"  />
            } else {
                return <Avatar style={styles.menuIcon} source={{uri: section.icon}} resizeMode="contain"  /> 
            }
            
        };
        return (
            <TouchableWithoutFeedback style={[styles.menu, (isActive && hasChild) && styles.isActive]} onPress={()=>{
                _touchMenulink(section); 
            }}> 
                {/* <Avatar style={styles.menuIcon} source={img_source} resizeMode="contain"  /> */}
                <Img_source />
                <Text style={[styles.menuText, (isActive && hasChild) && styles.activeMenuText]}>
                    {section.title}
                    
                </Text>
                {
                    hasChild && <Text style={[styles.text, {width: 25}, (isActive && hasChild) && styles.activeMenuText]}>
                        { !(isActive) && <Icon  name='chevron-down' width={32} height={32}  />}
                        { (isActive) && <Icon  name='chevron-up' width={32} height={32}  />}
                    </Text>
                }    
            </TouchableWithoutFeedback>
        );
    };
    _renderContent = section => {
        const { subItems } = section;
        
        return <>
            {subItems.length > 0  ? <View style={styles.Submenu}>
                { subItems.map((item,i) => {
                    return <TouchableOpacity style={styles.submenuItem} key={`${i}`} onPress={()=>_touchMenulink(item)}>
                        <Text style={[styles.menuText,styles.submenuText]}>{item.title}</Text>
                    </TouchableOpacity>
                }) }
            </View> : null} 
        </>
    };
    _updateSections = activeSectionsindex => {
        setSelected(activeSectionsindex);
    };

    return <Accordion
        sections={parentData}
        activeSections={selectedinex}
        renderSectionTitle={_renderSectionTitle}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        // underlayColor="rgba(255, 130, 1, 1)"
        // touchableComponent={TouchableOpacity}
    />
}
export default MenuView;
const styles = StyleSheet.create({

    text: {
        color: '#fff'
    },
    texthl: {
        color: color.primary,
    },
    menu:{
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#333",
        justifyContent: "space-between"
    },
    isActive: {
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    activeMenuText: {
        color: color.primary,
    },
    menuText: {
        color: "#fff",
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 20,
        padding: 15,
        paddingLeft: 5,
        flexGrow: 1
    },
    menuIcon:{
        height: 25,
        width: 40,
        
    },
    Submenu: {
        // backgroundColor: "#232122"
    },
    submenuItem: {
        paddingLeft: 40
    },
    submenuText: {
        textTransform: "none",
        color: "#b7b7b7",
        

    },

});