import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, Tooltip, Button } from 'antd';
import 'emoji-mart/css/emoji-mart.css';
import {
  SmileOutlined,
  PictureOutlined,
  GifOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { Picker } from 'emoji-mart';
import { useDispatch, useSelector } from 'react-redux';
import { postNow } from '../store/thunks/tweetThunk';
import { RootState } from '../store/store';
const { TextArea } = Input;

// @ts-ignore
const useOutsideAlerter = (ref, setOpenEmojiIndex) => {
  useEffect(() => {
    // Close if click outside element
    // @ts-ignore
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        //   do nothing if emoji symbol clicked again
        if (event.target.dataset.icon === 'smile') {
        } else setOpenEmojiIndex(null);
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

interface ScheduleTweetModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const ScheduleTweetModal: React.FC<ScheduleTweetModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const [textValues, setTextValues] = useState(['']);
  const [textValueLength, setTextValueLength] = useState([0]);
  const [openEmojiIndex, setOpenEmojiIndex] = useState<null | number>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userProfile);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setOpenEmojiIndex);

  const handleTextChange = (value: string, index: number) => {
    setTextValues(Object.assign([...textValues], { [index]: value }));
  };

  const handleTextLengthChange = (value: string, index: number) => {
    setTextValueLength(
      Object.assign([...textValueLength], {
        [index]: value.length,
      }),
    );
  };

  const handleEmojiButtonClick = (index: number) => {
    //   close if index is same as openIndex
    if (index === openEmojiIndex) setOpenEmojiIndex(null);
    // if null, set to passed in index
    else if (openEmojiIndex === null) setOpenEmojiIndex(index);
  };

  return (
    <Modal
      title="Schedule a tweet"
      visible={isOpen}
      onCancel={handleClose}
      onOk={handleClose}
      footer={[
        <Button
          className="hover:text-emerald-500 hover:border-emerald-500 focus:border-emerald-600"
          onClick={() => {
            dispatch(
              postNow({
                userId: user!.uid,
                content: textValues,
                scheduledTime: '',
                followupTweets: [],
              }),
            );
            handleClose();
          }}
        >
          Post Now
        </Button>,
        <Button
          type="primary"
          className="bg-emerald-600 border-emerald-600 hover:bg-emerald-500 hover:border-emerald-500 focus:bg-emerald-600 focus:border-emerald-600"
          onClick={() => {}}
        >
          Queue Tweet
        </Button>,
      ]}
    >
      <div>
        {textValues.map((value, index) => (
          <div className="border-gray-300 border rounded-md focus-within:border-emerald-400 mb-4">
            <TextArea
              rows={4}
              bordered={false}
              className="resize-none"
              onChange={(e) => {
                handleTextChange(e.target.value, index);
                handleTextLengthChange(e.target.value, index);
              }}
              placeholder={
                index === 0
                  ? 'Long text will automatically be turned into a thread!'
                  : `Tweet #${index + 1}`
              }
              value={value}
            />
            <div className="p-2 flex justify-between">
              <div className="flex items-baseline">
                <Tooltip title="Add emoji">
                  <SmileOutlined
                    className="hover:text-emerald-500 cursor-pointer relative text-lg"
                    onClick={() => {
                      handleEmojiButtonClick(index);
                    }}
                  />
                </Tooltip>
                <Tooltip title="Add image">
                  <PictureOutlined
                    className="hover:text-emerald-500 cursor-pointer relative text-lg mx-2"
                    onClick={() => {}}
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
                <div>{textValueLength[index]}</div>
                {textValues.length > 1 && (
                  <Tooltip title="Remove tweet">
                    <MinusOutlined
                      className="hover:text-emerald-500 cursor-pointer relative text-lg pl-2"
                      onClick={() => {
                        setTextValues(
                          textValues.filter((val, idx) => idx !== index),
                        );
                        setTextValueLength(
                          textValueLength.filter((val, idx) => idx !== index),
                        );
                      }}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Add tweet">
                  <PlusOutlined
                    className="hover:text-emerald-500 cursor-pointer relative text-lg pl-2"
                    onClick={() => {
                      setTextValues([...textValues, '']);
                      setTextValueLength([...textValueLength, 0]);
                    }}
                  />
                </Tooltip>
              </div>
            </div>
            {openEmojiIndex === index && (
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
                    // @ts-ignore
                    handleTextChange(`${value}${emoji.native}`, index);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ScheduleTweetModal;
