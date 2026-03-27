import { supabase } from "@/services/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Import Type มาใช้ จาก types.ts
import { PlaceData } from "../types";

export default function Inside() {
  const { type, displayTitle, color } = useLocalSearchParams<{
    type: string;
    displayTitle: string;
    color: string;
  }>();

  const sendColor = color || "683c21";
  const [items, setItems] = useState<PlaceData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      //ชื่อตารางให้ตรงกับ Supabase
      const tableMap: Record<string, string> = {
        tour: "tour_attraction",
        res: "popy_restaurants",
        cafe: "cafe_desserts",
        temple: "temples",
        fest: "festivals",
      };

      const tableName = tableMap[type as string] || "tour_attraction";

      // ดึงข้อมูล (ชื่อคอลัมน์เป็นชื่อกลางแล้ว)
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("name", { ascending: true }); // เรียงตาม name

      if (!error) setItems(data || []);
    };
    fetchData();
  }, [type]);

  const showRenderItem = ({ item }: { item: PlaceData }) => (
    <TouchableOpacity
      style={[styles.itemShow, { borderColor: sendColor }]}
      onPress={() =>
        router.push({
          pathname: "/detail",
          params: { ...item }, // ส่งข้อมูล item
        })
      }
    >
      <Image
        source={{
          uri: item.image_url || "https://via.placeholder.com/150", //ใช้เพื่อหากภาพไม่ขึ้นจะขึ้นสีเทาเเทน
        }}
        style={styles.itemImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{item.name || "ไม่มีชื่อ"}</Text>
        {/* ใช้ค่า district หรือถ้าไม่มี (เช่น festivals) ให้ใช้ location */}
        <Text style={styles.districtText}>
          📍อำเภอ {item.district || item.location || "เชียงใหม่"}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={25} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff1c4" }}>
      <Stack.Screen
        options={{
          title: (displayTitle as string) || "Loading...",
          headerShown: true,
        }}
      />
      <FlatList
        contentContainerStyle={{ padding: 15 }}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={showRenderItem}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ color: "#999" }}>
              ไม่พบข้อมูลในหมวด {displayTitle}...
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemShow: {
    flexDirection: "row",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#b5b5b5",
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 5,
    padding: 10,
    alignItems: "center",
  },
  itemImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  textContainer: {
    paddingLeft: 20,
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontFamily: "KanitBold",
    fontSize: 15,
    color: "#683c21",
  },
  districtText: {
    fontFamily: "KanitRegular",
    fontSize: 13,
    color: "#666",
    marginTop: 3,
  },
});
