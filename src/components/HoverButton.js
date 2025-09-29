import { Button } from '@mui/material';

import { styled } from '@mui/material/styles';



const HoverButton = styled(Button)`
  background: linear-gradient(135deg, #66CCFF 0%, #3399FF 100%);
  color: white;
  border: none;
  boxShadow: '0 4px 15px rgba(51, 153, 255, 0.3)';
  transition: all 0.3s ease-in-out;
  
  &:hover {
    background: linear-gradient(135deg, #3399FF 0%, #1E90FF 100%);
    boxShadow: '0 6px 20px rgba(51, 153, 255, 0.4)';
  }
`;

export default HoverButton