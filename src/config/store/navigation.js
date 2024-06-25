import { defineStore } from 'pinia';

var homeName = 'home'

const navigationStore = defineStore(
    'navigation',
    {
        state: () => ({
            path: [homeName]
        }),
        actions: {
            updatePath(router){
                this.path = [homeName];
                if(router.meta.parentName){
                    this.path.push(router.meta.parentName);
                }
                if(router.name !== homeName){
                    this.path.push(router.name);
                }
            }
        }
    }
)

export default navigationStore;