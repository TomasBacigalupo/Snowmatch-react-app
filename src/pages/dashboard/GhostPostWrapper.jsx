import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function GhostPostWrapper() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://blog.snowmatch.pro/ghost/api/v3/content/posts/slug/${slug}/`, {
          params: {
            key: process.env.REACT_APP_GHOST_CONTENT_API_KEY,
            include: 'tags,authors'
          }
        });

        if (response.data && response.data.posts && response.data.posts[0]) {
          const postData = response.data.posts[0];
          setPost({
            id: postData.id,
            title: postData.title,
            content: postData.html,
            cover: postData.feature_image,
            createdAt: new Date(postData.published_at),
            author: {
              name: postData.primary_author?.name || 'SnowMatch',
              avatarUrl: postData.primary_author?.profile_image || '/assets/logo/fullBlack.svg'
            },
            tags: postData.tags?.map(tag => tag.name) || []
          });
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching Ghost post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Page title="Error">
        <Container maxWidth="lg">
          <Box sx={{ py: 5 }}>
            <Typography color="error" variant="h5">
              {error}
            </Typography>
          </Box>
        </Container>
      </Page>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <Page title={post.title}>
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          {post.cover && (
            <Box
              component="img"
              src={post.cover}
              alt={post.title}
              sx={{
                width: '100%',
                height: 500,
                objectFit: 'cover',
                borderRadius: 3,
                mb: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          )}
          
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              mb: 4,
              fontWeight: 700,
              lineHeight: 1.2
            }}
          >
            {post.title}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 6,
            p: 2,
            bgcolor: 'background.neutral',
            borderRadius: 2
          }}>
            <Box
              component="img"
              src={post.author.avatarUrl}
              alt={post.author.name}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                mr: 3,
                border: '2px solid',
                borderColor: 'primary.main'
              }}
            />
            <Typography variant="subtitle1" sx={{ fontSize: '1.1rem' }}>
              {post.author.name} • {post.createdAt.toLocaleDateString()}
            </Typography>
          </Box>

          <Box
            sx={{
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                my: 3
              },
              '& p': {
                mb: 3,
                fontSize: '1.1rem',
                lineHeight: 1.8
              },
              '& h2, & h3, & h4': {
                mt: 6,
                mb: 3,
                fontWeight: 600
              },
              '& a': {
                color: 'text.primary',
                textDecoration: 'none',
                borderBottom: '2px solid',
                borderColor: 'grey.300',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'text.primary',
                  color: 'text.primary',
                  opacity: 0.8
                }
              },
              '& ul, & ol': {
                mb: 3,
                pl: 4
              },
              '& li': {
                mb: 1.5,
                fontSize: '1.1rem',
                lineHeight: 1.8,
                '&::marker': {
                  color: 'text.primary'
                }
              }
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <Box sx={{ 
              mt: 8,
              p: 3,
              bgcolor: 'background.neutral',
              borderRadius: 2
            }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Tags:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {post.tags.map((tag) => (
                  <Typography
                    key={tag}
                    variant="body1"
                    sx={{
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      px: 2,
                      py: 1,
                      borderRadius: 1.5,
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'primary.light',
                        transition: 'all 0.2s'
                      }
                    }}
                  >
                    {tag}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Page>
  );
}
