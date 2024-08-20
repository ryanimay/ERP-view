<template>
    <el-main class="homeBodyContainer" v-loading.fullscreen.lock="fullLoading">
        <el-container class="height100">
            <el-header class="alignCenter flexBetween">
                <span>
                    <el-text size="large" tag="b" class="marginRight6">{{$t('projectList.markColor')}}:</el-text>
                    <el-color-picker :disabled="!markColor" 
                    v-model="markColor" 
                    size="large"
                    :predefine="predefineColors"
                    @change="changeMarkColor"
                    @active-change="showPickColor" 
                    @focus="openColorPicker = true"
                    @blur="resetColor"/>
                </span>
                <span>
                    <el-button @click="addDialog = true" type="primary">
                        {{$t('projectList.addNewProject')}}
                    </el-button>
                </span>
            </el-header>
            <el-main class="height100">
                <el-tabs v-model="searchParams.type" type="border-card" @tab-change="handleClick" style="height: calc(100% - 30px); min-height: 200px;">
                    <el-tab-pane v-for="item in typeList" :key="item.name" :label="$t(item.label)" :name="item.name" v-loading.lock="loading"  style="height: calc(100% - 39px);">
                        <el-table
                        :data="projectList"
                        style="width: 100%;" 
                        :show-overflow-tooltip="true"
                        :row-style="tableRowStyle"
                        :highlight-current-row="true"
                        row-class-name="noHoverClass"
                        @current-change="rowClick"
                        height="100%">
                            <el-table-column column-key="id" prop="id" :label="$t('projectList.id')" min-width="50" :align="'center'" />
                            <el-table-column :label="$t('projectList.name')" min-width="90" >
                                <template #default="scope">
                                    <div class="el-input" v-if="scope.row.isEdit" >
                                        <div class="el-input__wrapper">
                                            <input class="el-input__inner" v-model.lazy="scope.row.name" :ref="el => inputNameRef[scope.$index] = el"/>
                                        </div>
                                    </div>
                                    <el-text v-else>{{scope.row.name}}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('projectList.type')" min-width="150"  width="150">
                                <template #default="scope">
                                    <el-select
                                    v-if="scope.row.isEdit"
                                    v-model="scope.row.type" 
                                    style="width: 135px">
                                    <el-option
                                    v-for="item in typeList"
                                        :key="item.name"
                                        :label="$t(item.label)"
                                        :value="item.name"
                                        />
                                    </el-select>
                                    <el-text v-else>{{getTypeLabel(scope.row.type)}}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('projectList.scheduledStartTime')" min-width="120" >
                                <template #default="scope">
                                    <el-date-picker
                                        v-if="scope.row.isEdit"
                                        v-model="scope.row.scheduledStartTime"
                                        type="date"
                                        placeholder="Pick a day"
                                        value-format="YYYY-MM-DD"
                                        style="width:100%"
                                    />
                                    <el-text v-else>{{scope.row.scheduledStartTime}}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('projectList.scheduledEndTime')" min-width="120" >
                                <template #default="scope">
                                    <el-date-picker
                                        v-if="scope.row.isEdit"
                                        v-model="scope.row.scheduledEndTime"
                                        type="date"
                                        placeholder="Pick a day"
                                        value-format="YYYY-MM-DD"
                                        style="width:100%"
                                    />
                                    <el-text v-else>{{scope.row.scheduledEndTime}}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('projectList.info')" min-width="150" >
                                <template #default="scope">
                                    <div class="el-input" v-if="scope.row.isEdit" >
                                        <div class="el-input__wrapper">
                                            <input class="el-input__inner" v-model.lazy="scope.row.info" />
                                        </div>
                                    </div>
                                    <el-text v-else>{{scope.row.info}}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column prop="manager.username" :label="$t('projectList.manager')" min-width="135" width="135" >
                                <template #default="scope">
                                    <el-select 
                                    v-if="scope.row.isEdit"
                                    v-model="scope.row.manager.id" 
                                    :placeholder="$t('projectList.selectManager')" 
                                    style="width: 100%"
                                    @change="(val) => updateManagerName(scope.row, val)">
                                        <el-option v-for="client in clientNameList"
                                            :key="client.id"
                                            :label="client.username"
                                            :value="client.id"
                                        />
                                    </el-select>
                                    <el-text v-else>{{scope.row.manager.username}}</el-text>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('projectList.edit')" min-width="60" :align="'center'">
                                <template #default="scope">
                                    <el-button 
                                    v-if="scope.row.isEdit" 
                                    type="primary"
                                    circle 
                                    @click="saveRow(scope)" >
                                        <el-icon>
                                            <Upload />
                                        </el-icon>
                                    </el-button>
                                    <el-button 
                                    v-else 
                                    circle 
                                    :disabled="scope.row.status === 3"
                                    @click="scope.row.isEdit = true" >
                                        <el-icon>
                                            <Edit />
                                        </el-icon>
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('projectList.status')" min-width="120" :align="'center'" >
                                <template #default="scope">
                                    <el-popconfirm
                                    width="250"
                                    :confirm-button-text="$t('projectList.statusOk')"
                                    :cancel-button-text="$t('projectList.statusCencel')"
                                    cancel-button-type="info"
                                    icon="InfoFilled"
                                    :title="$t('projectList.statusAsk')"
                                    @confirm="clickStatus(scope.row)"
                                    >
                                        <template #reference>
                                            <el-button 
                                            plain
                                            size="small" 
                                            :type="statusType(scope.row)"
                                            :disabled="scope.row.status !== 1 && scope.row.status !== 2">
                                            {{getStatusName(scope.row.status)}}
                                            </el-button>
                                        </template>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
        <!--新增專案-->
        <el-dialog v-model="addDialog" :title="$t('projectList.addNewProject')" width="1200" @close="closeAdd">
            <el-table :data="[addProjectModel]" style="width: 100%">
                <el-table-column :label="$t('projectList.name')" min-width="90" >
                    <template #default="scope">
                        <el-input v-model="scope.row.name" ref="addNameRef"/>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('projectList.type')" min-width="150"  width="150">
                    <template #default="scope">
                        <el-select
                        v-model="scope.row.type" 
                        style="width: 135px"
                        ref="addTypeRef">
                        <el-option
                        v-for="item in typeList"
                            :key="item.name"
                            :label="$t(item.label)"
                            :value="item.name"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('projectList.scheduledStartTime')" min-width="120" >
                    <template #default="scope">
                        <el-date-picker
                            v-model="scope.row.scheduledStartTime"
                            type="date"
                            placeholder="Pick a day"
                            value-format="YYYY-MM-DD"
                            style="width:100%"
                        />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('projectList.scheduledEndTime')" min-width="120" >
                    <template #default="scope">
                        <el-date-picker
                            v-model="scope.row.scheduledEndTime"
                            type="date"
                            placeholder="Pick a day"
                            value-format="YYYY-MM-DD"
                            style="width:100%"
                        />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('projectList.info')" min-width="150" >
                    <template #default="scope">
                        <el-input v-model="scope.row.info" />
                    </template>
                </el-table-column>
                <el-table-column prop="manager.username" :label="$t('projectList.manager')" min-width="135" >
                    <template #default="scope">
                        <el-select 
                        v-model="scope.row.managerId" 
                        :placeholder="$t('projectList.selectManager')" 
                        style="width: 100%"
                        @change="(val) => updateManagerName(scope.row, val)">
                            <el-option v-for="client in clientNameList"
                                :key="client.id"
                                :label="client.username"
                                :value="client.id"
                            />
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addDialog = false">{{ $t('projectList.statusCencel') }}</el-button>
                    <el-button type="primary" @click="addProject">{{ $t('projectList.save') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, reactive, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { proxy } = getCurrentInstance();
const openColorPicker = ref(false);
const loading = ref(false);
const fullLoading = ref(false);
const addDialog = ref(false);
const addNameRef = ref(null);
const addTypeRef = ref(null);
const clientNameList = ref([]);
const projectList = ref([]);
const inputNameRef = ref([]);
const predefineColors = ref([
  '#B0CADC',
  '#D0B0DC',
  '#DCB0B0',
  '#DCCCB0',
  '#B0DCC0',
])
const searchParams = reactive({
    id: null,
    name: null,
    type: '1',//預設搜尋
    scheduledStartTime: null,
    scheduledEndTime: null,
    info: null,
    managerId: null,
    status: null,
    markColor: null
})
const markColor = ref(null);
const currentRow = ref(null);
const currentProject = reactive({
    id: null,
    name: null,
    type: null,
    scheduledStartTime: null,
    scheduledEndTime: null,
    info: null,
    managerId: null,
    status: null,
    markColor: null
})
const addProjectModel = reactive({
    name: null,
    type: null,
    scheduledStartTime: null,
    scheduledEndTime: null,
    info: null,
    managerId: null
})
const typeList = [
    {
        "label":"projectList.type1",
        "name":"1"
    },
    {
        "label":"projectList.type2",
        "name":"2"
    },
    {
        "label":"projectList.type3",
        "name":"3"
    }
];
const statusList = [
    {
        "id":1,
        "name":"projectList.status1"
    },
    {
        "id":2,
        "name":"projectList.status2"
    },
    {
        "id":3,
        "name":"projectList.status3"
    }
]
onMounted(async () => {
    loading.value = true;
    await loadProject();
    await loadClientNameList();
    loading.value = false;
});
async function loadProject() {
    const response = await request.projectList(searchParams);
    const data = handleResponse(response);
    projectList.value = data;
}
async function updateProject() {
    loading.value = true;
    const response = await request.updateProject(currentProject);
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        loading.value = false;
        return true;
    }
    loading.value = false;
}
async function loadClientNameList() {
    const response = await request.clientNameList();
    const data = handleResponse(response);
    clientNameList.value = data;
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
function handleClick(){
    loading.value = true;
    inputNameRef.value = [];//陣列歸零
    markColor.value = null;//清除標記顏色
    loadProject();
    loading.value = false;
}
function tableRowStyle(col) {
    return { 
        backgroundColor: col.row.markColor
    }; 
}
function rowClick(row){
    currentRow.value = row;
    if(row){
        markColor.value = row.markColor ? row.markColor : '#FFFFFF';
        currentProject.id = row.id;
        currentProject.markColor = row.markColor;//記錄舊顏色
    }
}
function changeMarkColor(color){
    if (color !== currentProject.markColor) {
        clearCurrentProject();
        currentProject.markColor = color ? color : '#FFFFFF';
        updateProject();
    }
}
function showPickColor(color){
    if(openColorPicker.value){
        currentRow.value.markColor = color;
    }
}
function resetColor(){
    if(openColorPicker.value){
        openColorPicker.value = false;
        if(currentRow.value.markColor !== currentProject.markColor){
            currentRow.value.markColor = currentProject.markColor;
        }
    }
}
function clearCurrentProject(){
    currentProject.name = null;
    currentProject.type = null;
    currentProject.scheduledStartTime = null;
    currentProject.scheduledEndTime = null;
    currentProject.info = null;
    currentProject.managerId = null;
    currentProject.status = null;
    currentProject.markColor =  null;
}
function saveRow(scope){
    if(checkEditName(scope)){
        currentProject.id = scope.row.id;
        currentProject.name = scope.row.name;
        currentProject.type = scope.row.type;
        currentProject.scheduledStartTime = scope.row.scheduledStartTime;
        currentProject.scheduledEndTime = scope.row.scheduledEndTime;
        currentProject.info = scope.row.info;
        currentProject.managerId = scope.row.manager.id;
        currentProject.status = scope.row.status;
        currentProject.markColor = scope.row.markColor;
        const rs = updateProject();
        if(rs){
            //更新成功關閉編輯
            scope.row.isEdit = false;
            //如果type改變，就從當前列表移除不顯示
            if(scope.row.type !== searchParams.type) {
                projectList.value = projectList.value.filter(item => item.id !== scope.row.id);
            }
        }
    }
}
function checkEditName(scope){
    if(scope.row.name && scope.row.name.trim()){
        return true;
    }
    proxy.$msg.error(t('projectList.pleaseInputName'));
    inputNameRef.value[scope.$index].focus();
    return false;
}
function getTypeLabel(typeName){
    const type = typeList.find(item => item.name === typeName);
    return type ? t(type.label) : typeName;
}
function updateManagerName(row, val){
    const selectedManager = this.clientNameList.find(client => client.id === val);
    if (selectedManager && row.manager) {
        row.manager.username = selectedManager.username;
    }
}
function getStatusName(statusId){
    const status = statusList.find(item => item.id === statusId);
    return status ? t(status.name) : statusId;
}
function statusType(row){
    if(row.status === 1){
        return 'primary'
    }else if(row.status === 2){
        return 'success'
    }else{
        return 'info'
    }
}
function clickStatus(row){
    if(row.status === 1){
        if(requestStartProject(row.id)){
            row.status = 2;
        }
    }else if(row.status === 2){
        if(requestDoneProject(row.id)){
            row.status = 3;
        }
    }
}
async function requestStartProject(id){
    loading.value = true;
    const response = await request.startProject({"id": id});
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        loading.value = false;
        return true;
    }
    loading.value = false;
}
async function requestDoneProject(id){
    loading.value = true;
    const response = await request.doneProject({"id": id});
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
        loading.value = false;
        return true;
    }
    loading.value = false;
}
async function addProject(){
    if(checkAddParam()){
        fullLoading.value = true;
        const response = await request.addProject(addProjectModel);
        if (response && response.data.code === 200) {
            proxy.$msg.success(response.data.data);
            loadProject();
            addDialog.value = false;
        }
        fullLoading.value = false;
    }
}
function checkAddParam(){
    if(!addProjectModel.name || !addProjectModel.name.trim()){
        proxy.$msg.error(t('projectList.pleaseInputName'));
        addNameRef.value.focus();
        return false;
    }else if(!addProjectModel.type){
        proxy.$msg.error(t('projectList.pleaseInputType'));
        addTypeRef.value.focus();   
        return false;
    }
    return true;
}
function closeAdd(){
    addProjectModel.name = null;
    addProjectModel.type = null;
    addProjectModel.scheduledStartTime = null;
    addProjectModel.scheduledEndTime = null;
    addProjectModel.info = null;
    addProjectModel.managerId = null;
}
</script>

<style scoped>
.height100{
    height: 100%;
}
.alignCenter{
    display: flex;
    align-items: center;
}
.marginRight6{
    margin-right: 6px;
}
.flexBetween{
    display: flex;
    justify-content: space-between;
}
</style>