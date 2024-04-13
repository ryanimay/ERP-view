import { createStore } from 'vuex';

export default createStore({
    state: {
        publicKey: '',
    },
    mutations: {
        setPublicKey(state, key) {
            state.publicKey = key;
        },
    },
    actions: {
    },
});