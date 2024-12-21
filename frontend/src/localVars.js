//blue
import { keyframes } from '@chakra-ui/react';
export const bk1 = '#27374D';
export const bk2 = '#29435C';
export const btnScheme = 'cyan';

//blue 2
// export const bk1 = '#0A2647';
// export const bk2 = '#144272';
// export const btnScheme = 'cyan';

//dark
// export const bk1 = '#222831';
// export const bk2 = '#31363F';
// export const btnScheme = 'cyan';

export const gr1 = 'linear-gradient(22.5deg, rgb(84, 190, 204) 0%, rgb(84, 190, 204) 19%,rgb(89, 172, 188) 19%, rgb(89, 172, 188) 20%,rgb(94, 154, 171) 20%, rgb(94, 154, 171) 22%,rgb(99, 136, 155) 22%, rgb(99, 136, 155) 31%,rgb(105, 117, 138) 31%, rgb(105, 117, 138) 33%,rgb(66,97,121) 33%, rgb(66,97,121) 45%,rgb(40,78,103) 45%, rgb(40,78,103) 51%,rgb(41,67,92) 51%, rgb(41,67,92) 100%),linear-gradient(45deg, rgb(84, 190, 204) 0%, rgb(84, 190, 204) 19%,rgb(89, 172, 188) 19%, rgb(89, 172, 188) 20%,rgb(94, 154, 171) 20%, rgb(94, 154, 171) 22%,rgb(99, 136, 155) 22%, rgb(99, 136, 155) 31%,rgb(105, 117, 138) 31%, rgb(105, 117, 138) 33%,rgb(66,97,121) 33%, rgb(66,97,121) 45%,rgb(40,78,103) 45%, rgb(40,78,103) 51%,rgb(41,67,92) 51%, rgb(41,67,92) 100%)';
export const gr2 = 'linear-gradient(45deg, rgba(130, 89, 219, 0.2),rgba(44, 192, 226, 0.2),rgba(182, 103, 181, 0.2)),linear-gradient(135deg, rgb(38,55,77),rgb(41,67,92),rgb(29,142,171))';

export const categories = ['User', 'Account', 'Tool', 'Activation', 'Service', 'Key', 'Code']

export const textShadowPulse = keyframes`
  0% {
    text-shadow: 0.5px 0.5px 0px white, 0 0 2px white;
  }
  50% {
    text-shadow: 1px 1px 1px white, 0 0 5px white;
  }
  100% {
    text-shadow: 0.5px 0.5px 0px white, 0 0 2px white;
  }
`;

export const borderPulse = keyframes`
  0% {
    box-shadow: 0px 0px 0px cyan, 0 0 2px cyan;
  }
  50% {
    box-shadow: 0px 0px 5px cyan, 0 0 10px cyan;
  }
  100% {
    box-shadow: 0px 0px 0px cyan, 0 0 2px cyan;
  }
`;