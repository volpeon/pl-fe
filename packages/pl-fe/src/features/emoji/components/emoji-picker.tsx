import { Picker as EmojiPicker, init } from 'emoji-mart';
import React, { useRef, useEffect } from 'react';

import { joinPublicPath } from 'pl-fe/utils/static';

import data from '../data';

const spritesheets = import.meta.glob<{ default: string }>('/node_modules/emoji-datasource/sheet_*_64.png', { eager: true });

const getSpritesheetURL = (set: string) => spritesheets[`/node_modules/emoji-datasource/sheet_${set}_64.png`].default;

const getImageURL = (set: string, name: string) => joinPublicPath(`/packs/emoji/${name}.svg`);

const Picker: React.FC<any> = (props) => {
  const ref = useRef(null);

  useEffect(() => {
    const input = { ...props, data, set: 'google', ref, autoFocus: true, getImageURL, getSpritesheetURL };

    new EmojiPicker(input);
  }, []);

  return <div ref={ref} />;
};

export { Picker as default };
