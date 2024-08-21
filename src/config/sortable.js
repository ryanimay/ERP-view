import Sortable from 'sortablejs';

let sortableInstance = null
export function setSort(tableData, element) {
    const el = document.querySelector(element)
    if (!el) {
        console.error('Element not found: ', element)
        return
    }
    if (sortableInstance) {
        sortableInstance.destroy();
        sortableInstance = null
    }
    sortableInstance = new Sortable(el, {
        animation: 150,//過渡動畫
        sort: true,
        ghostClass: 'sortable-ghost',//被選取樣式
        forceFallback: true,//禁用html，下面autoScroll配置才會生效
        scrollSensitivity: 100,//觸發滾動距離
        scrollSpeed: 15,//滾動速度
        onStart: () => {
            document.body.style.userSelect = 'none'; // 禁用文本選擇，避免拖曳反白
        },
        onEnd: (e) => {
            document.body.style.userSelect = ''; // 恢復文本選擇
            const targetRow = tableData.splice(e.oldIndex, 1)[0]
            tableData.splice(e.newIndex, 0, targetRow)
        },
    })
}

export function destroy() {
    if (sortableInstance) {
        sortableInstance.destroy();
        sortableInstance = null
    }
}