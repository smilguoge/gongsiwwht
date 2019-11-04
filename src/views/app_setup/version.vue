<template>
  <div class="createPost-container">
    <sticky :class-name="'sub-navbar back'">
      <el-button v-loading="loading" size="medium" plain icon="el-icon-back" @click="back">返回列表</el-button>
    </sticky>
    <div class="app-container">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增版本</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="版本号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本大小" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row.size }} M</span>
          </template>
        </el-table-column>
        <el-table-column label="下载地址 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.update_url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新类型">
          <template slot-scope="scope">
            <span>{{ scope.row.device_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最低版本要求 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.minimum_version }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <el-dialog :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" title="新增版本" width="500px">
        <el-form ref="dataForm" :model="temp" :rules="rules" label-position="right" label-width="100px" style="width: 400px;">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="temp.version" placeholder="版本号"/>
          </el-form-item>
          <el-form-item label="文件大小" prop="size">
            <el-input v-model="temp.size" placeholder="文件大小">
              <template slot="append">M</template>
            </el-input>
          </el-form-item>
          <el-form-item label="下载链接" prop="update_url">
            <el-input v-model="temp.update_url" placeholder="下载链接"/>
          </el-form-item>
          <el-form-item label="更新设备">
            <el-select v-model="temp.device_type" placeholder="设备" clearable class="filter-item" style="width: 130px">
              <el-option v-for="item in DeviceOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
            </el-select>
          </el-form-item>
          <el-form-item label="版本要求" prop="minimum_version">
            <el-input v-model="temp.minimum_version" placeholder="版本要求"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="temp.remark" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createData">确定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getAppVersionList, postAppVersionSave, deleteAppVersion } from '@/api/app_setup'
import waves from '@/directive/waves' // Waves directive, deleteAppVersion
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'
import Sticky from '@/components/Sticky' // 粘性header组件
const DeviceOptions = [
  { key: 'ANDROID', display_name: 'ANDROID' },
  { key: 'IOS', display_name: 'IOS' }
]

export default {
  name: 'Driver',
  components: { PanThumb, Pagination, Sticky },
  directives: { waves },
  data() {
    return {
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1
      },
      DeviceOptions,
      temp: {
        version: '',
        size: '',
        update_url: '',
        device_type: '',
        minimum_version: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogChangePass: false,
      dialogEsc: false,
      dialogStatus: '',
      rules: {
        version: [{ required: true, message: '版本号不能为空', trigger: 'change' }],
        size: [{ required: true, message: '版本大小不能为空', trigger: 'change' }],
        update_url: [{ required: true, message: '更新地址不能为空', trigger: 'change' }]
      },
      setup_id: ''
    }
  },
  created() {
    this.setup_id = this.$route.params && this.$route.params.setup_id
    if (this.setup_id === '') {
      this.$notify.error({
        title: '错误',
        message: '参数错误'
      })
    }
    this.getList()
  },
  methods: {
    back() {
      this.$router.push({ name: 'AppSetupList' })
    },
    getList() {
      this.listLoading = true
      this.listQuery.setup_id = this.setup_id
      getAppVersionList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined
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
          this.temp.setup_id = this.setup_id
          postAppVersionSave(this.temp).then(response => {
            this.getList()
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.submit_disabled = true
          const tempData = Object.assign({}, this.temp)
          postAppVersionSave(tempData).then(response => {
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
        deleteAppVersion(row).then(response => {
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
