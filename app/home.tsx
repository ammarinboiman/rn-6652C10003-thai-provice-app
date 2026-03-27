import { CategoryItem } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { default as React } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const tourBro = require("@/assets/images/tour_attraction.png");
const eatBro = require("@/assets/images/popy_restaurants.png");
const drinkBro = require("@/assets/images/cafe_desserts.png");
const templesBro = require("@/assets/images/temples.png");
const festivalsBro = require("@/assets/images/festivals.png");

export default function Home() {
  const categories: CategoryItem[] = [
    {
      id: "1",
      title: "สถานที่ท่องเที่ยว",
      image: tourBro,
      color: "#2d98da",
      table: "tour",
    },
    {
      id: "2",
      title: "ร้านอาหารยอดฮิต",
      image: eatBro,
      color: "#eb3b5a",
      table: "res",
    },
    {
      id: "3",
      title: "คาเฟ่ & ของหวาน",
      image: drinkBro,
      color: "#a55eea",
      table: "cafe",
    },
    {
      id: "4",
      title: "วัดสวยเชียงใหม่",
      image: templesBro,
      color: "#f39c12",
      table: "temple",
    },
    {
      id: "5",
      title: "เทศกาล & ประเพณี",
      image: festivalsBro,
      color: "#27ae60",
      table: "fest",
    },
  ];

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      activeOpacity={0.7} // เพิ่มเพื่อให้ดูมีการกด
      style={[styles.categoryCard, { borderColor: item.color }]}
      onPress={() =>
        router.push({
          pathname: "/inside",
          params: {
            type: item.table,
            displayTitle: item.title,
            color: item.color,
          }, /// ส่งค่าสีไปด้วย
        })
      }
    >
      <Image
        source={item.image}
        style={styles.categoryImage}
        resizeMode="cover"
      />
      <Text style={[styles.categoryText, { color: "#683c21" }]}>
        {item.title}
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={25} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 25 }}
        showsVerticalScrollIndicator={false} // ซ่อนแถบเลื่อนเพื่อความสวยงาม
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... styles ของคุณถูกต้องแล้วครับ ...
  container: {
    flex: 1,
    backgroundColor: "#fff1c4",
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    overflow: "hidden", // เพิ่มเพื่อให้รูปไม่ล้นขอบมน
  },
  categoryImage: {
    width: 150,
    height: 100,
    marginRight: 15,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold", // ถ้าฟอนต์ Kanit ไม่ติด ให้ลองใส่ตัวนี้สำรองไว้
    marginLeft: 1,
  },
});
