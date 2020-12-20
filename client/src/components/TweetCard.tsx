import React, { useState } from 'react';
import { Tag, Dropdown, Button, Menu } from 'antd';
import { MoreOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { FollowupTweet } from '../store/commonTypes';
import FollowupTweetCard from './FollowupTweetCard';
import { extractConvertedTime } from '../utils';

export interface TweetCardProps {
  scheduledTime: string;
  tweetContent: string[];
  followupTweets: FollowupTweet[];
}

const CardTag = (info: string) => {
  return (
    <Tag color="#E0FDEF">
      <span className="text-emerald-600 font-bold">{info}</span>
    </Tag>
  );
};

const menu = (
  <Menu>
    <Menu.Item>
      <div>Edit</div>
    </Menu.Item>
    <Menu.Item>
      <div>Post Now</div>
    </Menu.Item>
    <Menu.Item>
      <div>Delete</div>
    </Menu.Item>
  </Menu>
);

const FormattedTweetContent = (tweetContent: string[]) => {
  if (tweetContent.length === 1) {
    return <div>{tweetContent[0]}</div>;
  } else {
    return tweetContent.map((paragraph, index) => {
      if (tweetContent.length === index + 1) {
        // Last one
        return <div key={`paragraph-${index}`}>{paragraph}</div>;
      } else {
        return (
          <>
            <div key={`paragraph-${index}`}>{paragraph}</div>
            <div
              className="border-l-4 w-px border-gray-200 ml-2 my-1 rounded-full h-8"
              key={`line-${index}`}
            ></div>
          </>
        );
      }
    });
  }
};

const TweetCard: React.FC<TweetCardProps> = ({
  scheduledTime,
  tweetContent,
  followupTweets,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg shadow-lg p-4 pr-4">
        <div className="flex justify-between">
          <div>
            <div className="mb-2">
              {CardTag(`@ ${extractConvertedTime(scheduledTime)}`)}
            </div>
          </div>
          <div>
            <Dropdown
              overlay={menu}
              placement="bottomCenter"
              trigger={['click']}
            >
              <Button
                className="hover:border-emerald-500 hover:text-emerald-500 focus:border-emerald-500 focus:text-emerald-500"
                style={{ padding: '0 0.5rem', paddingBottom: '0.2rem' }}
              >
                <MoreOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
        <div>{FormattedTweetContent(tweetContent)}</div>
        {followupTweets.length > 0 && (
          <div>
            <Button
              type="text"
              className="p-0 text-emerald-600 font-bold hover:text-emerald-700 focus:text-emerald-700 focus:bg-transparent flex items-center"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              {isOpen ? 'Hide' : 'Show'} follow-up tweets{' '}
              {isOpen ? <UpOutlined /> : <DownOutlined />}
            </Button>
          </div>
        )}
      </div>
      {isOpen &&
        followupTweets.length > 0 &&
        followupTweets.map((followup) => (
          <div className="ml-8">
            <FollowupTweetCard
              key={followup.id}
              tweetContent={followup.content}
              tags={followup.tags}
            />
          </div>
        ))}
    </>
  );
};

export default TweetCard;
