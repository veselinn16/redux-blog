import _ from 'lodash';
import jsonPlaceholder from '../apis/jsonPlaceholder';

// jumbo action creator
export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  // redux-thunk runs the function and await waits for the network request to finish
  await dispatch(fetchPosts());

  //returns an array of the unique userId's
  // const userIds = _.uniq(_.map(getState().posts, 'userId'));
  
  // // no need for await because now we have posts, which include all user ids
  // userIds.forEach(id => {
  //   dispatch(fetchUser(id))
  // });

  // The above code refactored to use lodash's chain() method. The value() is used to trigger the chain of functions. Without it, it would not run!
  _.chain(getState().posts)
    .map('userId')
    .uniq()
    .forEach(id => dispatch(fetchUser(id)))
    .value()
}

export const fetchPosts = () => async dispatch => {
  const response = await jsonPlaceholder.get('/posts');
  
  dispatch({
    type: 'FETCH_POSTS',
    payload: response.data
  });
}

export const fetchUser = id => async dispatch => {
  const response = await jsonPlaceholder.get(`/users/${id}`);

  dispatch({
    type: 'FETCH_USER',
    payload: response.data
  })
}

// // function that returns a function, that calls a private function with the id and dispatch passed to it
// export const fetchUser = id => dispatch => _fetchUser(id, dispatch);

// // fetches users only one time!
// const _fetchUser = _.memoize(async (id, dispatch) => {
//   const response = await jsonPlaceholder.get(`/users/${id}`);

//   dispatch({
//     type: 'FETCH_USER',
//     payload: response.data
//   })
// });