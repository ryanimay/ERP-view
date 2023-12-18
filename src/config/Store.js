import { createStore } from 'vuex';

export default createStore({
    state: {
        promptMessage: 'Somethings Wrong, Please Re-Login',
    },
    mutations: {
        setPromptMessage(state, data) {
            state.promptMessage = data;
        },
    },
    actions: {
        setPromptMessage({ commit }, data) {
            commit('setPromptMessage', data);
        },
    },
});