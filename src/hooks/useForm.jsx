import { useCallback, useState } from "react";
import { validateField } from "../utils/validation";

export const useForm = (fields) => {
  const [formValues, setFormValues] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [formErrors, setFormErrors] = useState({});

  const validateForm = (values) => {
    const errors = {};
    fields.forEach((field) => {
      const error = validateField(field.name, values[field.name]);
      if (error) {
        errors[field.name] = error;
      }
    });
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

  return { formValues, formErrors, handleInputChange, validateForm };
};
