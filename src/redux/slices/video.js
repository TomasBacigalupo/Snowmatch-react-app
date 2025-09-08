import { createSlice } from '@reduxjs/toolkit';
import { utcToLocalDate } from 'src/utils/dateUtils';
// utils
import axios from '../../utils/axios';
import * as axios2 from 'axios';        // The default axios instance
//
import { dispatch } from '../store';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    isLoadingExists: false,
    isLoadingCredits: false,
    isUploading: false,
    isLoadingReview: false,
    isLoadingProCheck: false,
    isCountLoading: false,
    analizeExists: false,
    loadingPayment: false,
    error: null,
    bookings: [],
    booking: null,
    isOpenModal: false,
    selectedBookingId: null,
    pendingBookings: [],
    upcomingBookings: [],
    message: null,
    adults: 1,
    children: 0,
    bookSuccess: false,
    events: [],
    assignedStudents: [],
    preferenceId:'',
    createBookingError: false,
    videos: [],
    progress: 0,
    leaders: [],
    isLoadingLeaderBoard: false,
    commentedCount: 0,
    isCountLoading: false,
    totalHours: 0
};

const slice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },

        startLoadingCredits(state) {
            state.isLoadingCredits = true;
        },

        startLoadingLeaderBoard(state) {
            state.isLoadingLeaderBoard = true;
        },

        startLoadingReview(state) {
            state.isLoadingReview = true;
        },
        startLoadingProCheck(state) {
            state.isLoadingProCheck = true;
        },

        stopLoadingReview(state) {
            state.isLoadingReview = false;
        },

        stopLoadingProCheck(state, action) {
            const id = action.payload;
            state.videos = state.videos.map(video => {
                if(video.id = id){
                    return {
                        ...video,
                        proCheck: true
                    }
                }
                return video
            })
            state.isLoadingProCheck = false;
        },

        // LIKE VIDEO SUCCESS
        likeVideoSuccess(state, action) {
            const { videoId, isLiked, likesCount } = action.payload;
            state.videos = state.videos.map(video => {
                if (video.id === videoId) {
                    return {
                        ...video,
                        likedByCurrentUser: isLiked,
                        likesCount: likesCount
                    };
                }
                return video;
            });
        },

        // ADD COMMENT SUCCESS
        addCommentSuccess(state, action) {
            const { videoId, comment } = action.payload;
            console.log('Adding comment to video:', videoId, comment);
            state.videos = state.videos.map(video => {
                if (video.id === videoId) {
                    return {
                        ...video,
                        videoComments: [...(video.videoComments || []), comment]
                    };
                }
                return video;
            });
            console.log('Updated videos state:', state.videos);
        },

        // DELETE COMMENT SUCCESS
        deleteCommentSuccess(state, action) {
            const { videoId, commentId } = action.payload;
            console.log('Deleting comment from video:', videoId, commentId);
            state.videos = state.videos.map(video => {
                if (video.id === videoId) {
                    return {
                        ...video,
                        videoComments: video.videoComments.filter(comment => comment.id !== commentId)
                    };
                }
                return video;
            });
            console.log('Updated videos state after comment deletion:', state.videos);
        },

        // SET VIDEOS SUCCESS
        setVideosSuccess(state, action) {
            state.videos = action.payload;
        },

        // ADD MORE VIDEOS SUCCESS
        addMoreVideosSuccess(state, action) {
            state.videos = [...state.videos, ...action.payload];
        },

         startLoadingExists(state) {
            state.isLoadingExists = true;
        },

        startLoadingPayment(state) {
            state.loadingPayment = true;
        },

        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        acceptBookingSuccess(state, action) {
            const bookinId = action.payload;
            state.pendingBookings = state.pendingBookings.filter((booking) => booking.id !== bookinId);
            state.isLoading = false;
        },

        // GET BOOKINGS
        getBookingsSuccess(state, action) {
            state.isLoading = false;
            state.bookings = action.payload;
        },

        // GET UPCOMING BOOKINGS
        getUpcomingBookingsSuccess(state, action) {
            state.isLoading = false;
            state.upcomingBookings = action.payload;
        },

        // GET BOOKING
        getBookingSuccess(state, action) {
            state.isLoading = false;
            state.booking = action.payload;
        },

        // CREATE EVENT
        createEventSuccess(state, action) {
            const newEvent = action.payload;
            state.isLoading = false;
            console.log(newEvent)
            console.log(state.events)
            state.events = [...state.events, {
                ...newEvent,
                start: newEvent.start.toDate(),
                end: newEvent.end.toDate()
            }];
        },

        // UPDATE EVENT
        updateEventSuccess(state, action) {
            const event = action.payload;
            const updateEvents = state.events.map((_event, i) => {
                if (_event.id === event.id) {
                    return {
                        ...event,
                        start: event.start.toDate(),
                        end: event.end.toDate()
                    };
                }
                return _event;
            });
            state.isLoading = false;
            state.events = updateEvents;
        },

        // PAYED LESSON
        payLessonSuccess(state, action) {
            const { eventId } = action.payload
            state.isLoadingPayment = false;
            state.lesson = { ...state.lesson, payed: true }
            const updateEvents = state.events.map((_event, i) => {
                if (_event.id === eventId) {
                    return {
                        ..._event,
                        payed: true
                    };
                }
                return _event;
            });
            state.isLoading = false;
            state.events = updateEvents;
        },

        // UNPAID LESSON
        unpaidLessonSuccess(state, action) {
            const eventId = action.payload
            state.isLoadingPayment = false;
            state.lesson = { ...state.lesson, payed: true };
            const updateEvents = state.events.map((_event, i) => {
                if (_event.id === eventId) {
                    return {
                        ..._event,
                        payed: true
                    };
                }
                return _event;
            });
            state.isLoading = false;
            state.events = updateEvents;
        },

        //DECLINED LESSON SUCCESS
        declinedLessonSuccess(state, action) {
            const eventId = action.payload
            state.isLoadingPayment = false;
            state.lesson = { ...state.lesson, state: 'DECLINED' };
            const updateEvents = state.events.map((_event, i) => {
                if (_event.id === eventId) {
                    return {
                        ..._event,
                        state: 'DECLINED'
                    };
                }
                return _event;
            });
            state.isLoading = false;
            state.events = updateEvents;
        },

        // ACCEPTED LESSON SUCCESS
        acceptedLessonSuccess(state, action) {
            const eventId = action.payload
            state.isLoadingPayment = false;
            state.lesson = { ...state.lesson, state: 'ACCEPTED' };
            const updateEvents = state.events.map((_event, i) => {
                if (_event.id === eventId) {
                    return {
                        ..._event,
                        state: 'ACCEPTED'
                    };
                }
                return _event;
            });
            const updatedLessons = state.lessons.map((_event, i) => {
                if (_event.id === eventId) {
                    return {
                        ..._event,
                        state: 'ACCEPTED'
                    };
                }
                return _event;
            });
            state.lessons = updatedLessons;
            state.isLoading = false;
            state.events = updateEvents;
        },

        // SELECT EVENT
        selectEvent(state, action) {
            const eventId = action.payload;
            state.selectedEventId = eventId;
            state.isOpenModal = true;
            state.selectedEventId = eventId;
        },

        // CRATED PREFERENCE
        cratePreferenceSuccess(state, action) {
            const preferenceId = action.payload;
            state.preferenceId = preferenceId;
            state.loadingPayment = false
        },

        // CHANGE MESSAGE
        changeMessage(state, action) {
            const message = action.payload;
            state.message = message;
        },

        changeAdults(state, action) {
            const adults = action.payload;
            state.adults = adults;
        },

        changeChildren(state, action) {
            const children = action.payload;
            state.children = children;
        },

        changeAsignedStudents(state, action) {
            state.assignedStudents = action.payload;
        },

        createBookingSuccess(state, action) {
            state.isLoading = false;
            state.loadingPayment = false;
            state.bookSuccess = true;
        },

        onCreateBookingError(state, action) {
            state.isLoading = false;
            state.loadingPayment = false;
            state.bookSuccess = false;
            state.createBookingError = true;
        },

        bookingPending(state, action) {
            state.isLoading = false;
            state.bookSuccess = false;
        },

        getEventsSuccess(state, action) {
            state.isLoading = false;
            state.events = action.payload;
        },

        getVideosSuccess(state, action) {
            state.isLoading = false;
            state.videos = action.payload;
        },
        
        addCreditsSuccess(state, action) {
            state.isLoadingCredits = false;
            state.credits = action.payload;
        },

        getLeaderBoardSuccess(state, action) {
            state.isLoadingLeaderBoard = false;
            state.leaders = action.payload;
        },

        getVideosToReviewSuccess(state, action) {
            state.isLoading = false;
            state.videosToReview = action.payload;
        },

        createVideoSuccess(state, action) {
            state.isLoading = false;
            state.isUploading = false;
        },

        existsVideoSuccess(state, action) {
            state.isLoadingExists = false;
            state.analizeExists = action.payload;
        },

        updateUploadProgress(state, action) {
            state.progress = action.payload;
        },

        clearUploadVideoState(state) {
            state.isLoading = false;
            state.isUploading = false;
        },

        getCommentedCountSuccess(state, action) {
            state.isCountLoading = false;
            state.commentedCount = action.payload;
        },

        getTotalHoursSuccess(state, action) {
            state.isCountLoading = false;
            state.totalHours = action.payload;
        }
    },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, changeMessage, bookingPending, changeAsignedStudents, onCreateBookingError, clearUploadVideoState } = slice.actions;

// ----------------------------------------------------------------------

export function getVideos() {
    return async () => {
        const accessToken = window.localStorage.getItem('accessToken');
        if (!accessToken) {
            dispatch(slice.actions.hasError(new Error('No authentication token found')));
            return;
        }

        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/videos/my-videos`);
            const videos = response.data
            dispatch(slice.actions.getVideosSuccess(videos));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addCredits(id, credits) {
    return async () => {
        dispatch(slice.actions.startLoadingCredits());
        try {
            const response = await axios.put(`/api/credits/pro/${id}?credits=${credits}`);
            const videos = response.data
            dispatch(slice.actions.addCreditsSuccess(videos));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getLeaderBoard(course) {
    return async () => {
        dispatch(slice.actions.startLoadingLeaderBoard());
        try {
            const response = await axios.get(`/api/videos/leaderboard?course=${course}`);
            const leaders = response.data
            dispatch(slice.actions.getLeaderBoardSuccess(leaders));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getVideosToReview() {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/videos/filtered?proCheckRequested=true&reviewed=false`);
            const videos = response.data
            dispatch(slice.actions.getVideosToReviewSuccess(videos));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function reviewVideo(data) {
    return async () => {
        const {id} = data;
        try {
            dispatch(slice.actions.startLoadingReview());
            await axios.post(`/api/videos/${id}/comments/ai`, data);
            dispatch(slice.actions.stopLoadingReview());
            dispatch(getVideosToReview())
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function proCheck(id) {
    return async () => {
        try {
            dispatch(slice.actions.startLoadingProCheck());
            await axios.put(`/api/videos/${id}/proCheck`);
            dispatch(slice.actions.stopLoadingProCheck(id));
            // dispatch(getVideos())
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            dispatch(slice.actions.stopLoadingProCheck(0));
        }
    };
}

// ----------------------------------------------------------------------

export function likeVideo(videoId, isLiked) {
    return async () => {
        try {
            // Make API call to like/unlike the video
            if (isLiked) {
                // Like action - POST request
                await axios.post(`/api/videos/${videoId}/like`);
            } else {
                // Unlike action - DELETE request
                await axios.delete(`/api/videos/${videoId}/like`);
            }
            
            // The API response should return the updated video data
            // For now, we'll let the component handle the optimistic update
            // and the API call will sync the state
            
        } catch (error) {
            console.error('Error liking video:', error);
            dispatch(slice.actions.hasError(error));
            // Revert the optimistic update on error
            throw error;
        }
    };
}

// ----------------------------------------------------------------------

export function addVideoComment(videoId, commentText) {
    return async () => {
        try {
            console.log('Adding comment to video:', videoId, commentText);
            // Make API call to add comment
            const response = await axios.post(`/api/videos/${videoId}/comments`, {
                comment: commentText
            });
            
            console.log('Comment API response:', response.data);
            
            // Update the state with the new comment
            dispatch(slice.actions.addCommentSuccess({
                videoId,
                comment: response.data
            }));
            
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            dispatch(slice.actions.hasError(error));
            throw error;
        }
    };
}

// ----------------------------------------------------------------------

export function deleteVideoComment(videoId, commentId) {
    return async () => {
        try {
            console.log('Deleting comment from video:', videoId, commentId);
            // Make API call to delete comment
            const response = await axios.delete(`/api/videos/comment/${commentId}`);
                        
            // Update the state by removing the deleted comment
            dispatch(slice.actions.deleteCommentSuccess({
                videoId,
                commentId
            }));
            
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error);
            dispatch(slice.actions.hasError(error));
            throw error;
        }
    };
}

// ----------------------------------------------------------------------

export function fetchFeedVideos(page = 0, pageSize = 5) {
    return async () => {
        try {
            const response = await axios.get(`/api/videos/feed?page=${page}&pageSize=${pageSize}`);
            const videos = response.data;
            
            if (page === 0) {
                // First page - replace all videos
                dispatch(slice.actions.setVideosSuccess(videos));
            } else {
                // Subsequent pages - add to existing videos
                dispatch(slice.actions.addMoreVideosSuccess(videos));
            }
            
            return videos;
        } catch (error) {
            console.error('Error fetching feed videos:', error);
            dispatch(slice.actions.hasError(error));
            throw error;
        }
    };
}


// ----------------------------------------------------------------------

export function getLessonById(id) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const responseEvent = await axios.get(`/api/events/lessons/byId/${id}`);
            dispatch(slice.actions.getLessonSuccess(responseEvent.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function changeProfilePicture(picture, callBack) {
    return async () => {
      try {
        const signedUrl = await axios.get(`/api/images/preSignedUrlImage`)
        // Upload at URL
        await fetch(signedUrl.data, {
          method: 'PUT',
          headers: {
            "Content-Type": picture.type,
          },
          body: picture
        });
  
      } catch (error) {
        console.error(error)
        callBack(false)
      }
      callBack(true)
    }
  }

export function createVideo(video, course, latitude, longitude) {
    return async () => {
        try {
            console.log('video.type', video.type)
            console.log('course 1', course)
            console.log('latitude', latitude)
            console.log('longitude', longitude)
            dispatch(slice.actions.startLoading());
            const response = await axios.post('/api/videos',{
                course: course,
                latitude: latitude,
                longitude: longitude
            });
            const presignedUrl = response.data.videoUrl;

            console.log("presignedUrl 1", presignedUrl)

            // change the presigned url from https to http
            // because the presigned url is not working with https
            // so we need to change it to http
            const httpPresignedUrl = presignedUrl // presignedUrl.replace('https', 'http');
            
            await fetch(httpPresignedUrl, {
                method: 'PUT',
                headers: {
                  "Content-Type": video.type,
                },
                body: video
              });

            dispatch(slice.actions.createVideoSuccess());
            return response;
        } catch (error) {
            console.log("error", error.message)
            return error;
        }
    };
}

export function videoExists(bucket, key) {
    return async () => {
        try {
            dispatch(slice.actions.startLoadingExists());
            const response = await axios.get(`/api/videos/exists?bucket=${bucket}&key=${key}`);
            dispatch(slice.actions.existsVideoSuccess(response.data.exists));
            console.log(response)
        } catch (error) {

            console.log("error", error.message)
            return error;
        }
    };
}

export function createVideoMultipart(video, course, location = null) {
    return async (dispatch) => {
      try {
        console.log("video.type", video.type);
        console.log("course 1", course);
        console.log("location", location);
  
        dispatch(slice.actions.startLoading());
  
        // 1️⃣ Solicitar URL pre-firmada
        const response = await axios.post("/api/videos", {
          course: course,
          location: location,
        });
  
        const presignedUrl = response.data.videoUrl;
        console.log("presignedUrl", presignedUrl);
  
        // 2️⃣ Crear FormData para multipart upload
        const formData = new FormData();
        formData.append("file", video);
  
        const axiosInstance = axios2.create();

        // 3️⃣ Subir el archivo con seguimiento de progreso
        await axiosInstance.put(presignedUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(slice.actions.updateUploadProgress(progress));
            console.log(`Upload Progress: ${progress}%`);
          },
        });
  
        dispatch(slice.actions.createVideoSuccess());
        return response;
      } catch (error) {
        console.log("error", error);
        dispatch(slice.actions.uploadFailed(error.message));
        return error;
      }
    };
  }

function addUtcOffset(dateString) {
    const date = new Date(dateString);
    const utcOffset = date.getTimezoneOffset() * 60000; // Get the UTC offset in milliseconds
    const adjustedDate = new Date(date.getTime() - utcOffset);
    return adjustedDate.toISOString(); // Convert back to the ISO 8601 format for consistency
}


// ----------------------------------------------------------------------

export function getCommentedCount() {
    return async () => {
        try {
            const response = await axios.get(`/api/videos/comments/user/count`);
            dispatch(slice.actions.getCommentedCountSuccess(response?.data?.count || 0));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getTotalHours() {
    return async () => {
        try {
            const response = await axios.get(`/api/events/teachers/hours`);    
            dispatch(slice.actions.getTotalHoursSuccess(response?.data?.totalHours || 0));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}



// ----------------------------------------------------------------------

export function updateEvent(eventId, updateEvent) {
    return async () => {
        const start = addUtcOffset(updateEvent.start); // Adjust start time with UTC offset
        const end = addUtcOffset(updateEvent.end); // Adjust end time with UTC offset
        //dispatch(slice.actions.startLoading());
        try {
            const response = await axios.put(`/api/events/byId/${eventId}`, {
                ...updateEvent,
                start,
                end
            });
            dispatch(slice.actions.updateEventSuccess({ ...updateEvent, id: eventId, start, end }));
            return response;
        } catch (error) {
            //dispatch(slice.actions.hasError(error));
            return error;
        }
    };
}

export function updateEventByUserIdAndEventId(userId, eventId, updatedEvent) {
    const start = addUtcOffset(updatedEvent.start); // Adjust start time with UTC offset
    const end = addUtcOffset(updatedEvent.end); // Adjust end time with UTC offset
    return async () => {
        //dispatch(slice.actions.startLoading());
        try {
            const response = await axios.put(`/api/admin/user/${userId}/event/${eventId}`, { ...updatedEvent, start, end });
            dispatch(slice.actions.updateEventSuccess({ ...updatedEvent, id: eventId }));
            return response;
        } catch (error) {
            //dispatch(slice.actions.hasError(error));
            return error;
        }
    };
}




export function getUpcomingEvents() {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/api/events/');

            const events = response.data.map(e => {
                return {
                    ...e,
                    start: utcToLocalDate(e.start),
                    end: utcToLocalDate(e.end)
                };
            });

            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            const totomorrow = new Date(today)
            totomorrow.setDate(totomorrow.getDate() + 2)


            const a1 = events.filter(e => e.start.toDateString() === today.toDateString() || (e.start <= today && today <= e.end) || e.end.toDateString() === today.toDateString());
            const a2 = events.filter(e => e.start.toDateString() === tomorrow.toDateString() || (e.start <= tomorrow && tomorrow <= e.end) || e.end.toDateString() === tomorrow.toDateString());
            const a3 = events.filter(e => e.start.toDateString() === totomorrow.toDateString() || (e.start <= totomorrow && totomorrow <= e.end) || e.end.toDateString() === totomorrow.toDateString());


            dispatch(slice.actions.getUpcomingEventsSuccess([a1, a2, a3]));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function setUnpaid(eventId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.put(`/api/events/byId/${eventId}/unpaid`);
            dispatch(slice.actions.unpaidLessonSuccess({ eventId }));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function setPaid(eventId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.put(`/api/events/byId/${eventId}/pay`);
            dispatch(slice.actions.paidLessonSuccess({ eventId }));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setAccepted(eventId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.put(`/api/events/lessons/${eventId}/accept`);
            dispatch(slice.actions.acceptedLessonSuccess({ eventId }));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
 
export function createBooking(teacherId, message, children, adults, events, totalPrice) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.post(`/api/bookings`, {
                teacherId: teacherId,
                userComment: message,
                events: events.map(e => {
                    if (e.lessonTime === 'AFTERNOON') {

                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                            lessonTime: 'AFTERNOON'
                        }
                    }
                    if (e.lessonTime === 'MORNING') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(13, 0, 0, 0)),
                            lessonTime: 'MORNING'
                        }
                    }
                    if (e.lessonTime === 'MORNING_2HS') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(12, 0, 0, 0)),
                            lessonTime: 'MORNING_2HS'
                        }
                    }
                    if (e.lessonTime === 'AFTERNOON_2HS') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(16, 0, 0, 0)),
                            lessonTime: 'AFTERNOON_2HS'
                        }
                    }
                    return {
                        ...e,
                        start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                        end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                    }
                }),
                children: children,
                adults: adults,
                totalPrice: totalPrice,
                payedReservation: totalPrice * 0.2,
            });
            dispatch(slice.actions.createBookingSuccess());
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function createAdminBooking(teacherId, studentId, message, children, adults, events, totalPrice) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.post(`/api/bookings/business?businessId=13`, {
                teacher: {id: teacherId},
                student: {id: studentId},
                userComment: message,
                eventList: events.map(e => {
                    if (e.lessonTime === 'AFTERNOON') {

                        return {
                            ...e,
                            start: dayjs(e.start),
                            end: dayjs(e.start),
                            lessonTime: 'AFTERNOON'
                        }
                    }
                    if (e.lessonTime === 'MORNING') {
                        return {
                            ...e,
                            start:dayjs(e.start),
                            end: dayjs(e.start),
                            lessonTime: 'MORNING'
                        }
                    }
                    if (e.lessonTime === 'MORNING_2HS') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(12, 0, 0, 0)),
                            lessonTime: 'MORNING_2HS'
                        }
                    }
                    if (e.lessonTime === 'AFTERNOON_2HS') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(16, 0, 0, 0)),
                            lessonTime: 'AFTERNOON_2HS'
                        }
                    }
                    return {
                        ...e,
                        start: dayjs(e.start),
                        end: dayjs(e.start),
                        lessonTime: 'ALL_DAY'
                    }
                }),
                children: children,
                adults: adults,
                totalPrice: totalPrice,
                price: totalPrice,
            });
            dispatch(slice.actions.createBookingSuccess());
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}




export function bookingAndPay(teacherId, message, children, adults, events, totalPrice, formData) {
    return async () => {
        console.log({ formData })
        dispatch(slice.actions.startLoadingPayment());
        try {
            await axios.post(`/api/bookings/bookAndPay?amount=${formData.transaction_amount}&token=${formData.token}&holderEmail=${formData.payer.email}&holderIdType=${formData.payer.identification.type}&holderId=${formData.payer.identification.number}&paymentMethodId=${formData.payment_method_id}&installments=${formData.installments}`, {
                teacherId: teacherId,
                userComment: message,
                events: events.map(e => {
                    if (e.lessonTime === 'AFTERNOON') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                            lessonTime: 'AFTERNOON'
                        }
                    }
                    if (e.lessonTime === 'MORNING') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(13, 0, 0, 0)),
                            lessonTime: 'MORNING'
                        }
                    }
                    if (e.lessonTime === 'MORNING_2HS') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(12, 0, 0, 0)),
                            lessonTime: 'MORNING_2HS'
                        }
                    }
                    if (e.lessonTime === 'AFTERNOON_2HS') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(16, 0, 0, 0)),
                            lessonTime: 'AFTERNOON_2HS'
                        }
                    }
                    return {
                        ...e,
                        start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                        end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                    }
                }),
                children: children,
                adults: adults,
                totalPrice: totalPrice,
                payedReservation: totalPrice * 0.2,
            });
            dispatch(slice.actions.createBookingSuccess());
        } catch (error) {
            dispatch(slice.actions.onCreateBookingError(error));
        }
    };
}

export function bookingAndPayProduct(productId, message, children, adults, events, totalPrice, formData) {
    return async () => {
        console.log({ formData })
        dispatch(slice.actions.startLoadingPayment());
        try {
            await axios.post(`/api/bookings/bookAndPayProduct?amount=${formData.transaction_amount}&token=${formData.token}&holderEmail=${formData.payer.email}&holderIdType=${formData.payer.identification.type}&holderId=${formData.payer.identification.number}&paymentMethodId=${formData.payment_method_id}&installments=${formData.installments}`, {
                productId: productId,
                userComment: message,
                events: events.map(e => {
                    if (e.lessonTime === 'AFTERNOON') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                            lessonTime: 'AFTERNOON'
                        }
                    }
                    if (e.lessonTime === 'MORNING') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(13, 0, 0, 0)),
                            lessonTime: 'MORNING'
                        }
                    }
                    if (e.lessonTime === 'MORNING_2HS') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(12, 0, 0, 0)),
                            lessonTime: 'MORNING_2HS'
                        }
                    }
                    if (e.lessonTime === 'AFTERNOON_2HS') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(16, 0, 0, 0)),
                            lessonTime: 'AFTERNOON_2HS'
                        }
                    }
                    return {
                        ...e,
                        start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                        end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                    }
                }),
                children: children,
                adults: adults,
                totalPrice: totalPrice,
                payedReservation: totalPrice * 0.2,
            });
            dispatch(slice.actions.createBookingSuccess());
        } catch (error) {
            dispatch(slice.actions.onCreateBookingError(error));
        }
    };
}

export function acceptAndPay(bookingId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.post(`/api/bookings/bookAndPay/accept/${bookingId}`);
            dispatch(slice.actions.acceptBookingSuccess(bookingId));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setDeclined(eventId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.put(`/api/events/lessons/${eventId}/decline`);
            dispatch(slice.actions.declinedLessonSuccess({ eventId }));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getEventsByUserId(id) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/admin/user/${id}/event?page=1&size=300`);

            const events = response.data.map(e => {
                const dateStart = new Date(e.start);
                const dateEnd = new Date(e.end);
                const utcOffset = dateStart.getTimezoneOffset() * 60000; // Get the UTC offset in milliseconds
                const adjustedDateStart = new Date(dateStart.getTime() + utcOffset);
                const adjustedDateEnd = new Date(dateEnd.getTime() + utcOffset);
                if (e?.source === 'APP' && e.eventType === "CLASS") {
                    return {
                        ...e,
                        title: e.title ?? 'Match',
                        name: 'Clase Solicitada',
                        description: e.description ?? 'Un usuario ah solicitado una clase este dia',
                        start: adjustedDateStart,
                        end: adjustedDateEnd,
                        textColor: e.textColor ?? "#FFC107",
                        type: "App class",
                        price: Number(e.price)
                    };
                }
                if (e?.source === 'PRODUCT' && e.eventType === "CLASS") {
                    let title = e.title
                    if (e.title === 'PRIVATE_FULL_DAY') {
                        title = 'Clase privada día completo'
                    }
                    if (e.title === 'PRIVATE_HALF_DAY') {
                        title = 'Clase privada medio día'
                    }

                    return {
                        ...e,
                        title: title,
                        description: 'Evento creado a partir de un producto',
                        start: adjustedDateStart,
                        end: adjustedDateEnd,
                        textColor: "#00AB55",
                        type: "App class"
                    };
                }
                return {
                    ...e,
                    start: adjustedDateStart,
                    end: adjustedDateEnd
                };
            })
            dispatch(slice.actions.getEventsSuccess(events));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getEventsByTeacherId(id, month) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/events/byUser/${id}?page=1&size=300&month=${month}`);

            const events = response.data.map(e => {
                const dateStart = new Date(e.start);
                const dateEnd = new Date(e.end);
                const utcOffset = dateStart.getTimezoneOffset() * 60000; // Get the UTC offset in milliseconds
                const adjustedDateStart = new Date(dateStart.getTime() + utcOffset);
                const adjustedDateEnd = new Date(dateEnd.getTime() + utcOffset);
                if (e?.source === 'APP' && e.eventType === "CLASS") {

                    return {
                        ...e,
                        title: 'Match',
                        name: 'Match',
                        description: e.description ?? 'Un usuario ah solicitado una clase este dia',
                        start: adjustedDateStart,
                        end: adjustedDateEnd,
                        textColor: e.textColor ?? "#FFC107",
                        type: "App class",
                        price: Number(e.price)
                    };
                }
                if (e?.source === 'PRODUCT' && e.eventType === "CLASS") {
                    let title = e.title
                    if (e.title === 'PRIVATE_FULL_DAY') {
                        title = 'Clase privada día completo'
                    }
                    if (e.title === 'PRIVATE_HALF_DAY') {
                        title = 'Clase privada medio día'
                    }

                    return {
                        ...e,
                        title: title,
                        description: 'Evento creado a partir de un producto',
                        start: adjustedDateStart,
                        end: adjustedDateEnd,
                        textColor: "#00AB55",
                        type: "App class"
                    };
                }
                return {
                    ...e,
                    start: adjustedDateStart,
                    end: adjustedDateEnd
                };
            })
            dispatch(slice.actions.getEventsSuccess(events));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function createPreference(teacherId, events) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.post(`/api/pay/createPreference`, {
                teacherId: teacherId,
                events: events.map(e => {
                    if (e.lessonTime === 'AFTERNOON') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                            lessonTime: 'AFTERNOON'
                        }
                    }
                    if (e.lessonTime === 'MORNING') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(13, 0, 0, 0)),
                            lessonTime: 'MORNING'
                        }
                    }
                    if (e.lessonTime === 'MORNING_2HS') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(12, 0, 0, 0)),
                            lessonTime: 'MORNING_2HS'
                        }
                    }
                    if (e.lessonTime === 'AFTERNOON_2HS') {
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(16, 0, 0, 0)),
                            lessonTime: 'AFTERNOON_2HS'
                        }
                    }
                    return {
                        ...e,
                        start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                        end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                    }
                })
            });
            dispatch(slice.actions.cratePreferenceSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
