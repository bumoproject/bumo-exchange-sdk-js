# bumo-exchange-sdk-js

## 概述
bumo-exchange-sdk-js接口文档

- [安装](#bumo-exchange-sdk-安装)
- [使用方法及实例](#使用方法及实例)
    - [初始化](#初始化)
    - [检查区块是否同步](#检查区块是否同步)
    - [生成账户](#生成账户)
    - [发送BU](#发送bu)
    - [查询账户余额](#查询账户余额)
    - [查询账户信息](#查询账户信息)
    - [验证账户地址](#验证账户地址)
    - [查询交易详情](#查询交易详情)
    - [通过区块高度查询区块交易](#通过区块高度查询区块交易)
    - [获取当前区块高度](#获取当前区块高度)

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
  assets : [
  {
    amount : 1400,
    key :
    {
      code : 'HNC',
      issuer : 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3'
    }
  }],
}

address: 账户地址
balance: 账户BU余额
nonce: 交易序号
assets: 该账户拥有的资产
    amount: 资产数量
    key: 资产标识
        code: 资产编码
        issuer: 资产发行账户地址
```
###### 实例：

```js
bumo.account.getInfo('buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1').then(data => {
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
transactionHash |    String    | 交易中的唯一hash            |

###### 返回值
返回值是一个对象：对象属性如下

   参数     |     类型     |     描述                    |
----------- | ------------ | --------------------------- |
error_code |    Number    | 错误码             |
msg |    String      | 描述信息 |
data |    Object   | 返回数据 |

data值是一个对象：格式如下:

```js

{
"total_count": 1,
"transactions": [{
	"actual_fee": 10004630000,
	"close_time": 1524899145079608,
	"error_code": 0,
	"error_desc": "",
	"hash": "7e28f25cb9c53bc9a7aa9e6ea7b4c65f85ca9d11ee6a136b4baf9574044c87d0",
	"ledger_seq": 100,
	"signatures": [{
		"public_key": "b001bda5a3b59c6b0b1fe18c2c13859dca4c37bd2676f6f3369a5f9f201c84ecc030f482c946",
		"sign_data": "9f289f7db9663b8bc477c6fd6c97ad143f94eea3f3ff4fc0b879221182b2759cf6bc1cf2cebecc78b6b0471733d9cc254648ee37ab52d52db260cff6db41d507"
	}],
	"transaction": {
		"fee_limit": 50000000000,
		"gas_price": 10000,
		"nonce": 2,
		"operations": [{
			"create_account": {
				"contract": {
					"payload": "'use strict'; \r\n function main(input) { payAsset(); log(input); } \r\n function query(input) { \r\n log(input); } \r\nfunction init(){return;}"
				},
				"dest_address": "buQYmXPFrMsFMSRyqsPphXXt46c6JL1AJmUP",
				"init_balance": 10000000,
				"metadatas": [{
					"key": "hello",
					"value": "这是创建账号的过程中设置的一个metadata"
				}],
				"priv": {
					"master_weight" : 1,
					"thresholds": {
						"tx_threshold": 1
					}
				}
			},
			"type": 1
		}],
		"source_address": "buQgH7GZJJGsMaiPVB5uPD1nGJsFP3D6nzsD"
	},
	"tx_size": 463
}]
}

total_count: 交易总数量
transactions: 交易列表
    actual_fee: 交易的实际费用
    close_time: 交易的关闭时间
    error_code: 交易状态码
    error_desc: 交易状态描述
    hash: 交易hash值
    ledger_seq: 交易所在的区块高度
    signatures: 交易签名列表
        public_key: 公钥
        sign_data: 签名后的数据
    transaction: 交易内容
        fee_limit: 交易手续费
        gas_price: 交易打包费
        nonce: 交易的序列号
        operations: 交易的操作列表

            create_account: 交易操作名称
                contract: 交易合约
                    payload: 合约内容


            dest_address: 目标账户地址
            init_balance: 目标账户的初始化余额
            metadatas: 附加信息
                key: 附加信息键
                value: 附加信息值
            priv: 目标账户权限
                master_weight: 目标账户的权重
                thresholds: 门限
                    tx_threshold: 交易门限
            type: 交易操作类型(1 创建账户；2 发行资产；3 转移资产；4 设置metadata；5 设置权重；6 设置门限；7 支付BU;)
    source_address: 交易的发起账户
    tx_size: 交易所占字节数

```

###### 实例：

```js
bumo.getTransaction(transactionHash).then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});
```


#### 通过区块高度查询区块交易
调用：bumo.getBlock(blockNumber)， 该方法返回Promise
###### 传入参数

   参数      |     类型     |     描述                    |
----------- | ------------ | ----------------- |
blockNumber |    Number    | 区块高度           |

###### 返回值
返回值是一个对象：对象属性如下

   参数     |     类型     |     描述                    |
----------- | ------------ | --------------------------- |
error_code |    Number    | 错误码             |
msg |    String      | 描述信息 |
data |    Object   | 返回数据 |

> data的结构参照 bumo.getTransaction中data的结构

###### 实例：

```js
bumo.getBlock(blockNumber).then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});
```


#### 检查区块是否同步
调用：bumo.checkBlockStatus()， 该方法返回Promise

###### 返回值
返回值是一个布尔值

```
true: 区块已同步
false: 区块未同步
```

###### 实例：

```js
bumo.checkBlockStatus().then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});
```

#### 获取当前区块高度
调用：bumo.getBlockNumber()， 该方法返回Promise

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
	seq: 206193
}

seq: 当前区块高度
```


###### 实例：

```js
bumo.getBlockNumber()().then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});
```


#### 验证账户地址
调用：bumo.checkAddress(address)， 该方法返回Promise

###### 传入参数

   参数      |     类型     |     描述                    |
----------- | ------------ | ----------------- |
address |    String    | 账户地址          |

###### 返回值
返回值是一个对象：对象属性如下

   参数     |     类型     |     描述                    |
----------- | ------------ | --------------------------- |
error_code |    Number    | 错误码             |
msg |    String      | 描述信息 |
data |    Object   | 返回数据 |

data值是一个布尔值：格式如下

```js
true: 有效地址
false: 无效地址
```


###### 实例：

```js
bumo.checkAddress('buQgE36mydaWh7k4UVdLy5cfBLiPDSVhUoPq').then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});
```


#### 发送BU
调用：bumo.sendBu(options)， 该方法返回Promise
###### optins是一个js对象，结构

   参数      |     类型     |     描述                    |
----------- | ------------ | ----------------- |
senderPrivateKey |   String    | 发送者的私钥           |
receiverAddress |   String    | 目标账户地址           |
amount |  Number    | 要转移的数量（单位是MO      |
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


data值是一个对象：格式如下

```js
{
	hash: '47c2c92b95c68865a32563a66adeb40161ed6175009c19cd427fff89570cc74b'
}

hash: 交易hash值
```
###### 实例：

```js
const options = {
	senderPrivateKey = 'privbsMCSqvv8kJ1A3Zt9RWjDHyG3jRdGpj9Jrgfxw7tdz3jZzhqA55v';
	receiverAddress = 'buQgE36mydaWh7k4UVdLy5cfBLiPDSVhUoPq';
	amount = 0.1;
	nonce = 121;
};

 bumo.sendBu(options).then(data => {
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
5 | 交易失败
6 | 交易号(nonce)太小
7 | 权重不足
8 | 函数参数数目不正确
9 | 函数参数类型不正确
10 | 函数参数不能为空
11 | 内部服务器错误
