import { createStore } from 'vuex';
import config from '@/config/RouterPath';

const data = ({
    securityPassword: '12345'
})

export default function getVuex(axios){
    var vuex = createStore({
        state: {
            publicKey: '',
        },
        mutations: {
            setPublicKey(state, key) {
                state.publicKey = key;
            },
        },
        actions: {
            async fetchPublicKey({ commit }) {
                try {
                    const response = await axios.post(config.api.permission.getKey.path, data);
                    if(response.code == 200){
                        commit('setPublicKey', response.data);
                    }else{
                        console.error('Error fetching public key:', response.message);
                    }
                } catch (error) {
                    console.error('Error fetching public key:', error);
                }
            },
        },
    });

    vuex.dispatch('fetchPublicKey');

    return vuex;
} 