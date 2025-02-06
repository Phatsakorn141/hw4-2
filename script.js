// โหลดข้อมูลจาก Local Storage หรือสร้างใหม่ถ้ายังไม่มีข้อมูล
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// ฟังก์ชันบันทึกข้อมูลลงใน Local Storage
function saveToLocalStorage() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

// ฟังก์ชันเพิ่มสินค้าใหม่
function addProduct(productData) {
  inventory.push(productData);
  saveToLocalStorage(); // บันทึกข้อมูลใหม่ลง Local Storage
  updateTable();
}

// ฟังก์ชันอัปเดตสต็อกสินค้า
function updateStock(productId, quantity) {
  const product = inventory.find(item => item.id === productId);
  if (product) {
    product.inStock += quantity;
    saveToLocalStorage(); // บันทึกการเปลี่ยนแปลงลง Local Storage
    updateTable();
  } else {
    alert("ไม่พบสินค้าในระบบ.");
  }
}

// ฟังก์ชันตรวจสอบสินค้าคงเหลือน้อย
function checkLowStock(threshold = 5) {
    const lowStockProducts = inventory.filter(item => item.inStock <= threshold);
    const reportDiv = document.getElementById("report");
    reportDiv.innerHTML = ""; // ล้างเนื้อหาเดิมใน reportDiv
  
    if (lowStockProducts.length > 0) {
      reportDiv.innerHTML = `<h3>สินค้าที่คงเหลือน้อยกว่า ${threshold}:</h3>`;
      const ul = document.createElement("ul"); // สร้างรายการแบบลำดับ
      lowStockProducts.forEach(product => {
        const li = document.createElement("li");
        li.textContent = `${product.name} (จำนวนคงเหลือ: ${product.inStock})`;
        ul.appendChild(li);
      });
      reportDiv.appendChild(ul); // แสดงรายการใน reportDiv
    } else {
      reportDiv.innerHTML = "<p>ไม่มีสินค้าที่คงเหลือน้อย</p>";
    }
  }
  

// ฟังก์ชันสร้างรายงานยอดขาย
function generateSalesReport(limit = 5) {
    let totalRevenue = 0;
  
    // คำนวณรายได้รวม
    inventory.forEach(product => {
      totalRevenue += product.price * product.totalSales;
    });
  
    // เรียงลำดับสินค้าตามยอดขาย
    const topSellingProducts = [...inventory]
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, limit); // ตัดเฉพาะ top limit อันดับแรก
  
    // สร้างรายงานใน div#report
    const reportDiv = document.getElementById("report");
    reportDiv.innerHTML = `<h3>รายได้รวม: ${totalRevenue} บาท</h3>`;
  
    if (topSellingProducts.length > 0) {
      reportDiv.innerHTML += `<h3>สินค้าขายดี (${limit} อันดับแรก):</h3>`;
      const ul = document.createElement("ul");
      topSellingProducts.forEach(product => {
        const li = document.createElement("li");
        li.textContent = `${product.name} (ยอดขาย: ${product.totalSales} ชิ้น)`;
        ul.appendChild(li);
      });
      reportDiv.appendChild(ul);
    } else {
      reportDiv.innerHTML += "<p>ไม่มีข้อมูลสินค้าขายดี</p>";
    }
}

// ฟังก์ชันอัปเดตตารางสินค้า
function updateTable() {
    const tableBody = document.getElementById("productTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // ล้างข้อมูลเก่าในตาราง

    inventory.forEach(product => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = product.id;
        row.insertCell(1).textContent = product.name;
        row.insertCell(2).textContent = product.price;
        row.insertCell(3).textContent = product.inStock;
        row.insertCell(4).textContent = product.category;
        row.insertCell(5).textContent = product.totalSales || 0;

        // เพิ่มปุ่มซื้อ
        const buyButton = document.createElement("button");
        buyButton.textContent = "ซื้อ";
        buyButton.onclick = () => {
            const quantity = prompt("กรุณาใส่จำนวนที่ต้องการซื้อ:");
            if (quantity) {
                recordSale(product.id, parseInt(quantity));
            }
        };
        const buyCell = row.insertCell(6);
        buyCell.appendChild(buyButton);
    });
}

// การทำงานเมื่อกดเพิ่มสินค้า
document.getElementById("addProductForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const productData = {
    id: document.getElementById("productId").value,
    name: document.getElementById("productName").value,
    price: parseFloat(document.getElementById("productPrice").value),
    inStock: parseInt(document.getElementById("productStock").value),
    category: document.getElementById("productCategory").value,
    totalSales: 0 // เริ่มต้นยอดขายเป็น 0
  };

  inventory.push(productData);
  updateTable();
});

// ฟังก์ชันบันทึกการขาย
function recordSale(productId, quantity) {
    const product = inventory.find(p => p.id === productId);
    if (product && product.inStock >= quantity) {
        product.inStock -= quantity;
        product.totalSales += quantity;
        updateTable();
        generateSalesReport();
    } else {
        alert("ไม่สามารถบันทึกการขายได้ เนื่องจากจำนวนคงเหลือไม่เพียงพอ");
    }
}

// ตัวอย่างการเรียกใช้ฟังก์ชันบันทึกการขาย
// recordSale("productId", 5);

// โหลดข้อมูลและอัปเดตตารางเมื่อเปิดหน้าเว็บ
updateTable();
