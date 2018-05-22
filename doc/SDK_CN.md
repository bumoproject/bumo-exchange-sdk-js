# bumo-exchange-sdk-js

## 概述
bumo-exchange-sdk-js接口文档

- [安装](#安装)
	- [安装](#安装)
- [使用方法及实例](#使用方法及实例)
    - [初始化](#初始化)
    - [生成账户](#生成账户)
    - [查询账户余额](#查询账户余额)
    - [查询账户信息](#查询账户信息)
    - [查询交易详情](#查询交易详情)
    - [发送BU](#发送BU)

- [错误码](#错误码)

## bumo-exchange-sdk 安装
```
npm install bumo-exchange-sdk --save
```

## 使用方法及实例
#### 初始化
###### 传入参数
options 是一个对象，可以包含如下属性

   参数      |     类型     |     描述      |
----------- | ------------ | ----------------- |
ips|   Array    | ip地址:端口             |

###### 实例：

```js
const BumoSDK = require('bumo-exchange-sdk');

const bumo = new BumoSDK({
  ips: [ 'seed1.bumotest.io:26002' ],
});

```
#### 生成账户
调用：bumo.account.create()， 该方法返回Promise
###### 返回值
返回值是一个对象：对象属性如下

   参数     |     类型     |     描述                    |
----------- | ------------ | --------------------------- |
error_code |    Number    | 错误码             |
msg |    String      | 描述信息 |
data |    Object   | 返回数据 |

data值是一个对象：格式如下

```js
{
  privateKey: 'privbzRqpiYdPPRAPNiP1qtXgcruwf3JipRiFZzuQ6ndWU1MbRdkYP2u',
  publicKey: 'b001e19aa19d58ed1bc07bf7fe32ff86899273c83b796d7fda82b27c85c218845330b869d216',
  address: 'buQdgwWDJWEPsF6tJMdm2c4YPB6vdc5fRVwQ'
}

privateKey: 私钥
publicKey: 公钥
address: 地址
```
###### 实例：

```js
bumo.account.create().then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});
```
#### 查询账户余额
调用：bumo.account.getBalance(address)， 该方法返回Promise
###### 传入参数

   参数      |     类型     |     描述                    |
----------- | ------------ | ----------------- |
address 	  |    String    | 账户地址              |
###### 返回值
返回值是一个对象：对象属性如下

   参数     |     类型     |     描述                    |
----------- | ------------ | --------------------------- |
error_code |    Number    | 错误码             |
msg |    String      | 描述信息 |
data |    Object   | 返回数据 |
data值是一个对象：格式如下

```js
{
  balance: 9968804800
}

balance: 账户余额
```

###### 实例：

```js
bumo.account.getBalance('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw').then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});
```





#### 查询账户信息
调用：bumo.account.getInfo(address)， 该方法返回Promise
###### 传入参数

   参数      |     类型     |     描述                    |
----------- | ------------ | ----------------- |
address 	  |    String    | 账户地址              |
###### 返回值
返回值是一个对象：对象属性如下

   参数     |     类型     |     描述                    |
----------- | ------------ | --------------------------- |
error_code |    Number    | 错误码             |
msg |    String      | 描述信息 |
data |    Object   | 返回数据 |
data值是一个对象：格式如下
```js
{
  address: 'buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1',
  balance: 9968804800,
  nonce: 2,
  assets: null
}

address: 账户地址
balance: 账户余额
nonce: 交易序号
assets: 该账号的所有资产
```
###### 实例：

```js
bumo.account.getInfo('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw').then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});
```


#### 查询交易详情
调用：bumo.getTransaction(transactionHash)， 该方法返回Promise
###### 传入参数

   参数      |     类型     |     描述                    |
----------- | ------------ | ----------------- |
transactionHash |    String    | 交易的唯一标识hash            |

###### 返回值
返回值是一个对象：对象属性如下

   参数     |     类型     |     描述                    |
----------- | ------------ | --------------------------- |
error_code |    Number    | 错误码             |
msg |    String      | 描述信息 |
data |    Object   | 返回数据 |
###### 实例：

```js
bumo.getTransaction(transactionHash).then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});
```

#### 发送BU
调用：bumo.sendBu(from, to, amount, nonce, gasPrice, feeLimit)， 该方法返回Promise
###### 传入参数

   参数      |     类型     |     描述                    |
----------- | ------------ | ----------------- |
from |   String    | 发送者的私钥           |
to |   String    | 目标账户地址           |
amount |  Number    | 要转移的数量（单位是BU）        |
nonce |  Number    | 交易序号 (可通过调用bumo.account.getInfo() 函数获得)      |
gasPrice |  Number    | [可选参数] gas价格(不小于配置的最低值) (单位是MO)|
feeLimit |  Number    | [可选参数] 愿为交易花费的手续费  (单位是MO)   |
> 注意：amount, gasPrice和feeLimit的单位是MO，且 1 BU = 10^8 MO

###### 返回值
返回值是一个对象：对象属性如下

   参数     |     类型     |     描述                    |
----------- | ------------ | --------------------------- |
error_code |    Number    | 错误码             |
msg |    String      | 描述信息 |
data |    Object   | 返回数据 |
###### 实例：

```js
const from = 'privbs1NhRnS64Gy4eLNYfJDFAsZNCdNWqg8dNCxze26wtQLEQ1d1gnR';
const to = 'buQgE36mydaWh7k4UVdLy5cfBLiPDSVhUoPq';
const amount = 0.1;
const nonce = 121;

const options = {
  from,
  amount,
  to,
  nonce,
};

 bumo.wallet.sendBu(options).then(data => {
   console.log(data);
 }).catch(err => {
   console.log(err.message);
 });

```



### 错误码

> 接口调用错误码信息

参数 | 描述
-----|-----
0	| 成功
1	| 私钥不合法
2	| 公钥不合法
3	| 地址不合法
4	| 账户不存在
