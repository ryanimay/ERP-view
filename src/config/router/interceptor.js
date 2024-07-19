import router from '@/config/router/routerConfig'
import { checkOrRefreshToken } from '@/config/tool/jwtTool';
import userStore from '@/config/store/user';
import i18n from '@/config/i18nConfig.js'
import navigationStore from '@/config/store/navigation';

router.beforeEach(async (to, from, next) => {
    const nextName = to.name;
    const requiresAuth = to.matched.some(router => router.meta.requiresAuth) === true;
    const user = userStore();
    const isLogin = user.isLogin;
    
    if (requiresAuth) {
        navigationStore().updatePath(to);
        if (await verify(isLogin)) {
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
                    message: isLogin ? i18n.global.t('router.reLogin') : undefined
                }
            });
        }
        //勾選記住我，並且登入未過期，直接導向首頁
    } else if (nextName === 'login' && localStorage.getItem('rememberMe') && await verify(isLogin)) {
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

async function verify(isLogin){
    const approvedJwt = await checkOrRefreshToken();
    return isLogin && approvedJwt;
}