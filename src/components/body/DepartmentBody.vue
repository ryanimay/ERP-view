<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading">
        <el-tabs tab-position="left" type="border-card" @tab-click="targetChange" style="height:99%; ">
            <div>
                <div class="paddingBottom10 height40 alignCenter">
                    <el-text size="large" tag="b" class="marginRight6">{{$t('departmentBody.defaultRole')}}:</el-text>
                    <el-select
                    v-if="defaultRole"
                    v-model="defaultRole"
                    placeholder="Select"
                    size="large"
                    style="width: 240px"
                    >
                    <el-option
                        v-for="role in departmentRoles"
                        :key="role.id"
                        :label="role.roleName"
                        :value="role.id"
                    />
                    </el-select>
                </div>
                <div class="paddingBottom10 height40 alignCenter">
                    <el-text size="large" tag="b" class="marginRight6">{{$t('departmentBody.departmentRoles')}}:</el-text>
                    <el-button v-for="(role) in departmentRoles" :key="role.id" :color="getRoleColor(role.id)">{{role.roleName}}</el-button>
                </div>
                <div class="paddingBottom10 height40 alignCenter">
                    <el-text size="large" tag="b" class="marginRight6">{{$t('departmentBody.search')}}:</el-text>
                    <el-input style="width: 200px" class="marginRight6" clearable/>
                    <el-button type="primary" @click="requestClientList()">
                        <el-icon>
                            <Search />
                        </el-icon>
                        {{ $t('departmentBody.search') }}
                    </el-button>
                </div>
            </div>
            <div class="maxFrame">
                <div v-if="clientList.length === 0" class="center fullFrame">
                    <el-empty :description="$t('departmentBody.clientEmpty')" />
                </div>
                <el-tab-pane style="height: 100%;" v-for="(department) in departmentList" :key="department.id" :label="department.name" :name="department.id">
                    <div v-if="clientList.length !== 0">
                        <el-table :data="clientList" stripe style="width: 100%" :border="true">
                            <el-table-column prop="id" :label="$t('departmentBody.col-id')" width="80" :align="'center'"/>
                            <el-table-column prop="username" :label="$t('departmentBody.col-username')" width="180" />
                            <el-table-column :label="$t('departmentBody.col-roles')" >
                                <template #default="scope">
                                    <el-tag v-for="role in scope.row.roles" :key="role.id" :color="getRoleColor(role.id)">{{ role.roleName }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('departmentBody.col-config')" width="100" :align="'center'">
                            <template #default="scope">
                                <el-button type="primary" @click="openEdit(scope.row)" size="small">
                                    <el-icon>
                                        <EditPen />
                                    </el-icon>
                                </el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </div>
        </el-tabs>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted } from 'vue';

const letters = '0123456789ABCDEF';
const defaultRole = ref();
const departmentList = ref([]);
const departmentRoles = ref([]);
const clientList = ref([]);
const loading = ref(false);
const colors = ref({});

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
function targetChange(target){
    colors.value = {};
    updateData(target);
    getRandomColors();
    loadDepartmentClient(target);
}
function updateData(target){
    console.log(departmentList.value.find(t => t.id === target.props.name));
    const department = departmentList.value.find(t => t.id === target.props.name);
    defaultRole.value = department.role;
    departmentRoles.value = department.roles;
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
function getRoleColor(id){
    return colors.value[id] || 'gray';
}
function getRandomColors(){
    departmentRoles.value.forEach(role => {
        colors.value[role.id] = getRandomColor();
    });
}
function getRandomColor(){
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
</script>

<style scope>
.center{
    display:flex;
    align-items:center;
    justify-content:center;
}
.maxFrame{
    border: 1px solid #dcdfe6;
    width:100%;
    height: calc(100% - 180px);
    min-height: 200px;
}
.fullFrame{
    width: 100%;
    height: 100%;
}
.paddingBottom10{
    padding-bottom: 10px;
}
.marginRight6{
    margin-right: 6px;
}
.height40{
    height: 40px;
}
.alignCenter{
    display: flex;
    align-items: center;
}
</style>