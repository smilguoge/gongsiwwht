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
      <el-table-column label="ID" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.shorthand }}
            <el-tooltip :content="scope.row.status == '1'?'启用':'禁用'" placement="top">
              <svg-icon :icon-class="scope.row.status == '1'?'enabled':'disabled'"/>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属服务" align="center">
        <template slot-scope="scope">
          <span>
            <el-tooltip v-if="scope.row.manage_service === '1'" content="管理服务" placement="top">
              <svg-icon icon-class="star"/>
            </el-tooltip>
            {{ scope.row.service_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="app配置" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.app_setup_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leader }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leader_mobile }}</span>
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
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            <span class="el-dropdown-link">
              编辑
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="checkPermission(['CompanySetup'])">
                <router-link :to="{name:'CompanySetup', params:{company_id: scope.row.id}}">
                  公司设置
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item v-if="checkPermission(['CompanyAdmin'])">
                <router-link :to="{name:'CompanyAdmin', params:{company_id: scope.row.id}}">
                  管理人员
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item v-if="checkPermission(['CompanyRole'])" >
                <router-link :to="{name:'CompanyRole', params:{company_id: scope.row.id}}">
                  司机角色
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item v-if="checkPermission(['CompanyDriver'])">
                <router-link :to="{name:'CompanyDriver', params:{company_id: scope.row.id}}">
                  司机管理
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="650px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 550px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="简称" prop="shorthand">
          <el-input v-model="temp.shorthand" placeholder="请输入简称"/>
        </el-form-item>
        <el-form-item label="管理服务" prop="manage_service">
          <el-switch
            v-model="temp.manage_service"
            active-value="1"
            inactive-value="0"/>
        </el-form-item>
        <el-form-item label="所属服务" prop="service_id">
          <el-select
            v-model="temp.service_id"
            :remote-method="searchService"
            :loading="serviceLoading"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入检索关键词">
            <el-option
              v-for="item in serviceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id" >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right"> <svg-icon :icon-class="item.status == '1'?'enabled':'disabled'"/></span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="app设置" prop="app_setup_id">
          <el-select
            v-model="temp.app_setup_id"
            :remote-method="searchAppSetup"
            :loading="appSetupLoading"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入检索关键词">
            <el-option
              v-for="item in appSetupOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐公司" prop="introducer_company_id">
          <el-select
            v-if="dialogStatus==='create'"
            v-model="temp.introducer_company_id"
            :remote-method="searchCompany"
            :loading="companyLoading"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入检索关键词">
            <el-option
              v-for="item in companyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id" >
              {{ item.name }} / {{ item.shorthand }}
            </el-option>
          </el-select>
          <el-input v-else v-model="temp.introducer_company_name" :disabled="true" placeholder=""/>
        </el-form-item>
        <el-form-item label="所属地区" prop="region_id">
          <el-select
            v-model="temp.region_id"
            :remote-method="searchRegion"
            :loading="regionLoading"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入检索关键词">
            <el-option
              v-for="item in regionOptions"
              :key="item.id"
              :label="item.full_name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" placeholder="请输入地址"/>
        </el-form-item>
        <el-form-item label="中心坐标" prop="lng">
          {{ temp.lng }}/{{ temp.lat }}
          <el-button type="warning" size="mini" icon="location el-icon-map-location" @click="handleMap(temp)">选择坐标</el-button>
          <input v-model="temp.lng" type="hidden">
          <input v-model="temp.lat" type="hidden">
        </el-form-item>
        <el-form-item label="公司电话" prop="tel">
          <el-input v-model="temp.tel" placeholder="请输入公司电话"/>
        </el-form-item>
        <el-form-item label="客服电话" prop="">
          <el-input v-model="temp.kf_tel" placeholder="请输入客服电话"/>
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="temp.leader" placeholder="请输入负责人"/>
        </el-form-item>
        <el-form-item label="负责人电话" prop="leader_mobile">
          <el-input v-model="temp.leader_mobile" placeholder="请输入负责人电话"/>
        </el-form-item>
        <el-form-item label="logo" prop="logo_id">
          <Upload
            v-model="temp.logo_url"
            @upload-success="logoSuccess"
            @upload-delete="logoDelete"/>
          <input v-model="temp.logo_id" type="hidden">
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="temp.status"
            active-value="1"
            inactive-value="0"/>
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
    <el-dialog :visible.sync="dialogMapVisible" :close-on-press-escape="dialogMapEsc" :close-on-click-modal="dialogMapEsc" title="选取坐标">
      <div class="amap-page-container">
        <el-amap-search-box
          :search-option="searchOption"
          :on-search-result="onSearchResult"
          class="search-box"/>
        <el-amap
          :center="mapCenter"
          :zoom="zoom"
          :events="events"
          class="amap-demo"
          vid="amapDemo">
          <el-amap-marker
            v-if="marker.position.length > 0"
            :position="marker.position"
            :icon="marker.icon"
            :events="marker.events"
            :visible="marker.visible"
            :draggable="marker.draggable" />
          <el-amap-marker
            v-for="(marker, index) in markers"
            :key="index"
            :position="marker"/>
        </el-amap>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMapVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCompanyList, getCompanySearch, postCompany, deleteCompany } from '@/api/company'
import { getRegionSearch } from '@/api/region'
import { getServiceSearch } from '@/api/service'
import { getAppSetupPlist } from '@/api/app_setup'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Upload from '@/components/Upload'
import mark from '@/assets/mark_r.png'
import checkPermission from '@/utils/permission' // 权限判断函数

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

export default {
  name: 'Service',
  components: { Pagination, Upload },
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
      marker: {
        position: [],
        icon: mark,
        visible: true,
        draggable: false
      },
      markers: [],
      zoom: 12,
      mapCenter: [116.397467, 39.90873],
      events: {
        click: (e) => {
          this.marker.position = [e.lnglat.lng, e.lnglat.lat]
          this.marker.icon = mark
          this.temp.lng = e.lnglat.lng
          this.temp.lat = e.lnglat.lat
        }
      },
      searchOption: {
        city: '',
        citylimit: false
      },
      companyOptions: [],
      companyLoading: false,
      regionOptions: [],
      regionLoading: false,
      serviceOptions: [],
      serviceLoading: false,
      appSetupOptions: [],
      appSetupLoading: false,
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
        shorthand: '',
        logo_id: '',
        logo_url: '',
        service_id: '',
        app_setup_id: '',
        region_id: '',
        address: '',
        lng: '',
        lat: '',
        tel: '',
        kf_tel: '',
        leader: '',
        leader_mobile: '',
        remark: '',
        manage_service: '0',
        introducer_company_id: '',
        introducer_company_name: '',
        status: '1'
      },
      setupTemp: {},
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      dialogMapVisible: false,
      dialogMapEsc: false,
      submit_disabled: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        name: [{ required: true, message: '名称为必填项', trigger: 'blur' }],
        shorthand: [{ required: true, message: '简称为必填项', trigger: 'blur' }],
        service_id: [{ required: true, message: '所属服务为必选项', trigger: 'blur' }],
        app_setup_id: [{ required: true, message: 'app设置为必选项', trigger: 'blur' }],
        region_id: [{ required: true, message: '所属区域为必填项', trigger: 'blur' }],
        address: [{ required: true, message: '地址为必填项', trigger: 'blur' }],
        lng: [{ required: true, message: '坐标为必填项', trigger: 'blur' }],
        lat: [{ required: true, message: '坐标为必填项', trigger: 'blur' }],
        tel: [{ required: true, message: '公司电话为必填项', trigger: 'blur' }],
        leader: [{ required: true, message: '负责人为必填项', trigger: 'blur' }],
        leader_mobile: [{ required: true, message: '负责人电话为必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.searchAppSetup()
  },
  methods: {
    checkPermission,
    onSearchResult(pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          const { lng, lat } = poi
          lngSum += lng
          latSum += lat
          this.markers.push([poi.lng, poi.lat])
        })
        const center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.mapCenter = [center.lng, center.lat]
      }
    },
    getList() {
      this.listLoading = true
      getCompanyList(this.listQuery).then(response => {
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
        shorthand: '',
        logo_id: '',
        logo_url: '',
        service_id: '',
        app_setup_id: '',
        region_id: '',
        address: '',
        lng: '',
        lat: '',
        tel: '',
        kf_tel: '',
        leader: '',
        leader_mobile: '',
        remark: '',
        manage_service: '0',
        introducer_company_id: '',
        introducer_company_name: '',
        status: '1'
      }
      this.mapCenter = [116.397467, 39.90873]
      this.regionOptions = []
    },
    handleMap() {
      if (this.temp.lng) {
        this.marker.position = [this.temp.lng, this.temp.lat]
        this.mapCenter = [this.temp.lng, this.temp.lat]
      }
      this.dialogMapVisible = true
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.searchService()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.submit_disabled = true
          postCompany(this.temp).then(response => {
            if (response) {
              this.getList()
              // this.list.unshift(response.data)
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
      this.searchIdRegion(this.temp.region_id)
      this.searchIdService(this.temp.service_id)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.submit_disabled = true
          postCompany(tempData).then(response => {
            if (response) {
              this.getList()
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
            }, 0.5 * 1000)
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
        deleteCompany(row).then(() => {
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
    searchCompany(query) {
      if (query !== '') {
        this.companyLoading = true
        getCompanySearch({ keyword: query }).then(response => {
          this.companyOptions = response.data

          setTimeout(() => {
            this.companyLoading = false
          }, 0.5 * 1000)
        })
      } else {
        this.companyOptions = []
      }
    },
    searchRegion(query) {
      if (query !== '') {
        this.regionLoading = true
        getRegionSearch({ keyword: query }).then(response => {
          this.regionOptions = response.data

          setTimeout(() => {
            this.regionLoading = false
          }, 0.5 * 1000)
        })
      } else {
        this.regionOptions = []
      }
    },
    searchIdRegion(id) {
      if (id !== '') {
        this.regionLoading = true
        getRegionSearch({ id: id }).then(response => {
          this.regionOptions = response.data

          setTimeout(() => {
            this.regionLoading = false
          }, 0.5 * 1000)
        })
      } else {
        this.regionOptions = []
      }
    },
    searchService(query) {
      if (query !== '') {
        this.serviceLoading = true
        getServiceSearch({ keyword: query }).then(response => {
          this.serviceOptions = response.data

          setTimeout(() => {
            this.serviceLoading = false
          }, 0.5 * 1000)
        })
      } else {
        this.serviceOptions = []
      }
    },
    searchAppSetup(query) {
      this.appSetupLoading = true
      getAppSetupPlist({ keyword: query }).then(response => {
        this.appSetupOptions = response.data

        setTimeout(() => {
          this.appSetupLoading = false
        }, 0.5 * 1000)
      })
    },
    searchIdService(id) {
      if (id !== '') {
        this.serviceLoading = true
        getServiceSearch({ id: id }).then(response => {
          this.serviceOptions = response.data

          setTimeout(() => {
            this.serviceLoading = false
          }, 0.5 * 1000)
        })
      } else {
        this.serviceOptions = []
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .list_btn{
    /*height: 28px;*/
    /*line-height: 28px;*/
    margin: 5px;
    float: left;
  }
  .amap-page-container {
    position: relative;
  }
  .search-box {
    position: absolute;
    top: 25px;
    left: 20px;
  }
  .amap-demo {
    height: 500px;
  }
  .marbot10{margin-bottom:10px}
</style>
