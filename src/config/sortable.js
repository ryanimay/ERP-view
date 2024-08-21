import Sortable from 'sortablejs'

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
        sort: true,
        ghostClass: 'sortable-ghost',
        onEnd: (e) => {
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