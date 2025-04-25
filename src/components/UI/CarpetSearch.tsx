import "../../Css/UI/CarpetSearch.css"
import * as React from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useUserContext} from "../../lib/UserContext.tsx";

export default function CarpetSearch() {
    const [value, setValue] = React.useState('1');


    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return(
        <>
            <div className="carpet-search-container">
                <header className={'carpet-search-header'}>
                    <h1>Carpet Collection</h1>
                    <p> Discover our exquisite selection of handcrafted carpets</p>
                </header>
                <div className="carpet-search-tabs">
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Search by Number" value="1" />
                                    <Tab label="Search by dimensions" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <div className="search-carpet-number-container">
                                    <TextField
                                        id="carpetNumTextField"
                                        defaultValue="Enter Carpet Number..."
                                        variant="filled"
                                        size="medium"
                                        fullWidth={true}
                                    />
                                    <Button className="search-button-container" variant="contained">Search Carpet</Button>
                                </div>
                            </TabPanel>
                            <TabPanel value="2">
                                <div className="search-dimensions-container">
                                    <div className="search-dimensions-text-field-container">
                                        <TextField
                                            id="carpetWidthTextField"
                                            defaultValue="Width"
                                            variant="filled"
                                            size="medium"
                                            fullWidth={true}
                                        />
                                        <p className="search-dimensions-text-field-container-para">X</p>
                                        <TextField
                                            id="carpetLengthTextField"
                                            defaultValue="Length"
                                            variant="filled"
                                            size="medium"
                                            fullWidth={true}
                                        />
                                    </div>
                                    <div className="search-button-container">
                                        <Button variant="contained">Search Carpet</Button>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </div>
            </div>
        </>
    );
}