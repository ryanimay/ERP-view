/*
固定格式為
{
  path:路徑,
  method:請求方式,
  requiresAuth:是否需驗證
}
*/

const config = {
  api: (() => {
    const base = '/api';//proxy轉換
    const context_path = base + '/erp_base';//後端api字段
    const client = context_path + '/client';
    const menu = context_path + '/menu';
    const attend = context_path + '/attend';
    const department = context_path + '/department';
    const notification = context_path + '/notification';
    const role = context_path + '/role';
    const permission = context_path + '/permission';
    return {
      cache: {
      },
      client: {
        opValid: {
          path: client + '/opValid',
          method:'get',
          requiresAuth: false
        },
        register: {
          path: client + '/register',
          method:'post',
          requiresAuth: false
        },
        login: {
          path: client + '/login',
          method:'post',
          requiresAuth: false
        },
        resetPassword: {
          path: client + '/resetPassword',
          method:'put',
          requiresAuth: false
        },
        update: {
          path: client + '/update',
          method:'put',
          requiresAuth: true
        },
        updatePassword: {
          path: client + '/updatePassword',
          method:'put',
          requiresAuth: true
        },
        logout: {
          path: client + '/logout',
          method:'post',
          requiresAuth: true
        },
        list: {
          path: client + '/list',
          method:'get',
          requiresAuth: true
        },
        clientStatus: {
          path: client + '/clientStatus',
          method:'put',
          requiresAuth: true
        },
        clientLock: {
          path: client + '/clientLock',
          method:'put',
          requiresAuth: true
        },
      },
      role: {
        list: {
          path: role + '/list',
          method:'get',
          requiresAuth: true
        },
        update: {
          path: role + '/update',
          method:'put',
          requiresAuth: true
        },
        add: {
          path: role + '/add',
          method:'post',
          requiresAuth: true
        },
        remove: {
          path: role + '/remove',
          method:'delete',
          requiresAuth: true
        },
        rolePermission: {
          path: role + '/rolePermission',
          method:'post',
          requiresAuth: true
        },
      },
      permission: {
        list: {
          path: permission + '/list',
          method:'get',
          requiresAuth: true
        },
        role: {
          path: permission + '/role',
          method:'get',
          requiresAuth: true
        },
        ban: {
          path: permission + '/ban',
          method:'put',
          requiresAuth: true
        },
      },
      menu: {
        all: {
          path: menu + '/all',
          method:'get',
          requiresAuth: true
        },
        pMenu: {
          path: menu + '/pMenu',
          method:'get',
          requiresAuth: true
        }
      },
      attend: {
        signIn: {
          path: attend + '/signIn',
          method:'put',
          requiresAuth: true
        },
        signOut: {
          path: attend + '/signOut',
          method:'put',
          requiresAuth: true
        }
      },
      department: {
        list:{
          path: department + '/list',
          method:'get',
          requiresAuth: true
        },
        staff:{
          path: department + '/staff',
          method:'get',
          requiresAuth: true
        },
        edit:{
          path: department + '/edit',
          method:'post',
          requiresAuth: true
        },
        remove:{
          path: department + '/remove',
          method:'delete',
          requiresAuth: true
        }
      },
      notification: {
        status:{
          path: notification + '/status',
          method:'post',
          requiresAuth: true
        }
      }
    };
  })(),
}

export default config;