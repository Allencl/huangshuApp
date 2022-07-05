import React, { Component } from 'react';
import {TextInput,TouchableOpacity,StyleSheet,Text, View, NativeModules } from 'react-native';
import { Icon,InputItem,WingBlank,Modal, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';

class InputComponent extends Component {
    constructor(props) {
        super(props);

        this.props.onRef && this.props.onRef(this);

        this.state={
            searchValue:'',   // 查询值
            show:true
        };
    }

    /**
     * 聚焦
     * @param {} text 
    */
    focusHandle(){
        // setTimeout(()=>{
        //     if(!this.textInput.isFocused()){
        //         this.textInput.focus();
        //     }
        // },10);
    }


    /**
     * 设置值
     * @param {} text 
     */
    setValue(key,callBack){
        this.setState({
            searchValue:key
        },()=>{
            callBack && callBack();
        });
    }

    /**
     * 发请求
     * @returns 
     */
     queryHandle(text){
        let {onQuery} = this.props;

        onQuery && onQuery(text);

     }

    render() {
        let that=this;
        let {searchValue}=this.state;
        let {show}=this.state;
        let {onSearch} = this.props;


        return (
            <View>
          <View style={styles.searchContainer}>
            <View style={styles.searchContainerInput}>
                { show ?
                    <TextInput
                        // ref={(input) =>{
                        //     this.textInput=input;
                        //     if(input){
                        //         input.focus();
                        //     }
                        // }}
                        style={styles.searchContainerTextInput}
                        value={searchValue} 
                        placeholder="SN查询..."
                        onChangeText={(text)=>{
                            that.setState({searchValue:text});

                            // sn 是22位的编码
                            if(text.length==22){
                                that.queryHandle(text);
                            }
                        }}
                    />
                    :
                    <View></View>
                }

            </View>
            
            <TouchableOpacity
                onPress={() =>{
                    that.setState({
                        show:false,
                        searchValue:''
                    },()=>{
                        that.setState({show:true})  
                    });  
                }}
            >         
                <View style={styles.searchContainerIconClear}>   
                    <Icon style={{fontSize:26}} name="clear" size="md" color="#1890ff" />
                </View>
            </TouchableOpacity>
            
            
            <TouchableOpacity
                onPress={() =>{
                    onSearch && onSearch(that.state.searchValue);
                }}
            >
                <View style={styles.searchContainerIcon}>
                    <Icon style={{fontSize:30}} name="search" size="md" color="#1890ff" />
                </View>
            </TouchableOpacity>

          </View> 
            </View>
        );
    }
}


const styles=StyleSheet.create({
    searchContainer:{
        flexDirection: "row",
        paddingTop:15,
        borderBottomWidth:1,
        borderColor:"#e0e2e5",
        marginLeft:12,
        marginRight:12,
    },
    searchContainerInput:{
        flex:7,
    },
    searchContainerTextInput:{
        height:36
    },
    searchContainerIcon:{
        flex:2,
        paddingLeft:6,
        paddingRight:6,
    },
    searchContainerIconClear:{
        flex:2,
        paddingLeft:6,
        paddingRight:6,
    }
});


export default InputComponent;
