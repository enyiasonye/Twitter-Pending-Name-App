import React from 'react';
import { Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import tw from 'twin.macro';
import styled from 'styled-components';

const BasicInput = styled(Input)`
  ${tw`focus-within:border-emerald-400 focus:border-emerald-400 hover:border-emerald-400`}
`;

const previewImage = (file: File) => (
  <img src={URL.createObjectURL(file)} alt={file.name} className="h-6 w-6" />
);

interface UploadItemProps {
  placeholderText: string;
  file: File;
  handleDelete: () => void;
}

const UploadItem: React.FC<UploadItemProps> = ({
  placeholderText,
  file,
  handleDelete,
}) => {
  return (
    <BasicInput
      //   className="focus-within:border-emerald-400 focus:border-emerald-400 hover:border-emerald-400"
      placeholder={placeholderText}
      prefix={previewImage(file)}
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
