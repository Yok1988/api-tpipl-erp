require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // ใช้ false ถ้าเป็น Local SQL Server
    trustServerCertificate: true,
  },
};

// เชื่อมต่อ SQL Server
sql.connect(config)
  .then(() => console.log("✅ Database Connected! 👍👍💖👌"))
  .catch((err) => console.log("❌ Database Connection Failed:", err));

// 📌 API ดึงข้อมูลจาก `CCScanDO`
app.get("/sales-erp", async (req, res) => {
  try {
    const result = await sql.query(`
     SELECT  DPDate,DONo,SPONo,SO,CustNo,ShpCode,PlantNo,TrkNo
    ,SaleType,ItemNo,Qty,Price,Discount,PictureFile,TextFile
    FROM BP.CCScanDO
    WHERE DPDate BETWEEN DATEADD(month, DATEDIFF(month, 0,  GETDATE()), 0) AND GETDATE()
  `); 
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("❌ Error fetching data");
  }
});

const PORT = process.env.PORT || 5000;

const os = require("os");
function getLocalIP() {//การดึง IP เครื่องภายใน (Local IP)
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "localhost";
}

console.log("🌍 API Ready at:", `http://${getLocalIP()}:${PORT}`);
console.log("🌍 API Ready at:", `http://localhost:${PORT}`);
console.log("🔗 Database Config:", {  
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
}); 

//app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// รันเซิร์ฟเวอร์
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));

