import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, Tooltip, Button, DatePicker } from 'antd';
import { v4 as uuidv4 } from 'uuid';
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
import { postNow, queueTweet } from '../store/thunks/tweetThunk';
import { RootState } from '../store/store';
import PrimaryButton from './PrimaryButton';
import { isThePast } from '../utils';
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

interface ScheduleTweetModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const ScheduleTweetModal: React.FC<ScheduleTweetModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const [textValues, setTextValues] = useState(['']);
  const [showPastError, setShowPastError] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<null | number>(null);
  const [openEmojiIndex, setOpenEmojiIndex] = useState<null | number>(null);
  const [scheduledTime, setScheduledTime] = useState<moment.Moment | null>(
    null,
  );

  // handle changes in scheduled time
  useEffect(() => {
    if (scheduledTime) {
      const currentScheduledTime = scheduledTime?.toDate();
      if (isThePast(currentScheduledTime)) {
        setShowPastError(true);
      } else {
        setShowPastError(false);
      }
    } else {
      setShowPastError(false);
    }
  }, [scheduledTime]);

  // handle generating new blocks of text
  useEffect(() => {
    console.log(focusedIndex);
    // find any that have greater than 280 characters
    if (focusedIndex) {
      if (textValues[focusedIndex].length > 280) {
      }
    }
  }, [focusedIndex, textValues]);

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.userProfile);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setOpenEmojiIndex);

  const handleTextChange = (value: string, index: number) => {
    setTextValues(Object.assign([...textValues], { [index]: value }));
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
          disabled={textValues[0] === ''}
          onClick={() => {
            dispatch(
              postNow({
                id: uuidv4(),
                userId: user!.uid,
                content: textValues,
                timezone: user!.settings!.timezone,
                localScheduledTime: new Date().toString(),
                utcScheduledTime: new Date().toUTCString(),
                followupTweets: [],
                posted: true,
              }),
            );
            handleClose();
          }}
        >
          Post Now
        </Button>,
        <PrimaryButton
          disabled={
            scheduledTime === null || textValues[0] === '' || showPastError
          }
          onClick={() => {
            scheduledTime !== null &&
              dispatch(
                queueTweet({
                  id: uuidv4(),
                  userId: user!.uid,
                  content: textValues,
                  timezone: user!.settings!.timezone,
                  localScheduledTime: scheduledTime?.toDate().toString(),
                  utcScheduledTime: scheduledTime.toDate().toUTCString(),
                  followupTweets: [],
                  posted: false,
                }),
              );
            handleClose();
          }}
        >
          Queue Tweet
        </PrimaryButton>,
      ]}
    >
      <div>
        {textValues.map((value, index) => (
          <div className="border-gray-300 border rounded-md focus-within:border-emerald-400 mb-4">
            <TextArea
              rows={4}
              bordered={false}
              className="resize-none"
              onClick={() => {
                setFocusedIndex(index);
              }}
              onChange={(e) => {
                handleTextChange(e.target.value, index);
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
                <div className={`${getTextColor(textValues[index].length)}`}>
                  {textValues[index].length}
                </div>
                {textValues.length > 1 && (
                  <Tooltip title="Remove tweet">
                    <MinusOutlined
                      className="hover:text-emerald-500 cursor-pointer relative text-lg pl-2"
                      onClick={() => {
                        setTextValues(
                          textValues.filter((val, idx) => idx !== index),
                        );
                        if (index > 0) setFocusedIndex(index - 1);
                      }}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Add tweet">
                  <PlusOutlined
                    className="hover:text-emerald-500 cursor-pointer relative text-lg pl-2"
                    onClick={() => {
                      setTextValues([...textValues, '']);
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
        <div className="flex justify-between">
          <div>Scheduled Time</div>
          <div className="flex flex-col">
            <DatePicker
              showNow={false}
              size="small"
              showTime={{ use12Hours: true }}
              format="YYYY-MM-DD h:mm"
              onChange={(value) => setScheduledTime(value)}
            />
            {showPastError && (
              <span className="self-end text-red-600">
                This time is in the past
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleTweetModal;
