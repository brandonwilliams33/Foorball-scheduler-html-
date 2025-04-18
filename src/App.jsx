import React, { useEffect, useState } from "react";
import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

// ✅ 你的 Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyBMheq8RzQ_gzXT36rVAhZLbkSKN3YlwjI",
    authDomain: "balltime-32fe1.firebaseapp.com",
    projectId: "balltime-32fe1",
    storageBucket: "balltime-32fe1.firebasestorage.app",
    messagingSenderId: "785484584550",
    appId: "1:785484584550:web:354d1bc258ef5df434bfa7",
    measurementId: "G-DZZ80485JK"
};

initializeApp(firebaseConfig);
const db = getFirestore();

const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
];
const timeSlots = [
    "9:00-11:00", "11:00-13:00", "13:00-15:00",
    "15:00-17:00", "17:00-19:00"
];

// 辅助：生成每周每天初始空数组
const initSelectedTimes = () =>
    days.reduce((acc, day) => ({ ...acc, [day]: [] }), {});

export default function App() {
    const [name, setName] = useState("");
    const [selectedTimes, setSelectedTimes] = useState(initSelectedTimes());
    const [schedules, setSchedules] = useState([]);

    // 读取所有日程
    const fetchSchedules = async () => {
        const snapshot = await getDocs(collection(db, "schedules"));
        const data = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
        }));
        setSchedules(data);
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    // 切换选择
    const handleSelect = (day, slot) => {
        if (!name.trim()) {
            alert("请先输入名字");
            return;
        }
        setSelectedTimes((prev) => {
            const dayArr = prev[day] || [];
            const updated = dayArr.includes(slot)
                ? dayArr.filter((s) => s !== slot)
                : [...dayArr, slot];
            return { ...prev, [day]: updated };
        });
    };

    // 提交：用 name 作为文档 ID，不同名字不会互相覆盖
    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("请先输入名字");
            return;
        }
        await setDoc(doc(db, "schedules", name.trim()), {
            selectedTimes
        });
        fetchSchedules();
    };

    // 重置：删除当前名字的文档，重置选择
    const handleReset = async () => {
        if (!name.trim()) {
            alert("请先输入名字");
            return;
        }
        await deleteDoc(doc(db, "schedules", name.trim()));
        setSelectedTimes(initSelectedTimes());
        fetchSchedules();
    };

    // 统计每个时段被哪些名字选中
    const getOverlap = () => {
        const overlap = {};
        days.forEach((day) => {
            overlap[day] = {};
            timeSlots.forEach((slot) => {
                overlap[day][slot] = [];
            });
        });
        schedules.forEach((sch) => {
            const sel = sch.selectedTimes || {};
            days.forEach((day) => {
                (sel[day] || []).forEach((slot) => {
                    overlap[day][slot].push(sch.id);
                });
            });
        });
        return overlap;
    };

    const overlaps = getOverlap();

    return (
        <div className="min-h-screen bg-pink-50 p-6 font-sans text-gray-800">
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
                    ⚽ 足球时间协调表
                </h1>

                {/* 名字输入 */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="请输入你的名字"
                        className="w-full p-2 border rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* 时间网格 */}
                <div className="grid grid-cols-7 gap-4">
                    {days.map((day) => (
                        <div key={day}>
                            <h2 className="text-center font-semibold mb-2">{day}</h2>
                            {timeSlots.map((slot) => {
                                const isSel = selectedTimes[day]?.includes(slot);
                                const users = overlaps[day][slot] || [];
                                const isOverlap = users.length > 1;
                                return (
                                    <button
                                        key={slot}
                                        onClick={() => handleSelect(day, slot)}
                                        className={`w-full text-sm mb-1 px-2 py-1 rounded-lg border
                      ${isSel
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100 text-gray-700"}
                      ${isOverlap
                                                ? "border-pink-500 border-2"
                                                : "border-gray-300"}
                      hover:bg-blue-100 transition`}
                                    >
                                        {slot}
                                        {users.length > 0 && (
                                            <div className="text-[10px] mt-1 text-gray-600 whitespace-normal">
                                                👥 {users.join("，")}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-center gap-4 mt-6 flex-wrap">
                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow"
                    >
                        提交
                    </button>
                    <button
                        onClick={handleReset}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl shadow"
                    >
                        重置
                    </button>
                    <button
                        onClick={() =>
                            navigator.clipboard.writeText(window.location.href)
                        }
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl shadow"
                    >
                        📋 复制分享链接
                    </button>
                </div>
            </div>
        </div>
    );
}
