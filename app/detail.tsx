import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PlaceData } from "../types"; // Import type ที่เราแก้เรื่อง Path แล้ว

type OpenStatus = {
  text: string;
  color: string;
};

export default function Detail() {
  // รับข้อมูลจากหน้า types.ts
  const params = useLocalSearchParams() as unknown as PlaceData;

  // ฟังก์ชันโทรศัพท์
  const handleOpenPhoneApp = () => {
    if (params.phone) {
      const phoneUrl = `tel:${params.phone}`;
      Linking.openURL(phoneUrl);
    }
  };
  // function date
  const getOpenStatus = (): OpenStatus | null => {
    if (!params.open_time || !params.close_time) return null;

    const now = new Date();
    const dayOfWeek = now.getDay().toString(); // 0-69 ตามที่ระบุไว้ใน supabase
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // เช็ควันปิดจาก Database (ถ้าปิดเเสดงสีเเดง)
    const isClosedToday = params.closed_days?.includes(dayOfWeek);
    if (isClosedToday) {
      return { text: "วันนี้ร้านปิด", color: "#000000" };
    }

    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const open = parseTime(params.open_time);
    const close = parseTime(params.close_time);

    const isOpenTime =
      close > open
        ? currentTime >= open && currentTime < close
        : currentTime >= open || currentTime < close;

    return isOpenTime
      ? { text: "เปิดอยู่", color: "#24a158" }
      : { text: "ปิดเเล้ว", color: "#e14534" };
  };

  // เรียกใช้แบบระบุ Type ชัดเจน
  const status: OpenStatus | null = getOpenStatus();

  // function เปิดแผนที่ภายนอก
  const handleOpenMapApp = () => {
    const lat = params.latitude;
    const lng = params.longitude;
    const label = params.name;

    // แก้ไข URL Google Apple Maps
    const googleMap = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const appleMap = `http://maps.apple.com/?q=${label}&ll=${lat},${lng}`;

    Linking.canOpenURL(googleMap).then((supported) => {
      if (supported) {
        Linking.openURL(googleMap);
      } else {
        Linking.openURL(appleMap);
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* ตั้งค่าหัวข้อบนแถบ Bar ตามชื่อสถานที่ */}
      <Stack.Screen options={{ title: params.name, headerShown: true }} />

      <Image
        source={{ uri: params.image_url || "https://via.placeholder.com/400" }}
        style={styles.mainImage}
      />

      <View style={styles.infoContainer}>
        {/* ชื่อร้าน */}
        <Text style={styles.shopName}>{params.name}</Text>
        <View style={styles.nameTime}>
          {/* --- แสดงเวลาเปิด-ปิด --- */}
          {(params.open_time || params.close_time) && (
            <View style={styles.timeBox}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={18}
                color="#683c21"
              />
              <Text style={styles.timeText}>
                {" "}
                เปิด:{params.open_time || "-"} | ปิด: {params.close_time || "-"}{" "}
                น.
              </Text>
            </View>
          )}
          {/* open / colse */}
          {status && (
            <View
              style={[styles.statusBadge, { backgroundColor: status.color }]}
            >
              <Text style={styles.statusText}>{status.text}</Text>
            </View>
          )}
        </View>

        <Text style={styles.shopDescription}>{params.description}</Text>

        {/* แสดงที่อยู่ (รองรับทั้ง district และ location) */}
        <Text style={styles.shopDistrict}>
          📍 อำเภอ {params.district || params.location || "เชียงใหม่"}
        </Text>

        {/* ถ้าเป็นเทศกาล ให้แสดงวันที่ด้วย */}
        {params.start_date && (
          <View style={styles.festivalBox}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={20}
              color="#e67e22"
            />
            <Text style={styles.festivalText}>
              {" "}
              ช่วงเวลา: {params.period || params.start_date}
            </Text>
          </View>
        )}

        {/* แสดงปุ่มโทรเฉพาะเมื่อมีเบอร์โทรศัพท์ */}
        {params.phone && (
          <TouchableOpacity
            style={styles.shopPhone}
            onPress={handleOpenPhoneApp}
          >
            <MaterialCommunityIcons name="phone" size={20} color="white" />
            <Text style={styles.shopPhoneText}> โทรศัพท์: {params.phone}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.shopMapText}>ตำแหน่งที่ตั้ง</Text>
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          style={styles.showMapView}
          initialRegion={{
            latitude: Number(params.latitude),
            longitude: Number(params.longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: Number(params.latitude),
              longitude: Number(params.longitude),
            }}
            title={params.name}
            description="คลิกเพื่อนำทาง"
            onPress={handleOpenMapApp}
          />
        </MapView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff1c4",
  },
  mainImage: {
    width: "100%",
    height: 250,
  },
  infoContainer: {
    padding: 20,
  },
  shopName: {
    fontFamily: "KanitBold",
    fontSize: 24,
    color: "#2c3e50",
  },
  shopDistrict: {
    fontFamily: "KanitRegular",
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 20,
    marginBottom: 20,
  },
  festivalBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef5e7",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  festivalText: {
    fontFamily: "KanitSemiBold",
    color: "#e67e22",
  },
  shopDescription: {
    fontFamily: "KanitRegular",
    fontSize: 15,
    color: "#34495e",
    lineHeight: 24,
    marginTop: 15,
  },
  shopPhone: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#27ae60",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    alignSelf: "flex-start",
  },
  shopPhoneText: {
    fontFamily: "KanitSemiBold",
    fontSize: 16,
    color: "#ffffff",
  },
  shopMapText: {
    fontFamily: "KanitSemiBold",
    fontSize: 18,
    color: "#2c3e50",
  },
  mapWrapper: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 40,
  },
  showMapView: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff", // หรือใช้สีอ่อนๆ อย่าง #f0f0f0
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignSelf: "flex-start", // ให้กล่องกว้างเท่าเนื้อหา
    marginTop: 10,
    marginBottom: 10,
  },
  timeText: {
    fontFamily: "KanitRegular",
    fontSize: 13,
    color: "#683c21",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "flex-end",
  },
  statusText: {
    fontFamily: "KanitBold",
    fontSize: 15,
    color: "#ffff",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  nameTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
