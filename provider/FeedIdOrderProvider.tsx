import axios from 'axios';
import React, { useState } from 'react';

// FeedIdOrderContextの第2引数に関数がセットされていない状態で呼び出されたとき用の関数
const throwError = () => {
  throw Error('It is not enclosed in a FeedIdOrderProvider');
};

interface SetFeedIdOrderOption {
  isSend: boolean;
}

type SetFeedIdOrderType = (
  ids: string[],
  option?: SetFeedIdOrderOption
) => void;

// [フィードIDs, setフィードIDs] をFeedIdOrderProvider内のコンポーネントに提供する
const FeedIdOrderContext = React.createContext<
  [string[] | null, SetFeedIdOrderType]
>([null, throwError]);

// FeedIdOrderContextの初期設定を行うProvider
const FeedIdOrderProvider: React.FC = ({ children }) => {
  const [feedIdOrder, _setFeedIdOrder] = useState<string[] | null>(null);

  // APIへの登録と表示の更新を行う関数
  const setFeedIdOrder: SetFeedIdOrderType = (ids, option) => {
    if (option?.isSend ?? false) {
      console.log('send ' + ids);
      axios.post('/api/feeds/subscribing', {
        subscribingFeedIdOrder: ids,
      });
    } else {
      console.log("don't send " + ids);
    }

    _setFeedIdOrder(ids);
  };

  return (
    <FeedIdOrderContext.Provider value={[feedIdOrder, setFeedIdOrder]}>
      {children}
    </FeedIdOrderContext.Provider>
  );
};

export { FeedIdOrderContext, FeedIdOrderProvider };
