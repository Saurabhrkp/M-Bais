import React from 'react';
import { Player, BigPlayButton } from 'video-react';

export default (props) => {
  return (
    <Player src={props.URL}>
      <BigPlayButton position='center' />
    </Player>
  );
};
