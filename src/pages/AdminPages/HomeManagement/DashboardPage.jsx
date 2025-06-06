import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { getAllInvoicesApi } from "../../../features/invoice/invoiceApi";
import { getAllProductsApi } from "../../../features/product/productApi";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceData, productData] = await Promise.all([
          getAllInvoicesApi(),
          getAllProductsApi(),
        ]);

        const invoicesData = invoiceData?.invoices ?? [];
        const productsData = productData ?? [];
        const sortedProducts = productsData.sort(
          (a, b) => (b.sold || 0) - (a.sold || 0)
        );
        setInvoices(invoicesData);
        setProducts(sortedProducts);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = useMemo(() => {
    if (!Array.isArray(invoices)) return [];

    const grouped = invoices.reduce((acc, invoice) => {
      const date = new Date(invoice.issuedAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          date,
          totalAmount: 0,
          count: 0,
          completedCount: 0,
          cancelledCount: 0,
        };
      }
      acc[date].totalAmount += invoice.totalAmount;
      acc[date].count += 1;

      if (invoice.status === "Completed") acc[date].completedCount += 1;
      if (invoice.status === "Cancelled") acc[date].cancelledCount += 1;

      return acc;
    }, {});

    return Object.values(grouped);
  }, [invoices]);

  // Tính top 5 sản phẩm bán chạy nhất
  const topProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    const productsWithSold = products.filter((p) => typeof p.sold === "number");
    if (productsWithSold.length === 0) return [];

    return productsWithSold.slice(0, 3);
  }, [products]);

  // Tính tổng số sản phẩm bán được theo thể loại
  const categorySalesData = useMemo(() => {
    const categorySales = products.reduce((acc, product) => {
      if (product.sold > 0) {
        if (!acc[product.category]) {
          acc[product.category] = 0;
        }
        acc[product.category] += product.sold;
      }
      return acc;
    }, {});

    return Object.keys(categorySales).map((category) => ({
      name: category,
      uv: categorySales[category], // Số lượng sản phẩm bán được
    }));
  }, [products]);

  return (
    <div className="admin-dashboard">
      {loading ? (
        <p className="loading-text">Đang tải dữ liệu...</p>
      ) : (
        <div className="dashboard-content">
          <div>
            <h3 className="dashboard-chart-title">THỐNG KÊ DOANH THU</h3>
            <div className="dashboard-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="date" stroke="#111" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#111" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #ccc",
                      fontSize: "0.9rem",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#333" }}
                    formatter={(value, name) => {
                      if (name === "Tổng tiền")
                        return [`${value.toLocaleString()} VND`, name];
                      return [value, name];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "0.9rem", color: "#111" }}
                    iconType="circle"
                  />
                  <Bar dataKey="totalAmount" name="Tổng tiền" fill="#000" />
                  <Bar dataKey="count" name="Tổng đơn" fill="#555" />
                  <Bar
                    dataKey="completedCount"
                    name="Đã hoàn tất"
                    fill="#1b1b1b"
                  />
                  <Bar dataKey="cancelledCount" name="Đã hủy" fill="#aaa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Thêm biểu đồ phân khúc sản phẩm bán được */}
          <div>
            <h3 className="dashboard-chart-title">
              PHÂN KHÚC SẢN PHẨM BÁN ĐƯỢC
            </h3>
            <div className="dashboard-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={730}
                  height={250}
                  data={categorySalesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Danh sách top sản phẩm bán chạy */}
          <div className="top-products-section">
            <h3 className="top-products-title">🔥 SẢN PHẨM HOT NHẤT</h3>
            <ul className="top-products-list">
              {topProducts.map((product, index) => (
                <li key={product._id} className="top-product-item">
                  <span className="top-product-rank">#{index + 1}</span>
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="top-product-image"
                  />
                  <div className="top-product-info">
                    <span className="top-product-name">{product.title}</span>
                    <span className="top-product-sold">
                      {product.sold} đã bán
                    </span>
                    <span className="top-product-price">
                      {product.price?.toLocaleString()}₫
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
