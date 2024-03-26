const config = {
  api: (() => {
    const base = '/api';//proxy轉換
    const context_path = base + '/erp_base';//後端api字段
    // const cache = context_path + '/cache';
    const client = context_path + '/client';
    // const role = context_path + '/role';
    // const permission = context_path + '/permission';
    const router = context_path + '/router';
    return {
      cache: {
        // refresh: { path: cache + '/refresh', requiresAuth: true },
      },
      client: {
        opValid: { path: client + '/opValid', requiresAuth: false },
        register: { path: client + '/register', requiresAuth: false },
        login: { path: client + '/login', requiresAuth: false },
        resetPassword: { path: client + '/resetPassword', requiresAuth: false },
        // list: { path: client + '/list', requiresAuth: true },
        // getClient: { path: client + '/getClient', requiresAuth: true },
        update: { path: client + '/update', requiresAuth: true },
        updatePassword: { path: client + '/updatePassword', requiresAuth: true },
        // clientLock: { path: client + '/clientLock', requiresAuth: true },
        // clientStatus: { path: client + '/clientStatus', requiresAuth: true },
      },
      role: {
        // list: { path: role + '/list', requiresAuth: false },
        // update: { path: role + '/update', requiresAuth: true },
        // add: { path: role + '/add', requiresAuth: true },
        // remove: { path: role + '/remove', requiresAuth: true },
      },
      permission: {
        // role: { path: permission + '/role', requiresAuth: true },
        // tree: { path: permission + '/tree', requiresAuth: true },
        // ban: { path: permission + '/ban', requiresAuth: true },
        // securityConfirm: { path: permission + '/securityConfirm', requiresAuth: true },
      },
      router: {
        role: { path: router + '/role', requiresAuth: true }
      }
    };
  })(),
}

export default config;