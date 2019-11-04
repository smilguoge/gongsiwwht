<template>
  <div class="app-container">
    <div class="company_box">
      <h2>公司信息</h2>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="company_load">
        <el-form-item  label="公司名称" prop="company_name">
          <el-input v-model="ruleForm.company_name" style="width:450px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label-width="" label="公司LOGO图" prop="" style="margin-bottom:0px;">

          <el-upload
            class="avatar-uploader fl"
            action="http://dev-adminapi.bzffs.cc/api/file"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.ruleForm.logo_url" :src="this.ruleForm.logo_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="bg_box">点击更换</div>
          </el-upload>
          <el-input v-model="ruleForm.logo_id"  type="hidden"></el-input>
        </el-form-item>
       <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm.address"  placeholder="请输入地址" style="width:450px"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="ruleForm.tel" placeholder="请输入电话" style="width:450px"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号" style="width:450px"></el-input>
        </el-form-item>
        <el-form-item label="关键词" prop="keyword">
          <el-input  v-model="ruleForm.keyword" placeholder="请输入关键词" style="width:450px"></el-input>
        </el-form-item>
        <el-form-item label="备案号" prop="beian_num">
          <el-input v-model="ruleForm.beian_num" placeholder="请输入备案号" style="width:450px"></el-input>
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="ruleForm.qq" placeholder="请输入qq" style="width:450px"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="ruleForm.wechat" placeholder="请输入微信" style="width:450px"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="postcode">
          <el-input v-model="ruleForm.postcode" placeholder="请输入邮编" style="width:450px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱" style="width:450px"></el-input>
        </el-form-item>
        <el-form-item label-width="" label="公司二维码" prop="" style="margin-bottom:0px;">

          <el-upload
            class="avatar-uploader"
            action="http://dev-adminapi.bzffs.cc/api/file"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleAvatarSuccess_ewm"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.ruleForm.wechat_code_url" :src="this.ruleForm.wechat_code_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="bg_box">点击更换</div>
          </el-upload>
          <el-input v-model="ruleForm.wechat_code_id" type="hidden"></el-input>
        </el-form-item>
        <el-form-item label-width="" label="合作公司logo" prop="" style="margin-bottom:0px;">
        <el-upload
          action="http://dev-adminapi.bzffs.cc/api/file"
          list-type="picture-card"
          :file-list="fileList"
          :headers="headers"
          :on-success="cooperationSuccess"
          :on-remove="cooperationRemove"
          :on-preview="handlePictureCardPreview"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        </el-form-item>
          <el-input v-model="ruleForm.company_imgsid" style="width:450px" type="hidden"></el-input>
        <el-form-item label="描述" prop="description">
          <el-input :rows="7" type="textarea" v-model="ruleForm.description" style="width:450px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateData('ruleForm')">提交修改</el-button>
        </el-form-item>
      </el-form>


    </div>
  </div>
</template>

<script>
import {getAboutList, postAbout, deleteAdmin, getRolePlist } from '@/api/about'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'


</script>
<script>
  import {getAboutList, postAbout, deleteAdmin, getRolePlist } from '@/api/about'
  export default {
    name: 'Aboutlist',
    inject:['reload'],
    data() {
      return {
        list:{
        },
        ruleForm: {
            company_name :'',
            address:'',
            tel:'',
            phone:'',
            keyword:'',
            description:'',
            beian_num:'',
            qq:'',
            wechat:'',
            postcode:'',
            email:'',
            company_imgsidarr:'',
            logo_url:'',
            logo_id:'',
            wechat_code_id:'',
            wechat_code_url:'',
            company_imgsurlarr:'',
            company_imgsid:'',
        },
        rules: {
          company_name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' }
          ],
          address: [
            {required: true,message:'地址不能为空' , trigger: 'blur'}
          ],
          tel: [
            {required: true,message:'电话不能为空' , trigger: 'blur'}
          ],
          phone: [
            {required: true,message:'手机不能为空' , trigger: 'blur'}
          ],
          keyword: [
            {required: true,message:'关键词不能为空' , trigger: 'blur'}
          ],
          description: [
            {required: true,message:'描述不能为空' , trigger: 'blur'}
          ],
          beian_num: [
            {required: true,message:'备案号不能为空' , trigger: 'blur'}
          ],
          qq: [
            {required: true,message:'qq不能为空' , trigger: 'blur'}
          ],
          wechat: [
            {required: true,message:'微信不能为空' , trigger: 'blur'}
          ],
          postcode: [
            {required: true,message:'邮编不能为空' , trigger: 'blur'}
          ],
          email: [
            {required: true,message:'邮箱不能为空' , trigger: 'blur'}
          ],
        },
        listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        role_id: '',
        status: '',
        },
        company_load:'true',
        imageUrl: '',
        headers:{
          Authorization: '' //从cookie里获取token，并赋值  Authorization ，而不是token
        },
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: [],
        remove_id:'',
      };
    },
    created(){
      this.getList()
    },
    methods: {
      getList() {
        this.company_load = true
        getAboutList(this.listQuery).then(response => {
          const originalArray = response.data.list[4].company_imgsurlarr;
          let newArray = originalArray.map(element => { return {url: element}; });
          this.ruleForm.company_imgsurlarr = newArray
          console.log(this.ruleForm.company_imgsurlarr);
          this.fileList = this.ruleForm.company_imgsurlarr
          console.log(response.data.list[4])
          this.ruleForm = response.data.list[4]
          setTimeout(() => {
            this.company_load = false
          }, 0.5 * 1000)
        })
      },
      updateData(ruleForm) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            postAbout(this.ruleForm).then(response => {
              console.log(response)
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
      getToken(){
        this.headers.Authorization = this.$store.getters.token
      },
      handleAvatarSuccess(res, file) {
        this.ruleForm.logo_url = res.data.url;
        this.ruleForm.logo_id =res.data.id;
      },
      handleAvatarSuccess_ewm(res, file) {
        this.ruleForm.wechat_code_url = res.data.url;
        this.ruleForm.wechat_code_id =res.data.id;
      },
      cooperationSuccess(res, file){
        var input_num = this.ruleForm.company_imgsid.length;
        if( input_num == 0){
          this.ruleForm.company_imgsid = res.data.id;
        }
        if( input_num >= 18){
          this.ruleForm.company_imgsid =this.ruleForm.company_imgsid + ',' + res.data.id;
        }
      },
      cooperationRemove(res, file){
        this.remove_id = res.url
        if('response' in res){
          var remove_local_id ="," + res.response.data.url.substring(41,59);
          this.ruleForm.company_imgsid = this.ruleForm.company_imgsid.replace(remove_local_id,"");
        }
        var input_num = this.ruleForm.company_imgsid.length;
        if( input_num < 19){
           var this_id = this.remove_id.substring(41,59);
           this.ruleForm.company_imgsid = this.ruleForm.company_imgsid.replace(this_id,"");
        }else{
          var this_id ="," + this.remove_id.substring(41,59);
          this.ruleForm.company_imgsid = this.ruleForm.company_imgsid.replace(this_id,"");
          console.log(this.ruleForm.company_imgsid)
          console.log(input_num)
        }
      },
      beforeAvatarUpload(file) {
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isPNG) {
          this.$message.error('上传头像图片只能是 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isPNG && isLt2M;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    },
    mounted(){
      this.getToken()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

 .company_box{
   width:100%;
   height:100%;
   background-color: #fff;
   padding:20px;
   h2{
     font-size: 18px!important;
     font-weight: 400;
     border-bottom:1px solid #f2f2f2;
     padding-bottom: 15px;
   }
 }
 .app-container{
   padding:20px;
   background-color: #F4F5F9;
 }
 .demo-ruleForm{
   width:725px;
 }
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader{
    width:178px;
    height: 178px;
    overflow: hidden;
    position: relative;
  }
  .avatar-uploader img{
    border:1px solid #d5d5d5;
  }
  .avatar-uploader:hover .bg_box{
     opacity: 1;
   }
  .bg_box{
    width:100%;
    height:100%;
    position: absolute;
    background:rgba(0,0,0,0.6);
    line-height: 178px;
    color:#f2f2f2;
    font-size: 16px;
    top:0px;
    opacity: 0;
    transition: 0.1s all;
  }
  .avatar-uploader:hover img{
    background: rgba(0,0,0,0.3)
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dotted #d5d5d5;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-upload-list--picture-card{
    float: left;
  }
  .el-upload--picture-card{
    float: left;
  }
</style>
<style lang="stylesheet/scss" lang="scss">
</style>

