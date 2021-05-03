import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TweetCard from '../../shared/components/TweetCard';
import { RootState, useAppDispatch } from '../../store/store';
import { categorizeTweetSchedule } from '../../shared/utils';
import ScheduleTweetModal from '../../shared/components/ScheduleTweetModal';
import PrimaryButton from '../../shared/components/PrimaryButton';
import { updateCurrentDraft } from '../../store/slices/tweetSlice';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const tweets = useSelector(
    (state: RootState) => state.tweets.scheduledTweets,
  );
  const currentDraft = useSelector(
    (state: RootState) => state.tweets.currentDraft,
  );
  const currentUser = useSelector((state: RootState) => state.auth.userProfile);

  const handleScheduleModalClose = () => setScheduleModalOpen(false);
  const categorizedTweets = categorizeTweetSchedule(tweets);

  return (
    <div>
      <div className="mx-12 mt-4">
        <div className="flex justify-between mb-4 items-center">
          <h1 className="font-bold text-2xl">Queued Tweets</h1>
          <PrimaryButton
            size="large"
            onClick={() => {
              currentDraft === null &&
                currentUser &&
                dispatch(
                  updateCurrentDraft({
                    id: uuidv4(),
                    userId: currentUser.uid,
                    content: [],
                    localScheduledTime: new Date().toString(),
                    utcScheduledTime: new Date().toUTCString(),
                    followupTweets: [],
                    posted: false,
                  }),
                );
              setScheduleModalOpen(true);
            }}
          >
            Schedule a tweet
          </PrimaryButton>
        </div>
        <div>
          {Array.from(categorizedTweets.entries()).map((category, idx) => (
            <>
              <h1
                className="font-bold text-lg mb-4"
                key={`category-title-${idx}`}
              >
                {category[0]}
              </h1>
              <div className="mb-4" key={`tweet-container-${idx}`}>
                {category[1].map((tweet) => (
                  <TweetCard
                    key={tweet.id}
                    localScheduledTime={tweet.localScheduledTime}
                    tweetContent={tweet.content}
                    followupTweets={tweet.followupTweets}
                  />
                ))}
              </div>
            </>
          ))}
        </div>
      </div>
      <ScheduleTweetModal
        isOpen={scheduleModalOpen}
        isEditing={false}
        data={currentDraft!}
        handleClose={handleScheduleModalClose}
      />
    </div>
  );
};

export default Dashboard;
