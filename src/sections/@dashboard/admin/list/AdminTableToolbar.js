import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Chip } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const TEACHER_CHIPS = [
  { name: 'Thiago', value: 850 },
  { name: 'Agos', value: 897 },
  { name: 'Charly', value: 912 },
  { name: 'Fifu', value: 4 },
  { name: 'Gonzalo', value: 903 },
  { name: 'Sebas', value: 904 },
  { name: 'Tadeo', value: 905 },
  { name: 'Lola', value: 977 },
  { name: 'Popi', value: 592 },
  { name: 'Maite', value: 653 },
  { name: 'Oriana', value: 974 },
];

AdminTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterRole: PropTypes.string,
  filterLevel: PropTypes.number,
  filterMonth: PropTypes.string,
  filterTeacherId: PropTypes.string,
  filterStudentId: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onFilterLevel: PropTypes.func,
  onFilterMonth: PropTypes.func,
  onFilterTeacherId: PropTypes.func,
  onFilterStudentId: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
  bookings: PropTypes.bool,
};

export default function AdminTableToolbar({ 
  filterName, 
  filterRole, 
  filterLevel, 
  filterMonth,
  filterTeacherId,
  filterStudentId,
  onFilterName, 
  onFilterRole, 
  onFilterLevel,
  onFilterMonth,
  onFilterTeacherId,
  onFilterStudentId,
  optionsRole,
  bookings = false,
  showRole = true,
  showLevel = true,
  showMountain = true,
  showTeacher = true,
  showName = true,
  showMonth = true,
  showTeacherId = true,
  showStudentId = true,
  showSearchAdmin = true
}) {
  return (
    <Stack spacing={2}>
      <Stack 
        spacing={2} 
        direction={{ xs: 'column', sm: 'row' }} 
        sx={{ 
          pt: bookings ? 0 : 2.5,
          pb: bookings ? 0 : 2.5,
          px: bookings ? 0 : 3,
          alignItems: 'stretch',
          '& > *': { 
            flex: 1,
            display: 'flex',
            alignItems: 'center'
          }
        }}
      >
        {!bookings && showRole && (
          <>
            <TextField
              fullWidth
              select
              label="Role"
              value={filterRole}
              onChange={onFilterRole}
              SelectProps={{
                MenuProps: {
                  sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                },
              }}
              sx={{
                maxWidth: { sm: 240 },
                textTransform: 'capitalize',
              }}
            >
              {optionsRole.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Level"
              value={filterLevel}
              onChange={onFilterLevel}
              SelectProps={{
                MenuProps: {
                  sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                },
              }}
              sx={{
                maxWidth: { sm: 240 },
                textTransform: 'capitalize',
              }}
            >
              {["0", "1", "2", "3", "4", "5"].map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}

        {!bookings && showName && (
          <TextField
            fullWidth 
            value={filterName}
            onChange={(event) => onFilterName(event.target.value)}
            placeholder="Search Admin..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {!bookings && showSearchAdmin && (
          <TextField
            fullWidth
            value={filterName}
            onChange={(event) => onFilterName(event.target.value)}
            placeholder="Search Admin..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {showMonth && <TextField
          fullWidth
          select
          label="Month"
          value={filterMonth}
          onChange={onFilterMonth}
          SelectProps={{
            MenuProps: {
              sx: { '& .MuiPaper-root': { maxHeight: 260 } },
            },
          }}
          sx={{
            maxWidth: { sm: 240 },
            textTransform: 'capitalize',
          }}
        >
          {[
            { value: '06', label: 'June' },
            { value: '07', label: 'July' },
            { value: '08', label: 'August' },
            { value: '09', label: 'September' },
            { value: '10', label: 'October' },
          ].map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>}

        {showTeacherId && <TextField
          fullWidth
          label="Teacher ID"
          value={filterTeacherId}
          onChange={onFilterTeacherId}
          type="text"
          sx={{ maxWidth: { sm: 240 } }}
        />}

        {showStudentId && <TextField
          fullWidth
          label="Student ID"
          value={filterStudentId}
          onChange={onFilterStudentId}
          type="text"
          sx={{ maxWidth: { sm: 240 } }}
        />}
      </Stack>

      {bookings && (
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{  
            flexWrap: 'wrap', 
            gap: 1,
            pb:1,
            alignItems: 'center'
          }}
        >
          {TEACHER_CHIPS.map((teacher) => (
            <Chip
              key={teacher.value}
              label={teacher.name}
              onClick={() => onFilterTeacherId(teacher.value)}
              color={filterTeacherId === teacher.value ? 'primary' : 'default'}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
