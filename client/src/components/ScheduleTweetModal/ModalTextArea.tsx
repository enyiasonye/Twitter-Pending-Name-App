import React, { useEffect, useRef, useState } from 'react';
import { Input, Tooltip } from 'antd';
import {
  SmileOutlined,
  PictureOutlined,
  GifOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

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
  value: string; // actual text content of textarea
  handleTextAreaClick: () => void;
  handleTextAreaChange: (currentValue: string) => void;
  showMinus: boolean;
  handleMinusClick: (currentIndex: number) => void;
  handlePlusClick: () => void;
}

const ModalTextArea: React.FC<ModalTextAreaProps> = ({
  currentIndex,
  value,
  handleTextAreaClick,
  handleTextAreaChange,
  showMinus = false,
  handleMinusClick,
  handlePlusClick,
}) => {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(wrapperRef, setIsEmojiOpen);

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
        value={value}
      />
      TEST
      <div className="p-2 flex justify-between">
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
            <PictureOutlined
              className="hover:text-emerald-500 cursor-pointer relative text-lg mx-2"
              onClick={() => {
                hiddenInputRef.current?.click();
              }}
            />
            <input
              className="hidden"
              type="file"
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
          <div className={`${getTextColor(value.length)}`}>{value.length}</div>
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

export default ModalTextArea;
