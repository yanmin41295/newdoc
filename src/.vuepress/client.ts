import {defineClientConfig} from '@vuepress/client'
import VXETable from 'vxe-table'
// import 'vxe-table/lib/style.css'
import VueExcelEditor from 'vue3-excel-editor'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

export default defineClientConfig({
    enhance: ({app, router, siteData}) => {
        // app.use(VXETable)
        app.use(Antd)
        app.use(VueExcelEditor);
    },
})
