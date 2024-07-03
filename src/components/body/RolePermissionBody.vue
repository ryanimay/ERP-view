<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" v-loading.fullscreen.lock="fullLoading">
        <span class="marginRight20">
            <el-button type="success" @click="openAddRole" >+{{ $t('rolePermissionBody.addRole') }}</el-button>
        </span>
        <span>
            <el-text size="large" tag="b" class="marginRight6">{{ $t('rolePermissionBody.searchRole') }}:</el-text>
            <el-input v-model="searchName" style="width: 200px" class="marginRight12" clearable />
            <el-button type="primary" @click="searchByName">
                <el-icon>
                    <Search />
                </el-icon>
                {{ $t('rolePermissionBody.search') }}
            </el-button>
            <el-button v-if="searchName" @click="searchReset">
                {{ $t('rolePermissionBody.reset') }}
            </el-button>
        </span>
        <el-tabs tab-position="left" type="border-card" @tab-click="targetChange" style="height: calc(99% - 35px); min-height: 200px; margin-top: 10px;">
            <div class="paddingBottom10 height40 alignCenter">
                <el-text size="large" tag="b" class="marginRight6">{{ $t('rolePermissionBody.roleId') }}:</el-text>
                <el-text size="large" tag="b" class="marginRight6">{{ currentRole.id }}</el-text>
            </div>
            <div class="paddingBottom10 height40 alignCenter">
                <el-text size="large" tag="b" class="marginRight6">{{ $t('rolePermissionBody.roleName') }}:</el-text>
                <el-input v-if="currentRole.name" v-model="currentRole.name" style="width: 150px; margin-right: 6px;" />
                <el-button v-if="currentRole.name" type="primary" @click="updateRoleName">{{ $t('rolePermissionBody.save') }}</el-button>
            </div>
            <div class="marginBottom10" >
                <el-text size="large" tag="b" class="marginRight6">{{ $t('rolePermissionBody.selectPermission') }}:</el-text>
            </div>
            <div class="maxFrame">
                <el-tab-pane style="height: 100%;" v-for="(role) in showRoleList" :key="role.id"
                    :label="role.roleName" :name="role.id">
                    <div>
                        <el-tree  
                        ref="tree"
                        :data="permissionList"
                        show-checkbox
                        node-key="id"
                        :props="{ disabled: (data) => checkDisabled(data) }"
                        >
                            <template #default="{ data }">
                                <span v-if="data.status === false"><s>{{ formatLabel(data) }}</s></span>
                                <span v-else>{{ formatLabel(data) }}</span>
                            </template>
                        </el-tree>
                    </div>
                </el-tab-pane>
            </div>
        </el-tabs>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const publicPermissionId = ref([]);
const loading = ref(false);
const fullLoading = ref(false);
const searchName = ref('');
const roleList = ref([]);
const showRoleList = ref([]);
const permissionList = ref([]);
const { proxy } = getCurrentInstance();
const tree = ref(null);
onMounted(async () => {
    loading.value = true;
    await getRoleList();
    await getPermissionList();
    loading.value = false;
});
const currentRole = reactive({
    id: null,
    name: null,
})
async function getPermissionList() {
    const response = await request.permissionList();
    const data = handleResponse(response);
    if (data) {
        permissionList.value = data;
        publicPermissionId.value = data.filter(item => item.info === '*').flatMap(item => item.children).map(child => child.id);   
    }
}
async function getRoleList() {
    const response = await request.roleList();
    const data = handleResponse(response);
    if (data) {
        roleList.value = data;
        showRoleList.value = data;
    }
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
async function targetChange(target){
    loading.value = true;
    currentRole.id = target.props.name;
    currentRole.name = target.props.label;
    await getRolePermission(target.index);
    loading.value = false;
}
async function getRolePermission(index) {
    const response = await request.rolePermission({'roleId': currentRole.id});
    const data = handleResponse(response);
    if (tree.value) {
        data.push(...publicPermissionId.value);//公開API固定勾選
        tree.value[index].setCheckedKeys(data);
    }
}
async function updateRoleName() {
    loading.value = true;
    const response = await request.updateRole(currentRole);
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        updateRoleListName();
    } else {
        proxy.$msg.error(response.data.data);
    }
    loading.value = false;
}
function updateRoleListName(){
    roleList.value.find(role => role.id === currentRole.id).roleName = currentRole.name;
    showRoleList.value = roleList.value;
}
function formatLabel(data){
    return data.children ? t('permission.' + data.info) : data.info;
}
//公開API鎖定
function checkDisabled(data){
    return data.info === '*' || data.authority === '*' || data.status === false ? true : false;
}
function searchByName(){
    currentRole.id = null;
    currentRole.name = null;
    showRoleList.value = roleList.value.filter(role => role.roleName.toLowerCase().includes(searchName.value.toLowerCase()));
}
function searchReset(){
    searchName.value = '';
    currentRole.id = null;
    currentRole.name = null;
    showRoleList.value = roleList.value;
}
</script>

<style scoped>
.marginRight6 {
    margin-right: 6px;
}

.marginRight12{
    margin-right: 12px;
}

.marginRight20 {
    margin-right: 20px;
}

.maxFrame {
    border: 1px solid #dcdfe6;
    width: 100%;
    height: calc(100% - 190px);
    min-height: 200px;
    overflow: auto;
}

.paddingBottom10 {
    padding-bottom: 10px;
}

.marginBottom10 {
    margin-bottom: 10px;
}

.height40 {
    height: 40px;
}

.alignCenter {
    display: flex;
    align-items: center;
}

</style>