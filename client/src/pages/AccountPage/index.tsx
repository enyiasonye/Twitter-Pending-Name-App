import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import TimezoneSelect from 'react-timezone-select';
import styled from 'styled-components';
import PrimaryButton from '../../shared/components/PrimaryButton';
import { UserSettings } from '../../store/commonTypes';
import { RootState, useAppDispatch } from '../../store/store';
import isEqual from 'lodash/isEqual';
import { updateSettings } from '../../store/thunks/userThunk';

const StyledContainer = styled.div`
  width: 50rem;
  margin: 1rem auto 0;
`;

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.auth.userProfile);
  const [canSave, setCanSave] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<UserSettings>({
    timezone: user?.settings?.timezone || '',
  });

  useEffect(() => {
    // If current and user settings same, cannot save
    setCanSave(!isEqual(user?.settings, currentSettings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSettings]);

  return (
    <StyledContainer>
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">Account Settings</h1>
        <PrimaryButton
          disabled={!canSave}
          onClick={() => {
            dispatch(
              updateSettings({
                updatedSettings: currentSettings,
                userId: user!.uid,
              }),
            );
            setCanSave(false);
          }}
        >
          Save
        </PrimaryButton>
      </div>
      <div className="mt-4 w-3/4">
        <h2 className="font-bold text-xl pb-2">Time Zone</h2>
        {/* UNSAFE error comes from react-select dependency */}
        <TimezoneSelect
          value={currentSettings.timezone}
          onChange={(timezone: { value: any }) => {
            setCurrentSettings({
              ...currentSettings,
              timezone: timezone.value,
            });
          }}
        />
      </div>
    </StyledContainer>
  );
};

export default AccountPage;
