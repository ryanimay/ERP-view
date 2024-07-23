<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" v-loading.fullscreen.lock="fullLoading">
        <el-container>
            <el-header id="searchHeader">
                <span>
                    <span class="searchHeaderBlock">{{ $t('salarySettingBody.search') }}</span>
                    <span class="searchHeaderBlock">
                    <el-input oninput="value = value.replace(/[^\d]/g, ''); if (value > 9999) value = 9999;" v-model="requestParam.userId" style="width: 200px" clearable :placeholder="$t('salarySettingBody.pleaseInputUserId')"/>
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
                            <el-button type="primary" icon="EditPen" @click="openEdit(scope.row)" />
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

            <!--新增薪資設定彈窗-->
            <el-dialog v-model="addNewRootDialog" :title="$t('salarySettingBody.addNewRoot')" width="350" @close="cleanAddDialog">
                <el-form :model="salaryRoot" label-position="right" @submit.prevent>
                    <el-form-item :label="$t('salarySettingBody.col-userId')+':'">
                        <el-tooltip
                            placement="top"
                            trigger="hover"
                            :content="$t('salarySettingBody.col-userIdPrompt')">
                            <el-input 
                            ref="userIdCol"
                            v-model="salaryRoot.userId" 
                            @input="handleUserIdInput"/>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item :label="$t('salarySettingBody.col-baseSalary')+':'">
                        <el-input  
                        ref="baseSalaryCol"
                        v-model="salaryRoot.baseSalary" 
                        :formatter="(value) => '$ '+ `${value}`.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"/>
                    </el-form-item>
                    <el-form-item :label="$t('salarySettingBody.col-mealAllowance')+':'">
                        <el-input v-model="salaryRoot.mealAllowance"
                        :formatter="(value) => '$ '+ `${value}`.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"/>
                    </el-form-item>
                    <el-form-item :label="$t('salarySettingBody.col-laborInsurance')+':'">
                        <el-input v-model="salaryRoot.laborInsurance" 
                        :formatter="(value) => '$ '+ `${value}`.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"/>
                    </el-form-item>
                    <el-form-item :label="$t('salarySettingBody.col-nationalHealthInsurance')+':'">
                        <el-input v-model="salaryRoot.nationalHealthInsurance" 
                        :formatter="(value) => '$ '+ `${value}`.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"/>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="addSalaryRoot">{{ $t('salarySettingBody.save') }}</el-button>
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
const salaryRoot = reactive({
    id: null,
    userId: '',
    baseSalary: '',
    mealAllowance: '',
    laborInsurance: '',
    nationalHealthInsurance: '',
    root: true
})
const userIdCol = ref(false);
const baseSalaryCol = ref(false);
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
async function addSalaryRoot(){
    fullLoading.value = true;
    if(!dataInvalid()){
        const response = await request.editSalaryRoots(salaryRoot);
        if(response.data.code === 200){
            proxy.$msg.success(response.data.data);
            await loadSalaryRoots();//新增完重載清單
            addNewRootDialog.value = false;
        }
    }
    fullLoading.value = false;
}
function dataInvalid(){
    if(salaryRoot.userId === ''){
        proxy.$msg.error(t('salarySettingBody.pleaseInputUserId'));
        userIdCol.value.focus();
        return true;
    }else if(salaryRoot.baseSalary === '' || parseInt(salaryRoot.baseSalary) === 0){
        proxy.$msg.error(t('salarySettingBody.pleaseInputBaseSalary'));
        baseSalaryCol.value.focus();
        return true;
    }
    return false;
}
function openEdit(row){
    editData.id = row.id;
    editData.departmentId = row.department ? row.department.id : null;
    editUserDialog.value = true;
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
function cleanAddDialog(){
    salaryRoot.userId = '';
    salaryRoot.baseSalary = '';
    salaryRoot.mealAllowance = '';
    salaryRoot.laborInsurance = '';
    salaryRoot.nationalHealthInsurance = '';
}
const handleUserIdInput = (value) => {
    console.log(value);
    let formattedValue = value.replace(/[^\d]/g, ''); // 只保留数字
    if (formattedValue > 9999) formattedValue = 9999; // 限制最大值为9999
    salaryRoot.userId = formattedValue; // 更新数据模型
};
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