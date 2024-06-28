<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading">
        <el-tabs tab-position="left" type="border-card" @tab-click="targetChange" style="height:99%; ">
            <div>
                <div class="paddingBottom10 height40 alignCenter">
                    <el-text size="large" tag="b" class="marginRight6">{{$t('departmentBody.defaultRole')}}:</el-text>
                    <el-select
                    v-if="currentDepartment.defaultRoleId"
                    v-model="currentDepartment.defaultRoleId"
                    placeholder="Select"
                    size="large"
                    style="width: 240px"
                    @change="updateDepartment"
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
                    <el-button color="gray" @click="searchByRole(null)" :loading="clicked === null ? true : false" loading-icon="StarFilled" >{{$t('departmentBody.all')}}</el-button>
                    <el-button v-for="(role) in departmentRoles" :key="role.id" :color="getRoleColor(role.id)" @click="searchByRole(role.id)" :loading="clicked === role.id ? true : false" loading-icon="StarFilled" >{{role.roleName}}</el-button>
                </div>
                <div class="paddingBottom10 height40 alignCenter">
                    <span>
                        <el-text size="large" tag="b" class="marginRight6">{{$t('departmentBody.search')}}:</el-text>
                        <el-input v-model="searchName" style="width: 200px" class="marginRight6" clearable/>
                        <el-button type="primary" @click="searchByName()">
                            <el-icon>
                                <Search />
                            </el-icon>
                            {{ $t('departmentBody.search') }}
                        </el-button>
                    </span>
                    <span>
                        <el-text size="large" tag="b" class="marginLeft30">{{$t('departmentBody.total')}}:{{ showClientList.length }}</el-text>
                    </span>
                </div>
            </div>
            <div class="maxFrame">
                <div v-if="showClientList.length === 0" class="center fullFrame">
                    <el-empty :description="$t('departmentBody.clientEmpty')" />
                </div>
                <el-tab-pane style="height: 100%;" v-for="(department) in departmentList" :key="department.id" :label="department.name" :name="department.id">
                    <div v-if="showClientList.length !== 0">
                        <el-table :data="showClientList" stripe style="width: 100%" :border="true" :show-overflow-tooltip="true">
                            <el-table-column prop="id" :label="$t('departmentBody.col-id')" width="80" :align="'center'"/>
                            <el-table-column prop="username" :label="$t('departmentBody.col-username')" width="180" />
                            <el-table-column :label="$t('departmentBody.col-roles')" >
                                <template #default="scope">
                                    <el-tag v-for="role in scope.row.roles" :key="role.id" :color="getRoleColor(role.id)" type="info"><p id="fontBlack">{{ role.roleName }}</p></el-tag>
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
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';

const searchName = ref('');
const clicked = ref(null);
const departmentList = ref([]);
const departmentRoles = ref([]);
const clientList = ref([]);
const showClientList = ref([]);
const loading = ref(false);
const colors = ref({});
const { proxy } = getCurrentInstance();
const currentDepartment = reactive({
    id: null,
    name: null,
    defaultRoleId: null,
    roles:[]
});

onMounted(async () => {
    loading.value = true;
    await loadDepartmentList();
    loading.value = false;
});
async function loadDepartmentList(){
    const response = await request.departmentList({"pageSize":100});
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
    clicked.value = null;
    colors.value = {};
    currentDepartment.roles = [];
    updateData(target);
    getRandomColors();
    loadDepartmentClient(target);
}
function updateData(target){
    const department = departmentList.value.find(t => t.id === target.props.name);
    departmentRoles.value = department.roles;
    currentDepartment.id = department.id;
    currentDepartment.name = department.name;
    currentDepartment.defaultRoleId = department.role.id;
    department.roles.forEach(r => currentDepartment.roles.push(r.id));
}
async function loadDepartmentClient(target){
    loading.value = true;
    const response = await request.departmentStaff({ "id" : target.props.name });
    const data = handleResponse(response);
    if(data){
        clientList.value = data;
        showClientList.value = data;
    }
    loading.value = false;
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
    return "hsla(" + ~~(360 * Math.random()) + "," +
                    "50%,"+
                    "80%,1)"
}
async function updateDepartment(){
    loading.value = true;
    const response = await request.departmentEdit(currentDepartment);
    if(response || response.data.code === 200){
        proxy.$msg.success(response.data.data);
    }else{
        proxy.$msg.error(response.data.data);
    }
    loading.value = false;
}
function searchByRole(id){
    searchName.value = '';
    clicked.value = id;
    if(id === null){
        showClientList.value = clientList.value;
    }else{
        const data = clientList.value.filter(client =>
            client.roles.some(role => role.id === id)
        );
        showClientList.value = data;
    }
}
function searchByName(){
    clicked.value = null;
    const data = clientList.value.filter(client =>
        client.username.toLowerCase().includes(searchName.value.toLowerCase())
    );
    showClientList.value = data;
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
    height: calc(100% - 190px);
    min-height: 200px;
    overflow: auto;
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
.marginLeft30{
    margin-left: 30px;
}
.height40{
    height: 40px;
}
.alignCenter{
    display: flex;
    align-items: center;
}
#fontBlack{
    color: black;
}
</style>