<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.label" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-view" @click="handleTree">查看树状图</el-button>
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
          <span>
            <el-tooltip v-if="scope.row.manage_service === '1'" content="服务菜单" placement="top">
              <svg-icon icon-class="star"/>
            </el-tooltip>
            {{ scope.row.label }} ({{ scope.row.route }})
          </span>
        </template>
      </el-table-column>
      <el-table-column label="所属父级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pname }}</span>
        </template>

      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">

        <el-form-item label="名称" prop="label">
          <el-input v-model="temp.label" placeholder="请输入名称 如：用户列表"/>
        </el-form-item>
        <el-form-item label="别名" prop="route">
          <el-input v-model="temp.route" placeholder="请输入别名 如：UserList"/>
        </el-form-item>

        <el-form-item label="所属分类" prop="pid">
          <el-select v-model="temp.pid" placeholder="父级分类" clearable class="filter-item">
            <el-option v-for="item in plist" :key="item.id" :label="item.label" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" placeholder="请输入排序 越大越靠前"/>
        </el-form-item>
        <el-form-item label="服务菜单" prop="manage_service">
          <el-switch
            v-model="temp.manage_service"
            active-value="1"
            inactive-value="0"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogTreeVisible" title="菜单树状图" width="550px">
      <el-tree
        :data="menu"
        node-key="id"
        default-expand-all />
    </el-dialog>

  </div>
</template>

<script>
import { getCompanyMenutree, postCompanyMenu, getCompanyMenuList, getCompanyMenuPlist, deleteCompanyMenu } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'CompanyMenu',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      plist: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        label: ''
      },
      temp: {
        id: undefined,
        label: '',
        route: '',
        sort: '',
        manage_service: '0',
        pid: ''
      },
      dialogTreeVisible: false,
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        label: [{ required: true, message: '名称为必填项', trigger: 'blur' }],
        route: [{ required: true, message: '路由为必填项', trigger: 'blur' }]
      },
      menu: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCompanyMenuList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getPlist() {
      getCompanyMenuPlist().then(response => {
        this.plist = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        label: '',
        route: '',
        sort: '',
        manage_service: '0',
        pid: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.getPlist()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postCompanyMenu(this.temp).then(response => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.getPlist()
      row.pid = row.pid === '0' ? '' : row.pid
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          postCompanyMenu(tempData).then(response => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, response.data)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCompanyMenu(row).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      }).catch(() => {

      })
    },
    handleTree() {
      this.dialogTreeVisible = true
      getCompanyMenutree().then(response => {
        this.menu = response.data
      })
    }
  }
}
</script>
