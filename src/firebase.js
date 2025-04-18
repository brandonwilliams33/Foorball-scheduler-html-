// src/firebase.js

// 1. 导入 Firebase 核心模块
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 2. 你的项目配置
const firebaseConfig = {
  apiKey: "AIzaSyBMheq8RzQ_gzXT36rVAhZLbkSKN3YlwjI",
  authDomain: "balltime-32fe1.firebaseapp.com",
  projectId: "balltime-32fe1",
  storageBucket: "balltime-32fe1.firebasestorage.app",
  messagingSenderId: "785484584550",
  appId: "1:785484584550:web:354d1bc258ef5df434bfa7",
  measurementId: "G-DZZ80485JK"
};

// 3. 初始化 Firebase
const app = initializeApp(firebaseConfig);  // ✅ 正确初始化

// 4. 获取服务实例
const db = getFirestore(app);

// 5. 导出关键对象
export { app, db };  // 👈 同时导出 app 和 db