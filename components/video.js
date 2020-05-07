import React from 'react';

export default (props) => {
  return (
    <video width='80%' controls>
      <source src={props.URL} />
      Your browser does not support HTML video.
    </video>
  );
};
