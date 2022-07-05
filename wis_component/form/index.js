import InputComponent from './Input';         // 单行输入框
import TextareaComponent from './Textarea';   // 多行 输入框
import FormRadioComponent from './Radio';   // Radio
import DatePickerComponent from './datePicker';  // 时间控件
import CameraComponent from './camera';  // 扫码

import FormHeadComponent from './FormHead';   // 表单头
import FormSearchComponent from './SearchHead';  // 查询头
import SelectComponent from './select';   // 下拉框
import WisFormText from './formText';   // 表单只读
import FormPhotoComponent from './photo';   // 拍照


module.exports = {
    WisFormText:WisFormText,
    WisInput:InputComponent,
    WisTextarea:TextareaComponent,
    WisFormHead:FormHeadComponent,
    WisSearchHead:FormSearchComponent,
    WisRadio:FormRadioComponent,
    WisDatePicker:DatePickerComponent,
    WisCamera:CameraComponent,
    WisSelect:SelectComponent,
    WisFormPhoto:FormPhotoComponent
};


  
