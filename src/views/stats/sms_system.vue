<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.company_id"
        :remote-method="searchCompany"
        :loading="companyLoading"
        filterable
        clearable
        remote
        reserve-keyword
        placeholder="请输入公司名称关键词"
        @clear="handleFilter">
        <el-option
          v-for="item in companyOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id" >
          {{ item.name }} / {{ item.shorthand }}
        </el-option>
      </el-select>

      <el-date-picker
        v-model="listQuery.record_at"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        class="filter-item-date separator"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"/>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      show-summary
      highlight-current-row
      height="600">
      <el-table-column label="公司名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="vcode_count" label="验证码用量（条）" align="center" />
      <el-table-column prop="vcode_money" label="验证码费用（元）" align="center" />
      <el-table-column prop="notice_count" label="短信通知用量（条）" align="center" />
      <el-table-column prop="notice_money" label="短信通知费用（元）" align="center" />
      <el-table-column prop="market_count" label="营销短信用量（条）" align="center" />
      <el-table-column prop="market_money" label="营销短信费用（元）" align="center" />
    </el-table>
  </div>
</template>

<script>
import { getCompanySearch } from '@/api/company'
import { getSms } from '@/api/stats'
import moment from 'moment'
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'StatsSmsSystem',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      companyOptions: [],
      companyLoading: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        record_at: [],
        company_id: ''
      },
      pickerOptions: {
        disabledDate: this.disabledDate
      }
    }
  },
  created() {
    var start_at = moment().month(moment().month() - 1).format('YYYY-MM-DD')
    var end_at = moment().format('YYYY-MM-DD')
    this.listQuery.record_at = [start_at, end_at]
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSms(this.listQuery).then(response => {
        this.list = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    disabledDate(time) {
      return time.getTime() > Date.now()
    }
  }
}
</script>
