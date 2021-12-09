<!--
 * @Description: vue 大文件上传
 * @Author: zhouy
 * @Date: 2021-12-08 14:22:19
 * @LastEditTime: 2021-12-08 14:28:30
 * @LastEditors: zhouy
-->
<template>
  <div class="video-management-wrap">
    <el-button
      size="mini"
      @click.native="
        isVisible = true;
        currentIndex = index || 0;
      "
      >选择{{ type_Map[type] }}</el-button
    >
    <el-dialog :visible.sync="isVisible" :modal="false" custom-class="chooseGoods" :title="'选择' + type_Map[type]" width="1100px" height="500px" top="20px">
      <el-form inline>
        <!-- 上传视频||音频 -->
        <el-upload
          style="display: inline-block !important"
          action
          :auto-upload="false"
          :show-file-list="false"
          :on-change="changeVideoFile"
          :accept="accept"
          ref="upload"
          :headers.sync="headers"
          :data="uploadData"
        >
          <el-button size="small" type="primary" class="btn" :disabled="uploadDisabled">点击上传</el-button>
          <span style="color: red" v-if="londing">上传中，请稍后</span>
        </el-upload>

        <!-- 上传音频 -->
        <!-- <el-upload
          style="display: inline-block !important"
          :action='actionUrl'
          :auto-upload="true"
          :headers.sync="headers"
          accept=".mp3,.mpeg,.wma,.aac,.realaudio"
          :data="uploadData"
          ref="upload"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          v-if="type === 1"
        >
          <el-button size="small" type="primary" class="btn">点击上传</el-button>
        </el-upload>-->
        <el-form-item :label="type_Map[type] + '名称'">
          <el-input :placeholder="'请输入' + type_Map[type] + '名称'" v-model="video_name_search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search">查询</el-button>
          <el-button @click="clearVal">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- PROGRESS -->
      <!-- 上传大视频时的进度条 -->
      <div class="progress" style="padding: 0 32px">
        <el-progress :text-inside="true" :stroke-width="22" :percentage="Number(total.toFixed(2))" style="margin-top: 26px" v-if="total > 0 && total <= 100"></el-progress>

        <el-button type="primary" v-if="total > 0 && total <= 100" @click="handleBtn" style="margin-top: 20px">{{ btn | btnText }}</el-button>
        <span v-if="total > 0 && total <= 100" style="padding: 0 10px; display: inline-block">共{{ allTrillion }} M</span>
        <span v-if="total > 0 && total <= 100" style="padding: 0 10px; display: inline-block">上传成功: {{ successTrillion }} M</span>
        <span v-if="total > 0 && total <= 100" style="padding: 0 10px; display: inline-block">您当前上传速度{{ secondSpeedNum.toFixed(2) }}kb/s</span>
        <span v-if="total > 0 && total <= 100" style="padding: 0 10px; display: inline-block">预计还需{{ Math.ceil(remainingTime) }}分钟{{ Math.floor(remainingSeconds) }}秒</span>
      </div>
      <div style="color: red; padding-left: 32px; line-height: 36px">*上传文件大小不能超过1G*</div>
      <el-table :data="tableList" :header-cell-style="tableHeaderColor" style="margin-top: 26px" height="800" v-loading="serverLoading" :cell-style="cellStyleColor">
        <el-table-column type="index" label="序号" align="center" width="280" />
        <el-table-column prop="filename" :label="type_Map[type] + '名称'" align="center" width="280" />
        <el-table-column prop="updated_at" label="上传时间" align="center" width="280" />
        <el-table-column prop="wechatUser" label="操作" align="center" width="280">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="deleteOnce(scope.row.id)">删除</el-button>
              <el-button type="text" @click="cancelData" v-if="scope.row.isChecked">取消</el-button>
              <el-button type="text" @click="confim(scope.row)" v-if="!scope.row.isChecked">确认</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="confirm">确 定</el-button>
        <el-button @click.native="isVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Loading } from "element-ui";

import { getVideo, delVideo } from "@/api/videoManagement";

import { getMerchantId, getUid, getToken } from "@/utils/auth";

import SparkMD5 from "spark-md5";

import { videoUpload, getVideoUpload, deleteVideoOnce } from "@/api/classVudio";

import { cloneDeep } from "lodash";

export default {
  props: {
    index: Number,
    url: {
      type: String,
      default: "",
    },
    // 视频类型 0: 视频 1: 音频 默认格式上传视频
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      headers: {},

      isVisible: false,

      // 每秒上传速度
      secondSpeedNum: 0,
      // 每次上传的上传时间
      startTime: 0,

      dataList: {
        _meta: {
          currentPage: 1,
          perPage: 4,
          totalCount: 1,
        },
      },
      // 视频名称查询项
      video_name_search: "",
      total: 0,
      // 总大小
      allTrillion: null,
      // 已经上传的兆数
      successTrillion: 0,
      // 还剩多大文件没传
      disparityTrillion: null,
      // 预计还剩多长时间
      remainingTime: null,
      accept: ".avi, .mp4, .mov, .m4v, .3gp, .m3u8, .webm",
      video: null,
      btn: false,
      uploadData: {
        // 上传文件
        file: "test",
      },
      tableList: [],

      selectData: {},
      londing: false,
      serverLoading: false,

      // 是否上传过
      isRepeatUpLoad: false,
      // 每次发送完毕成功时的索引
      upDateIndex: null,
      // 秒数
      remainingSeconds: null,
      // 表格高亮行, 返显用户上次选择的视频行高亮显示
      changeIndex: "",
      // 接口返回上次的上传中断位置
      serverIndex: null,
      // 是否在上传中
      uploadDisabled: false,
      merchantId: "",
      uid: "",
      type_Map: {
        0: "视频",
        1: "音频",
      },
      actionUrl: process.env.BASE_API + "接口地址",
    };
  },

  filters: {
    btnText(btn) {
      return btn ? "继续" : "暂停";
    },
    totalText(total) {
      return total > this.totalNum ? this.totalNum : total;
    },
  },

  watch: {
    isVisible(val) {
      if (!val) {
        this.video_name_search = "";
        this.changeIndex = null;
        this.getVideoUpload(this.video_name_search);
        return;
      }
      this.getVideoUpload(this.video_name_search);
    },
    type: {
      handler(val) {
        // 视频
        if (val === 0) {
          this.accept = '.avi, .mp4, .mov, .m4v, .3gp, .m3u8, .webm"';
        } else {
          // 音频
          this.accept = ".mp3,.mpeg,.wma,.aac,.realaudio";
        }
      },
      immediate: true,
    },
  },

  created() {
    (this.merchantId = getMerchantId()), (this.uid = getUid());
  },

  methods: {
    confirm() {
      if (JSON.stringify(this.selectData) === "{}") {
        this.$message({
          type: "warning",
          message: "请选择视频",
        });
        return;
      }
      this.isVisible = false;
      this.$emit("handleConfirm", this.selectData);
    },

    cancelData() {
      this.selectData.isChecked = false;
      this.selectData = {};
      // 选择当前音频把当前数据更新到父组件
      this.$emit("checkOnce", this.selectData);
    },

    deleteData(data) {
      console.log(data);
    },
    clearVal() {
      this.getVideoUpload();
      this.video_name_search = "";
    },

    onSuccess(response, file, fileList) {
      // 上传音频成功， 更新数据
      if (response.success) {
        this.$message({
          type: "success",
          message: "上传成功",
        });
        this.getVideoUpload(this.video_name_search);
      }
    },
    search() {
      this.getVideoUpload(this.video_name_search);
    },

    confim(data) {
      this.selectData.isChecked = false;
      this.selectData = data;
      data.isChecked = true;
      this.$emit("checkOnce", data);
      this.isVisible = false;
    },

    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background: #EFEFEF";
      }
    },
    cellStyleColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.changeIndex) {
        return "background: #EFEFEF";
      }
    },
    deleteOnce(id) {
      this.$confirm("此操作将永久删除", "是否继续", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          // console.log('确认')
          deleteVideoOnce(id).then((res) => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getVideoUpload(this.video_name_search);
            }
          });
        })
        .catch((action) => {
          // console.log('取消')
        });
    },

    handleBtn() {
      if (this.btn) {
        //断点续传
        this.abort = false;
        this.btn = false;
        this.sendRequest();
        return;
      }
      //暂停上传
      this.btn = true;
      this.abort = true;fileParse
    },

    // 处理上传的文件
    fileParse(file, type = "base64") {
      return new Promise((resolve) => {
        let fileRead = new FileReader();
        if (type === "base64") {
          fileRead.readAsDataURL(file);
        } else if (type === "buffer") {
          fileRead.readAsArrayBuffer(file);
        }
        fileRead.onload = (ev) => {
          resolve(ev.target.result);
        };
      });
    },
    // 上传音频
    async changeAudioFile(file) {},

    // 选择文件
    async changeVideoFile(file) {
      let bigSize = 1 * 1000 * 1000 * 1000;
      if (file.size > bigSize) {
        this.$message({
          type: "warning",
          message: "视频大小不能超过1G, 请重新上传",
        });
        return;
      }
      this.uploadDisabled = true;
      // 加载loading, 等文件处理完毕关闭loading
      this.serverLoading = true;
      // 每次选择完文件重置上次上传的一切数据
      this.isRepeatUpLoad = false;
      this.upDateIndex = null;
      this.secondSpeedNum = null;
      this.successTrillion = 0;
      this.disparityTrillion = null;
      this.remainingTime = null;
      this.remainingSeconds = null;
      if (!file) return;
      file = file.raw;
      this.londing = true;
      this.total = 0;
      // 计算文件总大小
      this.allTrillion = (file.size / 1000 / 1000).toFixed(2);

      // 解析为BUFFER数据
      // 把文件切片处理：把一个文件分割成为好几个部分（固定大小, 根据文件大小计算切片数）
      // 每一个切片有自己的部分数据和自己的名字

      let buffer = await this.fileParse(file, "buffer"),
        spark = new SparkMD5.ArrayBuffer(),
        hash,
        suffix;
      spark.append(buffer);
      hash = spark.end();
      suffix = /\.([0-9a-zA-Z]+)$/i.exec(file.name)[1];
      // 计算共需要切多少片
      this.totalNum = Math.ceil((file.size / 1024) * 1000 * 4);

      // 创建多个切片
      let partList = [],
        cur = 0;
      // 定义多个切片每次上传时的参数
      for (let i = 0; i < this.totalNum; i++) {
        let item = {
          chunk: file.slice(cur, cur + 1024 * 1000 * 4),
          filename: `${hash}.${suffix}__${i + 1}`,
          newfile: `${hash}.${suffix}`,
          ind: i + 1,
          name: file.name,
          total: this.totalNum,
        };

        cur += 1024 * 1000 * 4;
        partList.push(item);
      }

      this.partList = cloneDeep(partList);
      this.hash = hash;
      // 记录开始时间
      this.startTime = new Date();
      this.sendRequest();
      this.londing = false;
    },

    // 获取视频列表数据
    getVideoUpload(video_name_search = this.video_name_search) {
      getVideoUpload(video_name_search, this.type).then((res) => {
        if (res.success) {
          this.tableList = res.data.items;
          this.tableList.forEach((item, index) => {
            if (item.attachment === this.url) {
              this.changeIndex = index;
              this.$set(item, "isChecked", true);
            } else {
              this.$set(item, "isChecked", false);
            }
          });
        }
      });
    },
    // 创建请求
    async sendRequest() {
      // 根据切片的个数创建多个请求
      let requestList = [];
      this.partList.forEach((item, index) => {
        // 每一个函数都是发送一个切片的请求
        let fn = () => {
          // 如果该视频已经上传过, 则不再继续执行
          if (this.isRepeatUpLoad) {
            return;
          }
          // 断点续传, 如果这个索引位置已经发送过该请求,那么不再上传,从上次的位置接着续传, 用于用户手动点击暂停
          if (index <= this.upDateIndex && this.upDateIndex !== null) {
            return;
          }

          if (index <= this.serverIndex - 2) {
            console.log(true);
            return;
          }
          let data = new FormData();
          // bolb文件流
          data.append("chunk", item.chunk);
          // 文件名称 hash_索引
          data.append("filename", item.filename);
          // 文件名称 hash
          data.append("new_filename", item.newfile);
          // 当前索引
          data.append("index", item.ind);
          // 总个数
          data.append("total", item.total);
          // 用户上传文件名称
          data.append("name", item.name);
          if (this.type === 1) {
            data.append("type", "audio");
          }

          if (index >= this.totalNum - 1) {
            this.serverLoading = true;
          }
          return videoUpload(data)
            .then((res, rej) => {
              if (res.success) {
                if (index === 0) {
                  this.serverLoading = false;
                }
                let num = this.totalNum;
                // 每次上传成功进度条所需增加的进度
                let addNum = 100 / this.totalNum;
                // 上传成功的兆
                this.successTrillion += (1024 * 1000 * 4) / 1000 / 1000;
                // 剩余的没传的兆b
                this.disparityTrillion = this.allTrillion - this.successTrillion;
                this.total += addNum;
                // 随时记录当前接口成功的索引位置, 再次暂停继续请求时以当前索引为主
                this.upDateIndex = index;
                // 记录当前时间
                let endTime = new Date();
                // 计算每次上传的差异时间
                let disparityTime = endTime - this.startTime;
                // 每秒平均上传速度 (每次所需上传的大小/每次上传的差异时间)
                this.secondSpeedNum = (1024 * 1000 * 4) / 1000 / (disparityTime / 1000);
                // 剩余还需多少分钟
                this.remainingTime = Math.floor((this.disparityTrillion * 1000) / (this.secondSpeedNum * 60));
                // 预计剩余多少秒
                this.remainingSeconds = ((this.disparityTrillion * 1000) / (this.secondSpeedNum * 60) - this.remainingTime) * 60;

                // 重新为开始时间赋值
                this.startTime = endTime;
              }
            })
            .catch((e) => {
              if (this.total < 1) {
                this.serverLoading = false;
                this.uploadDisabled = false;
              }
              // 出现异常,强制暂停用户的上传流程
              this.$message({
                type: "warning",
                message: "您的网络出现异常,已为您暂停上传,如需继续，请点击继续上传按钮",
              });
              this.abort = true;
              this.btn = true;
            });
        };
        requestList.push(fn);
      });

      let i = 0;
      // 上传到最后一个索引
      let complete = async () => {
        this.total = 0;
        this.totalNum = 0;
        this.partList = [];
        this.abort = false;
        this.btn = false;
        this.uploadDisabled = false;
      };

      // 发送请求
      let send = async () => {
        // 已经中断则不再上传
        if (this.abort) return;

        if (i >= requestList.length) {
          // 都传完了
          complete();
          return;
        }

        await requestList[i]();
        i++;
        send();
      };

      send();
    },

    /**
     * @description: 上传之前更新headers时间
     */
  },
};
</script>
<style lang="scss">
.video-management-wrap {
  .chooseGoods {
    .btn {
      margin-left: 35px;
    }
    .el-dialog__header {
      padding: 10px 10px;
      line-height: 40px;
    }
    .el-dialog__body {
      padding: 0;
      background: #f8f8f8;
      overflow: hidden;
    }
    .el-dialog__footer {
      text-align: center;
    }
    .video-style {
      width: 250px;
      height: 440px;
      cursor: pointer;
      padding: 10px;
      margin: 15px;
      border: 1px solid #ccc;
      border-radius: 3px;
      position: relative;
      .left-video {
        .mark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          line-height: 144px;
          color: #fff;
          text-align: center;
          font-size: 60px;
          width: 144px;
          z-index: 1;
          background: rgba(0, 0, 0, 0.4);
        }
        .del-icon {
          position: absolute;
          top: 5px;
          right: 5px;
        }
        .del-icon:hover {
          color: red;
        }
        .name {
          display: inline-block;
          width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: top;
        }
      }
    }
    .footer {
      text-align: center;
    }
  }
}
</style>
