import React, { useState, useEffect } from 'react';
import { Modal, Button, DatePicker } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import 'emoji-mart/css/emoji-mart.css';
import { useDispatch, useSelector } from 'react-redux';
import { postNow, queueTweet } from '../../store/thunks/tweetThunk';
import { RootState } from '../../store/store';
import PrimaryButton from '../PrimaryButton';
import { isThePast } from '../../utils';
import { useImmer } from 'use-immer';
import ModalTextArea from './ModalTextArea';

interface ScheduleTweetModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const ScheduleTweetModal: React.FC<ScheduleTweetModalProps> = ({
  isOpen,
  handleClose,
}) => {
  // const [textValues, setTextValues] = useState(['']);
  const [textValues, setTextValues] = useImmer(['']);
  const [showPastError, setShowPastError] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [scheduledTime, setScheduledTime] = useState<moment.Moment | null>(
    null,
  );

  // function to clear out modal state
  const handleClear = () => {
    setTextValues((draft) => {
      draft = [''];
    });
    setFocusedIndex(0);
    setScheduledTime(null);
  };

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
    // find any that have greater than 280 characters
    if (textValues[focusedIndex].length > 280) {
      const segmentedText = textValues[focusedIndex].match(
        /.{1,280}([.!?]|$)/g,
      );
      if (segmentedText !== null) {
        setTextValues((draft) => {
          draft.splice(focusedIndex, 1, ...segmentedText);
        });
      }
    }
  }, [focusedIndex, textValues]);

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.userProfile);

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
          <ModalTextArea
            currentIndex={index}
            value={value}
            handleTextAreaClick={() => {
              setFocusedIndex(index);
            }}
            handleTextAreaChange={(currentValue) => {
              setTextValues((draft) => {
                draft[index] = currentValue;
              });
            }}
            showMinus={textValues.length > 1}
            handleMinusClick={() => {
              if (index === 0) {
                setFocusedIndex(0);
              }
              if (index > 0) {
                setFocusedIndex(index - 1);
              }
              setTextValues((draft) => {
                draft.splice(index, 1);
              });
            }}
            handlePlusClick={() => {
              setTextValues((draft) => {
                draft.push('');
              });
            }}
          />
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
