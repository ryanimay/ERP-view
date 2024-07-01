<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" v-loading.fullscreen.lock="fullLoading">
        <el-tabs tab-position="left" type="border-card" @tab-click="targetChange" style="height:99%;">
            <div>
                <div class="paddingBottom10 height40 alignCenter spaceBetween">
                    <span>
                        <el-button v-if="currentDepartment.id" type="primary" @click="openEditDepartment">{{ $t('departmentBody.edit') }}</el-button>
                        <el-button v-else type="primary" disabled>{{ $t('departmentBody.edit') }}</el-button>
                    </span>
                    <span>
                        <el-button v-if="currentDepartment.id" type="danger" @click="removeWarning">{{ $t('departmentBody.remove') }}</el-button>
                        <el-button v-else type="danger" disabled>{{ $t('departmentBody.remove') }}</el-button>
                    </span>
                </div>
                <div class="paddingBottom10 height40 alignCenter">
                    <el-text size="large" tag="b" class="marginRight6">{{ $t('departmentBody.departmentRoles') }}:</el-text>
                    <el-button color="gray" @click="searchByRole(null)" :loading="clicked === null ? true : false"
                        loading-icon="StarFilled">{{ $t('departmentBody.all') }}</el-button>
                    <el-button v-for="(role) in departmentRoles" :key="role.id" :color="getRoleColor(role.id)"
                        @click="searchByRole(role.id)" :loading="clicked === role.id ? true : false"
                        loading-icon="StarFilled">{{ role.roleName }}</el-button>
                </div>
                <div class="paddingBottom10 height40 alignCenter">
                    <span>
                        <el-text size="large" tag="b" class="marginRight6">{{ $t('departmentBody.search') }}:</el-text>
                        <el-input v-model="searchName" style="width: 200px" class="marginRight6" clearable />
                        <el-button type="primary" @click="searchByName()">
                            <el-icon>
                                <Search />
                            </el-icon>
                            {{ $t('departmentBody.search') }}
                        </el-button>
                    </span>
                    <span>
                        <el-text size="large" tag="b" class="marginLeft30">{{ $t('departmentBody.total') }}:{{ showClientList.length }}</el-text>
                    </span>
                </div>
            </div>
            <div class="maxFrame">
                <div v-if="showClientList.length === 0" class="center fullFrame">
                    <el-empty :description="$t('departmentBody.clientEmpty')" />
                </div>
                <el-tab-pane style="height: 100%;" v-for="(department) in departmentList" :key="department.id"
                    :label="department.name" :name="department.id">
                    <div v-if="showClientList.length !== 0">
                        <el-table :data="showClientList" stripe style="width: 100%" :border="true"
                            :show-overflow-tooltip="true">
                            <el-table-column :resizable="false" prop="id" :label="$t('departmentBody.col-id')"
                                width="80" :align="'center'" />
                            <el-table-column :resizable="false" prop="username"
                                :label="$t('departmentBody.col-username')" width="180" />
                            <el-table-column :resizable="false" :label="$t('departmentBody.col-roles')">
                                <template #default="scope">
                                    <el-tag v-for="role in scope.row.roles" :key="role.id" class="marginRight6"
                                        :color="getRoleColor(role.id)" type="info">
                                        <p id="fontBlack">{{ role.roleName }}</p>
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column :resizable="false" :label="$t('departmentBody.col-config')" width="100"
                                :align="'center'">
                                <template #default="scope">
                                    <el-button type="primary" @click="openEdit(scope.row)">
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
        <!--編輯部門-->
        <el-dialog v-model="editDepartmentDialog" :title="$t('departmentBody.edit')" width="350" destroy-on-close>
            <div class="paddingBottom10 alignCenter">
                <el-text size="large" tag="b" class="marginRight6">{{ $t('departmentBody.col-id') }}:</el-text>
                <el-text size="large" tag="b">{{ departmentRequest.id }}</el-text>
            </div>
            <div class="paddingBottom10 alignCenter">
                <el-text size="large" tag="b" class="marginRight6">{{ $t('departmentBody.departmentName') }}:</el-text>
                <el-input v-model="departmentRequest.name" style="width: 150px" />
            </div>
            <div class="paddingBottom10 alignCenter">
                <el-text size="large" tag="b" class="marginRight6">{{ $t('departmentBody.defaultRole') }}:</el-text>
                <el-select v-if="departmentRequest.defaultRoleId" v-model="departmentRequest.defaultRoleId"
                    placeholder="Select" size="default" style="width: 150px" >
                    <el-option v-for="role in departmentRoles" :key="role.id" :label="role.roleName"
                        :value="role.id" />
                </el-select>
            </div>
            <div>

            </div>
            <div class="justifyEnd padding10">
                <el-button type="primary" @click="updateDepartment">{{ $t('departmentBody.save') }}</el-button>
            </div>
        </el-dialog>
        <!--編輯部門用戶角色-->
        <el-dialog v-model="editUserDialog" :title="$t('departmentBody.col-config')" width="350" destroy-on-close>
            <div>
                <el-text size="large" tag="b" class="marginRight6">{{ $t('departmentBody.canAdd') }}:</el-text>
                <el-button v-for="(role) in departmentRoles" :key="role.id" :color="getRoleColor(role.id)"
                    @click="addRoleTag(role)" size="small" class="margin3">{{ role.roleName }} +</el-button>
            </div>
            <el-divider />
            <div class="paddingBottom10">
                <el-text size="large" tag="b" class="marginRight6">{{ $t('departmentBody.col-username') }}:</el-text>
                <el-text size="large" tag="b">{{ currentName }}</el-text>
            </div>
            <div>
                <el-text size="large" tag="b" class="marginRight6">{{ $t('departmentBody.clientRole') }}:</el-text>
                <el-tag v-for="role in userRolesRequest.roles" :key="role.id" class="margin3"
                    :color="getRoleColor(role.id)" type="info" closable @close="removeRoleTag(role.id)">
                    <p id="fontBlack">{{ role.roleName }}</p>
                </el-tag>
            </div>
            <div class="justifyEnd padding10">
                <el-button type="primary" @click="editClientRole">{{ $t('departmentBody.save') }}</el-button>
            </div>
        </el-dialog>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus'

const { t } = useI18n();
const editDepartmentDialog = ref(false);
const editUserDialog = ref(false);
const searchName = ref('');
const clicked = ref(null);
const departmentList = ref([]);
const departmentRoles = ref([]);
const clientList = ref([]);
const showClientList = ref([]);
const fullLoading = ref(false);
const loading = ref(false);
const colors = ref({});
const { proxy } = getCurrentInstance();
const departmentRequest = reactive({
    id: null,
    name: null,
    defaultRoleId: null,
    roles: []
});
const currentDepartment = reactive({
    id: null,
    name: null,
    defaultRoleId: null,
    roles: []
});
const currentName = ref('');
const userRolesRequest = reactive({
    id: null,
    roles: []
});

onMounted(async () => {
    loading.value = true;
    await loadDepartmentList();
    loading.value = false;
});
async function loadDepartmentList() {
    const response = await request.departmentList({ "pageSize": 100 });
    const data = handleResponse(response);
    if (data) {
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
function targetChange(target) {
    clicked.value = null;
    colors.value = {};
    updateData(target.props.name);
    getRandomColors();
    loadDepartmentClient(target);
}
function updateData(id) {
    const department = departmentList.value.find(t => t.id === id);
    departmentRoles.value = department.roles;
    currentDepartment.id = department.id;
    currentDepartment.name = department.name;
    currentDepartment.defaultRoleId = department.role.id;
    currentDepartment.roles = [];
    department.roles.forEach(r => currentDepartment.roles.push(r.id));
}
async function loadDepartmentClient(target) {
    loading.value = true;
    const response = await request.departmentStaff({ "id": target.props.name });
    const data = handleResponse(response);
    if (data) {
        clientList.value = data;
        showClientList.value = data;
    }
    loading.value = false;
}
function getRoleColor(id) {
    return "hsla(" + colors.value[id] + ", 50%, 80%, 1)" || 'gray';
}
function getRandomColors() {
    departmentRoles.value.forEach(role => {
        let newHue;
        do {
            newHue = getRandomHue();
        } while (isSimilarHueExists(newHue));
        colors.value[role.id] = newHue;
    });
}
function getRandomHue() {
    return ~~(360 * Math.random());
}
//隨機數要30以上不然看不出差別
function isSimilarHueExists(hue) {
    for (const key in colors.value) {
        const existingHue = colors.value[key];
        const diff = Math.abs(hue - existingHue);
        if (Math.min(diff, 360 - diff) < 30) return true;
    }
    return false;
}
async function updateDepartment() {
    fullLoading.value = true;
    const response = await request.departmentEdit(departmentRequest);
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        editDepartmentDialog.value=false;
        await loadDepartmentList();
        updateData(departmentRequest.id);
    } else {
        proxy.$msg.error(response.data.data);
    }
    fullLoading.value = false;
}
function searchByRole(id) {
    searchName.value = '';
    clicked.value = id;
    if (id === null) {
        showClientList.value = clientList.value;
    } else {
        const data = clientList.value.filter(client =>
            client.roles.some(role => role.id === id)
        );
        showClientList.value = data;
    }
}
function searchByName() {
    clicked.value = null;
    const data = clientList.value.filter(client =>
        client.username.toLowerCase().includes(searchName.value.toLowerCase())
    );
    showClientList.value = data;
}
function openEdit(row) {
    currentName.value = row.username;
    userRolesRequest.id = row.id;
    userRolesRequest.roles = JSON.parse(JSON.stringify(row.roles));
    editUserDialog.value = true;
}
function removeRoleTag(id) {
    userRolesRequest.roles = userRolesRequest.roles.filter(role => role.id !== id);
}
function addRoleTag(role) {
    if (!(userRolesRequest.roles.some(r => r.id === role.id))) {
        userRolesRequest.roles.push(role);
    }
}
async function editClientRole() {
    loading.value = true;
    userRolesRequest.roles = userRolesRequest.roles.map(role => role.id);
    const response = await request.update(userRolesRequest);
    const data = handleResponse(response);
    if (data) {
        reloadStaff(data);
        proxy.$msg.success(t('departmentBody.updateSuccess'));
        editUserDialog.value = false;
    } else {
        proxy.$msg.error(response.data.data);
    }
    loading.value = false;
}
function reloadStaff(data) {
    const newRole = departmentRoles.value.filter(item => data.roleId.includes(item.id));
    const staff = clientList.value.find(item => item.id === data.id);
    if (staff) {
        staff.roles = newRole;
    }
}
const removeWarning = () => {
    ElMessageBox.confirm(
        t('departmentBody.deleteDepartmentWarning'),
        t('departmentBody.warning'),
        {
            confirmButtonText: t('departmentBody.delete'),
            cancelButtonText: t('departmentBody.cancel'),
            type: 'danger',
        }
    ).then(() => {
        removeDepartment();
    }
    ).catch(() => { });
}
async function removeDepartment(){
    fullLoading.value = true;
    const response = await request.removeDepartment({ 'id' : currentDepartment.id });
    if(response && response.data.code === 200){
        proxy.$msg.success(response.data.data);
        departmentList.value = departmentList.value.filter(department => department.id !== currentDepartment.id);
    }else{
        proxy.$msg.error(response.data.data);
    }
    fullLoading.value = false;
}
function openEditDepartment(){
    departmentRequest.id = currentDepartment.id;
    departmentRequest.name = currentDepartment.name;
    departmentRequest.defaultRoleId = currentDepartment.defaultRoleId;
    departmentRequest.roles = currentDepartment.roles;
    editDepartmentDialog.value=true;
}
</script>

<style scope>
.center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.maxFrame {
    border: 1px solid #dcdfe6;
    width: 100%;
    height: calc(100% - 190px);
    min-height: 200px;
    overflow: auto;
}

.fullFrame {
    width: 100%;
    height: 100%;
}

.paddingBottom10 {
    padding-bottom: 10px;
}

.marginRight6 {
    margin-right: 6px;
}

.margin3 {
    margin: 3px !important;
}

.marginLeft30 {
    margin-left: 30px;
}

.height40 {
    height: 40px;
}

.alignCenter {
    display: flex;
    align-items: center;
}

.spaceBetween {
    display: flex;
    justify-content: space-between;
}

#fontBlack {
    color: black;
}

.justifyEnd {
    display: flex;
    justify-content: flex-end;
}

.padding10 {
    padding: 5px 10px 10px 0px;
}
</style>