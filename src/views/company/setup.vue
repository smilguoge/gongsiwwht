<template>
  <div class="createPost-container">
    <sticky :class-name="'sub-navbar back'">
      <el-button v-loading="loading" size="medium" plain icon="el-icon-back" @click="back">返回列表</el-button>
    </sticky>
    <div class="app-container">
      <el-tabs type="border-card">
        <el-tab-pane label="收费设置">
          <el-form ref="dataForm" :model="temp" :rules="rules" label-width="120px">
            <el-tabs tab-position="left">
              <el-tab-pane label="短信">
                <el-form-item label="开启收费" prop="">
                  <el-switch
                    v-model="temp.sms_charge"
                    active-value="1"
                    inactive-value="0"/>
                </el-form-item>
                <el-form-item v-if="temp.sms_charge === '1'" label="验证码" prop="">
                  <el-input v-model="temp.sms_vcode">
                    <template slot="append">元/条</template>
                  </el-input>
                </el-form-item>
                <el-form-item v-if="temp.sms_charge === '1'" label="通知短信" prop="">
                  <el-input v-model="temp.sms_notice">
                    <template slot="append">元/条</template>
                  </el-input>
                </el-form-item>
                <el-form-item v-if="temp.sms_charge === '1'" label="营销短信" prop="">
                  <el-input v-model="temp.sms_market">
                    <template slot="append">元/条</template>
                  </el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="订单">
                <el-form-item label="开启收费" prop="">
                  <el-switch
                    v-model="temp.order_charge"
                    active-value="1"
                    inactive-value="0"/>
                </el-form-item>
                <el-form-item v-if="temp.order_charge === '1'" label="收取费用" prop="">
                  <el-input v-model="temp.order_money">
                    <template slot="append">元/单</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="公司销单" prop="">
                  <el-switch
                    v-model="temp.order_cannel"
                    active-value="1"
                    inactive-value="0"/>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="保险使用">
                <el-form-item label="开启使用" prop="">
                  <el-switch
                    v-model="temp.insure_use"
                    active-value="1"
                    inactive-value="0"/>
                </el-form-item>
                <el-form-item v-if="temp.insure_use === '1'" label="保险名称" prop="">
                  <el-input v-model="temp.insure_name"/>
                </el-form-item>
                <el-form-item v-if="temp.insure_use === '1'" label="保险单号" prop="">
                  <el-input v-model="temp.insure_order"/>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="保险收费">
                <el-form-item label="开启收费" prop="">
                  <el-switch
                    v-model="temp.insure_charge"
                    active-value="1"
                    inactive-value="0"/>
                </el-form-item>
                <el-form-item v-if="temp.insure_charge === '1'" label="收取费用" prop="">
                  <el-input v-model="temp.insure_money">
                    <template slot="append">元/单</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="有效保险设置" prop="">
                  <el-input v-model="temp.insure_num" />
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="实名认证">
                <el-form-item label="开启收费" prop="">
                  <el-switch
                    v-model="temp.cert_charge"
                    active-value="1"
                    inactive-value="0"/>
                </el-form-item>
                <el-form-item v-if="temp.cert_charge === '1'" label="收取费用" prop="">
                  <el-input v-model="temp.cert_money">
                    <template slot="append">元/次</template>
                  </el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="外派订单">
                <el-form-item label="开启收费" prop="">
                  <el-switch
                    v-model="temp.share_charge"
                    active-value="1"
                    inactive-value="0"/>
                </el-form-item>
                <el-form-item v-if="temp.share_charge === '1'" label="收取费用" prop="">
                  <el-input v-model="temp.share_money">
                    <template slot="append">元/次</template>
                  </el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="推荐公司">
                <el-form-item label="开启收费" prop="">
                  <el-switch
                    v-model="temp.introducer_company_charge"
                    active-value="1"
                    inactive-value="0"/>
                </el-form-item>
                <el-form-item v-if="temp.introducer_company_charge === '1'" label="收取费用" prop="">
                  <el-input v-model="temp.introducer_company_money">
                    <template slot="append">元/次</template>
                  </el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="支付渠道">
                <el-form-item label="平台支付" prop="company_channel">
                  <el-select v-model="temp.company_channel" placeholder="支付渠道" clearable class="filter-item">
                    <el-option v-for="item in companychannel" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="司机支付" prop="driver_channel">
                  <el-select v-model="temp.driver_channel" placeholder="支付渠道" clearable class="filter-item">
                    <el-option v-for="item in driverchannel" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>

            <el-form-item>
              <el-button v-loading="loading" type="primary" style="margin: 20px 0 0 50px;" @click="onSubmit">保 存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getCompanySetupDetail, postCompanySetup, getCompanyChannel, getDriverChannel } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Sticky from '@/components/Sticky' // 粘性header组件

export default {
  name: 'CompnaySetup',
  components: { Sticky },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      detail: null,
      companychannel: null,
      driverchannel: null,
      total: 0,
      listLoading: true,
      temp: {
        id: undefined,
        sms_charge: '0',
        sms_vcode: '',
        sms_notice: '',
        sms_market: '',
        insure_use: '0',
        insure_name: '',
        insure_order: '',
        insure_charge: '0',
        insure_money: '',
        insure_num: '',
        order_charge: '0',
        order_money: '',
        order_cannel: '0',
        cert_charge: '0',
        cert_money: '',
        company_channel: '',
        driver_channel: '',
        share_charge: '0',
        share_money: '',
        introducer_company_charge: '0',
        introducer_company_money: ''
      },
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
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
    this.getDetail()
    this.getChannelcompany()
    this.getChanneldriver()
  },
  methods: {
    getChannelcompany() {
      getCompanyChannel().then(response => {
        this.companychannel = response.data
      })
    },
    getChanneldriver() {
      getDriverChannel().then(response => {
        this.driverchannel = response.data
      })
    },
    back() {
      this.$router.push({ name: 'CompanyList' })
    },
    getDetail() {
      getCompanySetupDetail(this.company_id).then(response => {
        this.temp = response.data
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        sms_charge: '0',
        sms_vcode: '',
        sms_notice: '',
        sms_market: '',
        insure_use: '0',
        insure_name: '',
        insure_order: '',
        insure_charge: '0',
        insure_money: '',
        insure_num: '',
        order_charge: '0',
        order_money: '',
        order_cannel: '0',
        cert_charge: '0',
        cert_money: '',
        share_charge: '0',
        share_money: '',
        introducer_company_charge: '0',
        introducer_company_money: ''
      }
    },
    onSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postCompanySetup(this.temp).then(response => {
            if (response) {
              // this.list.unshift(response.data)
              // this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.charge_input{width:200px}
.createPost-container {
 position: relative;
}
</style>
