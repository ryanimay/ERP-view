<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" v-loading.fullscreen.lock="fullLoading">
        <el-container>
            <el-header id="searchHeader">
                <span>
                    <span class="searchHeaderBlock">{{ $t('clientBody.search') }}</span>
                    <span class="searchHeaderBlock">
                        <el-select
                        v-model="requestParam.type"
                        style="width: 100px"
                        @change="changeCondition">
                        <el-option
                        v-for="item in searchCondition"
                            :key="item.value"
                            :label="$t(item.name)"
                            :value="item.value"
                            />
                        </el-select>
                    </span>
                    <span class="searchHeaderBlock">
                        <el-input v-if="requestParam.type == 1" class="no-number" @keydown="numberInput" @input="numSize" type="number" v-model="requestParam.id" style="width: 200px" clearable/>
                        <el-input v-else-if="requestParam.type == 2" v-model="requestParam.name" style="width: 200px" clearable/>
                        <el-input v-else v-model="requestParam.id" style="width: 200px" disabled/>
                    </span>
                    <span class="searchHeaderBlock">
                        <el-button type="primary" @click="requestClientList()">
                            <el-icon>
                                <Search />
                            </el-icon>
                            {{ $t('clientBody.search') }}
                        </el-button>
                    </span>
                </span>
                <span>
                    <el-button type="danger" @click="openApplyUser">
                        {{ $t('clientBody.applyNewUser') }}
                    </el-button>
                </span>
            </el-header>
            <el-main>
                <el-table
                    :data="clientList"
                    :default-sort="{ prop: 'id', order: 'ascending' }"
                    style="width: 100%" :border="true"
                    @sort-change="handleSortChange">
                    <el-table-column column-key="id" prop="id" label="ID" sortable='custom' width="65"/>
                    <el-table-column :label="$t('clientBody.col-username')" width="200">
                        <template #default="scope">
                            {{ scope.row.username }}
                            <el-tag v-if="!scope.row.email" type="danger" round effect="plain">{{ $t('clientBody.new') }}</el-tag>    
                        </template>    
                    </el-table-column>
                    <el-table-column prop="email" :label="$t('clientBody.col-email')" min-width="220"/>
                    <el-table-column column-key="department" prop="department.name" :label="$t('clientBody.col-departmentName')" sortable='custom' width="170" />
                    <el-table-column column-key="lastLoginTime" prop="lastLoginTime" :label="$t('clientBody.col-lastLoginTime')" sortable='custom' width="170" :formatter="formatTime2"/>
                    <el-table-column column-key="createTime" prop="createTime" :label="$t('clientBody.col-createTime')" sortable='custom' width="170" :formatter="formatTime1"/>
                    <el-table-column column-key="attendStatus" prop="attendStatus" :label="$t('clientBody.col-attendStatus')" width="120" sortable='custom' :align="'center'" sort-by="attendStatus">
                        <template #default="scope">
                            <el-tag :type="signType(scope.row.attendStatus)">{{ $t(signText(scope.row.attendStatus)) }}</el-tag>    
                        </template>
                    </el-table-column>
                    <el-table-column column-key="isActive" prop="active" :label="$t('clientBody.col-active')" sortable='custom' width="120" :align="'center'" sort-by="active" >
                        <template #default="scope">
                            <el-tag :type="statusType(scope.row.active)">{{ $t(statusText1(scope.row.active)) }}</el-tag>    
                        </template>
                    </el-table-column>
                    <el-table-column column-key="isLock" prop="lock" :label="$t('clientBody.col-lock')" sortable='custom' width="120" :align="'center'" sort-by="lock" >
                        <template #default="scope">
                            <el-tag :type="statusType(!scope.row.lock)">{{ $t(statusText2(scope.row.lock)) }}</el-tag>    
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('clientBody.col-edit')" width="100" :align="'center'">
                        <template #default="scope">
                            <el-button type="primary" @click="openEdit(scope.row)">
                                <el-icon>
                                    <EditPen />
                                </el-icon>
                                {{$t('clientBody.edit')}}
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
                    <span>{{ $t('clientBody.total') + ' ' + requestParam.totalElements + $t('clientBody.totalQuantifier')}}</span>
                    <span id="marginLeft12">
                        <el-select v-model="requestParam.pageSize" style="width: 110px" @change="handleSizeChange">
                            <el-option v-for="size in sizeOptions"
                                :key="size"
                                :label="size + $t('clientBody.pageQuantifier')"
                                :value="size"
                            />
                        </el-select>
                    </span>
                </span>
                </el-pagination>
            </el-footer>

            <!--申請新用戶彈窗-->
            <el-dialog v-model="applyUserDialog" :title="$t('clientBody.applyNewUser')" width="350" :before-close="handleClose">
                <el-form :model="applyUserData" label-position="right" @submit.prevent>
                    <el-form-item :label="$t('clientBody.col-username')+':'">
                        <el-input v-model="applyUserData.username" />
                    </el-form-item>
                    <el-form-item :label="$t('clientBody.col-departmentName')+':'">
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
                        <el-button @click="handleClose">{{ $t('clientBody.cancel') }}</el-button>
                        <el-button type="primary" @click="applyUser">{{ $t('clientBody.submit') }}</el-button>
                    </div>
                </template>
            </el-dialog>
            <!--編輯用戶彈窗-->
            <el-dialog v-model="editUserDialog" :title="$t('clientBody.editUser')" width="350" :before-close="handleCloseEdit">
                <el-form :model="applyUserData" label-position="right" @submit.prevent>
                    
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="handleCloseEdit">{{ $t('clientBody.cancel') }}</el-button>
                        <el-button type="primary" @click="applyUser">{{ $t('clientBody.submit') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </el-container>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import userStore from '@/config/store/user';
const user = userStore();
const { t } = useI18n();
const { proxy } = getCurrentInstance();
const applyUserData = reactive({
    createBy: user.id,
    username: null,
    departmentId: null
})
const applyUserDialog = ref(false);
const editUserDialog = ref(false);
const loading = ref(false);
const fullLoading = ref(false);
const clientList = ref([]);
const departmentList = ref([]);
const requestParam = reactive({
    type: null,
    id: null,
    name: null,
    pageNum:null,
    pageSize:null,
    sort: null,
    sortBy: null,
    totalElements:null,
    totalPage:null
})
const searchCondition = [
    {
        "name": "clientBody.col-id",
        "value": 1
    },{
        "name": "clientBody.col-username",
        "value": 2
    }
]
const sizeOptions = [10, 30, 50, 100]
onMounted(async () => {
    loading.value = true;
    const response = await request.clientList(requestParam);
    const data = handleResponse(response);
    updatePage(data);
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
async function requestClientList() {
    loading.value = true;
    const response = await request.clientList(requestParam);
    const data = handleResponse(response);
    updatePage(data);
    loading.value = false;
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
        clientList.value = response.data;
        requestParam.pageNum = response.pageNum;
        requestParam.pageSize = response.pageSize;
        requestParam.totalElements = response.totalElements;
        requestParam.totalPage = response.totalPage;
    }
}
function formatTime(time){
    return time ? time.replace("T", " ") : time;
}
function formatTime1(cellValue){
    return formatTime(cellValue.createTime);
}
function formatTime2(cellValue){
    return formatTime(cellValue.lastLoginTime);
}
function signType(type){
    switch (type) {
        case 1:
            return 'danger';
        case 2:
            return 'success';
        case 3:
            return 'warning';
        default:
            return '';
    }
}
function signText(type){
    switch (type) {
        case 1:
            return 'homeHeader.signText.noPunch';
        case 2:
            return 'homeHeader.signText.punch';
        case 3:
            return 'homeHeader.signText.clockOut';
        default:
            return '';
    }
}
function statusType(status){
    if(status === true){
        return 'primary';
    }else{
        return 'info';
    }
}
function statusText1(status){
    if(status === true){
        return 'clientBody.active.true';
    }else{
        return 'clientBody.active.false';
    }
}
function statusText2(status){
    if(status === true){
        return 'clientBody.lock.true';
    }else{
        return 'clientBody.lock.false';
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
    requestClientList();
}
function handleSizeChange(size){
    requestParam.pageSize = size;
    requestClientList();
}
function handleSortChange(data){
    requestParam.sort = getOrder(data.order);
    requestParam.sortBy = data.column.columnKey;
    requestClientList();
}
function getOrder(order){
    if(order === 'descending'){
        return 2;
    }else{
        return 1;
    }
}
function changeCondition(val){
    if(val === 1){
        requestParam.name = null;
    }else if(val === 2){
        requestParam.id = null;
    }else{
        requestParam.id = null;
        requestParam.name = null;
    }
}
function openApplyUser(){
    applyUserDialog.value = true;
}
function handleClose(){
    applyUserData.username = null;
    applyUserData.departmentId = null;
    applyUserDialog.value = false;
}
function handleCloseEdit(){
    ElMessageBox.confirm(t('clientBody.confirmClose'))
        .then(() => {
            editUserDialog.value = false
        })
        .catch((e) => {
            console.log(e);
        });
}
async function applyUser(){
    fullLoading.value = true;
    const response = await request.register(applyUserData);
    if(response.data.code === 200){
        proxy.$msg.success(response.data.data);
        applyUserData.username = null;
        applyUserData.departmentId = null;
        const clientResponse = await request.clientList();//新增完重載清單
        const data = handleResponse(clientResponse);
        updatePage(data);
        
        requestParam.type =  null;
        requestParam.id =  null;
        requestParam.name =  null;
        applyUserDialog.value = false;
        fullLoading.value = false;
    }else{
        proxy.$msg.error(response.data.data);
        fullLoading.value = false;
    }
}
function openEdit(row){
    console.log(row);
    editUserDialog.value = true;
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
</style>