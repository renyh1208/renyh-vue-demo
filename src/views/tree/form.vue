<template>
  <div>
    <el-dialog :title="title[dialogStatus]" width="600px" :visible.sync="show">
      <div>
        <el-form ref="forms" :model="editData" :rules="rule" label-width="100px" v-if="!dialogStatus">
          <el-form-item label="父级id" :label-width="formLabelWidth" :hidden="true" prop="pid">
            <el-input v-model="editData.pid"></el-input>
          </el-form-item>
          <el-form-item label="选择机构" :label-width="formLabelWidth" :disabled="dialogStatus" :hidden="dialogStatus">
            <el-cascader
              :props="treeRoles"
              :options="options"
              :show-all-levels="false"
              change-on-select
              @change="createList">
            </el-cascader>
          </el-form-item>
          <el-form-item label="名称" :label-width="formLabelWidth" prop="department">
            <el-input v-model="editData.department" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            <el-button type="primary" @click="onSubmit" v-text="'新增'"></el-button>
            <el-button @click.native="show=false">取消</el-button>
          </el-form-item>
        </el-form>



        <el-form v-else ref="forms" :model="editData" :rules="rule" label-width="100px">
          <el-form-item label="组织id" :label-width="formLabelWidth" :hidden="true" prop="oid">
            <el-input v-model="editData.oid"></el-input>
          </el-form-item>
          <el-form-item label="名称" :label-width="formLabelWidth" prop="department">
            <el-input v-model="editData.department" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            <el-button type="primary" @click="onSubmit" v-text="'修改'"></el-button>
            <el-button @click.native="show=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import userFrom from '../table'
  import sysApi from '../../api/group'
  export default {
    comments: {userFrom},
    name: 'forms',
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
      }
    },
    data () {
      return {
        show: false,
        formLabelWidth: '100px',
        options: [{
          oid: '1',
          department: '普元科技',
          children: []
        }],
        optionId: null,
        rule: {
          department: [
            {required: true, trigger: '', message: '请输入组织名称！'}
          ],
          oid: [
            {required: true, trigger: '', message: '组织id不能为空'}
          ]
        },
        treeRoles: {
          value: 'oid',
          label: 'department',
          children: 'children'
        }
      }
    },
    methods: {
      // 懒加载下拉选
      async createList (val) {
        this.optionId = val[val.length - 1]
        this.editData.pid = this.optionId
        let resp = await sysApi.roleList(val[val.length - 1])
        if (resp.data.length > 0) {
          if (val.length === 1) {
            this.options[0].children = resp.data
          }
          if (val.length === 2) {
            this.options[0].children.forEach((items, index) => {
              if (this.optionId === items.groupId) {
                this.$set(items, 'children', resp.data)
              }
            })
          }
          if (val.length === 3) {
            this.options[0].children.forEach((items, index) => {
              if (items.children) {
                items.children.forEach((itemss, index) => {
                  if (this.optionId === itemss.groupId) {
                    this.$set(itemss, 'children', resp.data)
                  }
                })
              }
            })
          }
        }
      },
      async onSubmit () {
        this.$refs.forms.validate(async valid => {
          if (valid) {
            let resp
            if (this.dialogStatus) {
              resp = await sysApi.update(this.editData)
            } else {
              resp = await sysApi.create(this.editData)
            }
            console.log(resp);
            if (resp.code === 200) {
              this.$emit('success')
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.show = false
            }
          }
        })
      }
    }
  }
</script>
<style scoped>
</style>
