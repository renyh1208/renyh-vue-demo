<template>

  <div class="app-container">

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

      <el-form :inline="true">

      <el-form-item >
        <el-input placeholder="姓名" v-model="userName"></el-input>
      </el-form-item>

        <el-form-item>
        <el-button type="primary" @click="queryUsers"><i class="el-icon-search" ></i>搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="createUser">新增</el-button>
      </el-form-item>

      </el-form>
    </el-col>


    <!--列表-->
    <el-table :data="tableList" v-loading="listLoading" border element-loading-text="拼命加载中" style="width: 100%;">

      <el-table-column prop="uid" label="序号" width="65">
      </el-table-column>

      <el-table-column prop="userName" label="姓名">
      </el-table-column>

      <el-table-column prop="age" label="年龄">
      </el-table-column>

      <el-table-column prop="sex" label="性别">
      </el-table-column>

      <el-table-column label="组织">
        <template slot-scope="scope">
          <span>{{orgasMap[scope.row.oid]}}</span><!--从map中通过key取出对应的组织。-->
        </template>
      </el-table-column>

      <el-table-column prop="birthday" label="生日" width="110px">
      </el-table-column>

      <el-table-column prop="uid" label="操作 ">
        <template slot-scope="scope" >
              <el-button  type="primary"  @click="updateUser(scope.row)">编辑</el-button>
              <el-button  type="danger" @click="removeUser(scope.row.uid)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div>
      <el-pagination
        layout="prev, pager, next" :total="total" style="float:right;" @current-change="pageChange">
      </el-pagination>
    </div>

    <user-form :visible.sync = "visible" :dialogStatus="dialogStatus" :title="title" @success="loadData"
                :editData="editData"></user-form>

  </div>
</template>



<script>
import userApi from '@/api/user'
import UserForm from '../form'
import groupApi from '@/api/group'

export default {

  //注册表单
  components: {UserForm},

  data() {
    return {
      //设置列表数据
      tableList: [],
      //用户过渡加载时间
      listLoading: true,
      //设置该控件是否可见
      isShowEditVisible: false,
      //设置该控件是否可见
      deleteVisible: false,
      //初始化组织数据
      orgasMap :{},
      //设置修改的数据
      title: {
        update: '编辑页面',
        create: '新增页面'
      },
      oid: 0,
      dialogStatus: '',
      userName: '',
      total: 0,
      filters: {
        userName: ''
      },
      visible: false,
      userDate: [],
      editDate: {
        oid: null,
        uid: null,
        userName: null,
        age: null,
        sex: null,
        birthday: null
      },
      listQuery: {
        pageIndex: 1,
        pageSize: 5
      },
    }
  },
  /**
   * 初始化调用
   */
  created() {
    this.loadData();
    this.loadOrgas();
  },
  /**
   * 查询所有数据
   */
  methods: {
    async loadData() {
      this.listLoading = true
      userApi.queryUserList(this.listQuery, this.userName, this.oid).then(response => {
        console.log(response.data.list)
        this.tableList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },

    /**
     * 创建一个用户
     */
     createUser() {
      this.visible = true
      this.dialogStatus = "create"
      this.editData = {
        oid: null,
        uid: null,
        userName: null,
        age: null,
        sex: null,
        birthday: null
      }
    },

      /**
       * 修改一个用户
       */
    updateUser(val) {
      this.visible = true
      this.dialogStatus = "update"
      //数据隔离
      this.editData = Object.assign({},val)
      console.log(this.editData)
    },

    /**
     * 通过id删除一个用户
     * @param id
     */
    removeUser (id) {
      this.$confirm('永久删除该文件', '是否继续？', '提示', {//弹出一个确认框
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await userApi.remove(id)
        if (resp.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
        this.loadData()
      }).catch(() => {
      })
    },

    /**
     *  将当前页数赋值给pageindex
     *  从新加载
     * @param page
     */
    pageChange(page) {
      this.listQuery.pageIndex = page
      this.loadData()
    },
    queryUsers () {
      this.loadData()
    },

    /**
     * 获取所有组织信息封装到map中
     * 再通过map的key找到对应的部门
     */
    loadOrgas(){
      groupApi.sections().then(response => {
        if (response != null ) {
          let map = {};
          response.data.forEach(function (orga) {
            map[orga.oid] = orga.department;
          })
          this.orgasMap = map;
        }
      });
    },



  }
}
</script>

