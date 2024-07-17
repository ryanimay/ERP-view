<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" >
        <div class="fullFrame">
            <span class="marginRight20">
                <el-button type="success" @click="openAddRole" >+{{ $t('roleMenuBody.addRole') }}</el-button>
            </span>
            <span>
                <el-text size="large" tag="b" class="marginRight6">{{ $t('roleMenuBody.searchRole') }}:</el-text>
                <el-input v-model="searchName" style="width: 200px" class="marginRight12" clearable />
                <el-button type="primary" @click="searchByName">
                    <el-icon>
                        <Search />
                    </el-icon>
                    {{ $t('roleMenuBody.search') }}
                </el-button>
                <el-button v-if="searchName" @click="searchReset">
                    {{ $t('roleMenuBody.reset') }}
                </el-button>
            </span>
            <el-tabs v-model="currentRole.id" ref="tabsContainer" tab-position="left" type="border-card" @tab-click="targetChange" @tab-remove="targetRemove" style="height: calc(100% - 43px); margin-top: 10px;">
                <div class="height40 alignCenter">
                    <el-text size="large" tag="b" class="marginRight6">{{ $t('roleMenuBody.roleId') }}:</el-text>
                    <el-text v-if="isValidId(currentRole.id)" size="large" tag="b" class="marginRight6">{{ currentRole.id }}</el-text>
                </div>
                <div class="paddingBottom10 height40 alignCenter">
                    <el-text size="large" tag="b" class="marginRight6">{{ $t('roleMenuBody.roleName') }}:</el-text>
                    <el-input v-if="currentRole.id" :placeholder="$t('roleMenuBody.pleaseInputRoleName')" v-model="currentRole.name" style="width: 200px; margin-right: 6px;" />
                    <el-button v-if="isValidId(currentRole.id)" type="primary" @click="updateRoleName">{{ $t('roleMenuBody.save') }}</el-button>
                    <el-button v-if="currentRole.id && isNaN(currentRole.id)" type="success" @click="createNewRole">{{ $t('roleMenuBody.create') }}</el-button>
                </div>
                <div class="marginBottom10" >
                    <el-text size="large" tag="b" class="marginRight12">{{ $t('roleMenuBody.selectMenu') }}:</el-text>
                    <el-button type="info" @click="expandAll(true)">{{ $t('roleMenuBody.expandTrue') }}</el-button>
                    <el-button @click="expandAll(false)">{{ $t('roleMenuBody.expandFalse') }}</el-button>
                </div>
                <div class="maxFrame marginBottom5">
                    <div v-if="currentRole.id === null" class="center fullFrame">
                        <el-empty :description="$t('roleMenuBody.selectRole')" />
                    </div>
                    <el-tab-pane style="height: 100%;" v-for="(role) in showRoleList" :key="role.id"
                        :label="role.roleName" :name="role.id" :closable="!isValidId(role.id)" >
                        <template #label >
                            <span class="justifyBetween alignCenter">
                                <span>{{ role.roleName }}</span>
                                <el-icon v-if="isValidId(role.id)" class="closeIcon" @click="removeChecked($event, role.id)" >
                                    <CloseBold />
                                </el-icon>
                            </span>
                        </template>
                        <div v-if="!isValidId(currentRole.id)" class="center fullFrame">
                            <el-empty :description="$t('roleMenuBody.createFirst')" />
                        </div>
                        <div v-else>
                            <el-tree  
                            ref="tree"
                            :data="allMenu"
                            :default-checked-keys="defaultMenuIds"
                            show-checkbox
                            node-key="id"
                            :props="defaultProps"
                            >
                                <template #default="{ data }">
                                    <span v-if="data.status === false"><s>{{ $t(data.name) }}</s></span>
                                    <span v-else>{{ $t(data.name) }}</span>
                                </template>
                            </el-tree>
                        </div>
                    </el-tab-pane>
                </div>
                <div class="justifyCenter">
                    <el-button v-if="isValidId(currentRole.id)" type="primary" @click="saveRoleMenu">
                        {{ $t('roleMenuBody.save') }}
                    </el-button>
                </div>
            </el-tabs>
        </div>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus'

const { t } = useI18n();
const defaultMenuIds = ref([]);
const loading = ref(false);
const searchName = ref('');
const roleList = ref([]);
const showRoleList = ref([]);
const allMenu = ref([]);
const { proxy } = getCurrentInstance();
const tree = ref(null);
const tabsContainer = ref(null);
onMounted(async () => {
    loading.value = true;
    await getRoleList();
    await getAllMenu();
    loading.value = false;
});
const currentRole = reactive({
    index: null,
    id: null,
    name: null,
})
async function getAllMenu() {
    const response = await request.allMenu();
    const data = handleResponse(response);
    if (data) {
        allMenu.value = data;
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
    currentRole.index = target.index;
    expandAll(false);
    if(isValidId(currentRole.id)){
        await getRoleMenu(target.index);
    }
    loading.value = false;
}
function targetRemove(id){
    showRoleList.value = showRoleList.value.filter(role => role.id !== id);
    currentRole.id = null;
    currentRole.name = null;
    currentRole.index = null;
}
async function getRoleMenu(index) {
    const response = await request.pMenu({'roleIds': currentRole.id});
    const data = handleResponse(response);
    const ids = getIdList(data);
    checkedRoleMenu(index, ids);
}
function checkedRoleMenu(index, ids){
    if (tree.value) {
        tree.value[index].setCheckedKeys(ids);
    }
}
function getIdList(data){
    return data.length === 0 ? [] : data.flatMap(item => {
        if(item.child) return item.child.map(child => child.id)
    });
}
async function updateRoleName() {
    loading.value = true;
    const response = await request.updateRole(currentRole);
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        updateRoleList();
    }
    loading.value = false;
}
async function createNewRole() {
    loading.value = true;
    const response = await request.addRole({
        'id': null,
        'name': currentRole.name
    });
    if (response && response.data.code === 200) {
        initNewRole(response.data.data);
        proxy.$msg.success(t('roleMenuBody.createSuccess'));
    }
    loading.value = false;
}
function initNewRole(data){
    currentRole.id = data.id;
    currentRole.name = data.roleName;
    roleList.value[currentRole.index] = {
        'id': currentRole.id,
        'roleName' : currentRole.name
    }
    showRoleList.value = JSON.parse(JSON.stringify(roleList.value));
}
function updateRoleList(){
    roleList.value.find(role => role.id === currentRole.id).roleName = currentRole.name;
    showRoleList.value = JSON.parse(JSON.stringify(roleList.value));
}
function searchByName(){
    currentRole.id = null;
    currentRole.name = null;
    showRoleList.value = roleList.value.filter(role => role.roleName ? role.roleName.toLowerCase().includes(searchName.value.toLowerCase()) : false);
}
function searchReset(){
    searchName.value = '';
    currentRole.id = null;
    currentRole.name = null;
    showRoleList.value = JSON.parse(JSON.stringify(roleList.value));
}
async function saveRoleMenu(){
    loading.value = true;
    const ids = await getCheckedIds();
    const response = await request.updateRoleMenu({
        'id': currentRole.id,
        'menuIds': ids,
    });
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
    }
    loading.value = false;
}
async function getCheckedIds(){
    let ids = new Set();
    await tree.value[currentRole.index].getCheckedNodes().forEach(node => {
        console.log(node);
        if(node.parentsId) ids.add(node.parentsId);
        ids.add(node.id);
    });
    return Array.from(ids);
}
function expandAll(isExpand){
    for(const index in tree.value){
        const rootNode = tree.value[index].store.root.childNodes;
        if(rootNode){
            for(const node in rootNode){
                rootNode[node].expanded = isExpand;
            }
        }
    }
}
function openAddRole(){
    //先拿length才push新資料，所以index不用-1
    const index = showRoleList.value.length;
    const newId = 'new' + index;
    showRoleList.value.push({id: newId});
    focusNew(newId, index);
}
function focusNew(newId, index){
    currentRole.id = newId;
    currentRole.name = null;
    currentRole.index = index;
    expandAll(false);
}
//有效ID
function isValidId(id){
    return id && !isNaN(id);
}
async function removeRole(id){
    loading.value = true;
    const response = await request.removeRole({ 'id': id });
    if (response && response.data.code === 200) {
        removeRoleList(id);
        cleanCurrentRole();
        proxy.$msg.success(response.data.data);
    }
    loading.value = false;
}
function removeRoleList(id){
    roleList.value = roleList.value.filter(role => role.id !== id);//移除被刪除的role
    showRoleList.value = JSON.parse(JSON.stringify(roleList.value));
}
function cleanCurrentRole(){
    currentRole.id = null;
    currentRole.name = null;
    currentRole.index = null;
}
function removeChecked(event, id){
    event.stopPropagation();
    ElMessageBox.confirm(
        t('roleMenuBody.deleteRoleWarning'),
        t('roleMenuBody.warning'),
        {
            confirmButtonText: t('roleMenuBody.delete'),
            cancelButtonText: t('roleMenuBody.cancel'),
            type: 'danger',
        }
    ).then(() => {
        removeRole(id);
    }
    ).catch(() => { });
}
const defaultProps = {
    children: 'child', 
    label: 'name'
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

.marginSide16 {
    margin: 0px 16px;
}

.maxFrame {
    border: 1px solid #dcdfe6;
    width: 100%;
    height: 485px;
    overflow: auto;
}

.paddingBottom10 {
    padding-bottom: 10px;
}

.marginBottom10 {
    margin-bottom: 10px;
}

.marginBottom5 {
    margin-bottom: 5px;
}

.height40 {
    height: 40px;
}

.alignCenter {
    display: flex;
    align-items: center;
}

.justifyCenter {
    display: flex;
    justify-content: center;
}

.center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.fullFrame {
    width: 100%;
    height: 100%;
}

.justifyBetween{
    width: 100%;
    display: flex;
    justify-content: space-between
}

.closeIcon{
    border-radius: 50%;
    text-align: center;
    transition: all 0.2s;
    color: #909399;
}

.closeIcon:hover{
    background-color: #ee7c7c;
    color: #dddddd;
}
</style>