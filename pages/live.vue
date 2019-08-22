<template>
  <div>
    <div class="camera-box">
      <p>{{onlineList}}</p>
      <video id="receivedVideo" autoplay></video>
      <video id="localVideo" autoplay muted></video>
      <!-- <button @click="setDevice(1)">切换摄像头</button> -->
      <button @click="startWebRTC" v-if="onlineList.length<2">创建房间</button>
      <button @click="startWebRTC" v-else>进入房间</button>
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
      onlineList: []
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
    this.createSocket();
  },
  methods: {
    send(data) {
      this.socket.emit("rtc", data);
    },
    startWebRTC() {
      const configuration = {};
      this.rtc = new RTCPeerConnection(configuration);

      // 当本地ICE Agent需要通过信号服务器发送信息到其他端时
      // 会触发icecandidate事件回调
      this.rtc.onicecandidate = event => {
        if (event.candidate) {
          this.send({ candidate: event.candidate });
        }
      };

      // 如果用户是第二个进入的人，就在negotiationneeded 事件后创建sdp
      if (this.onlineList.length > 1) {
        // onnegotiationneeded 在要求sesssion协商时发生
        this.rtc.onnegotiationneeded = () => {
          // 创建本地sdp描述 SDP (Session Description Protocol) session描述协议
          this.rtc
            .createOffer()
            .then(this.localDescCreated)
            .catch(err => {});
        };
      }

      // 当远程数据流到达时，将数据流装载到video中
      this.rtc.onaddstream = function(event) {
        document.getElementById("receivedVideo").srcObject = event.stream;
      };
      this.setDevice();
    },
    setDevice(index = 0) {
      const mediaOpt = {
        audio: true,
        video: {
          deviceId: this.exArray[index]
        }
      };
      navigator.mediaDevices
        .getUserMedia(mediaOpt)
        .then(localStream => {
          document.getElementById("localVideo").srcObject = localStream;
          this.rtc.addStream(localStream);
          // myPeerConnection.addStream(localStream);
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
          console.log(err);
        }
      );
    },

    createSocket() {
      this.socket = io("http://api.se7en.com:7001", {
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
      this.socket.on("disconnect", msg => {
        console.log("#disconnect", msg);
      });

      this.socket.on("disconnecting", () => {
        console.log("#disconnecting");
      });

      this.socket.on("error", () => {
        console.log("#error");
      });
    }
  },
  beforeDestroy() {
    this.socket.close();
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
