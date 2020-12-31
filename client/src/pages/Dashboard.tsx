import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TweetCard from '../components/TweetCard';
import { RootState } from '../store/store';
import { Button } from 'antd';
import { categorizeTweetSchedule } from '../utils';
import ScheduleTweetModal from '../components/ScheduleTweetModal';

const Dashboard = () => {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const handleScheduleModalClose = () => setScheduleModalOpen(false);
  const tweets = useSelector(
    (state: RootState) => state.tweets.scheduledTweets,
  );
  const categorizedTweets = categorizeTweetSchedule(tweets);
  return (
    <div>
      <div className="mx-12 mt-4">
        <div className="flex justify-between mb-4 items-center">
          <h1 className="font-bold text-2xl">Queued Tweets</h1>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              setScheduleModalOpen(true);
            }}
            className="bg-emerald-600 border-emerald-600 hover:bg-emerald-500 hover:border-emerald-500 focus:bg-emerald-600 focus:border-emerald-600"
          >
            Schedule a tweet
          </Button>
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
                    scheduledTime={tweet.scheduledTime}
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
        handleClose={handleScheduleModalClose}
      />
    </div>
  );
};

export default Dashboard;
