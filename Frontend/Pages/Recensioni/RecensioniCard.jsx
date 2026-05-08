import { Card, CardContent, Typography, Avatar, Rating, Box } from '@mui/material';

function RecensioniCard({ nome, commento, punteggio }) {
    return (
        <Card sx={{ minWidth: 300, m: 1 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ mr: 2 }}>{nome?.charAt(0).toUpperCase()}</Avatar>
                    <Box>
                        <Typography variant="subtitle1">{nome}</Typography>
                        <Rating value={punteggio} precision={0.5} readOnly />
                    </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {commento}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default RecensioniCard;