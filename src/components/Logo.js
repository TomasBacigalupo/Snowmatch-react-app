import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
  disabled: PropTypes.bool,
};

export default function Logo({ disabledLink = false, sx, disabled = false }) {
  const theme = useTheme();
  const PRIMARY_LIGHT = disabled ? 'grey': theme.palette.primary.light;
  const PRIMARY_MAIN = disabled ? 'grey': theme.palette.primary.main;
  const PRIMARY_DARK = disabled ? 'grey': theme.palette.primary.dark;

  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>
        <g fill={PRIMARY_MAIN} stroke="none" strokeWidth="10" transform="translate(-119,640) scale(0.0935,-0.0935)">
          <path d="M1329 5161 c-52 -35 -82 -89 -81 -148 1 -55 208 -756 487 -1648 144
-458 147 -466 212 -507 36 -22 42 -22 325 -21 257 2 293 4 326 20 63 31 86 80
188 411 50 161 82 215 145 247 61 32 156 6 199 -55 18 -25 110 -285 110 -311
0 -32 87 -244 110 -269 l28 -30 265 0 c163 0 276 4 295 11 48 16 74 73 167
355 47 141 92 268 101 283 42 72 154 102 231 62 72 -36 89 -75 173 -390 66
-245 90 -293 161 -320 15 -5 134 -13 265 -17 l239 -7 47 44 c42 40 49 54 83
164 129 424 135 439 205 475 93 48 206 7 246 -90 8 -19 39 -126 69 -237 60
-223 86 -286 128 -317 27 -20 44 -21 317 -24 l289 -4 45 42 c63 59 72 94 45
196 -74 286 -589 1978 -619 2035 -5 9 -31 31 -58 48 l-49 31 -282 0 -282 0
-50 -32 c-56 -38 -55 -35 -129 -278 -76 -251 -97 -304 -137 -341 -33 -33 -37
-34 -113 -34 -126 0 -135 13 -229 340 -75 264 -79 273 -134 313 l-45 32 -265
0 -265 0 -44 -36 c-23 -20 -44 -37 -45 -38 -1 -1 -19 -58 -38 -127 -20 -68
-56 -188 -81 -266 -40 -127 -48 -145 -81 -172 -50 -41 -129 -59 -190 -42 -102
27 -121 61 -213 375 -33 114 -65 216 -70 226 -5 10 -31 32 -56 49 l-47 31
-238 0 -238 0 -50 -47 -50 -48 -77 -260 c-41 -143 -83 -273 -92 -290 -36 -64
-170 -97 -242 -60 -62 32 -86 91 -174 431 -24 94 -48 180 -54 191 -6 11 -30
33 -53 49 l-42 29 -271 3 -271 3 -46 -30z"/>
        </g>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
