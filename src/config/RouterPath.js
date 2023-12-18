const config = {
  api: (() => {
    const base = '/api';//proxy轉換
    const context_path = base + '/erp_base';//後端api字段
    const cache = context_path + '/cache';
    const client = context_path + '/client';
    const role = context_path + '/role';
    const permission = context_path + '/permission';
    return {
      cache: {
        refresh: cache + '/refresh',
      },
      client: {
        opValid: client + '/opValid',
        register: client + '/register',
        login: client + '/login',
        resetPassword: client + '/resetPassword',
        list: client + '/list',
        getClient: client + '/getClient',
        update: client + '/update',
        updatePassword: client + '/updatePassword',
        clientLock: client + '/clientLock',
        clientStatus: client + '/clientStatus',
      },
      role: {
        list: role + '/list',
        update: role + '/update',
        add: role + '/add',
        remove: role + '/remove',
      },
      permission: {
        role: permission + '/role',
        tree: permission + '/tree',
        ban: permission + '/ban',
        securityConfirm: permission + '/securityConfirm',
      },
    };
  })(),
}

export default config;