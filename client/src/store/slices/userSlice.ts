import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authenticateUser } from '../thunks/userThunks';

interface UserProfile {
  name: String;
  screenName: String;
  twitterId: String;
  profileImageUrl: String;
}

interface UserSliceState {
  userProfile: UserProfile | null;
}

const initialState: UserSliceState = {
  userProfile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // setAttendanceStatusSuccess(
    //   state: EventState,
    //   action: PayloadAction<{ id: string; status: AttendanceStatusEnum }>,
    // ) {
    //   if (action.payload.status === AttendanceStatusEnum.CANT_GO) {
    //     return {
    //       ...state,
    //       eventsInvited: state.eventsInvited.filter(
    //         (event) => event.id !== action.payload.id,
    //       ),
    //     };
    //   }
    //   return {
    //     ...state,
    //     eventsInvited: state.eventsInvited.map((event) => {
    //       if (event.id === action.payload.id) {
    //         return { ...event, attendanceStatus: action.payload.status };
    //       }
    //       return event;
    //     }),
    //   };
    // },
    // setFilteredEvents(
    //   state: EventState,
    //   action: PayloadAction<EventsInvited[]>,
    // ) {
    //   return {
    //     ...state,
    //     filteredEventsInvited: action.payload,
    //   };
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(authenticateUser.fulfilled, (state, action) => {
      console.log('YEET');
      state.userProfile = action.payload;
    });
  },
});

// export const {
//   setAttendanceStatusSuccess,
//   setFilteredEvents,
// } = eventSlice.actions;
export default userSlice.reducer;
