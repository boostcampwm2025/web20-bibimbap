import { useState, useRef } from 'react';
import type { EventTemplate } from '../types';
import { downloadEventTemplate, uploadEventTemplate } from '../api';

interface OptionManagementProps {
  template: EventTemplate;
  eventTypeName?: string;
}

export const OptionManagement = ({ template, eventTypeName = 'event' }: OptionManagementProps) => {
  const [options, setOptions] = useState<Record<string, any>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Assuming the first section contains the fields for the option table
  const fields = template.schema.sections[0]?.fields || [];

  const handleAddOption = () => {
    const newOption = fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {});
    setOptions([...options, newOption]);
  };

  const handleDeleteOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, key: string, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    setOptions(newOptions);
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadEventTemplate(template.eventTypeId, eventTypeName);
    } catch (error) {
      console.error('Download failed', error);
      alert('템플릿 다운로드에 실패했습니다.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadEventTemplate(template.eventTypeId, file);
      // Append parsed data to existing options
      setOptions(prev => [...prev, ...data]);
      alert(`${data.length}개의 선택지가 추가되었습니다.`);
    } catch (error) {
      console.error('Upload failed', error);
      alert('파일 업로드 및 처리에 실패했습니다. 템플릿 양식을 확인해주세요.');
    } finally {
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <section className="bg-white rounded-xl p-8 mb-6 shadow-sm">
      <h2 className="text-lg font-bold mb-6 text-gray-900">선택지 관리</h2>

      <div className="flex justify-between mb-6">
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-primary hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            템플릿 다운로드
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".xlsx" 
            className="hidden" 
          />
          <button 
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-primary hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            파일 업로드
          </button>
        </div>
        <button 
          onClick={handleAddOption}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          선택지 추가
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.key} className="bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
                  {field.label}
                </th>
              ))}
              <th className="bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
                액션
              </th>
            </tr>
          </thead>
          <tbody>
            {options.length === 0 ? (
              <tr>
                <td colSpan={fields.length + 1} className="px-4 py-10 text-center text-gray-400 text-sm">
                  추가된 선택지가 없습니다.
                </td>
              </tr>
            ) : (
              options.map((option, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  {fields.map((field) => (
                    <td key={field.key} className="px-4 py-3">
                      <input
                        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : 'text'}
                        value={option[field.key]}
                        onChange={(e) => handleOptionChange(index, field.key, e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 bg-white"
                        placeholder={field.label}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => handleDeleteOption(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
