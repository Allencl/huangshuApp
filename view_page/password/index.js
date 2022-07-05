import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet, ScrollView, View,Text,   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 
import AsyncStorage from '@react-native-async-storage/async-storage';
import {origin} from '@wis_component/origin';     // 服务地址


class Page extends Component {
  constructor(props) {
    super(props);

    this.state={
      config:{},   // 登录信息


      old:"",  // 旧密码
      new1:"",  // 新密码1
      new2:"", // 新密码2

    }

  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){
    this.getConfig();
  }

  componentDidMount(){
    this.getConfig();
  }

  /**
   * 获取登录信息
   */
  getConfig(){
    let that=this;
    AsyncStorage.getItem("token_config").then((option)=>{
      that.setState({
        config:JSON.parse(option),
      });
    });
  }


  /**
   * 提交
   * @param {} value 
   */
  passHandle=(value)=>{
    const {navigation} = this.props;
    let {config}=this.state;

    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        Toast.fail('必填字段未填！');
      } else{

        let {old,new1,new2}=value;


        // 密码 长度
        if(new1.length>8){
          Toast.fail('密码长度不能超过8个字符！');
          return
        }

        // 旧密码 新密码 重复
        if(old==new1){
            Toast.fail('新密码不能与旧密码一样！');
            return
        }
        if(new1!=new2){
            Toast.fail('两次新密码不一致！');
            return
        }   
        
        
        let _json={
          // id:1,
          // updateUser:1,
          userId: config.user.id,
          oldPassword: String(old).trim(),
          newPassword: String(new1).trim(),
          affirmPassword: String(new2).trim(),
        }

        const _formData = new FormData();
        Object.entries(_json).map(o=>{
          _formData.append(o[0],o[1]);
        });


        WISHttpUtils.post("phoneMain/resetPwd.do",{
          params:{

          },
          headers:{
            'Content-Type':'multipart/form-data',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: _formData          
        },(result) => {
          if( result.success ){
            Toast.success("修改成功！");
            setTimeout(()=>{
              navigation.navigate("Login");
            },300);
          }
        });


      }
    });
  }


  render() {
    let{old,new1,new2,}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {width, height, scale} = Dimensions.get('window');

    return (
      <View style={{height:height,padding:8,backgroundColor:"#fff"}}>

        <View style={{marginTop:22}}>
            <WisInput  
                form={form} 
                name="old"
                type="password"
                requiredSign={true}
                {...getFieldProps('old',{
                    rules:[{required:true }],
                    initialValue:old
                })} 
                error={getFieldError('old')}               
                lableName="旧密码"
                
            />
            <WisInput  
                form={form} 
                name="new1"
                type="password"
                requiredSign={true}
                {...getFieldProps('new1',{
                    rules:[{required:true }],
                    initialValue:new1
                })} 
                error={getFieldError('new1')}               
                lableName="新密码"
                
            />    
            <WisInput  
                form={form} 
                name="new2"
                type="password"
                requiredSign={true}
                {...getFieldProps('new2',{
                    rules:[{required:true }],
                    initialValue:new2
                })} 
                error={getFieldError('new2')}               
                lableName="确认新密码"
                
            />                      
        </View>

        <View style={{marginTop:32,marginBottom:50}}>
          <Button type="primary" onPress={this.passHandle}>提交</Button>
        </View>            
      </View>
    );
  }
}



export default createForm()(Page);

