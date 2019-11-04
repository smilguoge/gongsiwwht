<template>
  <div class="createPost-container">
    <sticky :class-name="'sub-navbar back'">
      <el-button v-loading="loading" size="medium" plain icon="el-icon-back" @click="back">返回列表</el-button>
    </sticky>
    <div class="app-container">
      <div class="filter-container">
        <el-input v-model="listQuery.name" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="序号" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="handleTree(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <el-dialog :visible.sync="dialogTreeVisible" title="详情" width="550px">
        <el-tree
          :data="menu.tree"
          :default-checked-keys="menu.checked"
          show-checkbox
          node-key="id"
          default-expand-all />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCompanyRoleList, getCompanyRoleTree } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky' // 粘性header组件

export default {
  name: 'CompanyRole',
  components: { Pagination, Sticky },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        company_id: '',
        name: ''
      },
      temp: {
        id: undefined,
        name: '',
        routes: []
      },
      dialogTreeVisible: false,
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      company_id: '',
      loading: false,
      menu: {
        tree: [],
        checked: []
      },
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [{ required: true, message: '名称为必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.company_id = this.$route.params && this.$route.params.company_id
    if (this.company_id === '') {
      this.$notify.error({
        title: '错误',
        message: '参数错误'
      })
    }
    this.getList()
  },
  methods: {
    back() {
      this.$router.push({ name: 'CompanyList' })
    },
    getList() {
      this.listLoading = true
      this.listQuery.company_id = this.company_id
      getCompanyRoleList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleTree() {
      this.dialogTreeVisible = true
      getCompanyRoleTree().then(response => {
        this.menu = response.data
      })
    }
  }
}
</script>
