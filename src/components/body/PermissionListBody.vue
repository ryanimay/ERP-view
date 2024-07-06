<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading">
        <el-collapse>
            <el-collapse-item v-for="(permission) in permissionList" :key="permission.id" :name="permission.id" class="collapseParents">
                <template #title>
                    <div class="marginLeft20"><b>{{ $t('permission.' + permission.info) }}</b></div>
                </template>
                <div v-for="(node) in permission.children" :key="node.id" class="marginLeft20">
                    <span>
                        {{ node.id }}
                    </span>
                    <span>
                        {{ node.authority }}
                    </span>
                    <span>
                        {{ node.info }}
                    </span>
                    <span>
                        {{ node.url }}
                    </span>
                    <span>
                        {{ node.status }}
                    </span>
                </div>
            </el-collapse-item>
        </el-collapse>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted } from 'vue';

const permissionList = ref([]);
const loading = ref(false);
onMounted(async () => {
    loading.value = true;
    await getPermissionList();
    loading.value = false;
});
async function getPermissionList() {
    const response = await request.permissionList();
    const data = handleResponse(response);
    if (data) {
        permissionList.value = data;
    }
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
</script>

<style scoped>
.marginLeft20{
    margin-left: 20px;;
}
</style>