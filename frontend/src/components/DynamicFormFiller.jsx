import React, { useState } from 'react';

function DynamicFormFiller({ form, answers, setAnswers }) {
  
  const handleChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId, option, checked) => {
    setAnswers(prev => {
      const current = prev[fieldId] || [];
      if (checked) {
        return { ...prev, [fieldId]: [...current, option] };
      } else {
        return { ...prev, [fieldId]: current.filter(o => o !== option) };
      }
    });
  };

  const handleFileChange = (fieldId, file) => {
    setAnswers(prev => ({ ...prev, [fieldId]: file }));
  };

  if (!form || !form.fields) return <div>No form available.</div>;

  return (
    <div className="dynamic-form">
      {form.description && <p className="dynamic-form__desc">{form.description}</p>}
      
      {form.fields.map(field => {
        const val = answers[field.id] || '';
        return (
          <div key={field.id} className="host-modal__field" style={{ marginBottom: '20px' }}>
            <label className="host-modal__label">
              {field.label} {field.required && <span className="text-error">*</span>}
            </label>
            
            {field.type === 'short_answer' && (
              <input type="text" className="host-modal__input" value={val} onChange={e => handleChange(field.id, e.target.value)} required={field.required} />
            )}
            
            {field.type === 'long_answer' && (
              <textarea className="host-modal__textarea" value={val} onChange={e => handleChange(field.id, e.target.value)} required={field.required} />
            )}
            
            {field.type === 'email' && (
              <input type="email" className="host-modal__input" value={val} onChange={e => handleChange(field.id, e.target.value)} required={field.required} />
            )}

            {field.type === 'phone' && (
              <input type="tel" className="host-modal__input" value={val} onChange={e => handleChange(field.id, e.target.value)} required={field.required} />
            )}

            {field.type === 'number' && (
              <input type="number" className="host-modal__input" value={val} onChange={e => handleChange(field.id, e.target.value)} required={field.required} />
            )}

            {field.type === 'url' && (
              <input type="url" className="host-modal__input" value={val} onChange={e => handleChange(field.id, e.target.value)} required={field.required} />
            )}
            
            {field.type === 'date' && (
              <input type="date" className="host-modal__input" value={val} onChange={e => handleChange(field.id, e.target.value)} required={field.required} />
            )}

            {field.type === 'dropdown' && (
              <select className="host-modal__input" value={val} onChange={e => handleChange(field.id, e.target.value)} required={field.required}>
                <option value="">Select an option...</option>
                {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
              </select>
            )}

            {field.type === 'multiple_choice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {field.options?.map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <input type="radio" name={`radio_${field.id}`} value={opt} checked={val === opt} onChange={e => handleChange(field.id, e.target.value)} required={field.required} />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {field.type === 'checkboxes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {field.options?.map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <input type="checkbox" checked={val.includes(opt)} onChange={e => handleCheckboxChange(field.id, opt, e.target.checked)} />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {field.type === 'file_upload' && (
              <input type="file" className="host-modal__input" onChange={e => handleFileChange(field.id, e.target.files[0])} required={field.required} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DynamicFormFiller;
