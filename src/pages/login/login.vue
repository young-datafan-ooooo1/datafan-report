<template>
  <div class="common-layout">
    <div class="logo-title">
      <img style="width: 100px" :src="ASSETS_URL+ '/common/img/stella-logo.png'">
    </div>
    <div class="logo-body" :style="`background: url(${ASSETS_URL}/common/img/login-back.png) no-repeat;`">
      <div class="login-back" :style="`background: url(${ASSETS_URL}/common/img/login-main.png) no-repeat;`" />
      <div class="login_form">
        <div class="login-title">
          登录
        </div>
        <div class="form-body">
          <a-form :form="form" @submit="onSubmit">
            <a-form-item label="用户名称" prop="name">
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入账户名',
                        whitespace: true
                      }
                    ]
                  }
                ]"
                autocomplete="autocomplete"
                placeholder="请输入用户名称"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item label="密码" prop="password">
              <a-input
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                        whitespace: true
                      }
                    ]
                  }
                ]"
                placeholder="请输入密码"
                autocomplete="autocomplete"
                type="password"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button
                :loading="logging"
                style="width: 100%; margin-top: 24px"
                html-type="submit"
                type="primary"
              >登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/services/user'
import { setAuthorization } from '@sense70/common-component-vue'
import { mapMutations } from 'vuex'
import Cookie from 'js-cookie'
import { ASSETS_URL } from '@/services/api'

export default {
  name: 'Login',
  data() {
    return {
      ASSETS_URL,
      imgHeight: 400,
      imgWidth: 400,
      logging: false,
      error: '',
      form: this.$form.createForm(this)
    }
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName
    }
  },
  mounted() {
    this.imgHeight = window.innerHeight * 0.6
    this.imgWidth = window.innerWidth * 0.4
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    onSubmit(e) {
      e.preventDefault()
      this.form.validateFields(err => {
        if (!err) {
          this.logging = true
          const username = this.form.getFieldValue('name')
          const password = this.form.getFieldValue('password')
          const data = {
            username: username,
            password: password,
            client_id: 'stella-client',
            client_secret: 'stella-secret',
            grant_type: 'password'
          }
          login(data)
            .then(this.afterLogin)
            .catch(e => {
              console.log(e)
              this.logging = false
            })
        }
      })
    },
    afterLogin(res) {
      this.logging = false
      const loginRes = res.data
      if (res.status === 200) {
        console.log(loginRes.user_cname)
        this.setUser(loginRes.user_cname)
        Cookie.set('userName', loginRes.user_cname)
        Cookie.set('loginUserName', loginRes.account)
        Cookie.set('userId', loginRes.user_id)

        // Cookie.set('token')
        localStorage.setItem('userName', loginRes.user_cname)
        setAuthorization({ token: loginRes.refresh_token })
        // let isSuper = false;
        // loginRes.roles.forEach(item => {
        //   if (item.code === "superadmin") {
        //     isSuper = true;
        //   }
        // })
        console.log(loginRes.refresh_token)
        // 获取路由配置
        this.$router.push('/home')
        this.$message.success(loginRes.message ?? '登陆成功', 2)
      } else {
        this.error = loginRes.message
      }
    }
  }
}
</script>

<style lang="less" scoped>
//@media screen and (max-height: 768px) {
//  .logo-body {
//    transform: translateY(10%);
//    height: calc(80% - 60px);
//  }
//}

.common-layout {
  display: flex;
  overflow: auto;
  flex-direction: column;
  height: 100%;
  background: #eeeff2;
  font-family: PingFangSC-Regular, PingFang SC;

  .logo-title {
    padding: 0 50px;
    height: 60px;
    background: #2c2e31;
    line-height: 56px;
  }

  .logo-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 1360px;
    //height: calc(100% - 60px);
    width: 100%;
    transform: translateY(20%);
    //background-size: cover;
  }
  .login-back {
    width: 701px;
    height: 554px;
  }

  .login_form {
    flex: 0 0 400px;
    padding: 32px;
    width: 400px;
    height: 388px;
    background: #ffffff;
    box-shadow: 0px 3px 9px 0px rgba(38, 38, 38, 0.14);
  }
  .login-title {
    display: flex;
    justify-content: space-between;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    font-family: PingFang-SC-Bold;
  }
  .form-body {
    padding: 32px 0 12px 0;
  }
}
</style>
