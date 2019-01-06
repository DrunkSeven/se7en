<template>
  <section>
    <el-form label-width="100px">
      <el-col :span="6" style="min-width:300px">
        <el-form-item label="选个日期：">
          <el-date-picker
            class="picker"
            v-model="date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptionsStart"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="min-width:300px">
        <el-form-item label="出发地：">
          <el-autocomplete
            v-model="startStation.name"
            :fetch-suggestions="queryStartStation"
            placeholder="请输入全拼，如：xiamen"
            @select="startStationSelect"
          ></el-autocomplete>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="min-width:300px">
        <el-form-item label="目的地：">
          <el-autocomplete
            v-model="endStation.name"
            :fetch-suggestions="queryEndStation"
            placeholder="请输入全拼，如：fuding"
            @select="endStationSelect"
          ></el-autocomplete>
        </el-form-item>
      </el-col>
      <el-button class="search-btn" type="primary" @click="getTicket">搜索</el-button>
    </el-form>
    <!-- <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
    >全选</el-checkbox>-->
    <el-checkbox-group style="clear:both" v-model="labelList" @change="changeLabel">
      <el-checkbox
        style="margin:0px 20px 20px 0;"
        v-for="(item,index) in showColumn"
        :label="index"
        :key="index"
      >{{item.label}}</el-checkbox>
    </el-checkbox-group>
    <el-table :data="ticket" height="calc(100vh - 360px)" stripe border>
      <el-table-column
        v-for="(item, index) in selectColumn"
        :key="index"
        :fixed="item.fixed"
        :prop="item.prop"
        :label="item.label"
        align="center"
      >
        <template slot-scope="scope">
          <div v-html="scope.row[item.prop]"></div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import http from "~/plugins/axios";
import util from "~/plugins/common";
export default {
  async asyncData(content) {
    content.store.commit("changeActiveIndex", "3");
    content.store.commit("changeBreadcrumb", []);
  },
  data() {
    return {
      pickerOptionsStart: {},
      startStation: {
        name: "",
        code: ""
      },
      endStation: {
        name: "",
        code: ""
      },
      date: "",
      labelList: [1, 2],
      selectColumn: [
        {
          label: "车次",
          prop: "station_train_code",
          fixed: true
        },
        {
          label: "出发站 到达站",
          prop: "start_end_station",
          show: true,
          html: true
        },
        {
          label: "时间",
          prop: "start_end_time",
          show: true,
          html: true
        },
        {
          label: "一等座",
          prop: "zy_num"
        },
        {
          label: "二等座",
          prop: "ze_num"
        }
      ],
      column: [
        {
          label: "车次",
          prop: "station_train_code",
          fixed: true,
          show: true
        },
        {
          label: "出发站 到达站",
          prop: "start_end_station",
          show: true,
          html: true
        },
        {
          label: "时间",
          prop: "start_end_time",
          show: true,
          html: true
        },
        {
          label: "商务座",
          prop: "swz_num"
        },
        {
          label: "一等座",
          prop: "zy_num"
        },
        {
          label: "二等座",
          prop: "ze_num"
        },
        {
          label: "硬座",
          prop: "yz_num"
        },
        {
          label: "硬卧",
          prop: "yw_num"
        },
        {
          label: "无座",
          prop: "wz_num"
        },
        {
          label: "高级软卧",
          prop: "gr_num"
        },
        {
          label: "软座",
          prop: "rz_num"
        },
        {
          label: "软卧",
          prop: "rw_num"
        },
        {
          label: "动卧",
          prop: "srrb_num"
        },
        {
          label: "其他",
          prop: "qt_num"
        }
      ],
      ticket: []
    };
  },
  computed: {
    showColumn() {
      return this.column.filter(item => item.show != true);
    },
    alwaysShow() {
      return this.column.filter(item => item.show == true);
    }
  },
  head() {
    return {
      title: `${process.env.title}-动车票查询`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `${process.env.title}的车票查询`
        },
        {
          hid: "keyword",
          name: "keyword",
          content: `车票,动车票,查询,动车票查询,node,幻化成扇子`
        }
      ]
    };
  },
  created() {
    this.pickerOptionsStart = {
      disabledDate(time) {
        let curDate = new Date().getTime();
        let day = 29 * 24 * 3600 * 1000;
        let dateRegion = curDate + day;
        return (
          time.getTime() < Date.now() - 8.64e7 || time.getTime() > dateRegion
        );
      }
    };
    if (process.client) {
      const ticketData = util.getCookie("ticketData");
      if (ticketData) {
        const { date, startStation, endStation } = JSON.parse(ticketData);
        this.date = date;
        this.startStation = startStation;
        this.endStation = endStation;
        this.getTicket();
      }
    }
  },
  methods: {
    queryStartStation(queryString, cb) {
      if (queryString) {
        http.post("getStationName", { name: queryString }).then(res => {
          cb(res.lists || []);
        });
      } else {
        cb([]);
      }
    },
    queryEndStation(queryString, cb) {
      if (queryString) {
        http.post("getStationName", { name: queryString }).then(res => {
          cb(res.lists || []);
        });
      } else {
        cb([]);
      }
    },
    startStationSelect(item) {
      this.startStation.code = item.code;
    },
    endStationSelect(item) {
      this.endStation.code = item.code;
    },
    getTicket() {
      http
        .post("getTicket", {
          date: this.date,
          startStation: this.startStation.code,
          endStation: this.endStation.code
        })
        .then(res => {
          if (res.flag) {
            this.setTicket(res.data);
          } else {
            this.$message(res.msg);
          }
        });
      util.setCookie(
        "ticketData",
        JSON.stringify({
          date: this.date,
          startStation: this.startStation,
          endStation: this.endStation
        })
      );
    },
    setTicket(res) {
      this.ticket = [];
      res.map(val => {
        let obj = {};
        for (let item in val) {
          obj[item] =
            val[item] == ("无" || "--")
              ? val[item]
              : `<span style='color:red;font-weight:800'>${val[item]}<span>`;
          obj.start_end_station = `${val.from_station_name}</br>${
            val.to_station_name
          }`;
          obj.start_end_time = `${val.start_time}</br>${val.arrive_time}`;
        }
        this.ticket.push(obj);
      });
    },
    changeLabel(val) {
      let arr = [];
      this.alwaysShow.forEach(element => {
        arr.push(element);
      });

      val.forEach(index => {
        arr.push(this.showColumn[index]);
      });

      this.selectColumn = arr;
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.picker {
  width: auto;
}
.search-btn {
  width: 100px;
  margin-bottom: 20px;
  margin-left: 30px;
}
@media screen and (max-width: 700px) {
  .search-btn {
    display: block;
    width: 100%;
    margin: 20px auto;
  }
}
</style>

