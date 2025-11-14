import React, { useState, KeyboardEvent } from 'react';
import Badge from './ui/Badge';
import { AssignmentStatus } from '../types';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = "Add tags (press Enter)",
  maxTags = 5
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < maxTags) {
      onChange([...tags, tag]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-gray-light">
        Tags {tags.length > 0 && `(${tags.length}/${maxTags})`}
      </label>
      
      <div className="flex flex-wrap gap-2 p-3 border border-neutral-light-gray dark:border-neutral-gray-medium rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center">
            <Badge status={AssignmentStatus.SUBMITTED} className="flex items-center gap-1">
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-xs hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </Badge>
          </div>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={tags.length >= maxTags}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm placeholder-neutral-gray-light"
        />
      </div>
      
      <div className="text-xs text-neutral-gray-light">
        Press Enter or comma to add tags. Common tags: #javascript, #react, #bug, #help, #css
      </div>
    </div>
  );
};

export default TagInput;
