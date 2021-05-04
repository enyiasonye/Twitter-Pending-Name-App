import React, { useState, useEffect } from 'react';
import { Modal, Button, DatePicker, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import 'emoji-mart/css/emoji-mart.css';
import { useSelector } from 'react-redux';
import { postNow, queueTweet } from '../../../store/thunks/tweetThunk';
import { RootState, useAppDispatch } from '../../../store/store';
import PrimaryButton from '../PrimaryButton';
import { isThePast } from '../../utils';
import { useImmer } from 'use-immer';
import ModalTextArea from './components/ModalTextArea';
import { ScheduledTweet, TextAreaContent } from '../../../store/commonTypes';
import { unwrapResult } from '@reduxjs/toolkit';
import { userMediaRef, stateChanged } from '../../../firebaseConfig';
import { format } from 'date-fns';

interface ScheduleTweetModalProps {
  isOpen: boolean;
  isEditing: boolean;
  data: ScheduledTweet;
  handleClose: () => void;
}
const ScheduleTweetModal: React.FC<ScheduleTweetModalProps> = ({
  isOpen,
  handleClose,
  data,
  isEditing,
}) => {
  const user = useSelector((state: RootState) => state.auth.userProfile);
  const [textValues, setTextValues] = useImmer<TextAreaContent[]>([
    { text: '', files: [] },
  ]);
  const [showPastError, setShowPastError] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [scheduledTime, setScheduledTime] = useState<moment.Moment | null>(
    null,
  );
  const dispatch = useAppDispatch();

  const postNowKey = 'postNow';

  // function to clear out modal state
  const handleClear = () => {
    setTextValues((draft) => {
      draft.splice(0, draft.length);
      draft.push({ text: '', files: [] });
    });
    setFocusedIndex(0);
    setScheduledTime(null);
  };

  // function to handle uploading images
  const handleImagesUpload = (
    files: {
      file: File;
      alt: string;
    }[],
    index: number,
  ) => {
    files.forEach((file) => {
      const fileName = `${format(new Date(), 'Y-MM')}/${
        user?.uid
      }/${new Date().toISOString()}-${uuidv4()}-${file.file.name}`;

      const uploadTask = userMediaRef.child(fileName).put(file.file);
      uploadTask.on(
        stateChanged,
        (snapshot) => {},
        (error) => {
          // use proper logging in the future
          console.log(error);
          message.error(`There was an error uploading ${file.file.name}`);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setTextValues((draft) => {
              draft[index].files.push({
                ...file,
                url: downloadURL,
                refPath: fileName,
              });
            });
          });
        },
      );
    });
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
    // we will keep any media on the first of the segmented texts
    if (textValues[focusedIndex].text.length > 280) {
      const segmentedText = textValues[focusedIndex].text.match(
        /.{1,280}([.!?]|$)/g,
      );
      const mappedSegmentedText = segmentedText?.map((item, index) => {
        if (index === 0) {
          return {
            text: item,
            files: textValues[focusedIndex].files,
          };
        } else {
          return {
            text: item,
            files: [],
          };
        }
      });
      if (segmentedText !== null && !!mappedSegmentedText) {
        setTextValues((draft) => {
          draft.splice(focusedIndex, 1, ...mappedSegmentedText);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex, textValues]);

  return (
    <Modal
      title="Schedule a tweet"
      visible={isOpen}
      onCancel={handleClose}
      onOk={handleClose}
      footer={[
        <Button
          className="hover:text-emerald-500 hover:border-emerald-500 focus:border-emerald-600"
          disabled={textValues[0].text === ''}
          onClick={() => {
            message.loading({
              content: 'Posting your tweet',
              key: postNowKey,
              duration: 0,
            });
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
            )
              .then(unwrapResult)
              .then(() => {
                message.success({
                  content: 'Tweet successfully posted',
                  key: postNowKey,
                });
                handleClear();
              })
              .catch((error) => {
                message.error({
                  content: error.twitterMessage,
                  key: postNowKey,
                });
                handleClear();
              });
            handleClose();
          }}
        >
          Post Now
        </Button>,
        <PrimaryButton
          disabled={
            scheduledTime === null || textValues[0].text === '' || showPastError
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
                draft[index].text = currentValue;
              });
            }}
            handleFileChange={(currentFileValue) => {
              // an upload has been removed
              if (currentFileValue.length < textValues[index].files.length) {
                setTextValues((draft) => {
                  draft[index].files = currentFileValue;
                });
                // we delete after because even if there's an error It'll get cleaned up later
                // assume first length of 1 since you can't batch delete
                const [fileToBeDeleted] = textValues[index].files.filter(
                  (item) => !currentFileValue.includes(item),
                );
                if (fileToBeDeleted.refPath) {
                  const currentFileRef = userMediaRef.child(
                    fileToBeDeleted.refPath,
                  );
                  currentFileRef.delete();
                }
              } else {
                handleImagesUpload(currentFileValue, index);
              }
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
                draft.push({ text: '', files: [] });
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
