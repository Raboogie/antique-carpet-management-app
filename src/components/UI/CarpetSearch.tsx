import '../../Css/UI/CarpetSearch.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useUserContext } from '../../lib/UserContext.tsx';
import {useEffect, useState} from 'react';
import {ImageGrid} from './ImageGrid.tsx';
import {CarpetCardImage} from './CarpetCardImage.tsx';
import {useForm, SubmitHandler, Controller} from 'react-hook-form';
import {z} from "zod";
import {CarpetDetails} from "./CarpetDetails.tsx";
import {CarpetDataTypeWithDate} from "../../lib/firebase/FireBaseCarpet.ts";
import {useCarpets, SearchParams} from "../../hooks/useCarpets.ts";
import { useQueryClient } from '@tanstack/react-query';
import Select from "@mui/material/Select";
import {CarpetStyles} from "../../lib/constants/CarpetStyles.ts";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { useSearchParams } from 'react-router-dom';
import HeroCarousel from "./HeroCarousel.tsx";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

const searchByNumSchema = z.object({
	carpetNum: z.string().regex(/^[a-zA-Z0-9]+$/, {
		message: 'Carpet number can only contain Letters and Numbers.',
	}),
});

const searchBySizeSchema = z.object({
	maxWidth: z.coerce.number().min(1, 'Max width is required'),
	minWidth: z.coerce.number(),
	maxLength: z.coerce.number().min(1, 'Max length is required'),
	minLength: z.coerce.number(),
});

const searchByTypeSchema = z.object({
	carpetType: z.string().min(1, 'Carpet Type is required'),
});

type SearchByNumData = z.infer<typeof searchByNumSchema>;
type SearchBySizeData = z.infer<typeof searchBySizeSchema>;
type SearchByTypeData = z.infer<typeof searchByTypeSchema>;

// Combined type for react-hook-form (all fields optional for type compatibility)
type SearchFormData = {
	carpetNum?: string;
	maxWidth?: number;
	minWidth?: number;
	maxLength?: number;
	minLength?: number;
	carpetType?: string;
};

interface CarpetSearchProps {
	toggleDefaultComponent: (value: boolean) => void;
	displayDefaultComponent: boolean;
}

// Helper function to parse initial search params
function parseInitialSearchParams(urlSearchParams: URLSearchParams): SearchParams | null {
	const searchTypeParam = urlSearchParams.get('searchType') as 'number' | 'dimensions' | 'type' | null;
	if (!searchTypeParam) return null;

	switch (searchTypeParam) {
		case 'number': {
			const carpetNum = urlSearchParams.get('carpetNum');
			return carpetNum ? { type: 'number', carpetNum } : null;
		}
		case 'dimensions': {
			const maxWidth = Number(urlSearchParams.get('maxWidth'));
			const maxLength = Number(urlSearchParams.get('maxLength'));
			if (!maxWidth || !maxLength) return null;
			return {
				type: 'dimensions',
				maxWidth,
				minWidth: Number(urlSearchParams.get('minWidth')) || null,
				maxLength,
				minLength: Number(urlSearchParams.get('minLength')) || null,
			};
		}
		case 'type': {
			const carpetType = urlSearchParams.get('carpetType');
			return carpetType ? { type: 'type', carpetType } : null;
		}
		default:
			return null;
	}
}

function parseInitialTab(urlSearchParams: URLSearchParams): string {
	const searchTypeParam = urlSearchParams.get('searchType');
	if (searchTypeParam === 'number') return '1';
	if (searchTypeParam === 'dimensions') return '2';
	if (searchTypeParam === 'type') return '3';
	return '1';
}

export default function CarpetSearch({toggleDefaultComponent, displayDefaultComponent}: CarpetSearchProps) {
	const [urlSearchParams, setUrlSearchParams] = useSearchParams();
	const [viewMode, setViewMode] = React.useState('View Catalog');

	// Initialize state lazily based on URL params
	const [value, setValue] = useState(() => parseInitialTab(urlSearchParams));
	const [searchParams, setSearchParams] = useState<SearchParams | null>(() => parseInitialSearchParams(urlSearchParams));
	const [searchType, setSearchType] = useState<'number' | 'dimensions' | 'type' | null>(
		searchParams?.type ?? null
	);

	const userCtx = useUserContext();
	const queryClient = useQueryClient();
	const isAdmin = userCtx.userRole === 'Admin';

	const { data: carpets, isLoading, isError, error } = useCarpets(searchParams);
	const [displaySwitch, setDisplaySwitch] = useState(false);

	const {register, handleSubmit, formState: { errors }, reset, setError, clearErrors, control} = useForm<SearchFormData>({
		defaultValues: {
			carpetType: CarpetStyles[0]?.style || '',
		}
	});

	useEffect(() => {
		if (userCtx) {
			if (userCtx.userRole === 'Admin') {
				setDisplaySwitch(true);
			}
		}
	}, [userCtx]);

	const handleTabToggle = (_event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
		reset();
		clearErrors();
		setSearchParams(null);
		setSearchType(null);
		setUrlSearchParams({});
	};

	const onSubmit: SubmitHandler<SearchFormData> = (data) => {
		clearErrors();
		let schema;
		if (value === '1') schema = searchByNumSchema;
		else if (value === '2') schema = searchBySizeSchema;
		else schema = searchByTypeSchema;

		const result = schema.safeParse(data);

		if (!result.success) {
			result.error.errors.forEach((error) => {
				const fieldName = error.path[0] as keyof SearchFormData;
				setError(fieldName, {
					type: 'manual',
					message: error.message,
				});
			});
			return;
		}

		if (value === '1') {
			const { carpetNum } = result.data as SearchByNumData;
			setSearchType('number');
			setSearchParams({ type: 'number', carpetNum });
			setUrlSearchParams({ searchType: 'number', carpetNum });
		} else if (value === '2') {
			const { maxWidth, minWidth, maxLength, minLength } = result.data as SearchBySizeData;
			setSearchType('dimensions');
			const params: SearchParams = {
				type: 'dimensions',
				maxWidth,
				minWidth: minWidth || null,
				maxLength,
				minLength: minLength || null,
			};
			setSearchParams(params);
			setUrlSearchParams({
				searchType: 'dimensions',
				maxWidth: String(maxWidth),
				...(minWidth ? { minWidth: String(minWidth) } : {}),
				maxLength: String(maxLength),
				...(minLength ? { minLength: String(minLength) } : {}),
			});
		} else if (value === '3') {
			const { carpetType } = result.data as SearchByTypeData;
			setSearchType('type');
			setSearchParams({ type: 'type', carpetType });
			setUrlSearchParams({ searchType: 'type', carpetType });
		}
	}

	const handleSwitchChange = (_event: React.MouseEvent<HTMLElement>,
								 newAlignment: string) => {
		setViewMode(newAlignment);
		toggleDefaultComponent(!displayDefaultComponent);
	};

	const handleCarpetDeleted = (deletedCarpetNum: string) => {
		queryClient.setQueryData<CarpetDataTypeWithDate[]>(
			['carpets', searchParams],
			(old) => old?.filter((c) => c.carpetNum !== deletedCarpetNum)
		);
	};

	const handleImageDeleted = (carpetNum: string, deletedUrl: string) => {
		queryClient.setQueryData<CarpetDataTypeWithDate[]>(
			['carpets', searchParams],
			(old) => old?.map((c) =>
				c.carpetNum === carpetNum
					? { ...c, imageUrls: c.imageUrls.filter((url) => url !== deletedUrl) }
					: c
			)
		);
	};

	return (
		<>
			<div className="carpet-search-container">
				<header className={'carpet-search-header'}>
					<div>
						{displaySwitch && (<>
							<ToggleButtonGroup
								color="primary"
								value={viewMode}
								exclusive
								onChange={handleSwitchChange}
								aria-label="Platform"
							>
								<ToggleButton value="View Catalog">View Catalog</ToggleButton>
								<ToggleButton value="Add New Carpet">Add New Carpet</ToggleButton>
							</ToggleButtonGroup>
						</>)}
					</div>
					<h1>Carpet Collection</h1>
					<p>
						{' '}
						Discover our exquisite selection of handcrafted carpets
					</p>
				</header>
				<div className="carpet-search-tabs">
					<section>
						<HeroCarousel/>
					</section>
					<form onSubmit={handleSubmit(onSubmit)}>

						<Box sx={{ width: '100%', typography: 'body1' }}>
							<h4 className='search-tabs-header'>Search By</h4>
							<TabContext value={value}>
								<Box sx={{ borderBottom: 1, borderColor: 'divider',  width: '100%' }}>
									<TabList onChange={handleTabToggle} aria-label="lab API tabs example" variant="scrollable"
											 scrollButtons="auto"
											 allowScrollButtonsMobile>
										<Tab label="Number" value="1" />
										<Tab label="Dimensions" value="2"/>
										<Tab label="Type" value="3"/>
									</TabList>
								</Box>
								<TabPanel value="1">
									<div className="search-carpet-number-container">
										<TextField
											id="carpetNumTextField"
											{...register('carpetNum')}
											label="Enter Carpet Number"
											error={!!errors.carpetNum}
											helperText={errors.carpetNum?.message}
											variant="filled"
											size="medium"
											fullWidth={true}
										/>
                                        <div className="search-button-container">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                            >
                                                Search Carpet
                                            </Button>
                                        </div>
									</div>
								</TabPanel>
								<TabPanel value="2">
									<div className="search-dimensions-container">
										<div className="search-dimensions-text-field-container">
											<div className="search-dimensions-length-container">
												<TextField
													id="carpetMaxLengthTextField"
													{...register('maxLength')}
													label="Max Length"
													error={!!errors.maxLength}
													helperText={errors.maxLength?.message}
													variant="filled"
													size="medium"
													fullWidth={true}
													type="number"
												/>
												<TextField
													id="carpetMinLengthTextField"
													{...register('minLength')}
													label="Min Length"
													error={!!errors.minLength}
													helperText={errors.minLength?.message}
													variant="filled"
													size="medium"
													fullWidth={true}
													type="number"
												/>
											</div>
											<p className="search-dimensions-text-field-container-para">
												X
											</p>
											<div className="search-dimensions-width-container">
												<TextField
													id="carpetMaxWidthTextField"
													{...register('maxWidth')}
													label="Max Width"
													error={!!errors.maxWidth}
													helperText={errors.maxWidth?.message}
													variant="filled"
													size="medium"
													fullWidth={true}
													type="number"
												/>
												<TextField
													id="carpetMinWidthTextField"
													{...register('minWidth')}
													label="Min Width"
													error={!!errors.minWidth}
													helperText={errors.minWidth?.message}
													variant="filled"
													size="medium"
													fullWidth={true}
													type="number"
												/>
											</div>
										</div>
										<div className="search-button-container">
											<Button type="submit" variant="contained">
												Search Carpet
											</Button>
										</div>
									</div>
								</TabPanel>
								<TabPanel value="3">
									<div className="search-carpet-type-container">
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
										<div className="search-button-container">
											<Button
												type="submit"
												variant="contained"
											>
												Search Carpet
											</Button>
										</div>
									</div>
								</TabPanel>
							</TabContext>
						</Box>
					</form>
				</div>
                <div className="carpet-search-results">
                    {isLoading && <p>Loading...</p>}
                    {isError && <p>Error loading carpets: {error?.message}</p>}
                    {!isLoading && !isError && (searchType === 'number') && carpets?.map((carpet) => (
                        <div className="carpet-search-result-items" key={carpet.carpetNum}>
                            <CarpetDetails
                                carpet={carpet}
                                {...(isAdmin && { onDeleted: handleCarpetDeleted })}
                            />
                            <ImageGrid
                                imageUrls={carpet.imageUrls}
                                isAdmin={isAdmin}
                                carpetNum={carpet.carpetNum}
                                onImageDeleted={(deletedUrl) => handleImageDeleted(carpet.carpetNum, deletedUrl)}
                            />
                        </div>
                    ))}
                    {!isLoading && !isError && (searchType === 'dimensions' || searchType === 'type') && carpets?.map((carpet) => (
                        <div className="carpet-search-result-items" key={carpet.carpetNum}>
                            <CarpetDetails
                                carpet={carpet}
                                {...(isAdmin && { onDeleted: handleCarpetDeleted })}
                            />
                            {carpet.imageUrls && carpet.imageUrls.length > 0 && (
                                <CarpetCardImage
                                    imageUrl={carpet.imageUrls[0]}
                                    carpetNum={carpet.carpetNum}
                                    altText={`Carpet ${carpet.carpetNum} - ${carpet.carpetType}`}
                                />
                            )}
                        </div>
                    ))}
                    {!isLoading && !isError && searchType && carpets?.length === 0 && (
                        <p>No carpets found.</p>
                    )}
                </div>
			</div>
		</>
	);
}
