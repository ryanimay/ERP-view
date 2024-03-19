# ERP-view

erp的前端部分  
主要就練習Vue.js(Vue3)，接ERP-Base的API  
~~Vue.js筆記:https://hackmd.io/0HEbLvzQQViCfIFTtY9TZQ~~
***
## 2024.3.15
舊設計棄置(branch master_abandoned)  
後端API重寫完，前端重寫  
主要希望改善code的css  
不要寫hardCode  
多利用套件做畫面效果  
figma熟練  
Router配置的部分整合到後端讀資料庫  

## 流程  
專案啟動呼叫後端API
獲取當前專案公鑰，用於後續JWT驗證  
獲取Router設置前端頁面路由  
註冊由有權限的用戶協助新增帳號，第一次登入帳號密碼相同，須改密碼，登記email  
登入:  
用戶輸入帳號密碼，經API由後端驗證  
如果未勾選rememberMe，只會返回accessToken  
如果勾選rememberMe，會返回accessToken和refreshToken  
並且後續把使用者帳號及回傳的JWT(accessToken && refreshToken)記在localStorage，  
密碼記錄由瀏覽器端控制自動儲存，後續瀏覽器操作就是先驗證localStorage中的accessToken  
未通過則利用refreshToken呼叫後端取得新的Token，  
如果沒有refreshToken這邊就會直接要求重登  
localStorage記錄帳號顯示於inputText  
