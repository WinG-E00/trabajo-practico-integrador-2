import { useState } from 'react';

export const useForm = (initialValues = {}) => {
    const [form, setForm] = useState(initialValues);

    const handleInputChange = ({ target: { name, value } }) => {
        setForm((previousForm) => ({ ...previousForm, [name]: value }));
    };

    const handleReset = () => setForm(initialValues);

    return { form, handleInputChange, handleReset };
};
