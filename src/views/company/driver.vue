<template>
  <div class="createPost-container">
    <sticky :class-name="'sub-navbar back'">
      <el-button v-loading="loading" size="medium" plain icon="el-icon-back" @click="back">返回列表</el-button>
    </sticky>

    <div class="app-container">
      <div class="filter-container">
        <el-input v-model="listQuery.keyword" clearable style="width: 200px;" class="filter-item" placeholder="用户名/手机/姓名" @keyup.enter.native="handleFilter"/>
        <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
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
        <el-table-column label="ID" prop="id" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工号" align="center" width="150">
          <template slot-scope="scope">
            <span>
              {{ scope.row.username }}
              <el-tooltip :content="scope.row.enable == '1'?'启用':'禁用'" placement="top">
                <svg-icon :icon-class="scope.row.enable == '1'?'enabled':'disabled'"/>
              </el-tooltip>
              <el-tooltip v-if="scope.row.commission == '1'" content="提成" placement="top">
                <svg-icon icon-class="commission"/>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="真实姓名 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.realname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号码 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.balance }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职位类型 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.job_type_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保险类型 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.insure_name }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="handleDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="1000px">
        <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" style="width: 850px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="头像">
                <el-input v-model="temp.avatar_id" type="hidden"/>
                <pan-thumb :image="temp.avatar_url"/>
              </el-form-item>
              <el-form-item label="工号" prop="username">
                {{ temp.username }}
              </el-form-item>
              <el-form-item label="真实姓名" prop="realname">
                {{ temp.realname }}
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                {{ temp.mobile }}
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                {{ temp.sex }}
              </el-form-item>
              <el-form-item label="职位类型" prop="job_type">
                {{ temp.job_type_name }}
              </el-form-item>
              <el-form-item label="保险类型" prop="insure">
                {{ temp.insure_name }}
              </el-form-item>
              <el-form-item label="星级" prop="star">
                {{ temp.star_name }}
              </el-form-item>
              <el-form-item label="入职时间" prop="hiredate">
                {{ temp.hiredate }}
              </el-form-item>
              <el-form-item label="推荐人" prop="">
                {{ temp.introducer_name }}
              </el-form-item>
              <el-form-item label="紧急联系人" prop="emergency_contact">
                {{ temp.emergency_contact }}
              </el-form-item>
              <el-form-item label="紧急电话" prop="emergency_phone">
                {{ temp.emergency_phone }}
              </el-form-item>
              <el-form-item label="籍贯" prop="native_place">
                {{ temp.native_place }}
              </el-form-item>
              <el-form-item label="住址" prop="address">
                {{ temp.address }}
              </el-form-item>
              <el-form-item label="提成" prop="commission">
                <el-switch
                  v-model="temp.commission"
                  active-value="1"
                  inactive-value="0"
                  disabled/>
              </el-form-item>
              <el-form-item label="启用" prop="enable">
                <el-switch
                  v-model="temp.enable"
                  active-value="1"
                  inactive-value="0"
                  disabled/>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" disabled type="textarea" placeholder="请输入备注"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证正面" prop="card_front_id">
                <el-image :src=" temp.card_front_url" style="width: 200px; font-size: 200px" fit="fill">
                  <div slot="error" class="image-slot">
                    <svg-icon icon-class="img" />
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item label="身份证正面" prop="card_back_id">
                <el-image :src=" temp.card_back_url" style="width: 200px; font-size: 200px" fit="fill">
                  <div slot="error" class="image-slot">
                    <svg-icon icon-class="img" />
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item label="驾驶证" prop="license_id">
                <el-image :src=" temp.license_url" style="width: 200px; font-size: 200px" fit="fill">
                  <div slot="error" class="image-slot">
                    <svg-icon icon-class="img" />
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item label="驾照类型" prop="license_type">
                {{ temp.license_type }}
              </el-form-item>
              <el-form-item label="领证时间" prop="license_date">
                {{ temp.license_date }}
              </el-form-item>

              <el-form-item label="支付宝二维码" prop="address">
                <el-image :src=" temp.alipay_qrcode_url" style="width: 200px; font-size: 200px" fit="fill">
                  <div slot="error" class="image-slot">
                    <svg-icon icon-class="img" />
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item label="微信二维码" prop="address">
                <el-image :src=" temp.wechat_qrcode_url" style="width: 200px; font-size: 200px" fit="fill">
                  <div slot="error" class="image-slot">
                    <svg-icon icon-class="img" />
                  </div>
                </el-image>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getCompanyDriverList } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import Sticky from '@/components/Sticky' // 粘性header组件

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

export default {
  name: 'Driver',
  components: { ImageCropper, PanThumb, Pagination, Sticky },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
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
      username_disabled: false,
      role_plist: null,
      listQuery: {
        company_id: '',
        page: 1,
        limit: 20,
        keyword: '',
        role_id: '',
        status: ''
      },
      statusOptions,
      temp: {
        id: undefined,
        realname: '',
        avatar_id: '',
        avatar_url: '',
        card_front_id: '',
        card_front_url: '',
        card_back_id: '',
        card_back_url: '',
        license_id: '',
        license_url: '',
        license_type: '',
        license_date: '',
        sex: '',
        job_type: '',
        insure: '',
        star: '',
        hiredate: '',
        emergency_contact: '',
        emergency_phone: '',
        username: '',
        password: '',
        introducer_id: '',
        introducer_name: '',
        native_place: '',
        address: '',
        remark: '',
        alipay_qrcode_url: '',
        wechat_qrcode_url: '',
        commission: '1',
        enable: '1'
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
        username: [{ required: true, message: '用户名为必填项', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号码为必填项', trigger: 'blur' }],
        realname: [{ required: true, message: '真实姓名为必填项', trigger: 'blur' }]
      },
      company_id: '',
      loading: false
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
      getCompanyDriverList(this.listQuery).then(response => {
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
      this.username_disabled = false
      this.temp = {
        id: undefined,
        realname: '',
        avatar_id: '',
        avatar_url: '',
        username: '',
        password: '',
        role_id: [],
        role_name: [],
        system: '0',
        status: '1'
      }
    },
    handleDetail(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.username_disabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-tagbox.el-tag{margin-left:10px}
.createPost-container {
 position: relative;
}
</style>
