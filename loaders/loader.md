<!--
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-01 15:27:13
 * @LastEditTime: 2021-12-02 09:16:33
 * @LastEditors: zhouy
-->
 * loader 配置

```js
 module:{
      rules:[{
            test:/\.scss/i,
            use:'style-loader',
            enforce: 'pre'
      	},
        {
            test:/\.scss/i,
            use:'css-loader',
            enforce: 'post'
      	}
     ]
   }
//enforce参数，pre前置，post后置
// 执行顺序 pre loader>normal loader>post loader
// loader的执行顺序是根据webpack配置决定的
```

- 自定义loader引入

  - resolveLoader --> alias

    ```js
    resolveLoader: {
            alias: {
                'babel-loader': path.resolve(__dirname,'../loaders/babel-loader.js')
            }
        }
    ```

  - resloveLoader --> modules

    ```js
    resolveLoader: {       
    	modules: [
            path.resolve(__dirname,'../loaders/') 
        	]   
        },
    ```

    