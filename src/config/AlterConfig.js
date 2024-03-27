import { createVNode, render } from 'vue';
import message from '@/components/tool/AlterMessage.vue';

const div = document.createElement('div');
div.setAttribute('class', 'message-container');
document.body.appendChild(div);

let timer = null;
const messageInstance = createVNode(message);

function sendInfo(type, text) {
    const divs = document.getElementsByClassName('message');
    if (divs.length > 0) {
        if (timer) {
            clearTimeout(timer);
        }
        render(null, div);
    }
    
    messageInstance.props = { type, text };
    render(messageInstance, div);
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        render(null, div);
    }, 3000);
}

export default {
    success(text) {
        sendInfo('success', text);
    },
    warn(text) {
        sendInfo('warn', text);
    },
    error(text) {
        sendInfo('error', text);
    },
};