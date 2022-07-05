import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN,WisBluetooth} from '@wis_component/ul';
import {WisFormPhoto} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址


// 屏幕绑定
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={

      departmentList:[],   // 事部
      productionList:[],   // 产线
      cardList:[],  // 台车

      cards:"",   // 台车组
      unit:"",   // 部品
      message:"",   // 屏幕信息

    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){
    this.initHanlde();  // 
  }

  componentDidMount(){
    let that=this;

    this.initHanlde();  // 


    // 监听扫码枪
    this.honeyWell=DeviceEventEmitter.addListener('globalEmitter_honeyWell',function(key=""){

      // 判断设备
      if( !(/^\d{2}\.\d{2}\.\d{2}\.\d{2}$/.test(key)) ){
        Toast.fail('错误设备编号！',2);
        return
      }
      

      let _key=key;
      if(key&&key.length>11){
        _key =(key.split("-")[0]).slice(3);
      }

      // console.log(_key)
      that.props.form.setFieldsValue({
        message:_key,
      });

    });

  }


  componentWillUnmount(){
    this.honeyWell.remove();
  }

  /**
   * 
   * @param {*} list 
   */
  initHanlde(){
      let that=this;

      WISHttpUtils.post("corporation/list.do",{
        params:{
          "queryCondition[enabled]":"Y"
        },
        // hideLoading:true
      },(result) => {
        let {rows=[]}=result;

        // console.log(result);
        that.setState({
          departmentList:rows,
        });
      });      
  }

  /**
    * 事部 切换
  */
  departmentChange=(list)=>{
    // console.log(list)
    let that=this;

    this.props.form.setFieldsValue({
      "production":[],
      "card":[],
      "cards":"",
      "unit":""
    });

    this.setState({
      productionList:[],
      cardList:[]  
    });


    WISHttpUtils.post("tmScreenBinding/getBatchLineList.do",{
      params:{
        "corporationId":list[0]["id"]
      },
      // hideLoading:true
    },(result) => {
      let {data=[]}=result;

      // console.log(result);
      that.setState({
        productionList: data.map(o=>Object.assign({},o,{name:o.lineName,id:o.lineCode})),
      });
    });  


  }

  /**
    * 产线 切换
  */
  productionChange(list){
    let that=this;
    let _id=this.props.form.getFieldProps('department').value;  // 事部ID


    this.props.form.setFieldsValue({
      "card":[],
      "cards":"",
      "unit":""
    });

    this.setState({
      cardList:[]  
    });

    WISHttpUtils.post("tmScreenBinding/getBatchTrolleyList.do",{
      params:{
        "corporationId":_id[0]["id"],
        "lineCode":list[0]["lineCode"]
      },
      // hideLoading:true
    },(result) => {
      let {data=[]}=result;

      // console.log(result);
      that.setState({
        cardList: data.map((o,i)=>Object.assign({},o,{name:`${o.trolleyName}[${o.trolleyCode}]`,id:i+1})),
      });
    });  


  }


  /**
    * 台车 切换
  */
  cardChange(list){
    // console.log(list)

    this.props.form.setFieldsValue({
      cards:list[0]["trolleyGroup"],
    });
    this.props.form.setFieldsValue({
      unit:list[0]["trolleyName"],
    });

  }


  /**
   * 提交
   */
  passHandle=(value)=>{
    const that=this;
    const {navigation} = this.props;
    let {initData={},config,SNValue,imageList,remark}=this.state;
    let{code,name,no}=this.state;


    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！',2);
        // console.log(error)


        if(!value["department"]["length"]){
          Toast.fail('事部未选择！',2);
          return
        }

        if(!value["production"]["length"]){
          Toast.fail('产线未选择！',2);
          return
        }

        if(!value["card"]["length"]){
          Toast.fail('台车未选择！',2);
          return
        }

        if(!value["cards"]){
          Toast.fail('台车组不能为空！',2);
          return
        }

        if(!value["unit"]){
          Toast.fail('台车名称不能为空！',2);
          return
        }
        
        if(!value["message"]){
          Toast.fail('屏幕编号不能为空！',2);
          return
        }



      } else{
        let _message=value["message"].trim();

        let _json={
          "screenNo":_message,
          "corporationId":value["department"][0]["id"],
          "lineCode":value["production"][0]["lineCode"],
          "lineName":value["production"][0]["lineName"],
          "trolleyCode":value["card"][0]["trolleyCode"],
          "trolleyName":value["card"][0]["trolleyName"],
          "trolleyGroup":value["card"][0]["trolleyGroup"],
          "num":value["card"][0]["num"]
        }

        // console.log(_json)
        WISHttpUtils.post("tmScreenBinding/binding.do",{
          params:_json,
          // hideLoading:true
        },(result) => {
          let {data,success}=result;

          // console.log( result )
          if(!data){
            Toast.offline('数据为空！',2);
          }
          
          if(success && data){
            Toast.success("提交成功！",2);
            that.saveImage(_message,data);
          }
        }); 

      }
  });
  }  


  /**
   * 
   * @returns 
   */
  saveImage=(_message,data)=>{
    let _dress=_message.replace(/\./g, ":");

    this.bluetoothRef.lanyaHandle(
      _dress,
      [data]
    )
  }


  /**
   * 完成
   * @returns 
   */
   onBegin=()=>{
    // Toast.offline('开始！',2);
   }



  render() {
    let that=this;
    let {departmentList,productionList,cardList} = this.state;
    let{cards,message,unit}=this.state;

    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>

        <WisBluetooth 
          showModel={true}
          onRef={(ref)=>{this.bluetoothRef=ref}}
          onBegin={()=>{ this.onBegin() }}
        />
       
        <View style={{marginTop:22}}>

          <WisSelect 
            form={form} 
            name="department"
            requiredSign={true}
            {...getFieldProps('department',{
              rules:[{required:true }],
              initialValue:[]
            })} 
            error={getFieldError('department')}  
            title="事部（单选）"             
            lableName="事部"
            textFormat={o=>o.code}
            labelFormat={o=>o.code}
            onChangeValue={(_list)=>{
              that.departmentChange(_list);
            }}
            data={departmentList}
          />

          <WisSelect 
            form={form} 
            name="production"
            requiredSign={true}
            {...getFieldProps('production',{
              rules:[{required:true }],
              initialValue:[]
            })} 
            error={getFieldError('production')}  
            title="产线（单选）"             
            lableName="产线"
            textFormat={o=>o.name}
            labelFormat={o=>o.name}
            onChangeValue={(_list)=>{
              that.productionChange(_list);
            }}
            data={productionList}
          />


          <WisSelect 
            form={form} 
            name="card"
            requiredSign={true}
            {...getFieldProps('card',{
              rules:[{required:true }],
              initialValue:[]
            })} 
            error={getFieldError('card')}  
            title="台车（单选）"             
            lableName="台车"
            textFormat={o=>o.name}
            labelFormat={o=>o.name}
            onChangeValue={(_list)=>{
              that.cardChange(_list);
            }}
            data={cardList}
          />


          <WisInput  
            form={form} 
            name="cards"
            requiredSign={true}
            {...getFieldProps('cards',{
              rules:[{required:true }],
              initialValue:cards
            })} 
            error={getFieldError('cards')}               
            lableName="台车组"
            
          />



          <WisInput     
            form={form} 
            name="unit"               
            requiredSign={true}
            {...getFieldProps('unit',{
              rules:[{required:true }],
              initialValue:unit
            })} 
            error={getFieldError('unit')}               
            lableName="台车名称"
          />  

          <WisInput  
            form={form} 
            name="message"               
            requiredSign={true}
            {...getFieldProps('message',{
              rules:[{required:true }],
              initialValue:message
            })} 
            error={getFieldError('message')}               
            lableName="屏幕编号"
            disabled
            
          />  


        </View>


        <View style={{marginTop:32,marginBottom:50}}>
          <Button type="primary" onPress={this.passHandle}>提交</Button>          
        </View>      
                
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  inputBox:{
    fontSize:14,
    height:48,
    borderColor:'#515a6e',
    borderWidth:1,
    borderRadius:3,
    paddingLeft:8,

  },
  headContainer:{
    flexDirection:'row',
    paddingTop:18,
    paddingBottom:2,
    backgroundColor:"white",
    borderBottomWidth:1,
    borderColor:"#e9e9e9", 
  },
  headIcon:{
    paddingLeft:10,
    paddingRight:10
  }
});



export default createForm()(PageForm);

