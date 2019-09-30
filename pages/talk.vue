<template>
  <div>
    <div class="send-box">
      <el-input placeholder="输入信息" type="text" v-model="val" />
      <el-button @click="send" type="primary" :disabled="!Boolean(val)">发送</el-button>
    </div>

    <p class="online-list">
      当前在线：
      <span class="item" v-for="(item,index) in onlineList" :key="index">
        {{item==id?'我':item}}
        <span v-if="index<onlineList.length-1">、</span>
      </span>
    </p>
    <ul class="list">
      <li class="item" v-for="(item,index) in msgList" :key="index">
        <span>{{item.id==id?'我':item.id}}</span>
        :
        {{item.res}}
      </li>
    </ul>
  </div>
</template>
<script>
// import WS from "@/plugins/ws";
import io from "socket.io-client";
export default {
  async asyncData(content) {
    content.store.commit("changeActiveIndex", "4");
    content.store.commit("changeBreadcrumb", []);
  },
  data() {
    return {
      val: "",
      socket: "",
      msgList: [],
      onlineList: [],
      id: 0
    };
  },
  mounted() {
    this.socket = io(process.env.baseUrl, {
      // 实际使用中可以在这里传递参数
      query: {
        room: "demo",
        userId: `client_${Math.random()}`
      },

      transports: ["websocket"]
    });

    this.socket.on("connect", () => {
      this.id = this.socket.id;
      this.socket.emit("userList");
      // 监听自身 id 以实现 p2p 通讯
      this.socket.on(this.id, msg => {
        console.log("#receive,", msg);
      });
    });

    // 接收在线用户信息
    this.socket.on("online", msg => {
      if (msg.action == "join") {
        this.util.message(msg.message);
        this.onlineList.push(msg.id);
        Array.from(new Set(this.onlineList));
      } else if (msg.action == "getList") {
        this.onlineList = msg.clients;
      } else {
        this.onlineList = this.onlineList.filter(val => {
          return val != msg.id;
        });
      }
    });
    this.socket.on("text", msg => {
      this.msgList.push(msg);
    });
    // 系统事件
    this.socket.on("disconnect", msg => {
      console.log("#disconnect", msg);
    });

    this.socket.on("disconnecting", () => {
      console.log("#disconnecting");
    });

    this.socket.on("error", () => {
      console.log("#error");
    });
  },
  beforeDestroy() {
    console.log(this.socket.disconnected);
  },
  methods: {
    send() {
      this.socket.emit("msg", { id: this.id, res: this.val });
      this.val = "";
    }
  }
};
</script>
<style lang="less" scoped>
.send-box {
  display: flex;
  /deep/.el-button {
    margin-left: 10px;
  }
}
.online-list {
  font-size: 12px;
  color: #999;
  .item {
    color: #666;
  }
}
.list {
  padding-left: 0;
  .item {
    padding: 5px;
    color: #333;
    font-size: 14px;
    border-bottom: 1px dashed #ccc;
    &:last-child {
      border: none;
    }
  }
}
</style>
