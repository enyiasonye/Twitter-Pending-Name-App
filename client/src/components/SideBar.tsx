import {
  CalendarOutlined,
  DownOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menu = (
  <Menu>
    <Menu.Item className="flex items-center">
      <SettingOutlined />
      <Link to="/account">Settings</Link>
    </Menu.Item>
    {/* <Menu.Item>
      <div>Post Now</div>
    </Menu.Item>
    <Menu.Item>
      <div>Delete</div>
    </Menu.Item> */}
  </Menu>
);

const SideBar = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, [location]);
  return (
    <div className="relative bg-white">
      <div className="flex flex-col sm:flex-row sm:justify-around">
        <div className="w-72 h-screen">
          <div className="mx-6 mt-10">
            <Link
              className="hover:text-black font-bold text-3xl"
              to="/dashboard"
            >
              twee<span className="text-emerald-500">thresh</span>
            </Link>
          </div>
          <nav className="mt-10 px-6 ">
            <Link
              className={`hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors duration-200  text-gray-600 rounded-lg ${
                location.pathname === '/dashboard' && 'bg-gray-100'
              }`}
              to="/dashboard"
            >
              <CalendarOutlined className="text-lg" />
              <span className="mx-4 text-lg font-normal">Queue</span>
              <span className="flex-grow text-right"></span>
            </Link>
            {/* <Link
              className="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors duration-200  text-gray-800 rounded-lg bg-gray-100"
              to="#"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="m-auto"
                viewBox="0 0 2048 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M685 483q16 0 27.5-11.5t11.5-27.5-11.5-27.5-27.5-11.5-27 11.5-11 27.5 11 27.5 27 11.5zm422 0q16 0 27-11.5t11-27.5-11-27.5-27-11.5-27.5 11.5-11.5 27.5 11.5 27.5 27.5 11.5zm-812 184q42 0 72 30t30 72v430q0 43-29.5 73t-72.5 30-73-30-30-73v-430q0-42 30-72t73-30zm1060 19v666q0 46-32 78t-77 32h-75v227q0 43-30 73t-73 30-73-30-30-73v-227h-138v227q0 43-30 73t-73 30q-42 0-72-30t-30-73l-1-227h-74q-46 0-78-32t-32-78v-666h918zm-232-405q107 55 171 153.5t64 215.5h-925q0-117 64-215.5t172-153.5l-71-131q-7-13 5-20 13-6 20 6l72 132q95-42 201-42t201 42l72-132q7-12 20-6 12 7 5 20zm477 488v430q0 43-30 73t-73 30q-42 0-72-30t-30-73v-430q0-43 30-72.5t72-29.5q43 0 73 29.5t30 72.5z"></path>
              </svg>
              <span className="mx-4 text-lg font-normal">Form</span>
              <span className="flex-grow text-right"></span>
            </Link> */}
            {/* <Link
              className="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors duration-200  text-gray-600 rounded-lg "
              to="#"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="m-auto"
                viewBox="0 0 2048 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M960 0l960 384v128h-128q0 26-20.5 45t-48.5 19h-1526q-28 0-48.5-19t-20.5-45h-128v-128zm-704 640h256v768h128v-768h256v768h128v-768h256v768h128v-768h256v768h59q28 0 48.5 19t20.5 45v64h-1664v-64q0-26 20.5-45t48.5-19h59v-768zm1595 960q28 0 48.5 19t20.5 45v128h-1920v-128q0-26 20.5-45t48.5-19h1782z"></path>
              </svg>
              <span className="mx-4 text-lg font-normal">Commerce</span>
              <span className="flex-grow text-right">
                <button
                  type="button"
                  className="w-6 h-6 text-xs  rounded-full text-white bg-red-500"
                >
                  <span className="p-1">7</span>
                </button>
              </span>
            </Link> */}
            <Dropdown
              overlay={menu}
              placement="bottomCenter"
              trigger={['click']}
            >
              <Button
                type="text"
                className="flex items-center p-2 my-6 transition-colors duration-200  text-gray-600 rounded-lg w-full"
              >
                <UserOutlined className="text-lg mr-2" />
                <span className="mx-4 text-lg font-normal">Account</span>
                <span className="flex-grow text-right">
                  <DownOutlined className="text-lg" />
                </span>
              </Button>
            </Dropdown>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
