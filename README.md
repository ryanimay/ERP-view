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
新筆記: https://hackmd.io/@S1MNxjTORYSfAfivxMlEQw/Bkf-N7Y0a

## 流程   
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

關於請求權限:
JWT的驗證，前端只負責做時效驗證，加減篩選掉一些無效請求發送至後端導致不必要的資源浪費，  
簽名驗證的部分因為有安全性問題所以由後端負責驗證

## 關於權限
原先是希望用RBAC的方式，但後面發現如果有區分部門的需求就變得有點混亂，關於這，有兩種想法:  
1. 一樣貫徹RBAC，所有權限都是基於role的角色，每個部門的不同需求權限就是創一個新角色，部門單純就是用來掛名，無關權限，但要用到部門的操作場合就會變很複雜。  
2. (目前嘗試)讓部門跟權限掛勾，部門都會有個基本權限，就是用一個role，並且權限都加了一個屬性是level代表層級，也是用RBAC的方式加role給用戶，但部門搜尋就可以按層級去區分部門職位，大致能做到功能但總感覺哪裡有問題。  
另外，還有延伸想法就是做到更細，每個部門的role就是固定幾個(比如說部門經理、課長、職員)，然後從部門的層面去分配role給用戶，也可以同時用RBAC做部門以外的權限操作。