import { Box, Typography } from "@mui/material";
import useLocales from "src/hooks/useLocales";

const levelColors = {
    Principiante: 'secondary.lighter',
    Intermedio: 'info.lighter',
    Avanzado: 'info.light',
  };
  
  const levelIcon = {
    Principiante: '/assets/courses/Intensidad_1.svg',
    Intermedio: '/assets/courses/Intensidad_dark.svg',
    Avanzado: '/assets/courses/Intensidad_3.svg',
  };

export default function CourseCard({ post, onClick }) {
    const { translate } = useLocales();
    return (
        <Box
            onClick={onClick}
            sx={{
                width: 240,
                height: 340,
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'primary.light',
                cursor: 'pointer',
                '&:hover': { boxShadow: 4 },
            }}
        >
            {/* Upper Section: Title, Subtitle, and Level Indicator */}
            <Box
                sx={{
                    height: 180,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: levelColors[post.level] || 'secondary.lighter',
                }}
            >
                <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="text.primary"
                    noWrap
                >
                    {translate(`${post.code}.title`)}
                </Typography>

                <Typography
                    variant="h2"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{
                        mb: 2,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2, // Allows up to 2 lines
                        lineHeight: 1, // Tight line spacing
                    }}
                >
                    {translate(`${post.code}.subtitle`)}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Box
                        component="img"
                        src={levelIcon[post.level]}
                        alt="Level"
                        sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="body2" fontWeight="bold" sx={{ ml: 'auto' }}>
                        {post.points} pts
                    </Typography>
                </Box>
            </Box>

            {/* Lower Section: Image */}
            <Box
                component="img"
                src={post.cover}
                alt={post.title}
                sx={{
                    width: '100%',
                    height: 160,
                    objectFit: 'cover',
                }}
            />
        </Box>
    )
};