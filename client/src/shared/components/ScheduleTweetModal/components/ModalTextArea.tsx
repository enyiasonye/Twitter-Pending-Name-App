import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { Input, Tooltip, message } from 'antd';
import {
  SmileOutlined,
  PictureOutlined,
  GifOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import UploadItem from './UploadItem';
import tw, { styled } from 'twin.macro';
import '../styles/CenteredMessage.css';
import { TextAreaContent } from '../../../../store/commonTypes';
const { TextArea } = Input;

const getTextColor = (count: number) => {
  // yellow at 230 characters,
  // Red at 280+
  if (count >= 230 && count <= 280) {
    return 'text-yellow-500';
  } else if (count > 280) {
    return 'text-red-500';
  } else {
    return 'text-black';
  }
};

// @ts-ignore
const useOutsideAlerter = (ref, setIsEmojiOpen) => {
  useEffect(() => {
    // Close if click outside element
    // @ts-ignore
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        //   do nothing if emoji symbol clicked again
        if (event.target.dataset.icon === 'smile') {
        } else setIsEmojiOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
};

interface ModalTextAreaProps {
  currentIndex: number;
  value: TextAreaContent; // actual text content of textarea
  handleTextAreaClick: () => void;
  handleTextAreaChange: (currentValue: string) => void;
  handleFileChange: (currentFileValue: { file: File; alt: string }[]) => void;
  showMinus: boolean;
  handleMinusClick: (currentIndex: number) => void;
  handlePlusClick: () => void;
}

const ModalTextArea: React.FC<ModalTextAreaProps> = ({
  currentIndex,
  value,
  handleTextAreaClick,
  handleTextAreaChange,
  handleFileChange,
  showMinus = false,
  handleMinusClick,
  handlePlusClick,
}) => {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(wrapperRef, setIsEmojiOpen);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files);
      if (e.target.files.length <= 4) {
        // temp array to hold upload items and add all at once
        const temp: { file: File; alt: string }[] = [];
        Array.from(e.target.files).forEach((file) => {
          if (file.size > 5e6) {
            message.error('Images must be 5MB or smaller');
          } else {
            temp.push({ file, alt: '' });
          }
        });
        handleFileChange(temp);
      } else {
        message.error('A given tweet can only have 4 images at max');
      }
      // prevents issue where you cannot reupload first file
      if (hiddenInputRef.current) hiddenInputRef.current.value = '';
    }
  };

  const uploadDisabled = () => {
    // when gifs are implemented, it is either 4 images or one gif
    // also implement image size limit
    if (value.files.length >= 4) return true;
    return false;
  };

  const handleFileDelete = (index: number) => {
    handleFileChange(value.files.filter((_, idx) => idx !== index));
  };

  return (
    <div className="border-gray-300 border rounded-md focus-within:border-emerald-400 mb-4">
      <TextArea
        rows={5}
        bordered={false}
        className="resize-none"
        onClick={() => {
          handleTextAreaClick();
        }}
        onChange={(e) => {
          handleTextAreaChange(e.target.value);
        }}
        placeholder={
          currentIndex === 0
            ? 'Long text will automatically be turned into a thread!'
            : `Tweet #${currentIndex + 1}`
        }
        value={value.text}
      />
      <div className="p-1.5">
        {value.files.map((file, index) => (
          <UploadItem
            placeholderText="Image description"
            file={file}
            key={index}
            handleDelete={() => handleFileDelete(index)}
          />
        ))}
      </div>
      <div className="px-2 py-1 flex justify-between">
        <div className="flex items-center">
          <Tooltip title="Add emoji">
            <SmileOutlined
              className="hover:text-emerald-500 cursor-pointer relative text-lg"
              onClick={() => {
                setIsEmojiOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Add image">
            <StyledPictureIcon
              disabled={uploadDisabled()}
              onClick={() => {
                !uploadDisabled() && hiddenInputRef.current?.click();
              }}
            />
            <input
              className="hidden"
              type="file"
              multiple
              onChange={handleFileUpload}
              ref={hiddenInputRef}
              accept="image/*"
            />
          </Tooltip>
          <Tooltip title="Add gif">
            <GifOutlined
              className="hover:text-emerald-500 cursor-pointer relative text-lg"
              onClick={() => {}}
            />
          </Tooltip>
        </div>
        <div className="flex items-baseline">
          <div className={`${getTextColor(value.text.length)}`}>
            {value.text.length}
          </div>
          {showMinus && (
            <Tooltip title="Remove tweet">
              <MinusOutlined
                className="hover:text-emerald-500 cursor-pointer relative text-lg pl-2"
                onClick={() => {
                  handleMinusClick(currentIndex);
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="Add tweet">
            <PlusOutlined
              className="hover:text-emerald-500 cursor-pointer relative text-lg pl-2"
              onClick={() => {
                handlePlusClick();
              }}
            />
          </Tooltip>
        </div>
      </div>
      {isEmojiOpen && (
        <div ref={wrapperRef}>
          <Picker
            set="twitter"
            style={{
              position: 'absolute',
              marginTop: '0.5rem',
              marginLeft: '-0.5rem',
              zIndex: 20,
              height: '13rem',
              overflow: 'hidden',
            }}
            showPreview={false}
            perLine={8}
            showSkinTones={false}
            onSelect={(emoji) => {
              //   @ts-ignore
              handleTextAreaChange(`${value}${emoji.native}`);
            }}
          />
        </div>
      )}
    </div>
  );
};

const StyledPictureIcon = styled(PictureOutlined)`
  ${tw`relative text-lg mx-2`}
  ${(props: { disabled?: boolean }) =>
    props.disabled ? tw`text-gray-300` : tw`hover:text-emerald-500`}
  cursor: ${(props: { disabled?: boolean }) =>
    props.disabled ? 'default' : 'pointer'} !important
`;

export default ModalTextArea;
