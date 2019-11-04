<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-table-column label="新闻id" prop="id" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新闻名称" align="center" width="350">
        <template slot-scope="scope">
          <span>
            {{ scope.row.title}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="分类id" align="center" width="150">
        <template slot-scope="scope">
          <span>
            {{ scope.row.category_id}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="80%" >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width:800px; margin-left:50px;">
        <el-form-item label="新闻首图" class="anli_img_top">
          <el-input v-model="temp.img_id" type="hidden"/>
          <!-- <pan-thumb :image="temp.thumbnail_id"/>
         <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">上传头像</el-button>
      
          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :url="upload_url"
            field="file"
            lang-type="zh"
            @close="close"
            @crop-upload-success="cropSuccess"/>-->

          <el-upload
            action="http://dev-adminapi.bzffs.cc/api/file"
            list-type="picture-card"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="temp.thumbnail_url" alt="">
          </el-dialog>
          <div class="anli_img_box">
            <img :src="temp.thumbnail_url" alt="" class="anli_img">
          </div>
        </el-form-item>
        <el-form-item label="新闻id" prop="">
          <el-input v-model="temp.id" :disabled="username_disabled" placeholder="请输入id"/>
        </el-form-item>
        <el-form-item label="新闻名称" prop="">
          <el-input v-model="temp.title" placeholder="请输入新闻名称"/>
        </el-form-item>
        <el-form-item label="分类id" prop="">
          <el-input v-model="temp.category_id" placeholder="分类id"/>
        </el-form-item>
        <el-form-item label="标签id" prop="">
          <el-input v-model="temp.tag_id" placeholder="标签id(多个分类用英文，分隔：1,2)"/>
        </el-form-item>
        <el-form-item label="关键词" prop="">
          <el-input v-model="temp.keyword" placeholder="关键词"/>
        </el-form-item>
        <el-form-item label="描述" prop="">
          <el-input type="textarea" rows="3" v-model="temp.description" placeholder="描述"/>
        </el-form-item>
        <el-form-item label="点击量,浏览量" prop="">
          <el-input v-model="temp.clicknum" placeholder="点击量,浏览量"/>
        </el-form-item>
         <el-form-item label="新闻详情编辑" class="editor">
            <wangEditor :catchData="catchDataParent" :Content="this.temp.content"></wangEditor>
            <el-input v-model="temp.content" type="hidden"/>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getNewsList, postNews, deleteAdmin, getRolePlist } from '@/api/news'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import wangEditor from '@/components/wangEditor/wangEditor'
export default {
  name: 'newsList',
  inject:['reload'],
  components: { ImageCropper, PanThumb, Pagination,wangEditor},
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
      headers:{
        Authorization: '' //从cookie里获取token，并赋值  Authorization ，而不是token
      },
      dialogImageUrl: '',
      dialogVisible: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      username_disabled: false,
      role_plist: null,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        role_id: '',
        status: ''
      },
      temp: {
        id: '',
        title: '',
        category_id:'',
        tag_id:'',
        keyword:'',
        description:'',
        content: '',
        thumbnail_id:'',
        clicknum:'',
        thumbnail_url:'',
        editorcontent:'',
      },
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      upload_url: 'http://dev-adminapi.bzffs.cc/api/file',
    }
  },
  created() {
    this.getList()
    this.getRolePlist()
  },
  computed: {
      
  },
  mounted(){
    this.getToken();
    this.catchDataParent();
  },
  methods: {
     catchDataParent(value){
          this.temp.content = value      //在这里接受子组件传过来的参数，赋值给data里的参数
      },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.temp.thumbnail_url = res.data.url
         this.temp.thumbnail_id =res.data.id
        console.log(res)
    },
    getToken(){
      this.headers.Authorization = this.$store.getters.token
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    // cropSuccess(resData) {
    //   console.log(resData)
    //   this.imagecropperShow = false
    //   this.temp.img_id = resData.id
    //   this.temp.thumbnail_id = resData.url
    //   console.log(resData.id)
    // },
    close() {
      this.imagecropperShow = false
    },
    close1() {
      this.imagecropperShow1 = false
    },
    getList() {
      this.listLoading = true
      getNewsList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getRolePlist() {
      getRolePlist().then(response => {
        this.role_plist = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      row.status = status
      console.log(row)
      post(row.id).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
        row.status_name = response.data.status_name
      })
    },
    resetTemp() {
      this.username_disabled = true
      this.temp = {
        title: '',
        category_id:'',
        tag_id:'',
        keyword:'',
        description:'',
        content: '',
        thumbnail_id:'',
        clicknum:'',
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
          postNews(this.temp).then(response => {
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
      this.username_disabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postNews(this.temp).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.reload()
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
        deleteAdmin(row).then(() => {
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pan-thumb{
  border-radius: 0px!important;
}
 .el-tagbox.el-tag{margin-left:10px}
 .el-dialog{
   margin-top: 3vh;
 }
</style>
<style lang="stylesheet/scss"  lang="scss">
 .el-dialog{
   margin-top: 1vh!important;
 }
 .el-upload--picture-card{
   width:130px;
   float:right;
 }
 .anli_img_box{
   width:220px;
   height:150px;
   position: relative;
   overflow: hidden;
   float: left;
 }
 .anli_img{
   position: absolute;
   width:100%;
 }
 .anli_img_top{
   width:500px;
 }
</style>
