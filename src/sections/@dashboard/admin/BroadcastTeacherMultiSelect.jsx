import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'src/redux/store';
import { getTeachers } from 'src/redux/slices/admin';
import { useTranslation } from 'react-i18next';

const INSTRUCTOR_SEARCH_PAGE_SIZE = 25;

/**
 * Multi-select teacher search for broadcasting a booking intent (optional additive UI).
 */
export default function BroadcastTeacherMultiSelect({
  resort,
  selectedIds,
  onChange,
  disabled,
  helperText,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { teachers, isLoading } = useSelector((state) => state.admin);
  const [instructorSearch, setInstructorSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(
        getTeachers(0, 'TEACHER', instructorSearch.trim(), 0, INSTRUCTOR_SEARCH_PAGE_SIZE, resort || '', 'id')
      );
    }, 400);
    return () => clearTimeout(id);
  }, [dispatch, resort, instructorSearch]);

  const filteredTeachers = useMemo(() => {
    const data = teachers ?? [];
    if (!resort) return data;
    return data.filter((teacher) => {
      const enumMatch =
        Array.isArray(teacher.resortsEnum) &&
        teacher.resortsEnum.some((r) => String(r) === resort || r?.name === resort);
      const legacyMatch =
        Array.isArray(teacher.resorts) && teacher.resorts.some((r) => String(r) === resort);
      return enumMatch || legacyMatch;
    });
  }, [teachers, resort]);

  const selectedSet = useMemo(() => new Set((selectedIds || []).map(Number)), [selectedIds]);

  const handleSearchChange = useCallback((event) => {
    setInstructorSearch(event.target.value);
  }, []);

  const toggle = useCallback(
    (id) => {
      if (disabled) return;
      const next = new Set(selectedSet);
      const numId = Number(id);
      if (next.has(numId)) {
        next.delete(numId);
      } else {
        next.add(numId);
      }
      onChange(Array.from(next));
    },
    [disabled, onChange, selectedSet]
  );

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {t('adminBookings.broadcast.title', { defaultValue: 'Broadcast to teachers (optional)' })}
      </Typography>
      {helperText ? (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          {helperText}
        </Typography>
      ) : null}
      <TextField
        fullWidth
        size="small"
        label={t('adminBookings.broadcast.searchLabel', { defaultValue: 'Search instructors' })}
        value={instructorSearch}
        onChange={handleSearchChange}
        disabled={disabled}
        sx={{ mb: 1 }}
      />
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={28} />
        </Box>
      ) : null}
      {!isLoading && filteredTeachers.length === 0 ? (
        <Alert severity="info" sx={{ mb: 1 }}>
          {t('adminBookings.broadcast.empty', {
            defaultValue: 'No instructors found. Try another name or resort.',
          })}
        </Alert>
      ) : null}
      {!isLoading && filteredTeachers.length > 0 ? (
        <FormGroup
          sx={{
            maxHeight: 220,
            overflowY: 'auto',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: 1,
          }}
        >
          {filteredTeachers.map((teacher) => (
            <FormControlLabel
              key={teacher.id}
              control={
                <Checkbox
                  checked={selectedSet.has(Number(teacher.id))}
                  onChange={() => toggle(teacher.id)}
                  disabled={disabled}
                />
              }
              label={`${teacher.name || ''} ${teacher.lastname || ''}`.trim() || `#${teacher.id}`}
            />
          ))}
        </FormGroup>
      ) : null}
      {selectedSet.size > 0 ? (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {t('adminBookings.broadcast.selectedCount', {
            count: selectedSet.size,
            defaultValue: '{{count}} instructor(s) selected',
          })}
        </Typography>
      ) : null}
    </Box>
  );
}

BroadcastTeacherMultiSelect.propTypes = {
  resort: PropTypes.string,
  selectedIds: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
};
