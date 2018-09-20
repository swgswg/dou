import tip from '@/utils/tip';
import util from '@/utils/util';

const zeroClearingValue   = 'FE08010000000000000108'; // 清零
const noZeroClearingValue = 'FE08010000000000000007'; // 不清零
let deviceList = [];
module.exports = {

    // 初始化蓝牙模块
    openBluetooth(){

        let that = this;
        wx.openBluetoothAdapter({
            success(e){
                if (e.errMsg == 'openBluetoothAdapter:ok'){
                    that.getBluetoothState();
                }
            },
            fail(){
                tip.longtoast('请检查手机蓝牙是否开启');
            },
        });
        tip.loaded();
    },

    // 获取本机蓝牙适配器状态
    getBluetoothState(successFun,errorFun){
        let that = this;
        wx.getBluetoothAdapterState({
            success(e){

                // 停止搜寻附近的蓝牙外围设备
                that.stopDiscovery();

                // 监听蓝牙适配器状态变化事件
                that.onBluetoothStateChange();

                // 开始搜寻附近的蓝牙外围设备
                that.startDiscovery();

                // 监听寻找到新设备
                that.onFoundBluetooth();
            },
            fail(){
                tip.longtoast('请检查手机蓝牙是否开启');
            }
        });
    },

    // 监听蓝牙适配器状态变化事件
    onBluetoothStateChange(){
        wx.onBluetoothAdapterStateChange(function(res){
            console.log('监听蓝牙适配器状态变化');
            console.log(res);
            if((!res.available) || (!res.discovering)){
                tip.error('蓝牙不可用');
                tip.loaded();
            }
        });
    },

    // 开始搜寻附近的蓝牙外围设备
    startDiscovery(){
        wx.startBluetoothDevicesDiscovery({
            success (res) {
                if(res.isDiscovering){
                    tip.loading('正在搜索...');
                }
            },
            fail(){
                tip.loaded();
                tip.error('搜索失败');
            }
        })
    },

    // 监听寻找到新设备的事件
    onFoundBluetooth(){
        let that = this;
        wx.onBluetoothDeviceFound(function (res) {
            // that.getDevices();
            // 兼容安卓及iOS设备
            if(res.deviceId){
                that.devicesData(res);
            } else if(res.devices){
                that.devicesData(res.devices[0]);
            } else if(res[0]){
                that.devicesData(res[0]);
            }
        });
    },

    devicesData(new_devices){
        if(util.isEmpty(new_devices.name)){
            return;
        }
        let isExist = false;
        if(util.isEmpty(deviceList)){
            deviceList = [];
        } else {
            let len = deviceList.length;
            for(let i = 0; i < len; i++){
                if(new_devices.deviceId == deviceList[i].deviceId){
                    isExist = true;
                    deviceList.splice(i,1,new_devices);
                }
            }
        }
        console.log(new_devices);
        if(!isExist){
            deviceList.push(new_devices);
        }
    },

    // 获取在蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备
    getDevices(){
        let that = this;
        wx.getBluetoothDevices({
            success: function (res) {
                console.log('获取在蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备');
                console.log(res);
                that.setData({
                    deviceList:res.devices
                });
            }
        })
    },

    // 停止搜寻附近的蓝牙外围设备
    stopDiscovery(){
        wx.stopBluetoothDevicesDiscovery({
            success(res){
                console.log('停止搜寻附近的蓝牙外围设备');
                console.log(res);
                tip.loaded();
            },
            fail(){
                tip.error('停止搜索失败');
            },
        });
    },

    // 连接低功耗蓝牙设备
    BLEConnection(deviceId){
        let that = this;
        loading('连接中');
        // console.log('连接中');
        // console.log(deviceId);
        wx.createBLEConnection({
            deviceId: deviceId,
            timeout: 600000,
            success(res){
                console.log('连接成功');
                console.log(res);
                // connectingDeviceId = deviceId;
                that.setData({
                    connected: true,
                    connectingDeviceId: deviceId
                });
                that.getServices(deviceId);
                hide_Loading();
                toast('连接成功');
            },
            fail(res){
                console.log('连接失败');
                console.log(res);
                that.setData({
                    connected:false,
                });
                hide_Loading();
                toast('连接失败');
            },
        });
    },

    // 断开与低功耗蓝牙设备的连接
    closeConnection(){
        let connectingDeviceId = this.data.connectingDeviceId;
        if(!connectingDeviceId){
            return;
        }
        wx.closeBLEConnection({
            deviceId: connectingDeviceId,
            success(res){
                console.log('断开与低功耗蓝牙设备的连接');
                console.log(res);
            },
            fail(){
                toast('断开连接失败');
            }
        });
    },

    // 获取蓝牙设备所有服务(service) 为了获取service的UUID
    getServices(deviceId){
        let that = this;
        // console.log(deviceId);
        wx.getBLEDeviceServices({
            deviceId:deviceId,
            success(res){
                // console.log('获取蓝牙设备service');
                // console.log(res);
                that.setData({
                    services:res.services
                });
                let uuid = res.services;
                let len = uuid.length;
                for(let i = 0; i < len; i++){
                    that.getCharacteristics(deviceId,res.services[i].uuid);
                }
            },
            fail(res){
                toast('获取服务失败');
                console.log(res);
            },
        });
    },

    // 获取蓝牙设备某个服务中所有特征值(characteristic) 为了该特征值UUID支持的操作类型
    getCharacteristics(deviceId,services_UUID){
        let that = this;
        wx.getBLEDeviceCharacteristics({
            deviceId:deviceId,
            serviceId:services_UUID,
            success(res){
                // console.log('获取蓝牙设备characteristic');
                // console.log(res);
                if(res.errCode == 0){
                    let characteristics = res.characteristics;
                    let len = characteristics.length;
                    for(let k = 0; k < len; k++){
                        let indicate = characteristics[k].properties.indicate;
                        let notify = characteristics[k].properties.notify;
                        let read = characteristics[k].properties.read;
                        let write = characteristics[k].properties.write;
                        console.log(indicate,notify,read,write);
                        if(indicate && notify && read && write){
                            let connectingDeviceId = res.deviceId;
                            // console.log('connectingDeviceId');
                            // console.log(connectingDeviceId);
                            let services_UUID = res.serviceId;
                            // console.log('services_UUID');
                            // console.log(services_UUID);
                            let characteristic_UUID = characteristics[k].uuid;
                            // console.log('characteristic_UUID');
                            // console.log(characteristic_UUID);
                            that.setData({
                                connectingDeviceId: connectingDeviceId,
                                services_UUID: services_UUID,
                                characteristic_UUID: characteristic_UUID
                            });
                            that.notifyValueChange(connectingDeviceId,services_UUID,characteristic_UUID);
                        }
                    }
                }

            },
            fail(){
                toast('获取特征值失败');
            }
        });
    },

    // 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值
    notifyValueChange(deviceId,services_UUID,characteristic_UUID){
        let that = this;
        wx.notifyBLECharacteristicValueChange({
            deviceId:deviceId,
            serviceId:services_UUID,
            characteristicId:characteristic_UUID,
            state:true,
            success(res){
                console.log('启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值: 成功---');
                console.log(res);

                setTimeout(function () {
                    let connectingDeviceId = that.data.connectingDeviceId;
                    let services_UUID = that.data.services_UUID;
                    let characteristic_UUID = that.data.characteristic_UUID;
                    that.writeValue(connectingDeviceId,services_UUID,characteristic_UUID,test);
                },1000);

                that.onValueChange();
            },
            fail(res){
                console.log('启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值: 失败---');
                console.log(res);
            },
        });
    },

    // 监听低功耗蓝牙设备的特征值变化
    // 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
    onValueChange(){
        let that = this;
        wx.onBLECharacteristicValueChange(function(res){
            console.log('监听低功耗蓝牙设备的特征值变化');
            console.log(res);
            console.log(ab2hex(res.value));
            // 获取设备返回的数据
            let hex = ab2hex(res.value);
            // 获取总次数
            let num = hexSlice(hex);
            that.setData({
                shakeNum:num
            });
        });
    },

    // 读取低功耗蓝牙设备的特征值的二进制数据值
    // 接口读取到的信息需要在 onBLECharacteristicValueChange 方法注册的回调中获取
    readValue(){
        let connectingDeviceId = this.data.connectingDeviceId;
        let services_UUID = this.data.services_UUID;
        let characteristic_UUID = this.data.characteristic_UUID;
        wx.readBLECharacteristicValue({
            deviceId:connectingDeviceId,
            serviceId:services_UUID,
            characteristicId:characteristic_UUID,
            success(res){
                console.log('读取低功耗蓝牙设备的特征值的二进制数据值: 成功---');
                console.log(res);
            },
            fail(res){
                console.log('读取低功耗蓝牙设备的特征值的二进制数据值: 失败---');
                console.log(res);
            }
        });
    },

    // 向低功耗蓝牙设备特征值中写入二进制数据 建议每次写入不超过20字节
    writeValue(deviceId,services_UUID,characteristic_UUID,value){
        let that = this;
        // LegthGt20(value);
        // let len = writeValueQueue.length;
        // for(let i = 0; i < len; i++){
        //     // let buffer = hex2ab(queue[i]);
        //     if(queueSuccess){
        //         that.writeToBluetoothValue(deviceId,services_UUID,characteristic_UUID,writeValueQueue[i]);
        //     }
        // }
        that.writeToBluetoothValue(deviceId,services_UUID,characteristic_UUID,value);
    },

    // 蓝牙写数据
    writeToBluetoothValue(deviceId,services_UUID,characteristic_UUID,buffer){
        let value = hex2ab(buffer);
        wx.writeBLECharacteristicValue({
            deviceId:deviceId,
            serviceId:services_UUID,
            characteristicId:characteristic_UUID,
            value:value,
            success(res){
                console.log('向低功耗蓝牙设备特征值中写入二进制数据: 成功---');
                console.log(res);
                queueSuccess = true;
            },
            fail(res){
                console.log('向低功耗蓝牙设备特征值中写入二进制数据: 失败---');
                console.log(res);
                queueSuccess = false;
                writeValueQueue.push(buffer);
            }
        })
    },

    // 关闭蓝牙模块
    closeBluetooth(){
        wx.closeBluetoothAdapter({
            success(){
                toast('关闭成功');
            },
            fail(){
                toast('关闭失败');
            }
        });
    },

    // ArrayBuffer转16进度字符串示例
    ab2hex(buffer) {
        let hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function (bit) {
                return ('00' + bit.toString(16)).slice(-2);
            }
        );
        return hexArr.join('');
    },

    /**
     * 16进制字符串转ArrayBuffer
     */
    hex2ab(str) {
        if (!str) {
            return new ArrayBuffer(0);
        }
        let typedArray = new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        }));
        let buffer1 = typedArray.buffer;
        // console.log(buffer1);
        return buffer1;
    },


    // 16进制字符串取需要的字节(fe 08 01 00 01 01 01 7a0b 008f)
    hexSlice(hex) {
        // 取k8位
        let k8 = hex.slice(14,16);
        //取k9位
        let k9 = hex.slice(16,18);
        return parseInt(k9+k8,16);
    },


};