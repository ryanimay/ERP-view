<template>
    <div class="message" :class="messageClass" v-if="visible">
        <span id="icon" v-html="svgContent"></span>
        <span class="text">{{ text }}</span>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';

const props = defineProps({
    text: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'error'
    }
});

const visible = ref(false);
const messageClass = ref('');
const svgContent = ref('');

onMounted(() => {
    switch (props.type) {
        case 'warn':
            svgContent.value = require('@/assets/icon/warn.svg').default;
            messageClass.value = 'warn-message';
            break;
        case 'error':
            svgContent.value = require('@/assets/icon/error.svg').default;
            messageClass.value = 'error-message';
            break;
        case 'success':
            svgContent.value = require('@/assets/icon/success.svg').default;
            messageClass.value = 'success-message';
            break;
        default:
            break;
    }
    visible.value = true;
});
</script>

<style scoped>
.message {
    position: fixed;
    z-index: 88888;
    top: 0;
    color: black;
    left: 50%;
    height: 40px;
    line-height: 40px;
    top: 60px;
    transform: translate(-50%);
    padding: 12px;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: downed 100ms ease;
    border-radius: 4px;
    box-sizing: border-box;
}

.warn-message {
    color: yellow;
}

.error-message {
    color: red;
}

.success-message {
    color: green;
}

#icon svg path {
    fill: red;
}

@keyframes downed {
    0% {
        opacity: 0;
        top: 50px;
    }

    100% {
        opacity: 1;
        top: 60px;
    }
}

.text {
    margin-left: 5px;
    max-width: 400px;
    overflow: ellipsis;
    white-space: nowrap;
}

#icon {
    width: 20px;
}
</style>