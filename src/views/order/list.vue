<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable style="width: 200px;" class="filter-item" placeholder="姓名" @keyup.enter.native="handleFilter"/>
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
      <el-table-column label="订单号" prop="id" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center" width="200">
        <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ip地址" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述 " align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.description.substring(0,20)}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="order_page" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="550px">
      <div class="order_cont">
        <div class="order_li"><label>姓名：</label>{{temp.name}}</div>
        <div class="order_li"><label>电话：</label>{{temp.phone}}</div>
        <div class="order_li"><label>邮箱：</label>{{temp.email}}</div>
        <div class="order_li"><label>需求内容：</label>{{temp.description}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" type="primary">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getOrderList,getAdminList, postAdmin, deleteAdmin, getRolePlist } from '@/api/order'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'order',
  components: { Pagination },
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
        name: '',
        status: ''
      },
      temp: {
        name: '',
        phone: '',
        email: '',
        description: '',
        id:'',
        ip:''
      },
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '查看订单信息'
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    close() {
      this.imagecropperShow = false
    },
    getList() { 
      this.listLoading = true 
      getOrderList(this.listQuery).then(response=>{
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.username_disabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 .el-tagbox.el-tag{margin-left:10px}
 .order_page{font-size: 14px; color: #606266;text-align: left;}
 .order_page{padding-left: 30px;text-align: center;}
 .order_cont{    
    border-top: 1px solid #EBEEF5;
    padding-top: 20px;
    margin: -20px 20px -10px;}
 .order_li{line-height:2;text-align: left;}
</style>
