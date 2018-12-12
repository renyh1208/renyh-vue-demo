
<template>

  <div>
    <el-dialog :title="title[dialogStatus]" width="600px" :visible.sync="show">

    <el-form :model="editData" :rules="rule" ref="userFrom" label-width="100px">

    <el-form-item label="名称" prop="userName">
      <el-input v-model="editData.userName"></el-input>
    </el-form-item>


      <el-form-item label="密码" prop="passWord">
        <el-input v-model="editData.passWord"></el-input>
      </el-form-item>


      <el-form-item label="年龄" prop="age">
        <el-input v-model="editData.age"></el-input>
      </el-form-item>


      <el-form-item label="性别" prop="sex" value="selected">
        <el-radio v-model="editData.sex" :label="1">男</el-radio>
        <el-radio v-model="editData.sex" :label="2">女</el-radio>
      </el-form-item>


      <el-form-item label="组织id" prop="oid" :hidden="true">
        <el-input v-model="editData.oid"></el-input>
      </el-form-item>
    <el-form-item label="所属机构" prop="oid">
        <el-cascader
          :props = "treeRoles"
          :options="options"
          :show-all-levels="false"
          change-on-select
          @change="createList">
        </el-cascader>
    </el-form-item>



    <el-form-item label="生日" >
        <el-form-item prop="date">
          <el-date-picker type="date" placeholder="选择日期" v-model="editData.birthday" style="width: 100%;"></el-date-picker>
        </el-form-item>
    </el-form-item>



    <el-form-item>
      <el-button type="primary" @click="submitForm('userForm')">立即创建</el-button>
      <el-button type="primary" @click="editUser('userForm')">确认修改</el-button>
    </el-form-item>

        </el-form>
    </el-dialog>
  </div>
  </template>
<script>
  import userApi from '../../api/user'
  import groupApi from '../../api/group'
  export default {
    name: 'forms',
    /**
     * 接收数据
     */
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      editData: {
        Type: Array,
        required: true
      },
      dialogStatus: {
        Type: String,
        required: true
      },
      title: {
        Type: Map,
        required: true
      }
    },
    watch: {
      show (val) {
        if (!val) {
          this.$emit('update:visible', val)
          this.options = [{
            oid: '1',
            department: '普元科技',
            children: []
          }]
        }
      },
      visible (val) {
        if (val) {
          this.show = this.visible
        }
      },
      dialogStatus (val) {
        if (val === 'create') {
          this.$set(this.rule, 'passWord', this.passWord)
          this.$set(this.rule, 'oid', this.oid)
          this.disabled = false
        } else {
          this.disabled = true
          this.$delete(this.rule, 'passWord', this.passWord)
          this.$delete(this.rule, 'oid', this.oid)
        }
      }
    },
    data () {
      return {
        //设置下拉框中的根数据
        options: [{
          oid: '1',
          department: '普元科技',
          children: []
        }],
        optionId: null,
        show: this.visible,
        disabled: false,
        rule: {
          userName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          birthday: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
        },
        //对根节点进行映射
        treeRoles: {
          value: 'oid',
          label: 'department',
          children: 'children'
        },
      }
    },
    methods: {
      // 懒加载下拉选
      // 拿到根节点的id
      async createList (val) {
        if (val) {

          //将根节点减一赋值给optionId
          this.optionId = val[val.length - 1]
          //将optionid赋值给fROM表单中的id
          this.editData.oid = this.optionId

          //后端查询数据
          let resp = await groupApi.roleList(this.editData.oid)
          //判断数据不为null
          if (resp.data.length > 0) {

            //查询数据等于一的话就是根节点
            if (val.length === 1) {
              //将根节点中的数据放入到rhildren中
              this.options[0].children = resp.data
            }

            if (val.length === 2) {
              //判断等于二的时候就遍历查询后端数据返回之后将数据放入到children中
              this.options[0].children.forEach((items, index) => {
                if (this.optionId === items.oid) {
                  this.$set(items, 'children', resp.data)
                }
              })
            }

            if (val.length === 3) {
              //判断第三层数据，遍历之后将数据放入到children中
              this.options[0].children.forEach((items, index) => {
                if (items.children) {
                  items.children.forEach((itemss, index) => {
                    if (this.optionId === itemss.oid) {
                      this.$set(itemss, 'children', resp.data)
                    }
                  })
                }
              })
            }
          }
        }
      },
      // 新增
      submitForm () {
        this.$refs.userFrom.validate(async valid => {
          if (valid) {
            if(this.editData.sex === "1"){
              this.editData.sex = "男"
            }else{
              this.editData.sex = "女"
            }
            let resp = await userApi.create(this.editData)
            if (resp.code === 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.show = false
              this.$emit('success')
            }
          }
        })
      },
      editUser () {
        this.$refs.userFrom.validate(async valid => {
          if (valid) {
            if(this.editData.sex === "1"){
              this.editData.sex = "男"
            }else{
              this.editData.sex = "女"
            }
            console.log(this.editData)
            let resp = await userApi.update(this.editData)
            if (resp.code === 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.show = false
              this.$emit('success')
            }
          }
        })
      },
    }
  }
</script>

<style scoped>
</style>



