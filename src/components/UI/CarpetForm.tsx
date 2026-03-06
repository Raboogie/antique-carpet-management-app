import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import '../../Css/UI/CarpetForm.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import FileUpload from './FileUpload.tsx';
import {useEffect, useState} from 'react';
import { useImageStorage } from '../../hooks/useImageStorage.ts';
import {CarpetStyles} from "../../lib/constants/CarpetStyles.ts";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import * as React from 'react';
import {useUserContext} from "../../lib/UserContext.tsx";
import { ErrorBoundary } from 'react-error-boundary';
import { WidgetErrorFallback } from './ErrorBoundaryFallback';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
];

const userInputSchema = z.object({
	carpetNum: z.string().regex(/^[a-zA-Z0-9]+$/, {
		message: 'Carpet number can only contain Letters and Numbers.',
	}),
	carpetType: z.string().nonempty('Carpet Type is required'),
	width: z.number().min(1, 'Width is required').transform(Number),
	length: z.number().min(1, 'Length is required').transform(Number),
	// We use z.number().optional() here instead of z.coerce.number() or z.preprocess
	// because React Hook Form handles the string-to-number parsing natively via 'setValueAs' in the JSX.
	// This avoids Zod returning "Expected number, received NaN" when the input is cleared.
	widthInches: z.number().optional(),
	lengthInches: z.number().optional(),
	unit: z.string(),
	image: z
		.array(z.instanceof(File))
		.min(1, 'At least one image is required.')
		.refine(
			(files) => files.every((file) => file.size <= MAX_FILE_SIZE),
			`Max file size is 5MB.`
		)
		.refine(
			(files) =>
				files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		),
});

export type InputFormData = z.infer<typeof userInputSchema>;

interface CarpetFormProps {
	toggleDefaultComponent: (value: boolean) => void;
	displayDefaultComponent: boolean;
}

const parseOptionalNumber = (v: unknown) => v === "" || v == null || isNaN(Number(v)) ? undefined : Number(v);

function CarpetFormBase({toggleDefaultComponent, displayDefaultComponent}: CarpetFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
		control,
	} = useForm<InputFormData>({
		resolver: zodResolver(userInputSchema),
		defaultValues: {
			unit: 'Feet',
			image: [],
            carpetType: CarpetStyles[0]?.style || '',
		},
	});

	const currentUnit = watch('unit');
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [submittedData, setSubmittedData] = useState<InputFormData | null>(
		null
	);
	const userCtx = useUserContext();
	const [alignment, setAlignment] = React.useState('Add New Carpet');
	const [displaySwitch, setDisplaySwitch] = useState(false);
	const { progress } = useImageStorage(submittedData);

	useEffect(() => {
		if (userCtx) {
			if (userCtx.userRole === 'Admin') {
				setDisplaySwitch(true);
			}
		}
	}, [userCtx]);

	const onSubmit: SubmitHandler<InputFormData> = (data) => {
		//console.log('Form Data Submitted:', data);
		//console.log(data.image);
		setSubmittedData(data);
		console.log('Progress %', progress);
		setSuccessMessage('Form submitted successfully');
		reset();
	};

	const handleSwitchChange = (_event: React.MouseEvent<HTMLElement>,
								 newAlignment: string) => {
		setAlignment(newAlignment);
		toggleDefaultComponent(!displayDefaultComponent);
	};

	return (
		<div className="carpet-details-container">
			<div className="carpet-details-header">
				<div>
					{displaySwitch && (<>
						<ToggleButtonGroup
							color="primary"
							value={alignment}
							exclusive
							onChange={handleSwitchChange}
							aria-label="Platform"
						>
							<ToggleButton value="View Catalog">View Catalog</ToggleButton>
							<ToggleButton value="Add New Carpet">Add New Carpet</ToggleButton>
						</ToggleButtonGroup>
					</>)}
				</div>
				<h1>✨ Luxury Carpet Details</h1>
				<p>
					Create your perfect carpet profile with style and elegance
				</p>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="carpet-details-form"
			>
				{/* Carpet Information */}
				<div className="carpet-details-info-section">
					<h2>Carpet Information</h2>
					<div className="carpet-details-info-number">
						<label htmlFor="carpetNum">Carpet Number</label>
						<TextField
							{...register('carpetNum')}
							id="carpetNum"
							label="Enter Carpet Number"
							variant="outlined"
							size="medium"
							fullWidth
							error={!!errors.carpetNum}
							helperText={errors.carpetNum?.message}
						/>
					</div>
					<div className="carpet-details-info-type">
						<label htmlFor="carpetType">Carpet Type</label>
						<Controller
							name="carpetType"
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									labelId="carpetType"
									id="carpetType"
									fullWidth={true}
									error={!!errors.carpetType}
								>
									{CarpetStyles.map((style) => (
										<MenuItem key={style.style} value={style.style}>
											{style.style}
										</MenuItem>
									))}
								</Select>
							)}
						/>
                        {errors.carpetType && <FormHelperText error>{errors.carpetType.message}</FormHelperText>}
					</div>
				</div>

				{/* Size Section */}
				<div className="carpet-details-dimensions-section">
					<div className="dimensions-feet-container">
						<div className="carpet-details-dimensions-length">
							<label htmlFor="carpetLength">Length</label>
							<TextField
								{...register('length', { valueAsNumber: true })}
								id="carpetLength"
								name="length"
								label={currentUnit === 'Feet' ? 'Feet' : 'Meters'}
								variant="outlined"
								size="medium"
								fullWidth={true}
								error={!!errors.length}
								helperText={errors.length?.message}
							/>
						</div>
						<div className="carpet-details-dimensions-width">
							<label htmlFor="carpetWidth">Width</label>
							<TextField
								{...register('width', { valueAsNumber: true })}
								id="carpetWidth"
								name="width"
								label={currentUnit === 'Feet' ? 'Feet' : 'Meters'}
								variant="outlined"
								size="medium"
								fullWidth={true}
								error={!!errors.width}
								helperText={errors.width?.message}
							/>
						</div>
					</div>
					
					{currentUnit === 'Feet' && (
						<div className="dimensions-inches-container">
							<div className="carpet-details-dimensions-lengthInches">
								{/* 
									We use setValueAs instead of valueAsNumber: true. 
									When an input is cleared, it emits "". valueAsNumber turns "" into NaN, which breaks Zod validation. 
									This intercepts the "" (or null/NaN) and cleanly converts it to undefined before handing it to Zod. This is needed because the schema is optional. If we don't do this, the schema will not accept undefined values. It avoids Zod returning "Expected number, received NaN" when the input is cleared/empty.
								*/}
								<TextField
									{...register('lengthInches', { setValueAs: parseOptionalNumber })}
									id="carpetLengthInches"
									name="lengthInches"
									label="Inches"
									variant="outlined"
									size="medium"
									fullWidth={true}
									error={!!errors.lengthInches}
									helperText={errors.lengthInches?.message}
								/>
							</div>
							<div className="carpet-details-dimensions-widthInches">
								{/* 
									Same logic as lengthInches: safely catch empty or invalid inputs 
									and pass undefined to Zod so the optional schema accepts it without NaN errors.
								*/}
								<TextField
									{...register('widthInches', { setValueAs: parseOptionalNumber })}
									id="carpetWidthInches"
									name="widthInches"
									label="Inches"
									variant="outlined"
									size="medium"
									fullWidth={true}
									error={!!errors.widthInches}
									helperText={errors.widthInches?.message}
								/>
							</div>
						</div>
					)}
				
					<p className="carpet-details-dimensions-unit-label">
						Unit of Measurement
					</p>
					<div className="carpet-details-dimensions-unit-buttons">
						<input type="hidden" {...register('unit')} />
						<Button
							variant={
								currentUnit === 'Feet'
									? 'contained'
									: 'outlined'
							}
							size="large"
							onClick={() =>
								setValue('unit', 'Feet', {
									shouldValidate: true,
								})
							}
						>
							<Typography textTransform={'capitalize'}>
								Feet
							</Typography>
						</Button>
						<Button
							variant={
								currentUnit === 'Meters'
									? 'contained'
									: 'outlined'
							}
							size="large"
							onClick={() =>
								setValue('unit', 'Meters', {
									shouldValidate: true,
								})
							}
						>
							<Typography textTransform={'capitalize'}>
								Meters
							</Typography>
						</Button>
					</div>
				</div>

				{successMessage && (
					<div className="success-message">
						{successMessage}! Your carpet details have been saved.
					</div>
				)}

				<Controller
					name="image"
					control={control}
					render={({
						field: { onChange, value},
					}) => (
						<FileUpload
							onFileSelect={onChange}
							value={value}
							error={errors.image?.message}
						/>
					)}
				/>

				<div className="carpet-details-submit-button">
					<Button variant="outlined" size="large" type="button">
						<Typography textTransform={'capitalize'}>
							Cancel
						</Typography>
					</Button>
					<Button variant="contained" size="large" type="submit">
						<Typography textTransform={'capitalize'}>
							Submit Details
						</Typography>
					</Button>
				</div>
			</form>
		</div>
	);
}

export default function CarpetForm(props: CarpetFormProps) {
    return (
        <ErrorBoundary FallbackComponent={WidgetErrorFallback}>
            <CarpetFormBase {...props} />
        </ErrorBoundary>
    );
}
