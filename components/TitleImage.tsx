import { styled } from 'linaria/lib/react';
import Image from 'next/image';
import paraFeedReaderPic from '../public/para_feed_reader.png';

const TitleImageStyle = styled.div`
  margin: 50px 0;
`;

const TitleImage = () => {
  return (
    <TitleImageStyle>
      <Image
        src={paraFeedReaderPic}
        width={960}
        height={540}
        alt="para feed reader"
        priority
      />
    </TitleImageStyle>
  );
};

export { TitleImage };
