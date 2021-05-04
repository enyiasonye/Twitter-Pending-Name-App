import React from 'react';
import { Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import tw from 'twin.macro';
import styled from 'styled-components';
import '../styles/BasicInput.css';

const BasicInput = styled(Input)`
  ${tw`hover:border-emerald-400 mb-1`}
`;

const previewImage = (file: File) => (
  <img src={URL.createObjectURL(file)} alt={file.name} className="h-6 w-6" />
);

interface UploadItemProps {
  placeholderText: string;
  file: { file: File; alt: string };
  handleDelete: () => void;
}

const UploadItem: React.FC<UploadItemProps> = ({
  placeholderText,
  file,
  handleDelete,
}) => {
  return (
    <BasicInput
      className="ant-input-affix-wrapper"
      placeholder={placeholderText}
      value={file.alt}
      prefix={previewImage(file.file)}
      suffix={
        <CloseOutlined
          className="cursor-pointer"
          onClick={() => {
            handleDelete();
          }}
        />
      }
    />
  );
};

export default UploadItem;
