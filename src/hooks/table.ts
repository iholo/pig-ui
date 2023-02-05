import {ElMessage} from "element-plus";
import {useMessage} from "./message";
import request from "/@/utils/request";

export interface BasicTableProps {
    // 是否在创建页面时，调用数据列表接口
    createdIsNeed?: boolean
    // 是否需要分页
    isPage?: boolean
    // 查询条件
    queryForm?: any
    // 数据列表
    dataList?: any[]
    // 分页属性
    pagination?: Pagination,
    // 数据列表，loading状态
    dataListLoading?: boolean
    // 数据列表，多选项
    dataListSelections?: any[]
    // 接口api
    pageList?: (...arg: any) => Promise<any>
    // loading
    loading?: Boolean
}

export interface Pagination {
    // 排序字段
    order?: string
    // 是否升序
    asc?: boolean
    // 当前页码
    current?: number
    // 每页数
    size?: number
    // 总条数
    total?: number

    pageSizes?: any[]

    layout?: String
}


export function useTable(options?: BasicTableProps) {
    const defaultOptions: BasicTableProps = {
        dataListLoading: false,
        createdIsNeed: true,
        isPage: true,
        queryForm: {},
        dataList: [],
        pagination: {
            order: '',
            asc: false,
            current: 1,
            size: 10,
            total: 0,
            pageSizes: [1, 10, 20, 50, 100, 200],
            layout: "total, sizes, prev, pager, next, jumper"
        } as Pagination,
        dataListSelections: [],
        loading: false
    }

    const mergeDefaultOptions = (options: any, props: any): BasicTableProps => {
        for (const key in options) {
            if (!Object.getOwnPropertyDescriptor(props, key)) {
                props[key] = options[key]
            }
        }
        return props
    }

    // 覆盖默认值
    const state = mergeDefaultOptions(defaultOptions, options)


    const query = () => {
        if (state.pageList) {
            state.loading = true
            state.pageList({
                ...state.queryForm,
                current: state.pagination?.current,
                size: state.pagination?.size,
                order: state.pagination?.order,
                asc: state.pagination?.asc,
            }).then(res => {
                state.dataList = state.isPage ? res.data.records : res.data
                state.pagination!.total = state.isPage ? res.data.total : 0
            }).catch(err => {
                ElMessage.error(err.response.data.msg)
            }).finally(() => {
                state.loading = false;
            })
        }
    }


    onMounted(() => {
        if (state.createdIsNeed) {
            query()
        }
    })

    // 分页改变
    const sizeChangeHandle = (val: number) => {
        state.pagination!.size = val;
        query();
    };
    // 分页改变
    const currentChangeHandle = (val: number) => {
        state.pagination!.current = val;
        query();
    };

    // 排序
    const sortChangeHandle = (data: any) => {
        const {prop, order} = data

        if (prop && order) {
            state.pagination!.order = prop
            state.pagination!.asc = order === 'ascending'
        } else {
            state.pagination!.order = ''
        }

        query()
    }

    const getDataList = () => {
        state.pagination!.current = 1
        query()
    }

    //  下载文件
    const downBlobFile = (url: string, query: any, fileName: string) => {
        return request({
            url: url,
            method: 'get',
            responseType: 'blob',
            params: query
        }).then((response: any) => {
            // 处理返回的文件流
            if (response && response.size === 0) {
                useMessage().error('内容为空，无法下载')
                return
            }
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(response)
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            window.setTimeout(function () {
                window.URL.revokeObjectURL(response)
                document.body.removeChild(link)
            }, 0)
        })
    }

    return {
        getDataList,
        sizeChangeHandle,
        currentChangeHandle,
        sortChangeHandle,
        downBlobFile
    }

}