<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" v-model="param.searchCondition.name" class="filter-item" placeholder="角色名称">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.typeCode" placeholder="来源平台">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in roleTypes.data"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.inUse" placeholder="是否启用">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="是" value="1"></el-option>
        <el-option label="否" value="0"></el-option>
      </el-select>
      <el-input style="width: 200px;" v-model="param.searchCondition.orgName" @focus="chooseOrg(1)" class="filter-item" placeholder="选择所属机构">
      </el-input>
      <el-button class="filter-item" @click="getRoleList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <!--<el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>-->
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="roles.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="orgName" label="所属机构" width="150"></el-table-column>
      <el-table-column fixed prop="name" label="角色名称" width="120"></el-table-column>
      <el-table-column prop="typeName" label="来源平台" width="100"></el-table-column>
      <el-table-column label="是否启用" width="80">
        <template slot-scope="scope">
          {{scope.row.inUse | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60"></el-table-column>
      <el-table-column prop="code" label="角色编码"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.system || !!currentPermission.canToSystem" type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button v-if="!scope.row.system || !!currentPermission.canToSystem" type="danger" size="mini" @click="deleteRole(scope.row)">删除</el-button>
          <el-button type="info" size="mini" @click="setAuth(scope.row)">权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="roles.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="mObject.code"></el-input>
        </el-form-item>
        <el-form-item label="来源平台" prop="typeCode">
          <el-select :disabled="isEdit" v-model="mObject.typeCode" placeholder="请选择来源平台">
            <el-option
              v-for="item in roleTypes.data"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构" prop="orgName">
          <el-input :disabled="isHaveChildrenOrg" @focus="chooseOrg(2, mObject.orgId)" v-model="mObject.orgName"></el-input>
        </el-form-item>
        <el-form-item label="是否系统角色" prop="system">
          <el-select :disabled="isCanToSystem" v-model="mObject.system" placeholder="请选择是否系统角色">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="inUse">
          <el-select v-model="mObject.inUse" placeholder="请选择是否启用">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="mObject.sort"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="mObject.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="权限管理"
      :close-on-click-modal=false
      :visible.sync="authDialogVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="授权功能菜单" name="first">
          <el-tree
            ref="resourceTree"
            default-expand-all
            v-loading="permissionListLoading"
            :data="resourceList"
            show-checkbox
            node-key="id"
            :check-on-click-node="true"
            :expand-on-click-node="false"
            :default-checked-keys="selectedResourceList"
            :props="defaultProps">
          </el-tree>
          <div class="button-container">
            <el-button type="primary" size="small" @click="saveResource()">保存</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="授权数据权限" name="second">
          <el-tree
            ref="orgTree"
            default-expand-all
            v-loading="permissionListLoading"
            :data="orgList"
            show-checkbox
            node-key="id"
            :check-on-click-node="true"
            :expand-on-click-node="false"
            :default-checked-keys="selectedOrgList"
            :props="defaultProps">
          </el-tree>
          <div class="button-container">
            <el-button type="primary" size="small" @click="saveOrg()">保存</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分配用户" name="third">
          <div class="filter-container">
            <el-button class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="bindUser()">绑定</el-button>
          </div>
          <el-table
            @selection-change="handleSelectionChange"
            :data="roleUserList.data"
            v-loading="roleUserListLoading"
            border
            style="width: 100%">
            <el-table-column fixed width="120" prop="userName" label="账号"></el-table-column>
            <el-table-column width="120" prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="inUse" label="启用">
              <template slot-scope="scope">
                {{scope.row.inUse | yesOrNo}}
              </template>
            </el-table-column>
            <el-table-column prop="system" width="120" label="是否系统账号">
              <template slot-scope="scope">
                {{scope.row.system | yesOrNo}}
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" label="创建人"></el-table-column>
            <el-table-column prop="updatorName" label="更新人"></el-table-column>
            <el-table-column prop="sourceName" label="来源"></el-table-column>
            <el-table-column fixed="right" label="操作" width="72">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="unbindUser(scope.row)">解绑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="所属机构"
      :close-on-click-modal=false
      :visible.sync="orgDialogVisible">
      <el-tree
        :data="roleOrganizations"
        :check-strictly="true"
        v-loading="roleOrganizationsLoading"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :default-expand-all="true"
        highlight-current
        node-key="id"
        ref="chooseOrgTree"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChooseOrg()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog
      title="分配用户"
      :close-on-click-modal=false
      width="80%"
      :visible.sync="userDialogVisible">
      <el-table
        @current-change="currentUserChange"
        :data="roleExcludeUserList.data"
        v-loading="roleExcludeUserListLoading"
        highlight-current-row
        border
        style="width: 100%">
        <el-table-column fixed width="120" prop="userName" label="账号"></el-table-column>
        <el-table-column width="120" prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="inUse" label="启用">
          <template slot-scope="scope">
            {{scope.row.inUse | yesOrNo}}
          </template>
        </el-table-column>
        <el-table-column prop="system" width="120" label="是否系统账号">
          <template slot-scope="scope">
            {{scope.row.system | yesOrNo}}
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人"></el-table-column>
        <el-table-column prop="updatorName" label="更新人"></el-table-column>
        <el-table-column prop="sourceName" label="来源"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChooseUser()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style lang="scss" scoped>
.button-container {
  padding: 20px 0 0;
}
</style>


<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      activeName: "first",
      defaultProps: {
        children: "children",
        label: "name"
      },
      currentRow: {},
      currentUserRow: {},
      orgType: "",

      listLoading: false,
      roleUserListLoading: false,
      roleExcludeUserListLoading: false,
      permissionListLoading: false,
      roleOrganizationsLoading: false,
      param: { page: 1, limit: 10, searchCondition: {} },
      role_type_code_search: "",
      create_role_inUse: "",
      dialogVisible: false,
      mObject: {},
      mTitle: "",
      isEdit: false,
      isCanToSystem: false, // 默认"是否系统角色"选择框不可用
      isHaveChildrenOrg: false, // 默认"所属"选择框不可用
      selectedRows: [],
      authDialogVisible: false,
      orgDialogVisible: false,
      userDialogVisible: false,

      currentPermission: {},

      userParam: { page: 1, limit: 100, searchCondition: {} },
      excludeUserParam: { page: 1, limit: 100, searchCondition: {} },

      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
        typeCode: [
          { required: true, message: "请选择来源平台", trigger: "blur" }
        ],
        inUse: [{ required: true, message: "请选择是否启用", trigger: "blur" }],
        system: [
          { required: true, message: "请选择是否系统角色", trigger: "blur" }
        ]
      }
    };
  },
  filters: {},
  created() {
    this.getRoleList();
    this.getCurrentAccountAdminPermission();
    this.getRoleOrganizationList()
    this.getRoleTypeList()
  },
  computed: mapState({
    roles: state => state.role.roles,
    roleOrganizations: state => state.role.roleOrganizations,
    roleTypes: state => state.role.roleTypes,
    resourceList: state => state.role.resourceList,
    orgList: state => state.role.orgList,
    selectedResourceList: state => state.role.selectedResourceList,
    selectedOrgList: state => state.role.selectedOrgList,
    roleUserList: state => state.role.roleUserList,
    roleExcludeUserList: state => state.role.roleExcludeUserList,
    ...mapGetters(["isUse"])
  }),
  methods: {
    getCurrentAccountAdminPermission() {
      this.listLoading = true;
      this.$store
        .dispatch("getCurrentAccountAdminPermission", {})
        .then(response => {
          this.currentPermission = response.data;
          if (!response.data.canToSystem) {
            this.isCanToSystem = true;
          }
          if (!response.data.haveChildrenOrg) {
            this.isHaveChildrenOrg = true;
          }
          if (response.data.canSelectSource) {
            this.getRoleTypeList();
          } else {
            this.isEdit = true;
          }
        });
    },
    getRoleList() {
      this.listLoading = true;
      this.$store.dispatch("getRoleList", {
        params: this.param,
        callback: () => {
          this.listLoading = false;
        }
      });
    },
    getRoleOrganizationList() {
      this.roleOrganizationsLoading = true;
      this.$store.dispatch("getRoleOrganizationList", {
        params: this.param,
        callback: () => {
          this.roleOrganizationsLoading = false;
        }
      });
    },
    getRoleTypeList() {
      this.$store.dispatch("getRoleTypeList", { params: this.param });
    },
    getAuthUserList() {
      this.roleUserListLoading = true;
      this.$store.dispatch("getAuthUserList", {
        params: this.userParam,
        callback: () => {
          this.roleUserListLoading = false;
        }
      });
    },
    getAuthExcludeUserList() {
      this.roleExcludeUserListLoading = true;
      this.$store.dispatch("getAuthExcludeUserList", {
        params: this.excludeUserParam,
        callback: () => {
          this.roleExcludeUserListLoading = false;
        }
      });
    },
    resetSearch() {
      this.param.searchCondition = {};
      this.getRoleList();
    },
    handleSizeChange(size) {
      this.param.limit = size;
      this.getRoleList();
    },
    handleCurrentChange(page) {
      this.param.page = page;
      this.getRoleList();
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },

    // 设置权限
    setAuth(row) {
      this.currentRow = row;
      this.authDialogVisible = true;
      this.activeName = "first";
      this.permissionListLoading = true;
      this.$store.dispatch("getPermissionList", {
        row: row,
        callback: () => {
          this.permissionListLoading = false;
        }
      });
      this.userParam.id = this.currentRow.id;
      this.getAuthUserList();
    },

    // 保存授权功能菜单
    saveResource() {
      const nodes = this.$refs.resourceTree.getHalfCheckedNodes();
      const checkedNodes = this.$refs.resourceTree.getCheckedNodes();
      const rmlist = [];
      for (const node of nodes) {
        rmlist.push({
          roleId: this.currentRow.id,
          resourceId: node.id
        });
      }
      for (const node of checkedNodes) {
        rmlist.push({
          roleId: this.currentRow.id,
          resourceId: node.id
        });
      }
      const mObject = {
        roleId: this.currentRow.id,
        roleResourceMappingList: rmlist
      };
      this.$store.dispatch("saveResource", {
        data: mObject,
        callback: () => {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 3 * 1000
          });
        }
      });
    },

    // 保存授权数据权限
    saveOrg() {
      const nodes = this.$refs.orgTree.getHalfCheckedNodes();
      const checkedNodes = this.$refs.orgTree.getCheckedNodes();
      const rmlist = [];
      for (const node of nodes) {
        rmlist.push({
          roleId: this.currentRow.id,
          orgId: node.id
        });
      }
      for (const node of checkedNodes) {
        rmlist.push({
          roleId: this.currentRow.id,
          orgId: node.id
        });
      }
      const mObject = {
        roleId: this.currentRow.id,
        roleOrgMappingList: rmlist
      };
      this.$store.dispatch("saveOrg", {
        data: mObject,
        callback: () => {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 3 * 1000
          });
        }
      });
    },

    // 编辑/新增
    edit(row) {
      this.mTitle = "编辑";
      if (!row) {
        this.mTitle = "新增";
        row = {
          typeCode: this.currentPermission.sourceCode,
          orgId: this.currentPermission.currentOrg.id,
          orgName: this.currentPermission.currentOrg.name,
          typeName: this.currentPermission.sourceName,
          system: false,
          inUse: true
        };
      }
      this.mObject = Object.assign({}, row);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["mObject"].clearValidate();
      });
    },
    // 删除角色
    deleteRole(role) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("deleteRole", {
          data: role,
          callback: () => {
            this.$message({
              type: "success",
              message: "删除成功!",
              duration: 3 * 1000
            });
            this.getRoleList();
          }
        });
      });
    },
    // 批量删除角色
    deleteMulti() {
      const idsArr = [];
      for (const row of this.selectedRows) {
        idsArr.push(row.id);
      }
      if (!idsArr.length) {
        this.$message({
          type: "error",
          message: "请先选择需要删除的项!",
          duration: 3 * 1000
        });
        return false;
      }
      this.deleteRole({ id: idsArr.join(",") });
    },
    // 提交表单
    submitForm() {
      this.$refs["mObject"].validate(valid => {
        if (valid) {
          console.log(this.mObject);
          if (this.mObject.id) {
            this.$store.dispatch("editRole", {
              data: this.mObject,
              callback: () => {
                this.$message({
                  message: "更新成功",
                  type: "success",
                  duration: 3 * 1000
                });
                this.dialogVisible = false;
                this.getRoleList();
              }
            });
          } else {
            this.$store.dispatch("addRole", {
              data: this.mObject,
              callback: () => {
                this.$message({
                  message: "添加成功",
                  type: "success",
                  duration: 3 * 1000
                });
                this.dialogVisible = false;
                this.getRoleList();
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    chooseOrg(type, nodeKey) {
      this.orgDialogVisible = true;
      this.orgType = type;
      setTimeout(() => {
        this.$refs.chooseOrgTree.setCurrentKey(nodeKey || null);
      }, 500);
    },
    saveChooseOrg() {
      this.orgDialogVisible = false;
      const nodes = this.$refs.chooseOrgTree.getCurrentNode();
      if (this.orgType === 1) {
        this.param.searchCondition.orgId = nodes.id;
        this.param.searchCondition.orgName = nodes.name;
      } else if (this.orgType === 2) {
        this.mObject.orgId = nodes.id;
        this.mObject.orgName = nodes.name;
      }
    },
    // 绑定用户
    bindUser() {
      this.userDialogVisible = true;
      this.excludeUserParam.id = this.currentRow.id;
      this.getAuthExcludeUserList();
    },
    // 解绑用户
    unbindUser(row) {
      console.log(this.currentRow.id + "-----" + row.id);
      this.$confirm("此操作将永久解绑该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("unbindUser", {
          data: { roleId: this.currentRow.id, selectItemIds: row.id },
          callback: () => {
            this.$message({
              message: "解绑成功",
              type: "success",
              duration: 3 * 1000
            });
            this.userDialogVisible = false;
            this.getAuthUserList();
          }
        });
      });
    },
    currentUserChange(row) {
      this.currentUserRow = row;
    },
    saveChooseUser() {
      console.log(this.currentUserRow);
      this.$store.dispatch("bindUser", {
        data: {
          roleId: this.currentRow.id,
          accountIdArrayStr: this.currentUserRow.id
        },
        callback: () => {
          this.$message({
            message: "绑定成功",
            type: "success",
            duration: 3 * 1000
          });
          this.userDialogVisible = false;
          this.getAuthUserList();
        }
      });
    }
  }
};
</script>
