import { useEffect, useState } from "react";
import {
  getDiscountApi,
  createDiscountApi,
  updateDiscountApi,
  deleteDiscountApi,
} from "../../../features/discount/discountApi";
import "./DiscountManagement.css";

const initialFormState = {
  code: "",
  percent: 0,
  fixedAmount: 0,
  applicableProducts: [],
  freeShipping: false,
  minOrderAmount: 0,
  startDate: "",
  endDate: "",
  usageLimit: 100,
  status: "Active",
};

const PRODUCTS = [
  "Shirt",
  "Pants",
  "Hat",
  "Jacket",
  "Accessories",
  "T-Shirt",
  "Short",
];
const STATUS = ["Active", "Expired", "Disabled"];

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(initialFormState);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await getDiscountApi();
      setDiscounts(res.data || []);
      setError("");
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError("Lỗi khi tải danh sách mã giảm giá");
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "applicableProducts") {
        const val = value;
        setForm((prev) => {
          let updated = prev.applicableProducts.includes(val)
            ? prev.applicableProducts.filter((p) => p !== val)
            : [...prev.applicableProducts, val];
          return { ...prev, applicableProducts: updated };
        });
      } else {
        setForm((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.code || (!form.percent && !form.fixedAmount)) {
      setError("Vui lòng nhập đầy đủ mã giảm giá và phần trăm hoặc số tiền.");
      return;
    }

    try {
      if (editingId) {
        await updateDiscountApi(editingId, form);
        setSuccess("Cập nhật mã giảm giá thành công.");
      } else {
        await createDiscountApi(form);
        setSuccess("Thêm mã giảm giá thành công.");
      }

      setForm(initialFormState);
      setEditingId(null);
      fetchDiscounts();
    } catch (err) {
      setError(err.message || "Lỗi khi lưu mã giảm giá.");
    }
  };

  const handleEdit = (discount) => {
    setEditingId(discount._id);
    setForm({
      code: discount.code,
      percent: discount.percent,
      fixedAmount: discount.fixedAmount,
      applicableProducts: discount.applicableProducts || [],
      freeShipping: discount.freeShipping || false,
      minOrderAmount: discount.minOrderAmount || 0,
      startDate: discount.startDate?.split("T")[0] || "",
      endDate: discount.endDate?.split("T")[0] || "",
      usageLimit: discount.usageLimit || 100,
      status: discount.status || "Active",
    });
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;

    try {
      await deleteDiscountApi(id);
      setSuccess("Xóa mã giảm giá thành công.");
      fetchDiscounts();
    } catch (err) {
      setError(err.message || "Lỗi khi xóa mã giảm giá.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setError("");
    setSuccess("");
  };

  return (
    <div className="discount-management">
      <h1>Quản lý mã giảm giá</h1>
      <button
        className="toggle-form-btn"
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setForm(initialFormState);
          setError("");
          setSuccess("");
        }}
      >
        {showForm ? "Ẩn form" : "Thêm mã giảm giá"}
      </button>
      {(showForm || editingId) && (
        <form className="discount-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá"}</h2>
          <label>
            Mã giảm giá:
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              disabled={!!editingId}
            />
          </label>

          <label>
            Giảm theo %:
            <input
              type="number"
              name="percent"
              value={form.percent}
              onChange={handleChange}
              min={0}
              max={100}
            />
          </label>

          <label>
            Giảm số tiền cố định:
            <input
              type="number"
              name="fixedAmount"
              value={form.fixedAmount}
              onChange={handleChange}
              min={0}
            />
          </label>

          <fieldset>
            <legend>Sản phẩm áp dụng:</legend>
            {PRODUCTS.map((product) => (
              <label key={product}>
                <input
                  type="checkbox"
                  name="applicableProducts"
                  value={product}
                  checked={form.applicableProducts.includes(product)}
                  onChange={handleChange}
                />
                {product}
              </label>
            ))}
          </fieldset>

          <label>
            <input
              type="checkbox"
              name="freeShipping"
              checked={form.freeShipping}
              onChange={handleChange}
            />
            Miễn phí vận chuyển
          </label>

          <label>
            Giá trị đơn hàng tối thiểu:
            <input
              type="number"
              name="minOrderAmount"
              value={form.minOrderAmount}
              onChange={handleChange}
            />
          </label>

          <label>
            Ngày bắt đầu:
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Ngày kết thúc:
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Giới hạn lượt dùng:
            <input
              type="number"
              name="usageLimit"
              value={form.usageLimit}
              onChange={handleChange}
              min={1}
            />
          </label>

          <label>
            Trạng thái:
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="cancel-btn"
              >
                Hủy
              </button>
            )}
          </div>

          {loading && <p>Đang tải...</p>}
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
        </form>
      )}
      <h2>Danh sách mã giảm giá</h2>
      <table className="discount-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>%</th>
            <th>Tiền</th>
            <th>SP áp dụng</th>
            <th>Freeship</th>
            <th>Giá trị tối thiểu</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Giới hạn</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d) => (
            <tr key={d._id}>
              <td>{d.code}</td>
              <td>{d.percent}%</td>
              <td>{d.fixedAmount?.toLocaleString()}</td>
              <td>{(d.applicableProducts || []).join(", ")}</td>
              <td>{d.freeShipping ? "✔️" : "❌"}</td>
              <td>{d.minOrderAmount?.toLocaleString()}</td>
              <td>{d.startDate?.split("T")[0]}</td>
              <td>{d.endDate?.split("T")[0]}</td>
              <td>{d.usageLimit}</td>
              <td>{d.status}</td>
              <td>
                <button onClick={() => handleEdit(d)}>Sửa</button>
                <button onClick={() => handleDelete(d._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiscountManagement;
