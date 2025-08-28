import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
// 先引入Element Plus默认样式
import "element-plus/dist/index.css";
// 再引入自定义样式，确保覆盖Element Plus默认样式
import "./styles/index.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount("#app");
