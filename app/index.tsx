import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { default as React, useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
const chiangMai = require("@/assets/images/gotoChiangMai.png");

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    //  โค้ดตั้งเวลานับถอยหลัง 3วินาที.
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3000);
    //สั่งให้โค้ดนับถอยหลังเเละหยุดทำงาน
    return () => clearTimeout(timer);
  }, []);

  // function about เเเมว
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;
  const bounce3 = useRef(new Animated.Value(0)).current;

  // สร้างฟังก์ชันสั่งกระโดดแบบ Delay (ทำให้น้องโดดตามกัน)
  useEffect(() => {
    const createBounce = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay), // รอเวลาตามที่กำหนด
          Animated.timing(value, {
            toValue: -20,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    // สั่งให้ทั้ง 3 ตัวเริ่มทำงานพร้อมกัน แต่มี Delay ข้างในต่างกัน
    Animated.parallel([
      createBounce(bounce1, 0), // โดดทันที
      createBounce(bounce2, 200), // รอ 0.2
      createBounce(bounce3, 400), // รอ 0.4
    ]).start();
  }, []);
  return (
    <View style={styles.container}>
      <Image source={chiangMai} style={styles.showImg} />
      <View style={styles.textRow}>
        <Text style={styles.text1}>Top 5 </Text>
        <Text style={styles.text2}>Chiang Mai</Text>
      </View>
      <Text style={styles.showAppDetail}>เเนะนำสถานที่น่าไปในเชียงใหม่</Text>
      {/* <ActivityIndicator size="large" color="#683c21" /> */}
      <View style={styles.catRow}>
        <Animated.View style={{ transform: [{ translateY: bounce1 }] }}>
          <MaterialCommunityIcons name="fish" size={60} color="#cb7d2f" />
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: bounce2 }] }}>
          <MaterialCommunityIcons name="fish" size={60} color="#b78b2d" />
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: bounce3 }] }}>
          <MaterialCommunityIcons name="fish" size={60} color="#f7d23e" />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text1: {
    fontFamily: "KanitBold",
    fontSize: 30,
    color: "#654a02",
  },
  text2: {
    fontFamily: "KanitBold",
    fontSize: 30,
    color: "#543b05",
  },
  textRow: {
    flexDirection: "row",
    marginTop: 21,
  },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 25,
  },
  showAppDetail: {
    fontFamily: "KanitRegular",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 21,
    color: "#515151",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff1c4",
  },
  showImg: {
    width: 300,
    height: 300,
  },
});
