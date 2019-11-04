<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
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
      <el-table-column label="服务id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.name }}
            <el-tooltip :content="scope.row.status == '1'?'启用':'禁用'" placement="top">
              <svg-icon :icon-class="scope.row.status == '1'?'enabled':'disabled'"/>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="接口地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.api_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="logo" align="center">
        <template slot-scope="scope">
          <span>
            <el-image :src=" scope.row.logo_url" style="width: 80px; height: 80px; font-size: 80px" fit="fill">
              <div slot="error" class="image-slot">
                <svg-icon icon-class="img" />
              </div>
            </el-image>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="公众号二维码" align="center">
        <template slot-scope="scope">
          <span>
            <el-image :src=" scope.row.oa_qrcode_url" style="width: 80px; height: 80px; font-size: 80px" fit="fill">
              <div slot="error" class="image-slot">
                <svg-icon icon-class="img" />
              </div>
            </el-image>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="小程序二维码" align="center">
        <template slot-scope="scope">
          <span>
            <el-image :src=" scope.row.mp_qrcode_url" style="width: 80px; height: 80px; font-size: 80px" fit="fill">
              <div slot="error" class="image-slot">
                <svg-icon icon-class="img" />
              </div>
            </el-image>
          </span>
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

    <el-dialog :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" title="详情" width="650px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 550px;">
        <el-tabs tab-position="left">
          <el-tab-pane label="基础信息">
            <el-form-item label="名称" prop="name">
              <el-input v-model="temp.name" placeholder="请输入名称"/>
            </el-form-item>
            <el-form-item label="logo" prop="logo_id">
              <Upload
                v-model="temp.logo_url"
                @upload-success="logoSuccess"
                @upload-delete="logoDelete"/>
              <input v-model="temp.logo_id" type="hidden">
            </el-form-item>
            <el-form-item label="公众号二维码" prop="oa_qrcode_id">
              <Upload
                v-model="temp.oa_qrcode_url"
                @upload-success="oaqrcodeSuccess"
                @upload-delete="oaqrcodeDelete"/>
              <input v-model="temp.oa_qrcode_id" type="hidden">
            </el-form-item>
            <el-form-item label="小程序二维码" prop="mp_qrcode_id">
              <Upload
                v-model="temp.mp_qrcode_url"
                @upload-success="mpqrcodeSuccess"
                @upload-delete="mpqrcodeDelete"/>
              <input v-model="temp.mp_qrcode_id" type="hidden">
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="temp.status"
                active-value="1"
                inactive-value="0"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="公众号">
            <el-form-item label="app_id">
              <el-input v-model="temp.official_account.app_id" placeholder="请输入app_id"/>
            </el-form-item>
            <el-form-item label="secret">
              <el-input v-model="temp.official_account.secret" placeholder="请输入secret"/>
            </el-form-item>
            <el-form-item label="token">
              <el-input v-model="temp.official_account.token" placeholder="请输入token"/>
            </el-form-item>
            <el-form-item label="aes_key">
              <el-input v-model="temp.official_account.aes_key" placeholder="请输入aes_key"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="小程序">
            <el-form-item label="app_id">
              <el-input v-model="temp.mini_program.app_id" placeholder="请输入app_id"/>
            </el-form-item>
            <el-form-item label="secret">
              <el-input v-model="temp.mini_program.secret" placeholder="请输入secret"/>
            </el-form-item>
            <el-form-item label="token">
              <el-input v-model="temp.mini_program.token" placeholder="请输入token"/>
            </el-form-item>
            <el-form-item label="aes_key">
              <el-input v-model="temp.mini_program.aes_key" placeholder="请输入aes_key"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane v-if="dialogStatus==='update'" label="公众号模板">
            <el-tabs type="card">
              <el-tab-pane v-for="(item,index) in temp.official_account_template" :key="index" :label="item.template_name">
                <el-alert
                  v-if="item.template_note"
                  :closable="false"
                  :title="item.template_note"
                  type="info"
                  class="marbot10"
                  center
                  show-icon/>
                <el-form-item label="消息模板id">
                  <el-input v-model="item.template_id" placeholder="请输入消息模板id"/>
                </el-form-item>
                <el-form-item label="通知消息">
                  <el-input v-model="item.first" placeholder="请输入通知消息"/>
                </el-form-item>
                <el-form-item label="附加消息">
                  <el-input v-model="item.remark" placeholder="请输入附加消息"/>
                </el-form-item>
                <img src="@/assets/template_demo.jpg" height="250">
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getServiceList, postService, deleteService } from '@/api/service'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'
import Upload from '@/components/Upload'

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

export default {
  name: 'Service',
  components: { PanThumb, Pagination, Upload },
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
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        status: ''
      },
      statusOptions,
      temp: {
        id: undefined,
        name: '',
        logo_id: '',
        logo_url: '',
        oa_qrcode_id: '',
        oa_qrcode_url: '',
        mp_qrcode_id: '',
        mp_qrcode_url: '',
        mini_program: {
          'app_id': '',
          'secret': '',
          'token': '',
          'aes_key': ''
        },
        official_account: {
          'app_id': '',
          'secret': '',
          'token': '',
          'aes_key': ''
        },
        official_account_template: [],
        status: '1'
      },
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
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
      getServiceList(this.listQuery).then(response => {
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
        id: undefined,
        name: '',
        logo_id: '',
        logo_url: '',
        oa_qrcode_id: '',
        oa_qrcode_url: '',
        mp_qrcode_id: '',
        mp_qrcode_url: '',
        mini_program: {
          'app_id': '',
          'secret': '',
          'token': '',
          'aes_key': ''
        },
        official_account: {
          'app_id': '',
          'secret': '',
          'token': '',
          'aes_key': ''
        },
        official_account_template: [],
        status: '1'
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
          postService(this.temp).then(response => {
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
          postService(tempData).then(response => {
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
        deleteService(row).then(() => {
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
    logoSuccess(resData) {
      this.temp.logo_url = resData.url
      this.temp.logo_id = resData.id
    },
    logoDelete() {
      this.temp.logo_url = ''
      this.temp.logo_id = ''
    },
    oaqrcodeSuccess(resData) {
      this.temp.oa_qrcode_url = resData.url
      this.temp.oa_qrcode_id = resData.id
    },
    oaqrcodeDelete() {
      this.temp.oa_qrcode_url = ''
      this.temp.oa_qrcode_id = ''
    },
    mpqrcodeSuccess(resData) {
      this.temp.mp_qrcode_url = resData.url
      this.temp.mp_qrcode_id = resData.id
    },
    mpqrcodeDelete() {
      this.temp.mp_qrcode_url = ''
      this.temp.mp_qrcode_id = ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .marbot10{margin-bottom:10px}
</style>
