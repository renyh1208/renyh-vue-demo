<template>
  <div class="login-container">

    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">

      <h3 class="title">员工管理系统</h3>

      <el-form-item prop="userName">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="userName" type="text" v-model="loginForm.userName" autoComplete="on" placeholder="userName" />
      </el-form-item>


      <el-form-item prop="passWord">
        <span class="svg-container">
          <svg-icon icon-class="passWord"></svg-icon>
        </span>
        <el-input name="passWord" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.passWord" autoComplete="on"
          placeholder="passWord"></el-input>
      </el-form-item>



      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>



    </el-form>
  </div>
</template>

<script>
import loginuser from '../../api/user'
import { isvalidUsername } from '../utils/validate'
export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: '',
        passWord: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        passWord: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'passWord'
    }
  },
  methods: {

    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          let data = await loginuser.login(this.loginForm)
          this.loading = false
          let user = null
          if(data.code === 200){
            user = data.data
            this.$message({
              message : '登录成功',
              type : "success"
            })
          }
          sessionStorage.setItem('user',JSON.stringify(user))
          this.$router.push({path:'/'})

        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    position: fixed;
    height: 100%;
    width:100%;
    background-color: $bg;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    /*<!--. show-pwd {-->*/
      /*<!--position: absolute;-->*/
      /*<!--right: 10px;-->*/
      /*<!--top: 7px;-->*/
      /*<!--font-size: 16px;-->*/
      /*<!--color: $dark_gray;-->*/
      /*<!--cursor: pointer;-->*/
      /*<!--user-select:none;-->*/
    /*<!--}-->*/
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
</style>
