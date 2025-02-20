import { Card, CardContent, Typography, Button, Avatar, Stack } from "@mui/material";

const ReviewRequestBox = () => {
  return (
    <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3, textAlign: "center" }}>
      <Stack direction="column" alignItems="center" spacing={2}>
        <Avatar src="/images/pro-instructor.jpg" sx={{ width: 56, height: 56 }} />
        <Typography variant="h6" fontWeight="bold">
          Obtén una revisión de un SnowMatch Pro
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Un instructor experto analizará tu video y te dará consejos para mejorar tu técnica.
        </Typography>
        <Button variant="contained" color="primary" fullWidth>
          Solicitar revisión
        </Button>
      </Stack>
    </Card>
  );
};

export default ReviewRequestBox;