const config = {
  api: (() => {
    const base = '/api';//proxy轉換
    const context_path = base + '/erp_base';//後端api字段
    const client = context_path + '/client';
    const menu = context_path + '/menu';
    const permission = context_path + '/permission';
    return {
      cache: {
      },
      client: {
        opValid: { path: client + '/opValid', requiresAuth: false },
        register: { path: client + '/register', requiresAuth: false },
        login: { path: client + '/login', requiresAuth: false },
        resetPassword: { path: client + '/resetPassword', requiresAuth: false },
        update: { path: client + '/update', requiresAuth: true },
        updatePassword: { path: client + '/updatePassword', requiresAuth: true },
      },
      role: {
      },
      permission: {
        getKey: { path: permission + '/getKey', requiresAuth: false }
      },
      menu: {
        all: { path: menu + '/all', requiresAuth: true},
        pMenu: { path: menu + '/pMenu', requiresAuth: true}
      }
    };
  })(),
}

export default config;