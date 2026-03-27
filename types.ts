import { ImageSourcePropType } from "react-native";

// Interface สำหรับหน้า Home
export interface CategoryItem {
  id: string;
  title: string;
  image: ImageSourcePropType;
  color: string;
  table: string;
}

//Interface สำหรับข้อมูลสถานที่ (รวมทุกตารางจาก Supabase)
export interface PlaceData {
  id: string;
  name: string;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;

  // ฟิลด์เสริมที่มีเฉพาะบางตาราง (ใส่ ? ไว้เพื่อให้เป็น Optional)
  district?: string; // มีใน tour, temples, cafe
  district1?: string; // พบในตาราง popy_restaurants
  location?: string; // พบในตาราง festivals

  phone?: string; // มีใน temples, popy_restaurants, cafe
  open_time?: string; // มีใน tour, temples, popy_restaurants, cafe
  close_time?: string; // มีใน tour, temples, popy_restaurants, cafe
  closed_days?: string[]; // มีใน tour, temples, popy_restaurants, cafe

  // สำหรับ Festivals โดยเฉพาะ
  start_date?: string;
  period?: string;
}
