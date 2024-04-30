import router from '@/config/router/routerConfig'
import { verifyJWT } from '@/config/JwtTool';
import userStore from '@/store/User';

router.beforeEach((to, from, next) => {
    const nextName = to.name;
    const requiresAuth = to.matched.some(router => router.meta.requiresAuth) === true;
    const user = userStore();
    const isLogin = user.isLogin;
    
    if (requiresAuth) {
        if (verify(isLogin)) {
            if (mustUpdatePassword(nextName, user)) { 
                next({ name: 'updatePassword' });
            } else if (mustUpdateEmail(nextName, user)) { 
                next({ name: 'updateEmail' });
            } else {
                next();
            }
        } else {
            next({
                name: 'login',
                query: {
                    //未正常登出才需要顯示提示字
                    message: isLogin ? 'Please re-login.' : undefined
                }
            });
        }
        //勾選記住我，並且登入未過期，直接導向首頁
    } else if (nextName === 'login' && localStorage.getItem('rememberMe') && verify(isLogin)) {
        next({ name: 'home' });
    } else {
        next();
    }
});

function mustUpdatePassword(nextName, user){
    return nextName !== 'updatePassword' && user.mustUpdatePassword;
}

function mustUpdateEmail(nextName, user){
    return nextName !== 'updateEmail' && nextName !== 'updatePassword' && !user.email;
}

function verify(isLogin){
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    //accessToken通過&&refreshToken不存在
    //或是accessToken通過&&refreshToken通過
    const approvedJwt = verifyJWT(accessToken) && (!refreshToken || verifyJWT(refreshToken));
    return isLogin && approvedJwt;
}