import PropTypes from 'prop-types';
import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
// @mui
import { Paper, Typography, Box, Checkbox, AvatarGroup, Avatar } from '@mui/material';
// components
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';
//
import KanbanTaskDetails from './KanbanTaskDetails';
import { report } from 'process';

// ----------------------------------------------------------------------

KanbanTaskCard.propTypes = {
  card: PropTypes.object,
  index: PropTypes.number,
  onDeleteTask: PropTypes.func,
};

export default function KanbanTaskCard({ card, onDeleteTask, index }) {
  const { name, attachments, description, reporter } = card;

  const [openDetails, setOpenDetails] = useState(false);

  const [completed, setCompleted] = useState(card.completed);

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handleChangeComplete = (event) => {
    setCompleted(event.target.checked);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <Paper
            sx={{
              px: 2,
              width: 1,
              position: 'relative',
              boxShadow: (theme) => theme.customShadows.z1,
              '&:hover': {
                boxShadow: (theme) => theme.customShadows.z16,
              },
              ...(attachments?.length > 0 && {
                pt: 2,
              }),
            }}
          >
            <Box onClick={handleOpenDetails} sx={{ cursor: 'pointer' }}>
              {attachments?.length > 0 && (
                <Box
                  sx={{
                    pt: '60%',
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: (theme) =>
                      theme.transitions.create('opacity', {
                        duration: theme.transitions.duration.shortest,
                      }),
                    ...(completed && {
                      opacity: 0.48,
                    }),
                  }}
                >
                  <Image src={attachments[0]} sx={{ position: 'absolute', top: 0, width: 1, height: 1 }} />
                </Box>
              )}

              <Typography
                noWrap
                variant="h6"
                sx={{
                  py: 3,
                  pl: 5,
                  transition: (theme) =>
                    theme.transitions.create('opacity', {
                      duration: theme.transitions.duration.shortest,
                    }),
                  ...(completed && { opacity: 0.48 }),
                }}
              >
                {name}
                <Typography
                  variant="body2"
                >
                  {description}
                </Typography>
              </Typography> 
              {reporter &&
                reporter.map((r) => (
                  <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' sx={{ position: 'absolute', bottom: '10%', right: '10px' }}>
                    <Avatar key={r.id} src={r.avatar} alt={`${r?.name} ${r?.lastname}`} />
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                      {r.name} {r.lastname}
                    </Typography>
                  </Box>
                  

                ))
             }
            </Box>

            <Checkbox
              disableRipple
              checked={completed}
              icon={<Iconify icon={'eva:radio-button-off-outline'} />}
              checkedIcon={<Iconify icon={'eva:checkmark-circle-2-outline'} />}
              onChange={handleChangeComplete}
              sx={{ position: 'absolute', bottom: '30%', left:'10px' }}
            />
          </Paper>

          <KanbanTaskDetails
            card={card}
            isOpen={openDetails}
            onClose={handleCloseDetails}
            onDeleteTask={() => onDeleteTask(card.id)}
          />
        </div>
      )}
    </Draggable>
  );
}
