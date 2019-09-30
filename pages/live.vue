<template>
  <div>
    <div class="camera-box">
      <p class="status">{{rtc.iceConnectionState}}</p>
      <div class="send-box">
        <el-input type="text" placeholder="请输入房间号" v-model="roomId" />
        <el-button @click="closeWebRTC" v-if="rtc.iceConnectionState=='connected'">退出房间</el-button>
        <el-button @click="openWebRTC" v-else>进入房间</el-button>
      </div>
      <!-- <div class="send-box">
        <el-input type="text" placeholder="请输入房间号" v-model="roomId" />
        <el-button @click="startWebRTC">发消息</el-button>
      </div>-->
      <video id="receivedVideo" autoplay></video>
      <video id="localVideo" autoplay muted></video>

      <button v-for="(item,index) in exArray" :key="index" @click="changeEx(item)">摄像头{{index+1}}</button>
      <!-- <button @click="startWebRTC" v-if="onlineList.length<2">创建房间</button> -->
    </div>
  </div>
</template>
<script>
// import WS from "@/plugins/ws";
import io from "socket.io-client";
export default {
  async asyncData(content) {
    content.store.commit("changeActiveIndex", "3");
    content.store.commit("changeBreadcrumb", []);
  },
  data() {
    return {
      val: "",
      socket: "",
      msgList: [],
      myPeerConnection: "",
      id: 0,
      exArray: [],
      rtc: "",
      room: "",
      onlineList: [],
      roomId: "",
      status: ""
    };
  },
  async mounted() {
    //获取摄像头id
    await navigator.mediaDevices.enumerateDevices().then(sourceInfos => {
      for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        //这里会遍历audio,video，所以要加以区分
        if (sourceInfo.kind === "videoinput") {
          this.exArray.push(sourceInfo.deviceId);
        }
      }
    });
    //创建socket连接
  },
  methods: {
    changeEx(){

    },
    send(data) {
      this.socket.emit("rtc", data);
    },
    sendMsg(msg) {
      this.socket.emit("msg", data);
    },
    closeWebRTC() {
      this.rtc.close();
    },
    openWebRTC() {
      if (!this.socket) {
        this.createSocket();
        this.createWebRTC();
      } else {
        this.createWebRTC();
        this.rtc.onnegotiationneeded = () => {
          // 创建本地sdp描述 SDP (Session Description Protocol) session描述协议
          this.rtc
            .createOffer()
            .then(this.localDescCreated)
            .catch(err => {});
        };
      }
    },
    createWebRTC() {
      // if (!this.roomId) {
      //   this.util.message("请输入房间号", "info");
      //   return;
      // }

      const configuration = {};
      this.rtc = new RTCPeerConnection(configuration);
      // 当本地ICE Agent需要通过信号服务器发送信息到其他端时
      // 会触发icecandidate事件回调
      this.rtc.onicecandidate = event => {
        if (event.candidate) {
          this.send({ candidate: event.candidate });
        }
      };
      this.rtc.oniceconnectionstatechange = e => {
        switch (this.rtc.iceConnectionState) {
          case "disconnected":
            this.status = "对方连接已断开";
            break;
          case "closed":
            this.status = "本地连接已断开";
            break;
          case "failed":
            this.status = "连接已断开";
            break;
          case "connected":
            this.status = "已连接";
            break;
        }
        // if (msg) this.util.message(msg, "info");
      };
      // 当远程数据流到达时，将数据流装载到video中
      this.rtc.onaddstream = function(event) {
        document.getElementById("receivedVideo").srcObject = event.stream;
      };
      this.setDevice();
    },
    setDevice(index = 0) {
      const mediaOpt = {
        audio: true,
        video:true,
      };
      navigator.mediaDevices
        .getUserMedia(mediaOpt)
        .then(localStream => {
          document.getElementById("localVideo").srcObject = localStream;
          this.rtc.addStream(localStream);
          this.status = "等待对方进入房间";
        })
        .catch(err => {
          switch (err.name) {
            case "NotFoundError":
              this.util.message("未检测到摄像头", "error");
          }
        });
    },
    localDescCreated(desc) {
      this.rtc.setLocalDescription(
        desc,
        () => {
          this.send({ sdp: this.rtc.localDescription });
        },
        err => {
          console.log(err.name);
        }
      );
    },

    createSocket() {
      this.socket = io(process.env.baseUrl, {
        // 实际使用中可以在这里传递参数
        query: {
          room: this.roomId || 1520,
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
        if (this.onlineList.length > 1) {
          this.rtc.onnegotiationneeded = () => {
            // 创建本地sdp描述 SDP (Session Description Protocol) session描述协议
            this.rtc
              .createOffer()
              .then(this.localDescCreated)
              .catch(err => {});
          };
        }
      });
      this.socket.on("rtc", message => {
        if (message.sdp && this.rtc) {
          // 设置远程sdp, 在offer 或者 answer后
          this.rtc.setRemoteDescription(
            new RTCSessionDescription(message.sdp),
            () => {
              // 当收到offer 后就接听
              if (this.rtc.remoteDescription.type === "offer") {
                this.rtc
                  .createAnswer()
                  .then(this.localDescCreated)
                  .catch(err => {});
              }
            },
            err => {}
          );
        } else if (message.candidate && this.rtc) {
          // 增加新的 ICE canidatet 到本地的链接中
          this.rtc.addIceCandidate(
            new RTCIceCandidate(message.candidate),
            () => {},
            () => {}
          );
        }
      });
      // 系统事件
      this.socket.on("disconnect", msg => {});

      this.socket.on("disconnecting", () => {
        console.log("#disconnecting");
      });

      this.socket.on("error", err => {
        console.log(err);
      });
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  }
};
</script>
<style lang="less" scoped>
.status {
  font-size: 12px;
}
.send-box {
  display: flex;
  margin-bottom: 10px;
  /deep/.el-button {
    margin-left: 10px;
  }
}
#receivedVideo {
  max-width: 100%;
}
#localVideo {
  max-width: 100%;
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
