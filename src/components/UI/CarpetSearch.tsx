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
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from "zod";
import {CarpetDataType, getCarpetInfo} from "../../lib/firebase/FireBaseCarpet.ts";
import {CarpetDetails} from "./CarpetDetails.tsx";

const searchByNumSchema = z.object({
	carpetNum: z.string().regex(/^[a-zA-Z0-9]+$/, {
		message: 'Carpet number can only contain Letters and Numbers.',
	})
});

type SearchFormData = z.infer<typeof searchByNumSchema>;

export default function CarpetSearch() {
	const [value, setValue] = useState('1');
	const userCtx = useUserContext();
    const [carpets, setCarpets] = useState<CarpetDataType[]>([]);

	const {register, handleSubmit, formState: { errors },} = useForm<SearchFormData>({
		resolver: zodResolver(searchByNumSchema),
	})

	useEffect(() => {
		console.log(userCtx);
	}, []);

	const handleTabToggle = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	const onSubmit: SubmitHandler<SearchFormData> = (data) => {
        getCarpetInfo(data.carpetNum).then((carpetDoc) => {
            if (carpetDoc) {
                setCarpets([carpetDoc as unknown as CarpetDataType]);
                console.log("Carpet Data: ", carpets)
            } else {
                setCarpets([]);
            }
        });
	}

	return (
		<>
			<div className="carpet-search-container">
				<header className={'carpet-search-header'}>
					<h1>Carpet Collection</h1>
					<p>
						{' '}
						Discover our exquisite selection of handcrafted carpets
					</p>
				</header>
				<div className="carpet-search-tabs">
					<form onSubmit={handleSubmit(onSubmit)}>
						<Box sx={{ width: '100%', typography: 'body1' }}>
							<TabContext value={value}>
								<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
									<TabList onChange={handleTabToggle} aria-label="lab API tabs example">
										<Tab label="Search by Number" value="1" />
										<Tab label="Search by dimensions" value="2"/>
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
											<TextField
												id="carpetWidthTextField"
												label="Width"
												variant="filled"
												size="medium"
												fullWidth={true}
											/>
											<p className="search-dimensions-text-field-container-para">
												X
											</p>
											<TextField
												id="carpetLengthTextField"
												label="length"
												variant="filled"
												size="medium"
												fullWidth={true}
											/>
										</div>
										<div className="search-button-container">
											<Button type="submit" variant="contained">
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
                    {carpets.map((carpet) => (
                        <div className="carpet-search-result-items" key={carpet.carpetNum}>
                            <CarpetDetails carpet={carpet} />
                            <ImageGrid imageUrls={carpet.imageUrls} />
                        </div>
                    ))}
                </div>
			</div>
		</>
	);
}
