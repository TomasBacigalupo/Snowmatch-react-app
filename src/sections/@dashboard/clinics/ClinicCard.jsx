import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export const ClinicCard = ({ clinic }) => {
    const { title, description, imageUrl } = clinic;
    const onClick = () => {
        const phoneNumber = '+5492944263223';
        const _message = encodeURIComponent(
            `Clínica: ${title}\n${description}\nQuiero saber más sobre esta clínica.`
        );
        const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${_message}`;

        window.open(url, '_blank');
    }

    return (
        <Card onClick={onClick}>
            {imageUrl && (
                <CardMedia
                    component="img"
                    height="300"
                    image={imageUrl}
                    alt={title}
                />
            )}
            <CardContent>
                <Typography variant="h6" paragraph>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};