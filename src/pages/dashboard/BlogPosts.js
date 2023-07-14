import orderBy from 'lodash/orderBy';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';
// @mui
import { Grid, Button, Container, Stack } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { SkeletonPostItem } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../sections/@dashboard/blog';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }
  if (sortBy === 'popular') {
    return orderBy(posts, ['view'], ['desc']);
  }
  return posts;
};

export default function BlogPosts() {
  const { themeStretch } = useSettings();

  const isMountedRef = useIsMountedRef();

  const [posts, setPosts] = useState([{
    id: 1,
    name: 'test',
    description: 'test',
    image: 'test',
    view: 1,
    createdAt: 'test',
    updatedAt: 'test',
    author: {
      name: "Jaime",
      avatarUrl: "https://image.snowmatch.pro/profile/248-7a4aae14-7db3-4074-a3a3-3b44b81e9538"
    },
    youtubeUrl: 'FUrHpKp7I_k',
    title: 'proTips.tips.jaime.title',
    description: 'proTips.tips.jaime.description',
    createdAt: new Date().toString(),
  }, {
    id: 5,
    name: 'test',
    description: 'test',
    image: 'test',
    view: 1,
    createdAt: 'test',
    updatedAt: 'test',
    author: {
      name: "Chapi",
      avatarUrl: "https://image.snowmatch.pro/profile/121-8b34533f-318d-479b-984d-f0b0d951f363"
    },
    youtubeUrl: 'GF8Dbap50VE',
    title: 'proTips.tips.chapi2.title',
    description: 'proTips.tips.chapi2.description',
    createdAt: new Date().toString(),
  }, {
    id: 1,
    name: 'test',
    description: 'test',
    image: 'test',
    view: 1,
    createdAt: 'test',
    updatedAt: 'test',
    author: {
      name: "Tomi",
      avatarUrl: "https://image.snowmatch.pro/profile/14-1b79994a-22e5-4eed-99b4-d4c93070a784"
    },
    youtubeUrl: 'abUomom9nMg',
    title: 'proTips.tips.tomi.title',
    description: 'proTips.tips.tomi.description',
    createdAt: new Date().toString(),
  }, {
    id: 3,
    name: 'test',
    description: 'test',
    image: 'test',
    view: 1,
    createdAt: 'test',
    updatedAt: 'test',
    author: {
      name: "Manu",
      avatarUrl: "https://image.snowmatch.pro/profile/121-8b34533f-318d-479b-984d-f0b0d951f363"
    },
    youtubeUrl: 'sX-8h-hS66U',
    title: 'proTips.tips.manu.title',
    description: 'proTips.tips.manu.description',
    createdAt: new Date().toString(),
  }, {
    id: 4,
    name: 'test',
    description: 'test',
    image: 'test',
    view: 1,
    createdAt: 'test',
    updatedAt: 'test',
    author: {
      name: "Chapi",
      avatarUrl: "https://image.snowmatch.pro/profile/121-8b34533f-318d-479b-984d-f0b0d951f363"
    },
    youtubeUrl: 'MAcD6sfsBTg',
    title: 'proTips.tips.chapi.title',
    description: 'proTips.tips.chapi.description',
    createdAt: new Date().toString(),
  }
  ]);

  const [filters, setFilters] = useState('latest');

  const sortedPosts = applySort(posts, filters);

  const { translate } = useLocales();

  const getAllPosts = useCallback(async () => {
    try {
      const response = await axios.get('/api/blog/posts/all');

      if (isMountedRef.current) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleChangeSort = (value) => {
    if (value) {
      setFilters(value);
    }
  };

  return (
    <Page title={translate('proTips.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('proTips.title')}
          links={[
            { name: 'Match', href: PATH_GUEST.independent },
            { name: translate('proTips.title') },
          ]}
        />
        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch />
          <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
        </Stack>

        <Grid container spacing={3}>
          {(!posts.length ? [...Array(12)] : sortedPosts).map((post, index) =>
            post ? (
              <Grid key={post.id} item xs={12} sm={6} md={(index === 0 && 6) || 3}>
                <BlogPostCard post={post} index={index} />
              </Grid>
            ) : (
              <SkeletonPostItem key={index} />
            )
          )}
        </Grid>
      </Container>
    </Page>
  );
}
