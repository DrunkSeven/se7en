<template>
  <div class="draw-util">
    <el-button @click="changeActive" size="mini">显示</el-button>
    <div class="cont" :class="{'active':active}">
      <div class="util-box">
        <span class="label">工具:</span>
        <svg
          :class="{'selected':drawObj.type=='pen'}"
          @click="selectUtil('pen')"
          t="1576578507997"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="810"
          width="32"
          height="32"
        >
          <path
            d="M745.76 369.86l-451 537.48a18.693 18.693 0 0 1-8.46 5.74l-136.58 45.27c-13.24 4.39-26.46-6.71-24.43-20.5l20.86-142.36c0.5-3.44 1.95-6.67 4.19-9.33l451-537.48c6.65-7.93 18.47-8.96 26.4-2.31l115.71 97.1c7.92 6.64 8.96 18.46 2.31 26.39zM894.53 192.56l-65.9 78.53c-6.65 7.93-18.47 8.96-26.4 2.31l-115.71-97.1c-7.93-6.65-8.96-18.47-2.31-26.4l65.9-78.53c6.65-7.93 18.47-8.96 26.4-2.31l115.71 97.1c7.93 6.65 8.96 18.47 2.31 26.4z"
            fill="#6C6D6E"
            p-id="811"
          />
        </svg>
        <svg
          :class="{'selected':drawObj.type=='line'}"
          @click="selectUtil('line')"
          t="1576578805682"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2782"
          width="32"
          height="32"
        >
          <path
            d="M135.38030133928572 863.7550223214286L863.8077566964286 135.32756696428572 888.6674107142857 160.18638392857144 160.2399553571429 888.6138392857142z"
            p-id="2783"
          />
        </svg>
        <svg
          :class="{'selected':drawObj.type=='rect'}"
          @click="selectUtil('rect')"
          t="1576578533333"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="943"
          width="32"
          height="32"
        >
          <path
            d="M841.34 959.36H182.66c-65.06 0-117.99-52.94-117.99-118.02V182.69c0-65.08 52.94-118.04 117.99-118.04h658.68c65.06 0 117.99 52.96 117.99 118.04v658.65c0 65.08-52.93 118.02-117.99 118.02zM182.66 142.17c-22.31 0-40.51 18.18-40.51 40.51v658.65c0 22.34 18.2 40.49 40.51 40.49h658.68c22.31 0 40.51-18.15 40.51-40.49V182.69c0-22.34-18.2-40.51-40.51-40.51H182.66z"
            fill="#6C6D6E"
            p-id="944"
          />
        </svg>
        <svg
          :class="{'selected':drawObj.type=='ellipse'}"
          @click="selectUtil('ellipse')"
          t="1576578569191"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1076"
          width="32"
          height="32"
        >
          <path
            d="M511.99 960.22C264.84 960.22 63.77 759.15 63.77 512S264.84 63.78 511.99 63.78 960.23 264.85 960.23 512 759.14 960.22 511.99 960.22z m0-823.81C304.88 136.41 136.4 304.89 136.4 512s168.48 375.59 375.59 375.59c207.13 0 375.61-168.48 375.61-375.59S719.12 136.41 511.99 136.41z"
            fill="#6C6D6E"
            p-id="1077"
          />
        </svg>
        <!-- <el-button
          :type="item.type==drawObj.type?'primary':''"
          v-for="item in utilType"
          :key="item.type"
          @click="selectUtil(item.type)"
          size="mini"
        >{{item.name}}</el-button>-->

        <div class="poly-box">
          <svg
            :class="{'selected':drawObj.type=='poly'}"
            @click="selectUtil('poly')"
            t="1576578594738"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1209"
            width="32"
            height="32"
          >
            <path
              d="M680.71 915.22H343.29c-39.53 0-76.37-21.27-96.12-55.52L78.46 567.49c-19.75-34.22-19.75-76.77 0-110.99l168.71-292.2c19.75-34.24 56.6-55.52 96.12-55.52h337.42c39.53 0 76.37 21.27 96.12 55.52l168.71 292.2c19.75 34.22 19.75 76.77 0 110.99L776.83 859.7c-19.75 34.24-56.59 55.52-96.12 55.52zM343.29 175.69c-15.7 0-30.35 8.43-38.21 22.04l-168.71 292.2c-7.84 13.61-7.84 30.52 0 44.13l168.71 292.2c7.86 13.61 22.51 22.04 38.21 22.04h337.42c15.7 0 30.35-8.43 38.21-22.04l168.71-292.2c7.84-13.61 7.84-30.52 0-44.13l-168.71-292.2c-7.86-13.61-22.51-22.04-38.21-22.04H343.29z"
              fill="#6C6D6E"
              p-id="1210"
            />
          </svg>
          <el-input-number size="mini" type="number" v-model="drawObj.polyLine" :max="9" :min="3" />
        </div>
        <svg
          :class="{'selected':drawObj.type=='eraser'}"
          @click="selectUtil('eraser')"
          t="1576578691713"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="998"
          width="32"
          height="32"
        >
          <path
            d="M604.536246 736.222443l288.794439-282.693148-287.777557-270.999007-270.999007 283.201589z m-72.70705 71.181728L264.389275 539.455809 145.922542 660.973188l164.734856 164.734856a50.844091 50.844091 0 0 0 36.099305 14.744786h107.789474a101.688183 101.688183 0 0 0 71.181728-28.981132z m109.314796 35.082423h254.220457a50.844091 50.844091 0 0 1 0 101.688183H346.248262a152.532274 152.532274 0 0 1-107.789474-44.742801l-164.734856-164.734856a101.688183 101.688183 0 0 1 0-142.363456l457.596823-480.476663a101.688183 101.688183 0 0 1 143.380337-3.559086l287.269117 270.999007a101.688183 101.688183 0 0 1 4.067527 143.888778l-3.050646 3.050646z"
            fill="#666666"
            p-id="999"
          />
        </svg>
        <div class="select-color-box">
          <span class="label">颜色:</span>
          <span ref="selectColor" class="color" :style="{'background': drawObj.color}"></span>
        </div>
        <span
          class="color"
          v-for="item in color"
          :key="item"
          :style="{'background':item}"
          @click="drawObj.color=item"
        ></span>
        <!-- <el-button size="mini" @click="selectUtil('cut')">剪切</el-button>
        <el-button size="mini" @click="selectUtil('cancel')">撤销</el-button>-->
      </div>
      <div class="util-box">
        <span class="label">线条:</span>
        <el-switch
          v-model="drawObj.dashLine"
          active-color="#409EFF"
          inactive-color="#ff4949"
          active-text="虚线"
          inactive-text="实线"
        ></el-switch>
        <div class="line-width-box">
          <span class="label">粗细:</span>
          <span
            v-for="i in 3"
            :key="i"
            class="line-width"
            :class="{'line-width-active':drawObj.lineWidth==i*3}"
            :style="{'width':i*4+'px','height':i*4+'px','background':drawObj.color}"
            @click="drawObj.lineWidth=i*3"
          ></span>
          <span class="label">填充:</span>
          <el-switch
            v-model="drawObj.fill"
            active-color="#409EFF"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          ></el-switch>
          <div class="select-color-box">
            <span class="label">颜色:</span>
            <span class="color" :style="{'background': drawObj.fillColor}"></span>
          </div>
          <span
            class="color"
            v-for="item in color"
            :key="item"
            :style="{'background':item}"
            @click="drawObj.fillColor=item,drawObj.fill=true"
          ></span>
          <!-- <el-slider class="line-width" v-model="drawObj.lineWidth" :max="20" :min="1"></el-slider> -->
        </div>

        <div class="control-box">
          <el-button size="mini" @click="setPage('prePage')">上一张</el-button>
          <!-- <button id="preAnim">上一个动画</button> -->
          <el-button size="mini" @click="selectUtil('clear')">清空画布</el-button>
          <el-button size="mini" @click="selectUtil('cancel')">撤销</el-button>
          <!-- <button id="nextAnim">下一个动画</button> -->
          <el-button size="mini" @click="setPage('nextPage')">下一张</el-button>
          <!-- <el-button @click="playback()">重绘</el-button> -->
        </div>
      </div>
      <div class="util-box"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["drawObj"],
  data() {
    return {
      utilType: [
        { type: "pen", name: "铅笔" },
        { type: "line", name: "线条" },
        { type: "ellipse", name: "圈圈" },
        { type: "rect", name: "矩形" },
        { type: "eraser", name: "橡皮" }
      ],
      color: ["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#FFFF00", "#9AFF02"],
      active: false
    };
  },
  methods: {
    changeActive() {
      this.active = !this.active;
    },
    selectUtil(type) {
      this.$emit("selectUtil", type);
    },
    setPage(type) {
      this.$emit("setPage", type);
    }
  }
};
</script>
<style lang="less" scoped>
svg {
  cursor: pointer;
}
.selected {
  border-radius: 5px;
  background: #409eff;
  color: #fff;
}
.draw-util {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 5px;
  max-width: 800px;
  z-index: 4;
  height: 0;
}
.cont {
  transform: translateY(-400px);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0 0 10px 10px;
}
.active {
  transform: translateY(0);
}
.select-color-box {
  display: flex;
  align-items: center;
  margin: 0 20px;
  justify-content: space-between;
}

.color-box,
.util-box {
  padding: 5px 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /* justify-content: center; */
}
.line-width-box {
  display: flex;
  align-items: center;
  margin: 0 20px;
}
.line-width {
  border-radius: 100px;
  border: 2px solid #000;
  margin-right: 5px;
  cursor: pointer;
}
.line-width-active {
  border: 3px solid #409eff;
}
.util-box {
  .color {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #000;
    cursor: pointer;
    margin-right: 3px;
  }
}

.label {
  margin-right: 10px;
}

.poly-box {
  display: flex;
  align-items: center;
  margin-right: 2px;
}

.poly-box .util {
  margin-right: 0;
}
.control-box {
  width: 100%;
  margin-top: 10px;
  text-align: center;
}
#polyLine {
  width: 30px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.5);
  padding-left: 5px;
  height: 26px;
  border-left: none;
}
</style>
