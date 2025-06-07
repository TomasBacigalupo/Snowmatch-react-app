// import React, { useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import { paramCase } from 'change-case';
// import { Link as RouterLink } from 'react-router-dom';
// // @mui
// import { styled, alpha } from '@mui/material/styles';
// import { Box, Link, Avatar, Typography, Stack } from '@mui/material';
// // routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// // hooks
// import useResponsive from '../../../hooks/useResponsive';
// // utils
// import { fDate } from '../../../utils/formatTime';
// // components
// import Image from '../../../components/Image';
// import SvgIconStyle from '../../../components/SvgIconStyle';

// // ----------------------------------------------------------------------

// const OverlayStyle = styled('div')(({ theme }) => ({
//   top: 0,
//   zIndex: 1,
//   width: '100%',
//   height: '100%',
//   position: 'absolute',
//   backgroundColor: alpha(theme.palette.grey[900], 0.8),
// }));

// // ----------------------------------------------------------------------

// BlogPostCard.propTypes = {
//   post: PropTypes.object.isRequired,
//   index: PropTypes.number,
// };

// export default function BlogPostCard({ post, index }) {
//   const isDesktop = useResponsive('up', 'md');
//   const [isPlaying, setIsPlaying] = useState(false);
//   const videoRef = useRef(null);

//   const { cover, title, view, comment, share, author, createdAt, youtubeUrl, description, isYoutube, id, imageCover } = post;

//   const latestPost = index === 0 || index === 1 || index === 2;

//   const togglePlayPause = () => {
//     if (isPlaying) {
//       videoRef.current.pause();
//     } else {
//       videoRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <Box>
//       <Box sx={{ position: 'relative' }}>
//         <SvgIconStyle
//           src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
//           sx={{
//             width: 80,
//             height: 36,
//             zIndex: 9,
//             bottom: -15,
//             position: 'absolute',
//             color: 'background.paper',
//           }}
//         />
//         <Avatar
//           alt={author.name}
//           src={"https://snowmatchimages.s3.amazonaws.com/profile/SNOWMATCH_5.png"}
//           sx={{
//             left: 24,
//             zIndex: 9,
//             width: 32,
//             height: 32,
//             bottom: -16,
//             position: 'absolute',
//           }}
//         />

//         {/* Conditionally render video or image */}
//         {isYoutube ? (
//           <Box sx={{ position: 'relative' }}>
//             <video
//               ref={videoRef}
//               src={youtubeUrl} // Your video source here
//               muted
//               loop
//               style={{ width: '100%', height: 'auto' }}
//             />
//             <button
//               onClick={togglePlayPause}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '50%',
//                 padding: '10px',
//                 fontSize: '18px',
//                 cursor: 'pointer',
//               }}
//             >
//               {isPlaying ? 'Pause' : 'Play'}
//             </button>
//           </Box>
//         ) : (
//           <Image alt="cover" src={imageCover} ratio="4/3" />
//         )}
//       </Box>

//       <PostContent title={title} view={view} comment={comment} share={share} createdAt={createdAt}
//         isYoutube={isYoutube}
//         id={id}
//       />
//     </Box>
//   );
// }

// // ----------------------------------------------------------------------

// PostContent.propTypes = {
//   comment: PropTypes.number,
//   createdAt: PropTypes.string,
//   index: PropTypes.number,
//   share: PropTypes.number,
//   title: PropTypes.string,
//   view: PropTypes.number,
//   description: PropTypes.string,
// };

// export function PostContent({ title, view, comment, share, createdAt, index, description, isYoutube, id }) {
//   const isDesktop = useResponsive('up', 'md');
//   const linkTo = PATH_DASHBOARD.blog.view(id);

//   const latestPostLarge = index === 0;
//   const latestPostSmall = index === 1 || index === 2;

//   return (
//     <Box
//       sx={{
//         pt: 4.5,
//         width: 1,
//         ...((latestPostLarge || latestPostSmall) && {
//           pt: 0,
//           zIndex: 9,
//           bottom: 0,
//           position: 'absolute',
//           color: 'common.white',
//         }),
//       }}
//     >
//       <Typography
//         gutterBottom
//         variant="caption"
//         component="div"
//         sx={{
//           color: 'text.disabled',
//           ...((latestPostLarge || latestPostSmall) && {
//             opacity: 0.64,
//             color: 'common.white',
//           }),
//         }}
//       >
//         {fDate(createdAt)}
//       </Typography>

//       <Link to={linkTo} color="inherit" component={RouterLink}>
//         <Typography variant={isDesktop && latestPostLarge ? 'h5' : 'subtitle2'} noWrap>
//           {title}
//         </Typography>
//       </Link>

//       <Stack
//         flexWrap="wrap"
//         direction="row"
//         justifyContent="flex-end"
//         sx={{
//           mt: 3,
//           color: 'text.disabled',
//           ...((latestPostLarge || latestPostSmall) && {
//             opacity: 0.64,
//             color: 'common.white',
//           }),
//         }}
//       >
//         {/* Other post content */}
//       </Stack>
//     </Box>
//   );
// }


// import React, { useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import { paramCase } from 'change-case';
// import { Link as RouterLink } from 'react-router-dom';
// // @mui
// import { styled, alpha } from '@mui/material/styles';
// import { Box, Link, Card, Avatar, Typography, CardContent, Stack } from '@mui/material';
// // routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// // hooks
// import useResponsive from '../../../hooks/useResponsive';
// // utils
// import { fDate } from '../../../utils/formatTime';
// import { fShortenNumber } from '../../../utils/formatNumber';
// // components
// import Image from '../../../components/Image';
// import Iconify from '../../../components/Iconify';
// import TextMaxLine from '../../../components/TextMaxLine';
// import TextIconLabel from '../../../components/TextIconLabel';
// import SvgIconStyle from '../../../components/SvgIconStyle';

// // ----------------------------------------------------------------------

// const OverlayStyle = styled('div')(({ theme }) => ({
//   top: 0,
//   zIndex: 1,
//   width: '100%',
//   height: '100%',
//   position: 'absolute',
//   backgroundColor: alpha(theme.palette.grey[900], 0.8),
// }));

// // ----------------------------------------------------------------------

// BlogPostCard.propTypes = {
//   post: PropTypes.object.isRequired,
//   index: PropTypes.number,
// };

// export default function BlogPostCard({ post, index }) {
//   const isDesktop = useResponsive('up', 'md');

//   const { cover, title, view, comment, share, author, createdAt } = post;

//   const latestPost = index === 0 || index === 1 || index === 2;

//   if (isDesktop && latestPost) {
//     return (
//       <Card>
//         <Avatar
//           alt={author.name}
//           src={author.avatarUrl}
//           sx={{
//             zIndex: 9,
//             top: 24,
//             left: 24,
//             width: 40,
//             height: 40,
//             position: 'absolute',
//           }}
//         />
//         <PostContent title={title} view={view} comment={comment} share={share} createdAt={createdAt} index={index} />
//         <OverlayStyle />
//         <Image alt="cover" src={cover} sx={{ height: 360 }} />
//       </Card>
//     );
//   }

//   return (
//     <CardContent
//       sx={{
//         pt: 4.5,
//         width: 1,
//         ...((latestPostLarge || latestPostSmall) && {
//           pt: 0,
//           zIndex: 9,
//           bottom: 0,
//           position: 'absolute',
//           color: 'common.white',
//         }),
//       }}
//     >
//       <Box sx={{ position: 'relative' }}>
//         <SvgIconStyle
//           src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
//           sx={{
//             width: 80,
//             height: 36,
//             zIndex: 9,
//             bottom: -15,
//             position: 'absolute',
//             color: 'background.paper',
//           }}
//         />
//         <Avatar
//           alt={author.name}
//           src={author.avatarUrl}
//           sx={{
//             left: 24,
//             zIndex: 9,
//             width: 32,
//             height: 32,
//             bottom: -16,
//             position: 'absolute',
//           }}
//         />
//         <Image alt="cover" src={cover} ratio="4/3" />
//       </Box>

//       <PostContent title={title} view={view} comment={comment} share={share} createdAt={createdAt} />
//     </Card>
//   );
// }

// // ----------------------------------------------------------------------

// PostContent.propTypes = {
//   comment: PropTypes.number,
//   createdAt: PropTypes.string,
//   index: PropTypes.number,
//   share: PropTypes.number,
//   title: PropTypes.string,
//   view: PropTypes.number,
// };

// export function PostContent({ title, view, comment, share, createdAt, index }) {
//   const isDesktop = useResponsive('up', 'md');

//   const linkTo = PATH_DASHBOARD.blog.view(paramCase(title));

//   const latestPostLarge = index === 0;
//   const latestPostSmall = index === 1 || index === 2;

//   const POST_INFO = [
//     { number: comment, icon: 'eva:message-circle-fill' },
//     { number: view, icon: 'eva:eye-fill' },
//     { number: share, icon: 'eva:share-fill' },
//   ];

//   return (
//     <CardContent
//       sx={{
//         pt: 4.5,
//         width: 1,
//         ...((latestPostLarge || latestPostSmall) && {
//           pt: 0,
//           zIndex: 9,
//           bottom: 0,
//           position: 'absolute',
//           color: 'common.white',
//         }),
//       }}
//     >
//       <Typography
//         gutterBottom
//         variant="caption"
//         component="div"
//         sx={{
//           color: 'text.disabled',
//           ...((latestPostLarge || latestPostSmall) && {
//             opacity: 0.64,
//             color: 'common.white',
//           }),
//         }}
//       >
//         {fDate(createdAt)}
//       </Typography>

//       <Link to={linkTo} color="inherit" component={RouterLink}>
//         <TextMaxLine variant={isDesktop && latestPostLarge ? 'h5' : 'subtitle2'} line={2} persistent>
//           {title}
//         </TextMaxLine>
//       </Link>

//       <Stack
//         flexWrap="wrap"
//         direction="row"
//         justifyContent="flex-end"
//         sx={{
//           mt: 3,
//           color: 'text.disabled',
//           ...((latestPostLarge || latestPostSmall) && {
//             opacity: 0.64,
//             color: 'common.white',
//           }),
//         }}
//       >
//         {POST_INFO.map((info, index) => (
//           <TextIconLabel
//             key={index}
//             icon={<Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />}
//             value={fShortenNumber(info.number)}
//             sx={{ typography: 'caption', ml: index === 0 ? 0 : 1.5 }}
//           />
//         ))}
//       </Stack>
//     </CardContent>
//   );
// }







//last 
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Card, Avatar, Typography, CardContent, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
// components
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';
import TextMaxLine from '../../../components/TextMaxLine';
import TextIconLabel from '../../../components/TextIconLabel';
import SvgIconStyle from '../../../components/SvgIconStyle';
import { description } from 'src/_mock/text';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.8),
}));

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index }) {
  const isDesktop = useResponsive('up', 'md');

  const { title, view, comment, share, author, createdAt, id, cover, slug } = post;

  const latestPost = index === 0 || index === 1 || index === 2;

  if (isDesktop && latestPost) {
    return (
      <Card>
        <Avatar
          alt={author.name}
          src={"https://snowmatchimages.s3.amazonaws.com/profile/SNOWMATCH_5.png"}
          sx={{
            zIndex: 9,
            top: 24,
            left: 24,
            width: 40,
            height: 40,
            position: 'absolute',
          }}
        />
        <PostContent title={title} view={view} comment={comment} share={share} createdAt={createdAt} index={index} slug={slug} />
        <OverlayStyle />
        <img alt="cover" src={cover} sx={{ height: 360 }} />
      </Card>
    );
  }

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Avatar
          alt={author.name}
          src={author.avatarUrl}
          sx={{
            left: 24,
            zIndex: 9,
            width: 32,
            height: 32,
            bottom: -16,
            position: 'absolute',
          }}
        />
        <Image alt="cover" src={cover} ratio="4/3" />
      </Box>

      <PostContent title={title} view={view} description={post?.description} comment={comment} share={share} createdAt={createdAt} id={id}/>
    </Card>
  );
}

// ----------------------------------------------------------------------

PostContent.propTypes = {
  comment: PropTypes.number,
  createdAt: PropTypes.string,
  index: PropTypes.number,
  share: PropTypes.number,
  title: PropTypes.string,
  view: PropTypes.number,
  description: PropTypes.string,
};

export function PostContent({ title, view, comment, share, createdAt, index, description, slug }) {
  const isDesktop = useResponsive('up', 'md');
  const linkFormer = (slug) => `/noticias/${slug}`
  const linkTo = linkFormer(slug);

  const latestPostLarge = index === 0;
  const latestPostSmall = index === 1 || index === 2;

  const POST_INFO = [
    { number: share, icon: 'eva:share-fill' },
  ];

  return (
    <CardContent
      sx={{
        pt: 4.5,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }),
      }}
    >
      <Typography
        gutterBottom
        variant="caption"
        component="div"
        sx={{
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {fDate(createdAt)}
      </Typography>
      <Link to={``} color="inherit" component={RouterLink}>
        <TextMaxLine variant={isDesktop && latestPostLarge ? 'h5' : 'subtitle2'} line={2} persistent>
          {title}
        </TextMaxLine>
      </Link>
      <Typography variant='body'>
        {description}
      </Typography>

      <Stack
        flexWrap="wrap"
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: 3,
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {POST_INFO.map((info, index) => (
          <TextIconLabel
            key={index}
            icon={<Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />}
            value={null}
            sx={{ typography: 'caption', ml: index === 0 ? 0 : 1.5 }}
          />
        ))}
      </Stack>
    </CardContent>
  );
}
