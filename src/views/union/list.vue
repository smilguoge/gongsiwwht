<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
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
      <el-table-column label="联盟ID" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" >
        <template slot-scope="scope">
          <span>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="联盟公司" align="center">
        <template slot-scope="scope">
          <el-tag
            v-for="tag in scope.row.company_names"
            :key="tag"
            class="el-tagbox">
            {{ tag }}
          </el-tag>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="750px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 650px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="请输入备注"/>
        </el-form-item>
        <el-form-item label="同盟公司" prop="company_ids">
          <div style="text-align: center">
            <el-transfer
              v-model="temp.company_ids"
              :data="company_list"
              :titles="['非同盟', '同盟']"
              filterable
              style="text-align: left; display: inline-block">
              <span slot-scope="{ option }"><svg-icon :icon-class="option.status == '1'?'enabled':'disabled'"/> {{ option.label }}  <span v-if=" option.union_id">- {{ option.union_name }}</span></span>
            </el-transfer>
          </div>
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
import { getUnionList, postUnion, deleteUnion } from '@/api/union'
import { getCompanySearch } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'
import Upload from '@/components/Upload'

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

export default {
  name: 'Union',
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
      company_list: [],
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
        id: '',
        name: '',
        company_ids: [],
        remark: ''
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
      getUnionList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getCompanyList() {
      getCompanySearch({ all: 1 }).then(response => {
        const data = []
        const list = response.data
        let x = 0
        for (x in list) {
          data.push({
            key: list[x].id,
            label: list[x].name,
            union_id: list[x].union_id,
            union_name: list[x].union_name,
            status: list[x].status,
            disabled: list[x].status === '0' || (list[x].union_id && list[x].union_id !== this.temp.id)
          })
        }
        this.company_list = data
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
        company_ids: [],
        remark: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.getCompanyList()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.submit_disabled = true
          postUnion(this.temp).then(response => {
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
      this.getCompanyList()
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
          postUnion(tempData).then(response => {
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
        deleteUnion(row).then(response => {
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

<style rel="stylesheet/scss" lang="scss" scoped>

  .el-tagbox.el-tag{margin-left:10px}
</style>
