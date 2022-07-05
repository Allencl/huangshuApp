package com.meslanya;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;

import org.json.JSONException;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;



import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;  
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.ReactActivity;

import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;

import android.widget.Toast; 
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.meslanya.CustomToastPackage; // <-- 引入你自己的包

import com.meslanya.keyeventlister.KeyEventListerPackage; // <-- 引入你自己的包


import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.picksmart.BluetoothleController.BluetoothLEDevice;
import com.picksmart.BluetoothleController.BluetoothLEManager;
import com.picksmart.BluetoothleTransfer.BluetoothTransferClient;
import com.picksmart.BluetoothleTransfer.BluetoothTransferClientProgressCallback;
import com.picksmart.BluetoothleTransfer.BluetoothTransferDefinitions;

import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedList;
import java.util.List;



import android.Manifest;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import android.content.pm.PackageManager;

import org.json.JSONObject;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;





public class MainApplication extends Application implements ReactApplication {


  // 蓝牙功能 
  private static final String TAG = MainActivity.class.getSimpleName();

  public static final int STATUS_UPDATE_NONE = 0;        // 更新中
  public static final int STATUS_UPDATE_SUCCESS = 1;    // 成功
  public static final int STATUS_UPDATE_FAIL = 2;      // 失败
  public static final int STATUS_UPDATE_UPDATING = 3;   // 开始

  boolean isScanning = false;
  boolean isUpgrading = false;

  private Button startBtn;
  private Button stopBtn;
  private Button updateBtn;

  BluetoothTransferClient bluetoothTransferClient;
  BluetoothLEManager bluetoothLEManager;

  BluetoothTransferClientProgressCallback clientProgressCallback = new BluetoothTransferClientProgressCallback() {
    @Override
    public void progressUpdate(String address, float percent, int currentBlock) {
        Log.d(TAG, "progressUpdate address:" + address + " percent:" + percent + " currentBlock:" + currentBlock);
        String message = "progressUpdate address:" + address + " percent:" + percent + " currentBlock:" + currentBlock;
        //Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void statusUpdate(String address, BluetoothTransferDefinitions.StatusEnumeration status) {
        Log.d(TAG, "statusUpdate address:" + address + " status:" + status);
        
        //        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();

        int result = filterStatus(status);

        String message = "address:" + address + " status:" + status.toString()+"result:"+result;



        try {
            JSONObject json = new JSONObject();
            json.put("result",result);
            json.put("status",status.toString());
            json.put("address",address);

            ReactContext reactContext = getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
            sendEventLanya(reactContext,json.toString());

        } catch (JSONException e) {
            e.printStackTrace();
        }



        if ((result == STATUS_UPDATE_FAIL) || (result == STATUS_UPDATE_SUCCESS)) {
            isUpgrading = false;
        }
    }
  };

  private int filterStatus(BluetoothTransferDefinitions.StatusEnumeration status) {
      switch (status) {
          case ClientDeviceConnectTimeout:
          case ClientDeviceDiscoverTimeout:
          case ClientServiceMissingOnPeripheral:
          case ClientGotEnableUpdateScreenResponseFail:
          case ClientProcessStartCommandSentFail:
          case ClientImageTransferFailed:
          case ClientGotSetNewAddressResponseFail:
              return STATUS_UPDATE_FAIL;
          case ClientCompleteDeviceDisconnectedPositive:
          case ClientCompleteDeviceDisconnectedDuringProgramming:
              return STATUS_UPDATE_SUCCESS;
          case ClientDeviceReady:
          case ClientImageTransfer:
          case ClientCompleteFeedbackOK:
          case ClientReady:
              return STATUS_UPDATE_NONE;
          default:
              return STATUS_UPDATE_UPDATING;
      }
  }

  //客户自己实现添加读取本地的图片功能。用例只是读取assets目录下面的。
  // private void updateRemoteScreen(String address, int type) {
  //   try {
  //       Log.d(TAG, "updateRemoteScreen address:" + address + " type:" + type);
  //       String[] images = {"_bluetooth_1648192436355_1.png"};
  //       List<Bitmap> bitmaps = new LinkedList<>();
  //       for (String png : images) {
  //           InputStream in = getAssets().open(png);
  //           Bitmap bitmap = BitmapFactory.decodeStream(in);
  //           bitmaps.add(bitmap);
  //       }
  //       //调用传输图片
  //       bluetoothTransferClient.start(address, bitmaps, type);
  //   } catch (IOException e) {
  //       e.printStackTrace();
  //   } catch (InterruptedException e) {
  //       e.printStackTrace();
  //   }
  // }

  // private void updateRemoteScreen(String address, List<String> images, int type) {
  //   try {
  //       //String[] images = {"0.png", "a.png", "b.png", "c.png"};
  //       List<Bitmap> bitmaps = new LinkedList<>();
  //       for (String png : images) {
  //           InputStream in = new FileInputStream(png);
  //           Bitmap bitmap = BitmapFactory.decodeStream(in);
  //           bitmaps.add(bitmap);
  //       }
  //       //调用传输图片
  //       bluetoothTransferClient.start(address, bitmaps, type);
  //   } catch (IOException e) {

  //   } catch (InterruptedException e) {

  //   }
  // }


  private void updateRemoteScreen(String address, List<String> images, int type) {
    try {
        //String[] images = {"0.png", "a.png", "b.png", "c.png"};
        List<Bitmap> bitmaps = new LinkedList<>();
        for (String png : images) {
            File file = new File(png);
            if (file.exists()) {
                InputStream in = new FileInputStream(file);
                Bitmap bitmap = BitmapFactory.decodeStream(in);
                bitmaps.add(bitmap);
            } else {
                isUpgrading = false;
                Toast.makeText(this,"文件不存在！", Toast.LENGTH_SHORT).show();
                return;
            }
        }
        //调用传输图片
        bluetoothTransferClient.start(address, bitmaps, type);
    } catch (IOException e) {
      isUpgrading = false;
    } catch (InterruptedException e) {
      isUpgrading = false;
    }
}


  // 更新图片
  public void updateImage(String dress,List<String> images){
      // Toast.makeText(this,"kikilili",Toast.LENGTH_SHORT).show();


    if (!isUpgrading) {
      //更新电子墨水屏
      isUpgrading = true;
      // updateRemoteScreen("FF:FF:99:97:64:82", 296);
      updateRemoteScreen(dress,images,296);
    } else {
      Toast.makeText(this,"FF:FF:"+dress+"正在更新中！", Toast.LENGTH_SHORT).show();
    }

  }



    // public void updateImage(String dress){
    //   // Toast.makeText(this,"kikilili",Toast.LENGTH_SHORT).show();


    //   if (!isUpgrading) {
    //     //更新电子墨水屏
    //     isUpgrading = true;
    //     // updateRemoteScreen("FF:FF:99:97:64:82", 296);
    //     // updateRemoteScreen(dress,images,296);
    //     updateRemoteScreen(dress,296);


    //   } else {
    //     Toast.makeText(this,"FF:FF:"+dress+"正在更新中！", Toast.LENGTH_SHORT).show();
    //   }

    // }

  // 扫码功能
  private static final String INTENT_ACTION_SCAN_RESULT="com.honeywell.ezservice.uniqueaction";
  private void sendEvent(ReactContext reactContext,String abc) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("globalEmitter_honeyWell", abc);
  }
    // 蓝牙
    private void sendEventLanya(ReactContext reactContext,String abc) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("globalEmitter_honeyWell_lanya", abc);
    }

  private BroadcastReceiver barcodeReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
          if (INTENT_ACTION_SCAN_RESULT.equals(intent.getAction())) {
              //获取扫描数据，并将扫描数据存放在barcodeData中
              final String barcodeData = intent.getStringExtra("data");

              // Toast.makeText( getApplicationContext(),barcodeData,Toast.LENGTH_SHORT ).show();
              ReactContext reactContext = getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
              sendEvent(reactContext,barcodeData);
            }
      }
  };

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());

          packages.add(new KeyEventListerPackage());
          packages.add(new CustomToastPackage()); // <-- 添加这一行，类名替换成你的Package类的名字 name.
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    // 广播
    registerReceiver(barcodeReceiver, new IntentFilter(INTENT_ACTION_SCAN_RESULT));




    // 蓝牙权限
    // int permissionCheck = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION);
    // if (permissionCheck != PackageManager.PERMISSION_GRANTED) {
    //     ActivityCompat.requestPermissions(this, new String[]{
    //             Manifest.permission.ACCESS_FINE_LOCATION,
    //             Manifest.permission.ACCESS_COARSE_LOCATION,
    //             Manifest.permission.WRITE_EXTERNAL_STORAGE,
    //             Manifest.permission.READ_EXTERNAL_STORAGE,
    //     }, 1001);
    // }

    //构造BluetoothTransferClient实例
    bluetoothTransferClient = new BluetoothTransferClient(this, clientProgressCallback);

    //构造获取BluetoothLEManager实例
    bluetoothLEManager = BluetoothLEManager.getInstance(this);
    // bluetoothLEManager.prepareForScanForDevices(this);

  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.meslanya.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
