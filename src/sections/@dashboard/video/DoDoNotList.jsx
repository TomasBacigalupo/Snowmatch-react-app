import React, { useState } from "react";
import { Box, Paper, Typography, Tabs, Tab } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";

const RootStyle = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
}));

const ListContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2)
}));

const ListItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

const DoDontList = ({ title, doItems, dontItems }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <RootStyle>
        {/* Tabs */}
        <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)} >
          <Tab label="✅ Do" />
          <Tab label="❌ Don't" />
        </Tabs>

        {/* Do List */}
        {tabIndex === 0 && (
          <ListContainer>
            {doItems.map((item, index) => (
              <ListItem key={index}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="body2">{item}</Typography>
              </ListItem>
            ))}
          </ListContainer>
        )}

        {/* Don't List */}
        {tabIndex === 1 && (
          <ListContainer>
            {dontItems.map((item, index) => (
              <ListItem key={index}>
                <CancelIcon color="error" fontSize="small" />
                <Typography variant="body2">{item}</Typography>
              </ListItem>
            ))}
          </ListContainer>
        )}
      </RootStyle>
    </Box>
  );
};

export default DoDontList;