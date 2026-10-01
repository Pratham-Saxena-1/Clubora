import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import './FormBuilder.css'; // Let's use some simple CSS or inline styles, wait I can just use styled components or inline since I don't have FormBuilder.css yet. I'll add inline for now or create css file.
// Actually, I should create the CSS file too. Or add it to styles.css.
// I'll use standard classes and put styles in styles.css.

const PREDEFINED_FIELDS = [
  { type: 'short_answer', label: 'Full Name', required: true, options: [] },
  { type: 'short_answer', label: 'Registration Number', required: true, options: [] },
  { type: 'email', label: 'Email Address', required: true, options: [] },
  { type: 'phone', label: 'Phone Number', required: true, options: [] },
  { type: 'short_answer', label: 'Branch', required: true, options: [] },
  { type: 'dropdown', label: 'Year', required: true, options: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
  { type: 'url', label: 'Portfolio URL', required: false, options: [] },
  { type: 'long_answer', label: 'Motivation', required: false, options: [] },
  { type: 'long_answer', label: 'Past Experience', required: false, options: [] },
  { type: 'file_upload', label: 'Resume', required: false, options: [] },
];

const FIELD_TYPES = [
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'long_answer', label: 'Long Answer' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'number', label: 'Number' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'checkboxes', label: 'Checkboxes' },
  { value: 'date', label: 'Date' },
  { value: 'url', label: 'URL' },
  { value: 'file_upload', label: 'File Upload' },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

function FormBuilder({ fields, setFields }) {

  const addField = (field) => {
    setFields([...fields, { ...field, id: generateId() }]);
  };

  const updateField = (id, updates) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const moveField = (index, direction) => {
    if (index + direction < 0 || index + direction >= fields.length) return;
    const newFields = [...fields];
    const temp = newFields[index];
    newFields[index] = newFields[index + direction];
    newFields[index + direction] = temp;
    setFields(newFields);
  };

  const addOption = (id) => {
    const field = fields.find(f => f.id === id);
    updateField(id, { options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] });
  };

  const updateOption = (id, optIndex, value) => {
    const field = fields.find(f => f.id === id);
    const newOptions = [...field.options];
    newOptions[optIndex] = value;
    updateField(id, { options: newOptions });
  };

  const removeOption = (id, optIndex) => {
    const field = fields.find(f => f.id === id);
    updateField(id, { options: field.options.filter((_, i) => i !== optIndex) });
  };

  return (
    <div className="form-builder">
      <div className="form-builder__predefined">
        <h4 style={{ marginBottom: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>Add Commonly Used Fields</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PREDEFINED_FIELDS.map((pf, i) => (
            <button 
              key={i} 
              type="button" 
              className="form-builder__badge-btn"
              onClick={() => addField(pf)}
            >
              <Plus size={14} /> {pf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-builder__fields">
        {fields.map((field, index) => (
          <div key={field.id} className="form-builder__field-card">
            <div className="form-builder__field-header">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
                <button type="button" className="form-builder__icon-btn" onClick={() => moveField(index, -1)} disabled={index === 0}><ArrowUp size={16} /></button>
                <button type="button" className="form-builder__icon-btn" onClick={() => moveField(index, 1)} disabled={index === fields.length - 1}><ArrowDown size={16} /></button>
                
                <input 
                  type="text" 
                  value={field.label} 
                  onChange={e => updateField(field.id, { label: e.target.value })}
                  placeholder="Question text"
                  className="form-builder__input"
                  style={{ flex: 1, fontWeight: 600 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select 
                  value={field.type} 
                  onChange={e => updateField(field.id, { type: e.target.value })}
                  className="form-builder__select"
                >
                  {FIELD_TYPES.map(ft => (
                    <option key={ft.value} value={ft.value}>{ft.label}</option>
                  ))}
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                  <input 
                    type="checkbox" 
                    checked={field.required}
                    onChange={e => updateField(field.id, { required: e.target.checked })}
                  /> Required
                </label>
                <button type="button" className="form-builder__icon-btn text-error" onClick={() => removeField(field.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {['dropdown', 'multiple_choice', 'checkboxes'].includes(field.type) && (
              <div className="form-builder__options">
                {field.options?.map((opt, oIdx) => (
                  <div key={oIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: field.type === 'checkboxes' ? '2px' : '50%', border: '1px solid var(--border)' }}></div>
                    <input 
                      type="text" 
                      value={opt}
                      onChange={e => updateOption(field.id, oIdx, e.target.value)}
                      className="form-builder__input"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="form-builder__icon-btn text-error" onClick={() => removeOption(field.id, oIdx)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" className="form-builder__text-btn" onClick={() => addOption(field.id)}>
                  <Plus size={14} /> Add Option
                </button>
              </div>
            )}
            {field.type === 'short_answer' && <div className="form-builder__preview-input">Short answer text</div>}
            {field.type === 'long_answer' && <div className="form-builder__preview-input">Long answer text</div>}
            {field.type === 'file_upload' && <div className="form-builder__preview-input">File Upload</div>}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <button type="button" className="form-builder__add-btn" onClick={() => addField({ type: 'short_answer', label: 'Untitled Question', required: false, options: [] })}>
          <Plus size={16} /> Add Custom Field
        </button>
      </div>
    </div>
  );
}

export default FormBuilder;
