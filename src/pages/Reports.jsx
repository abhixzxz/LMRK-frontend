import React from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const reportLinks = [
	{ text: 'Report 1', path: '/report1' },
	{ text: 'Report 2', path: '/report2' },
	{ text: 'Report 3', path: '/report3' },
	{ text: 'Report 4', path: '/report4' },
	{ text: 'Report 5', path: '/report5' },
];

const Reports = () => (
	<Box>
		<Typography variant="h4" gutterBottom>Reports</Typography>
		<List>
			{reportLinks.map(link => (
				<ListItem button key={link.text} component={Link} to={link.path}>
					<ListItemText primary={link.text} />
				</ListItem>
			))}
		</List>
	</Box>
);

export default Reports;
