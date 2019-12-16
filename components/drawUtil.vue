<template>
  <div>
    <div class="util-box">
      <span class="label">工具:</span>
      <el-button
        :type="item.type==drawObj.type?'primary':''"
        v-for="item in utilType"
        :key="item.type"
        @click="selectUtil(item.type)"
        size="mini"
      >{{item.name}}</el-button>

      <div class="poly-box">
        <el-button
          @click="selectUtil('poly')"
          size="mini"
          :type="drawObj.type=='poly'?'primary':''"
        >正多边形</el-button>
        <el-input-number size="mini" type="number" v-model="drawObj.polyLine" :max="9" :min="3" />
      </div>
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
        <!-- <el-slider class="line-width" v-model="drawObj.lineWidth" :max="20" :min="1"></el-slider> -->
      </div>
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
    </div>
    <div class="util-box">
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
    </div>
    <div class="control-box">
      <!-- <el-button @click="setPage('prePage')">上一张</el-button> -->
      <!-- <button id="preAnim">上一个动画</button>
        <button>重置</button>
      <button id="nextAnim">下一个动画</button>-->
      <!-- <el-button @click="setPage('nextPage')">下一张</el-button> -->
      <!-- <el-button @click="playback()">重绘</el-button> -->
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
      color: ["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#FFFF00", "#9AFF02"]
    };
  },
  methods: {
    selectUtil(type) {
      this.$emit("selectUtil", type);
    }
  }
};
</script>
<style lang="less" scoped>
.select-color-box {
  display: flex;
  align-items: center;
  margin-right: 20px;
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

#polyLine {
  width: 30px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.5);
  padding-left: 5px;
  height: 26px;
  border-left: none;
}
</style>
