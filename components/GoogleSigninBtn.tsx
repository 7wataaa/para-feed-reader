import { styled } from 'linaria/lib/react';
import Image from 'next/image';
import { useState } from 'react';
import googleSigninLightDisabledPic from '../public/btn_google_signin_light/btn_google_signin_light_disabled_web2x.png';
import googleSigninLightFocusPic from '../public/btn_google_signin_light/btn_google_signin_light_focus_web2x.png';
import googleSigninLightNormalPic from '../public/btn_google_signin_light/btn_google_signin_light_normal_web2x.png';
import googleSigninLightPressedPic from '../public/btn_google_signin_light/btn_google_signin_light_pressed_web2x.png';

const lightPictures = {
  normal: googleSigninLightNormalPic,
  pressed: googleSigninLightPressedPic,
  focus: googleSigninLightFocusPic,
  disabled: googleSigninLightDisabledPic,
};

const GoogleSigninBtnImageStyle = styled.div`
  width: 250px;
  margin: 20px;
`;

interface LightGoogleSigninBtnProps {
  onClickHandler: () => Promise<void>;
}

const LightGoogleSigninBtn: React.FC<LightGoogleSigninBtnProps> = ({
  onClickHandler,
}) => {
  const [googleSigninBtnState, setGoogleSigninBtnState] = useState<
    'normal' | 'pressed' | 'focus' | 'disabled'
  >('normal');

  return (
    <GoogleSigninBtnImageStyle>
      <Image
        tabIndex={0}
        src={lightPictures[googleSigninBtnState]}
        alt="google signin button"
        width={382}
        height={92}
        onMouseDown={() => setGoogleSigninBtnState('pressed')}
        onMouseUp={() => setGoogleSigninBtnState('normal')}
        onBlur={() => setGoogleSigninBtnState('normal')}
        onClick={() => onClickHandler()}
      />
    </GoogleSigninBtnImageStyle>
  );
};

export { LightGoogleSigninBtn };
