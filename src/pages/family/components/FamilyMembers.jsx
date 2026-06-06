import {
  Box,
  Grid,
  Typography,
} from '@mui/material'

import MemberCard from './MemberCard'

export default function FamilyMembers({
  members,
  onEdit,
}) {
  return (
    <Box>
      <Typography
        sx={{
          color: '#fff',
          fontSize: 18,
          fontWeight: 700,
          mb: 2,
        }}
      >
        Family Members
      </Typography>

      <Grid
        container
        spacing={2}
      >
        {members?.map(
          (member) => (
            <Grid
              item
              xs={12}
              md={6}
              key={member.id}
            >
              <MemberCard
                member={member}
                onEdit={onEdit}
              />
            </Grid>
          )
        )}
      </Grid>
    </Box>
  )
}
