import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  InputAdornment,
  TextField,
  MenuItem,
  Chip,
  Collapse,
  Button,
  Autocomplete,
  CircularProgress,
  Typography,
} from '@mui/material';
import { ADMIN_BOOKING_RESORT_FILTER_OPTIONS } from 'src/utils/adminBookingResortOptions';
import { TEACHER_QUICK_CHIPS } from 'src/utils/teacherQuickChips';
// components
import Iconify from '../../../../components/Iconify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// ----------------------------------------------------------------------

const MONTH_OPTION_VALUES = ['06', '07', '08', '09', '10'];

const BOOKING_FILTER_YEAR_RANGE = 8;

/** Display label for teacher Autocomplete options (name + optional ID). */
function getTeacherOptionLabel(option) {
  if (option == null) return '';
  if (typeof option === 'string') return option;
  const name = `${option?.name || ''} ${option?.lastname || ''}`.trim();
  if (name) return option?.id != null ? `${name} (ID: ${option.id})` : name;
  return option?.id != null ? String(option.id) : '';
}

AdminTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterRole: PropTypes.string,
  filterLevel: PropTypes.number,
  filterMonth: PropTypes.string,
  /** Season / calendar year for admin booking month filter (optional). */
  filterYear: PropTypes.number,
  filterTeacherId: PropTypes.string,
  filterStudentId: PropTypes.string,
  filterResort: PropTypes.string,
  filterSortBy: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onFilterLevel: PropTypes.func,
  onFilterMonth: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFilterTeacherId: PropTypes.func,
  onFilterStudentId: PropTypes.func,
  onFilterResort: PropTypes.func,
  onFilterSortBy: PropTypes.func,
  onFilterDate: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
  optionsSortBy: PropTypes.arrayOf(PropTypes.string),
  bookings: PropTypes.bool,
  /** When true, hide instructor ID field and quick teacher chips (e.g. gear-only bookings). */
  hideInstructorFilters: PropTypes.bool,
  /** When true, hide the collapsible "More filters" section (e.g. resort admin bookings). */
  hideMoreFilters: PropTypes.bool,
  /** When set, resort filter is fixed to this value and the selector is disabled. */
  lockResort: PropTypes.string,
  /** Teacher options for name search Autocomplete (bookings toolbar). */
  teacherOptions: PropTypes.array,
  selectedTeacher: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onTeacherSearch: PropTypes.func,
  onTeacherSelect: PropTypes.func,
  teachersLoading: PropTypes.bool,
  teachersSearchError: PropTypes.bool,
  teacherSearchInput: PropTypes.string,
};

export default function AdminTableToolbar({
  filterName,
  filterRole,
  filterLevel,
  filterMonth,
  filterYear,
  filterTeacherId,
  filterStudentId,
  filterResort,
  filterSortBy,
  filterDate,
  onFilterName,
  onFilterRole,
  onFilterLevel,
  onFilterMonth,
  onFilterYear,
  onFilterTeacherId,
  onFilterStudentId,
  onFilterResort,
  onFilterSortBy,
  optionsRole,
  optionsSortBy,
  bookings = false,
  hideInstructorFilters = false,
  hideMoreFilters = false,
  showRole = true,
  showLevel = true,
  showMountain = true,
  showTeacher = true,
  showName = true,
  showMonth = true,
  showTeacherId = true,
  showStudentId = true,
  showSearchAdmin = true,
  showResort = true,
  showSortBy = false,
  lockResort = null,
  onFilterDate = null,
  teacherOptions = [],
  selectedTeacher = null,
  onTeacherSearch = null,
  onTeacherSelect = null,
  teachersLoading = false,
  teachersSearchError = false,
  teacherSearchInput = '',
}) {
  const { t } = useTranslation();
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const bookingYearOptions = Array.from({ length: BOOKING_FILTER_YEAR_RANGE }, (_, i) => new Date().getFullYear() - i);

  // Prefer Autocomplete name search on bookings; fall back to plain Teacher ID elsewhere.
  const showTeacherNameSearch =
    bookings && showTeacherId && !hideInstructorFilters && typeof onTeacherSelect === 'function';

  const teacherNoOptionsText = teachersSearchError
    ? t('adminBookings.filters.teachersLoadError')
    : teacherSearchInput?.trim()
      ? t('adminBookings.filters.noTeachersFound')
      : t('adminBookings.filters.typeToSearchTeachers');

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
        {onFilterDate && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={bookings ? t('adminBookings.filters.date') : 'Date'}
              value={filterDate ?? null}
              onChange={onFilterDate}
              slotProps={{
                field: { clearable: true },
                textField: { fullWidth: true },
              }}
            />
          </LocalizationProvider>

        )}
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

        {showSortBy && onFilterSortBy && (
          <TextField
            fullWidth
            select
            label={t('adminReview.filters.sortBy')}
            value={filterSortBy || 'priority'}
            onChange={onFilterSortBy}
            SelectProps={{
              MenuProps: {
                sx: { '& .MuiPaper-root': { maxHeight: 260 } },
              },
            }}
            sx={{
              maxWidth: { sm: 240 },
            }}
          >
            {(optionsSortBy || ['priority', 'id']).map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                }}
              >
                {t(`adminReview.filters.sortByOptions.${option}`)}
              </MenuItem>
            ))}
          </TextField>
        )}

        {showResort && (
          <TextField
            fullWidth
            select
            label={t('adminReview.filters.resort')}
            value={lockResort || filterResort || ''}
            onChange={onFilterResort}
            disabled={Boolean(lockResort)}
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
            {!lockResort && (
              <MenuItem value="" sx={{ mx: 1, my: 0.5, borderRadius: 0.75, typography: 'body2', color: 'text.secondary' }}>
                {t('adminReview.filters.allResorts')}
              </MenuItem>
            )}
            {(lockResort
              ? ADMIN_BOOKING_RESORT_FILTER_OPTIONS.filter((option) => option.value === lockResort)
              : ADMIN_BOOKING_RESORT_FILTER_OPTIONS
            ).map((option) => (
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
          </TextField>
        )}

        {!bookings && showName && (
          <TextField
            fullWidth
            value={filterName}
            onChange={(event) => onFilterName(event.target.value)}
            placeholder={t('adminReview.searchByNamePlaceholder')}
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
            placeholder={t('adminReview.searchByNamePlaceholder')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {showMonth && typeof filterYear === 'number' && onFilterYear && (
          <TextField
            fullWidth
            select
            label={bookings ? t('adminBookings.filters.year') : 'Year'}
            value={filterYear}
            onChange={onFilterYear}
            SelectProps={{
              MenuProps: {
                sx: { '& .MuiPaper-root': { maxHeight: 260 } },
              },
            }}
            sx={{
              maxWidth: { sm: 240 },
            }}
          >
            {bookingYearOptions.map((y) => (
              <MenuItem key={y} value={y} sx={{ mx: 1, my: 0.5, borderRadius: 0.75, typography: 'body2' }}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        )}
        {showMonth && (
          <TextField
            fullWidth
            select
            label={bookings ? t('adminBookings.filters.month') : 'Month'}
            value={filterMonth ?? ''}
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
            <MenuItem value="" sx={{ mx: 1, my: 0.5, borderRadius: 0.75, typography: 'body2', color: 'text.secondary' }}>
              {bookings ? t('adminBookings.filters.allMonths') : 'All months'}
            </MenuItem>
            {MONTH_OPTION_VALUES.map((value) => (
              <MenuItem
                key={value}
                value={value}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {bookings ? t(`adminBookings.filters.months.${value}`) : value}
              </MenuItem>
            ))}
          </TextField>
        )}

        {showTeacherNameSearch && (
          <Autocomplete
            fullWidth
            freeSolo
            clearOnBlur={false}
            options={teacherOptions || []}
            value={selectedTeacher}
            inputValue={teacherSearchInput}
            loading={teachersLoading}
            onChange={onTeacherSelect}
            onInputChange={(_event, newInputValue, reason) => {
              // Ignore resets so selecting an option does not re-trigger a name search.
              // Parent syncs inputValue on select/clear (including chip clear).
              if (reason === 'reset') return;
              onTeacherSearch?.(newInputValue);
            }}
            getOptionLabel={getTeacherOptionLabel}
            isOptionEqualToValue={(option, value) => {
              if (option == null || value == null) return false;
              if (typeof option === 'string' || typeof value === 'string') {
                return String(option) === String(value);
              }
              return String(option?.id) === String(value?.id);
            }}
            filterOptions={(x) => x}
            noOptionsText={teacherNoOptionsText}
            renderOption={(props, option) => (
              <li {...props} key={option?.id ?? getTeacherOptionLabel(option)}>
                <Stack spacing={0.25}>
                  <Typography variant="body2">
                    {`${option?.name || ''} ${option?.lastname || ''}`.trim() || getTeacherOptionLabel(option)}
                  </Typography>
                  {option?.id != null && (
                    <Typography variant="caption" color="text.secondary">
                      {`ID: ${option.id}`}
                    </Typography>
                  )}
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('adminBookings.filters.searchTeacherLabel')}
                placeholder={t('adminBookings.filters.searchTeacherPlaceholder')}
                error={Boolean(teachersSearchError)}
                helperText={teachersSearchError ? t('adminBookings.filters.teachersLoadError') : undefined}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teachersLoading ? <CircularProgress color="inherit" size={18} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ maxWidth: { sm: 280 }, minWidth: { sm: 220 } }}
          />
        )}

        {showTeacherId && !hideInstructorFilters && !showTeacherNameSearch && (
          <TextField
            fullWidth
            label={bookings ? t('adminBookings.filters.teacherId') : 'Teacher ID'}
            value={filterTeacherId}
            onChange={onFilterTeacherId}
            type="text"
            sx={{ maxWidth: { sm: 240 } }}
          />
        )}

        {showStudentId && <TextField
          fullWidth
          label={bookings ? t('adminBookings.filters.studentId') : 'Student ID'}
          value={filterStudentId}
          onChange={onFilterStudentId}
          type="text"
          sx={{ maxWidth: { sm: 240 } }}
        />}
      </Stack>

      {bookings && onFilterName && !hideMoreFilters && (
        <>
          <Button
            color="inherit"
            size="small"
            onClick={() => setMoreFiltersOpen((o) => !o)}
            endIcon={
              <Iconify
                icon={moreFiltersOpen ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
                sx={{ width: 20, height: 20 }}
              />
            }
            sx={{ alignSelf: 'flex-start', px: 0, typography: 'body2' }}
          >
            {t('adminBookings.filters.moreFilters')}
          </Button>
          <Collapse in={moreFiltersOpen}>
            <Stack spacing={2} sx={{ pt: 0.5 }}>
              <TextField
                fullWidth
                value={filterName}
                onChange={(event) => onFilterName(event.target.value)}
                placeholder={t('adminBookings.filters.searchBookingPlaceholder')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              {!hideInstructorFilters && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    flexWrap: 'wrap',
                    gap: 1,
                    pb: 1,
                    alignItems: 'center',
                  }}
                >
                  {TEACHER_QUICK_CHIPS.map((teacher) => {
                    const isSelected = String(filterTeacherId) === String(teacher.value);
                    return (
                      <Chip
                        key={teacher.value}
                        label={teacher.name}
                        // Re-clicking the active chip clears the teacher filter.
                        onClick={() => onFilterTeacherId(isSelected ? '' : teacher.value)}
                        onDelete={isSelected ? () => onFilterTeacherId('') : undefined}
                        color={isSelected ? 'primary' : 'default'}
                        // Keep label + delete X readable on primary hover (theme hover was dark-on-dark).
                        sx={
                          isSelected
                            ? {
                                color: 'primary.contrastText',
                                '& .MuiChip-label': {
                                  color: 'primary.contrastText',
                                },
                                '& .MuiChip-deleteIcon': {
                                  color: 'common.white',
                                  opacity: 0.9,
                                  '&:hover': {
                                    color: 'common.white',
                                    opacity: 1,
                                  },
                                },
                                '&:hover': {
                                  backgroundColor: 'primary.dark',
                                  color: 'primary.contrastText',
                                  '& .MuiChip-label': {
                                    color: 'primary.contrastText',
                                  },
                                  '& .MuiChip-deleteIcon': {
                                    color: 'common.white',
                                    opacity: 1,
                                  },
                                },
                              }
                            : undefined
                        }
                      />
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </Collapse>
        </>
      )}
    </Stack>
  );
}
