import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Box, Skeleton } from '@mui/material';
import axios from 'axios';
import Page from '../../components/Page';
import { BlogPostCard } from '../../sections/@dashboard/blog';

// ----------------------------------------------------------------------

export default function GhostWrapper() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://blog.snowmatch.pro/ghost/api/v3/content/posts/', {
          params: {
            key: process.env.REACT_APP_GHOST_CONTENT_API_KEY,
            include: 'tags,authors',
            limit: 10
          }
        });

        if (response.data && response.data.posts) {
          const formattedPosts = response.data.posts.map(post => ({
            id: post.id,
            title: post.title,
            description: post.excerpt,
            cover: post.feature_image,
            createdAt: new Date(post.published_at),
            author: {
              name: post.primary_author?.name || 'SnowMatch',
              avatarUrl: post.primary_author?.profile_image || '/assets/logo/fullBlack.svg'
            },
            tags: post.tags?.map(tag => tag.name) || [],
            slug: post.slug
          }));
          setPosts(formattedPosts);
        }
      } catch (err) {
        console.error('Error fetching Ghost posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (slug) => {
    navigate(`/noticias/${slug}`);
  };

  return (
    <Page title="Blog">
      <Container maxWidth="lg" sx={{paddingTop:3}} >
        <Box sx={{ py: 5 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Blog
          </Typography>
          
          {error && (
            <Typography color="error" sx={{ mb: 3 }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={3}>
            {loading ? (
              // Loading skeletons
              Array.from(new Array(6)).map((_, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />
                    <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} width="60%" />
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Skeleton variant="text" width={100} />
                    </Box>
                  </Box>
                </Grid>
              ))
            ) : (
              posts.map((post) => (
                <Grid key={post.id} item xs={12} sm={6} md={4}>
                  <Box onClick={() => handlePostClick(post.slug)} sx={{ cursor: 'pointer' }}>
                    <BlogPostCard post={post} />
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
