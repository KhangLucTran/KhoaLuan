import { useCallback, useState, useEffect } from "react";
import { validateField } from "../utils/validation";

export const useForm = (fields, initialValues = {}) => {
  // Khởi tạo giá trị mặc định
  const defaultValues = fields.reduce(
    (acc, field) => ({ ...acc, [field.name]: initialValues[field.name] || "" }),
    {}
  );

  const [formValues, setFormValues] = useState(defaultValues);
  const [formErrors, setFormErrors] = useState({});

  // Khi initialValues thay đổi, cập nhật formValues
  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...initialValues,
    }));
  }, [initialValues]);

  const validateForm = (values) => {
    const errors = {};
    fields.forEach((field) => {
      const error = validateField(field.name, values[field.name]);
      if (error) {
        errors[field.name] = error;
      }
    });
    setFormErrors(errors);
    return errors;
  };

  const handleInputChange = useCallback((name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  }, []);

  return {
    formValues,
    formErrors,
    handleInputChange,
    validateForm,
    setFormValues,
  };
};
