<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="ID" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" width="200">
        <template slot-scope="scope">
          <span>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="地图key" align="center" width="300">
        <template slot-scope="scope">
          {{ scope.row.map_key }}
        </template>
      </el-table-column>
      <el-table-column label="sid" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.map_sid }}
        </template>
      </el-table-column>
      <el-table-column label="推送设置">
        <template slot-scope="scope">
          access_key_id:{{ scope.row.access_key_id }}<br>
          access_key_secret:{{ scope.row.access_key_secret }}<br>
          ios_app_key:{{ scope.row.ios_app_key }}<br>
          android_app_key:{{ scope.row.android_app_key }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" size="mini">
            <span class="el-dropdown-link" @click="handleUpdate(scope.row)">
              编辑
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{name:'AppVersionList', params:{setup_id: scope.row.id}}">
                  版本控制
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="750px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 650px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="地图key" prop="map_key">
          <el-input v-model="temp.map_key" :disabled="dialogStatus==='update'" placeholder="请输入地图key"/>
        </el-form-item>
        <el-form-item label="推送账号" prop="">
          <el-input v-model="temp.access_key_id" placeholder="access_key_id"/>
        </el-form-item>
        <el-form-item label="推送密钥" prop="">
          <el-input v-model="temp.access_key_secret" placeholder="access_key_secret"/>
        </el-form-item>
        <el-form-item label="ios appkey" prop="">
          <el-input v-model="temp.ios_app_key" placeholder="ios_app_key"/>
        </el-form-item>
        <el-form-item label="安卓appkey" prop="">
          <el-input v-model="temp.android_app_key" placeholder="android_app_key"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :disabled="submit_disabled" type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getAppSetupList, postAppSetup, deleteAppSetup } from '@/api/app_setup'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination'

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

export default {
  name: 'AppSetup',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      company_list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: ''
      },
      statusOptions,
      temp: {
        id: '',
        name: '',
        map_key: '',
        access_key_id: '',
        access_key_secret: '',
        ios_app_key: '',
        android_app_key: '',
        remark: '',
        map_sid: ''
      },
      submit_disabled: false,
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        map_key: [{ required: true, message: '地图key不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '名称为必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAppSetupList(this.listQuery).then(response => {
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
    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        map_key: '',
        access_key_id: '',
        access_key_secret: '',
        ios_app_key: '',
        android_app_key: '',
        remark: '',
        map_sid: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.submit_disabled = true
          postAppSetup(this.temp).then(response => {
            if (response) {
              this.list.unshift(response.data)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
            setTimeout(() => {
              this.submit_disabled = false
            }, 0.5 * 1000)
          })
        }
      })
    },
    handleUpdate(row) {
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
          this.submit_disabled = true
          const tempData = Object.assign({}, this.temp)
          postAppSetup(tempData).then(response => {
            if (response) {
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
            }
            setTimeout(() => {
              this.submit_disabled = false
            }, 0.1 * 1000)
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
        deleteAppSetup(row).then(response => {
          if (response) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }
        })
      }).catch(() => {

      })
    }
  }
}
</script>

