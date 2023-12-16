<template>
    <div id='header'>
        <slot name="slot1"></slot>
        <slot name="slot2"></slot>
    </div>
</template>

<style scoped>
#header {
    flex: 50%;
    display: flex;
    background-color: #848484;
    flex-direction: column;
    height: 100vh;
    transition: background-color 0.5s ease;
    overflow: hidden;
}
#header:hover {
    background-color: rgb(117, 117, 117);
}
</style>