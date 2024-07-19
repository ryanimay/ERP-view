<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" v-loading.fullscreen.lock="fullLoading">
        <el-container>
            <el-header id="searchHeader">
                <span>
                    <span class="searchHeaderBlock">{{ $t('salarySettingBody.search') }}</span>
                    <span class="searchHeaderBlock">
                        <el-input @keydown="numberInput" @input="numSize" type="number" v-model="requestParam.userId" style="width: 200px" clearable :placeholder="$t('salarySettingBody.pleaseInputUserId')"/>
                    </span>
                    <span class="searchHeaderBlock">
                        <el-button type="primary" @click="requestSalaryRoots()">
                            <el-icon>
                                <Search />
                            </el-icon>
                            {{ $t('salarySettingBody.search') }}
                        </el-button>
                    </span>
                </span>
                <span>
                    <el-button type="danger" @click="openAddNewRoot">
                        {{ $t('salarySettingBody.addNewRoot') }}
                    </el-button>
                </span>
            </el-header>
            <el-main>
                <el-table
                    :data="rootList"
                    :default-sort="{ prop: 'user.id', order: 'ascending' }"
                    style="width: 100%" :border="true"
                    @sort-change="handleSortChange"
                    :show-overflow-tooltip="true">
                    <el-table-column column-key="userId" prop="user.id" :label="$t('salarySettingBody.col-userId')" sortable='custom' min-width="65"/>
                    <el-table-column column-key="username" prop="user.username" :label="$t('salarySettingBody.col-username')" min-width="130"/>
                    <el-table-column column-key="baseSalary" prop="baseSalary" :label="$t('salarySettingBody.col-baseSalary')" min-width="150"/>
                    <el-table-column column-key="mealAllowance" prop="mealAllowance" :label="$t('salarySettingBody.col-mealAllowance')" sortable='custom' min-width="130" />
                    <el-table-column column-key="laborInsurance" prop="laborInsurance" :label="$t('salarySettingBody.col-laborInsurance')" sortable='custom' min-width="130"/>
                    <el-table-column column-key="nationalHealthInsurance" prop="nationalHealthInsurance" :label="$t('salarySettingBody.col-nationalHealthInsurance')" sortable='custom' min-width="130"/>
                    <el-table-column column-key="time" prop="time" :label="$t('salarySettingBody.col-time')" min-width="105" sortable='custom' :align="'center'" />
                    <el-table-column :label="$t('clientBody.col-config')" min-width="80" :align="'center'">
                        <template #default="scope">
                            <el-button type="primary" @click="openEdit(scope.row)" >
                                <el-icon>
                                    <EditPen />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <!-- :total有bug，不做轉型console會報錯，雖然運行沒影響但是很煩 -->
            <el-footer id="footer">
                <el-pagination 
                background 
                layout="slot, prev, pager, next" 
                :pager-count="11"
                :current-page="requestParam.pageNum"
                :total="parseInt(requestParam.totalElements)"
                :page-count="requestParam.totalPage"
                @current-change="handleCurrentChange">
                <span class="fontBold">
                    <span>{{ $t('salarySettingBody.total') + ' ' + requestParam.totalElements + $t('salarySettingBody.totalQuantifier') }}</span>
                    <span id="marginLeft12">
                        <el-select v-model="requestParam.pageSize" style="width: 110px" @change="handleSizeChange">
                            <el-option v-for="size in sizeOptions"
                                :key="size"
                                :label="size + $t('salarySettingBody.pageQuantifier')"
                                :value="size"
                            />
                        </el-select>
                    </span>
                </span>
                </el-pagination>
            </el-footer>

            <!--申請新用戶彈窗-->
            <el-dialog v-model="addNewRootDialog" :title="$t('salarySettingBody.addNewRoot')" width="350">
                <el-form :model="applyUserData" label-position="right" @submit.prevent>
                    <el-form-item :label="$t('salarySettingBody.col-username')+':'">
                        <el-input v-model="applyUserData.username" ref="registerUserName"/>
                    </el-form-item>
                    <el-form-item :label="$t('salarySettingBody.col-departmentName')+':'">
                        <el-select v-model="applyUserData.departmentId" style="width: 150px" placeholder="none">
                            <el-option v-for="val in departmentList"
                            :key="val.id"
                            :label="val.name"
                            :value="val.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="handleClose">{{ $t('salarySettingBody.cancel') }}</el-button>
                        <el-button type="primary" @click="applyUser">{{ $t('salarySettingBody.submit') }}</el-button>
                    </div>
                </template>
            </el-dialog>
            <!--設置用戶狀態彈窗-->
            <el-dialog v-model="editUserDialog" :title="$t('salarySettingBody.col-config')" width="350" destroy-on-close>
                <div id="bordorTop">
                    <div class="alignCenter">
                        <el-text size="large" tag="b">{{$t('salarySettingBody.col-departmentName')}}:</el-text>
                        <el-select v-model="editData.departmentId" style="width: 150px; margin: 10px" placeholder="none">
                            <el-option v-for="val in departmentList"
                            :key="val.id"
                            :label="val.name"
                            :value="val.id"
                            />
                        </el-select>
                        <el-button type="primary" @click="editUser">{{ $t('salarySettingBody.save') }}</el-button>
                    </div>
                    <div class="alignCenter">
                        <el-text size="large" tag="b">{{$t('salarySettingBody.col-active')}}:</el-text>
                        <el-switch v-model="statusData.active" inline-prompt size="large" style="margin-left: 10px; --el-switch-on-color: #67c23a; --el-switch-off-color: #f56c6c" @change="changeActive">
                            <template #active-action>
                                <el-icon><Select></Select></el-icon>
                            </template>
                            <template #inactive-action>
                                <el-icon><CloseBold /></el-icon>
                            </template>
                        </el-switch>
                    </div>
                    <div class="alignCenter">
                        <el-text size="large" tag="b">{{$t('salarySettingBody.col-lock')}}:</el-text>
                        <el-switch v-model="statusData.lock" inline-prompt size="large" style="margin-left: 10px; --el-switch-on-color: #f56c6c; --el-switch-off-color: #67c23a" @change="changeLock">
                            <template #active-action>
                                <el-icon><Select></Select></el-icon>
                            </template>
                            <template #inactive-action>
                                <el-icon><CloseBold /></el-icon>
                            </template>
                        </el-switch>
                    </div>
                </div>
            </el-dialog>
        </el-container>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue';
import userStore from '@/config/store/user';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const user = userStore();
const { proxy } = getCurrentInstance();
const editData = reactive({
    id: null,
    departmentId: null,
})
const statusData = reactive({
    clientId: null,
    username: null,
    active: null,
    lock: null,
})
const applyUserData = reactive({
    createBy: user.id,
    username: null,
    departmentId: null
})
const registerUserName = ref(false);
const addNewRootDialog = ref(false);
const editUserDialog = ref(false);
const loading = ref(false);
const fullLoading = ref(false);
const rootList = ref([]);
const departmentList = ref([]);
const requestParam = reactive({
    userId: null,
    pageNum:null,
    pageSize:null,
    sort: null,
    sortBy: null,
    totalElements:null,
    totalPage:null
})
const sizeOptions = [10, 30, 50, 100]
onMounted(async () => {
    loading.value = true;
    await loadSalaryRoots();
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
async function requestSalaryRoots() {
    loading.value = true;
    await loadSalaryRoots(requestParam);
    loading.value = false;
}
async function loadSalaryRoots(requestParam){
    const response = await request.salaryRoots(requestParam);
    const data = handleResponse(response);
    console.log(data);
    updatePage(data);
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
function updatePage(response){
    if(response){
        rootList.value = response.data;
        requestParam.pageNum = response.pageNum;
        requestParam.pageSize = response.pageSize;
        requestParam.totalElements = response.totalElements;
        requestParam.totalPage = response.totalPage;
    }
}
//擋掉科學記號
function numberInput(val){
    if(val.key === 'e' || val.key === 'E' || val.key === '-' || val.key === '+'){
        val.preventDefault();
    }
}
function numSize(val){
    if(val > 99999){
        requestParam.id = 99999;
    }
}
function handleCurrentChange(page){
    requestParam.pageNum = page;
    requestSalaryRoots();
}
function handleSizeChange(size){
    requestParam.pageSize = size;
    requestSalaryRoots();
}
function handleSortChange(data){
    requestParam.sort = getOrder(data.order);
    requestParam.sortBy = data.column.columnKey;
    requestSalaryRoots();
}
function getOrder(order){
    if(order === 'descending'){
        return 2;
    }else{
        return 1;
    }
}
function openAddNewRoot(){
    addNewRootDialog.value = true;
}
function handleClose(){
    applyUserData.username = null;
    applyUserData.departmentId = null;
    addNewRootDialog.value = false;
}
async function applyUser(){
    fullLoading.value = true;
    if(dataInvalid()){
        proxy.$msg.error(t('salarySettingBody.pleaseInputUserName'));
        registerUserName.value.focus();
    }else{
        const response = await request.register(applyUserData);
        if(response.data.code === 200){
            proxy.$msg.success(response.data.data);
            applyUserData.username = null;
            applyUserData.departmentId = null;
            await loadSalaryRoots();//新增完重載清單
            requestParam.id =  null;
            requestParam.name =  null;
            addNewRootDialog.value = false;
        }
    }
    fullLoading.value = false;
}
function dataInvalid(){
    return !applyUserData.username || applyUserData.username.trim() === '';
}
function openEdit(row){
    statusData.clientId = row.id;
    statusData.username = row.username;
    statusData.active = row.active;
    statusData.lock = row.lock;
    editData.id = row.id;
    editData.departmentId = row.department ? row.department.id : null;
    editUserDialog.value = true;
}
async function changeActive(val){
    fullLoading.value = true;
    statusData['status'] = val;
    const response = await request.clientStatus(statusData);
    handleClientStatusResponse(response);
    fullLoading.value = false;
}
async function changeLock(val){
    fullLoading.value = true;
    statusData['status'] = val;
    const response = await request.clientLock(statusData);
    handleClientStatusResponse(response);
    fullLoading.value = false;
}
async function handleClientStatusResponse(response){
    if(response.data.code === 200){
        proxy.$msg.success(response.data.data);
        await loadSalaryRoots(requestParam);//更新完重載
    }
}
async function editUser(){
    fullLoading.value = true;
    const response = await request.update(editData);
    const data = handleResponse(response);
    if(data){
        proxy.$msg.success(t('salarySettingBody.updateSuccess'));
        await loadSalaryRoots(requestParam);
        if(editData.id === user.id){
            user.update(data);
        }
    }
    fullLoading.value = false;
}
</script>

<style scope>
#footer{
    display: flex;
    justify-content: flex-end;
}
.fontBold{
    font-weight: bold;
}
#marginLeft12{
    margin-left: 12px;
}
#searchHeader{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.searchHeaderBlock{
    padding-right: 10px;
}
#bordorTop{
    border-Top: 1px solid #cccccc;
}
.alignCenter{
    display: flex;
    align-items: center;
}
</style>