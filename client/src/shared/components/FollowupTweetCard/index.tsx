import React from 'react';
import { Tag, Dropdown, Button, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { TagType } from '../../../store/commonTypes';

export interface FollowupTweetCardProps {
  tags: { type: TagType; value: string }[];
  tweetContent: string[];
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
        return <div>{paragraph}</div>;
      } else {
        return (
          <>
            <div>{paragraph}</div>
            <div className="border-l-4 w-px border-gray-200 ml-2 my-1 rounded-full h-8"></div>
          </>
        );
      }
    });
  }
};

const FollowupTweetCard: React.FC<FollowupTweetCardProps> = ({
  tags,
  tweetContent,
}) => {
  return (
    <div className="rounded-lg shadow-lg p-4 pr-4">
      <div className="flex justify-between">
        <div>
          {tags.map((tag) => CardTag(`${tag.value} ${tag.type}`))}
          {/* <div className="mb-2">{CardTag('@ 1:00 PM')}</div> */}
        </div>
        <div>
          <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
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
    </div>
  );
};

export default FollowupTweetCard;
