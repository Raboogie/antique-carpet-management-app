import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import '../../Css/UI/CarpetForm.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import FileUpload from './FileUpload.tsx';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
];

const userInputSchema = z.object({
	carpetNum: z.number().min(1, 'Carpet Number is required').transform(Number),
	carpetType: z.string().nonempty('Carpet Type is required'),
	width: z.number().min(1, 'Width is required').transform(Number),
	length: z.number().min(1, 'Length is required').transform(Number),
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

type InputFormData = z.infer<typeof userInputSchema>;

export default function CarpetForm() {
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
		},
	});

	const currentUnit = watch('unit');

	const onSubmit: SubmitHandler<InputFormData> = (data) => {
		console.log('Form Data Submitted:', data);
		reset(); // Reset form after submission
	};

	return (
		<>
			<div className="carpet-details-container">
				<div className="carpet-details-header">
					<h1>Luxury Carpet Details</h1>
					<p>Please fill in the specification for the carpet</p>
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
								{...register('carpetNum', {
									valueAsNumber: true,
								})}
								id="carpetNum"
								label="Enter Carpet Number"
								variant="outlined"
								size="small"
								fullWidth
								error={!!errors.carpetNum}
								helperText={errors.carpetNum?.message}
							/>{' '}
						</div>
						<div className="carpet-details-info-type">
							<label htmlFor="carpetType">Carpet type</label>
							<TextField
								{...register('carpetType')}
								id="carpetType"
								name="carpetType"
								label="Enter carpet type"
								variant="outlined"
								size="small"
								fullWidth={true}
								error={!!errors.carpetType}
								helperText={errors.carpetType?.message}
							/>{' '}
						</div>
					</div>
					{/* Size Section */}
					<div className="carpet-details-dimensions-section">
						<div className="carpet-details-dimensions-width">
							<label htmlFor="carpetWidth">Width</label>
							<TextField
								{...register('width', { valueAsNumber: true })}
								id="carpetWidth"
								name="width"
								label="width"
								variant="outlined"
								size="small"
								fullWidth={true}
								error={!!errors.width}
								helperText={errors.width?.message}
							/>{' '}
						</div>
						<div className="carpet-details-dimensions-length">
							<label htmlFor="carpetLength">Length</label>
							<TextField
								{...register('length', { valueAsNumber: true })}
								id="carpetLength"
								name="length"
								label="Length"
								variant="outlined"
								size="small"
								fullWidth={true}
								error={!!errors.length}
								helperText={errors.length?.message}
							/>{' '}
						</div>
						<p>Unit</p>
						<div className="carpet-details-dimensions-unit-buttons">
							<input type="hidden" {...register('unit')} />
							<Button
								variant={
									currentUnit === 'Feet'
										? 'contained'
										: 'outlined'
								}
								size="small"
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
								size="small"
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

					<Controller
						name="image"
						control={control}
						render={({
							field: { onChange, onBlur, value, name, ref },
						}) => (
							<FileUpload
								onFileSelect={onChange}
								value={value}
								error={errors.image?.message}
							/>
						)}
					/>
					<div className="carpet-details-submit-button">
						<Button variant="outlined" size="small" type="button">
							<Typography textTransform={'capitalize'}>
								Cancel
							</Typography>
						</Button>
						<Button variant="contained" size="small" type="submit">
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
