// Dữ liệu của ProfileView
const userFields = [
  {
    name: "username",
    label: "Tên tài khoản",
    type: "text",
    width: "280px",
    height: "45px",
    helperText:
      "Tên tài khoản phải có ít nhất 3 ký tự, không chứa khoảng trắng.",
  },
  {
    name: "numberphone",
    label: "Số điện thoại",
    type: "text",
    width: "280px",
    height: "45px",
    helperText: "Số điện thoại hợp lệ phải có 10 chữ số.",
  },
  {
    name: "gender",
    label: "Giới tính",
    type: "select",
    options: [
      { label: "Nam", value: "male" },
      { label: "Nữ", value: "female" },
      { label: "Khác", value: "other" },
    ],
    height: "45px",
    helperText: "Vui lòng chọn giới tính.",
  },
  {
    name: "dob",
    label: "Ngày sinh",
    type: "date",
    helperText: "Vui lòng chọn ngày sinh hợp lệ.",
    datepicker: true,
  },
];

export { userFields };
