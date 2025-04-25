import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import '../../Css/UI/CarpetForm.css';

export default function CarpetForm() {
	return (
		<>
			<div className="carpet-details-container">
				<div className="carpet-details-header">
					<h1>Luxury Carpet Details</h1>
					<p>Please fill in the specification for the carpet</p>
				</div>

				<form action="" className="carpet-details-form">
					{/* Carpet Information */}
					<div className="carpet-details-info-section">
						<h2>Carpet Information</h2>
						<div className='carpet-details-info-number'>
							<label htmlFor="carpetNum">Carpet Number</label>
							<TextField
								id="carpetNum"
								label="Enter carpet Number"
								variant="outlined"
								size="small"
								fullWidth={true}
							/>
						</div>
						<div className='carpet-details-info-type'>
							<label htmlFor="carpetType">Carpet type</label>
							<TextField
								id="carpetType"
								label="Enter carpet type"
								variant="outlined"
								size="small"
								fullWidth={true}
							/>
						</div>
					</div>
					{/* Size Section */}
					<div className="carpet-details-dimensions-section">
						<div className='carpet-details-dimensions-width'>
							<label htmlFor="carpetWidth">Width</label>
							<TextField
								id="carpetWidth"
								label="width"
								variant="outlined"
								size="small"
								fullWidth={true}
							/>
						</div>
						<div className='carpet-details-dimensions-length'>
							<label htmlFor="carpetLength">Length</label>
							<TextField
								id="carpetLength"
								label="Length"
								variant="outlined"
								size="small"
								fullWidth={true}
							/>
						</div>
						<p>Unit</p>
						<div className='carpet-details-dimensions-unit-buttons'>
							<Button variant="contained" size="small">
								<Typography textTransform={'capitalize'}>
									Feet
								</Typography>
							</Button>
							<Button variant="outlined" size="small">
								<Typography textTransform={'capitalize'}>
									Meters
								</Typography>
							</Button>

						</div>
					</div>
					<div className="carpet-details-submit-button">
						<Button variant="outlined" size="small">
							<Typography textTransform={'capitalize'}>
								Cancel
							</Typography>
						</Button>
						<Button variant="contained" size="small">
							<Typography textTransform={'capitalize'}>
								Submit
							</Typography>
						</Button>
					</div>
				</form>
			</div>
		</>
	);
}
