<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading">
        <el-tabs tab-position="left" type="border-card" @tab-click="loadDepartmentClient" style="height:99%; ">
            <el-tab-pane v-for="(department) in departmentList" :key="department.id" :label="department.name" :name="department.id">
                <div v-if="clientList.length === 0">
                    <el-empty :description="$t('departmentBody.clientEmpty')" />
                </div>
                <div v-else>
                    <div>{{ department.roles }}</div>
                    <div>{{clientList}}</div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted } from 'vue';

const departmentList = ref([]);
const clientList = ref([]);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    await loadDepartmentList();
    loading.value = false;
});
async function loadDepartmentList(){
    const response = await request.departmentList();
    const data = handleResponse(response);
    if(data){
        departmentList.value = data.data;
    }
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
async function loadDepartmentClient(target){
    loading.value = true;
    const response = await request.departmentStaff({ "id" : target.props.name });
    const data = handleResponse(response);
    if(data){
        clientList.value = data;
    }
    loading.value = false;
    return true;
}
</script>

<style scope>

</style>