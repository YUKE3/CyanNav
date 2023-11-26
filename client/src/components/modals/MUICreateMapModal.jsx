import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { Close, PropaneSharp } from '@mui/icons-material';
import { FormControl, RadioGroup, Radio, FormControlLabel, FormGroup, Select, MenuItem, InputLabel, TextField } from '@mui/material';
import { DropzoneArea } from 'react-mui-dropzone'
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import { GlobalStoreContext } from '../../store'
import { useContext } from 'react';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 750,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUICreateMapModal(props) {
    const { store } = useContext(GlobalStoreContext);
    const theme = useTheme();

    const [open, setOpen] = React.useState(props.open);
    const [title, setTitle] = React.useState('Untitled');
    const [fileType, setFileType] = React.useState('');
    const [template, setTemplate] = React.useState('');
    const [files, setFiles] = React.useState([]);

    const handleClose = () => {
        setOpen(false)
        props.onClose()
    };

    const handleFileTypeChange = (event) => { // radio buttons 
        setFileType(event.target.value);
    }

    const handleTemplateChange = (event) => { // drop down menu
        setTemplate(event.target.value);
    };

    const handleFileChange = (files) => { // uploaded files
        setFiles(files);
    };

    const handleCreateMap = () => { // calls store function
        console.log(title, fileType, template, files)
        store.createMap(title, fileType, template, files);

        // closes modal
        setOpen(false)
        props.onClose()
    }

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="create-map-modal-title"
                aria-describedby="create-map-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="create-map-modal-title" variant="h6" component="h2">
                            Create Map
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 2,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>Map Title:
                            <TextField
                                required
                                placeholder="Untitled"
                                onChange={(e) => setTitle(e.target.value)}
                                sx={{ ml: 2 }}
                            />
                        </Box>


                        <FormGroup sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ mr: 2 }}>Select map file type:</Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <RadioGroup
                                        row
                                        name="map-file-type"
                                        defaultValue={'shapefiles'}
                                        onChange={handleFileTypeChange}
                                    >
                                        <FormControlLabel value="shapefiles" control={<Radio />} label="Shapefiles" />
                                        <FormControlLabel value="geojson" control={<Radio />} label="GeoJSON" />
                                        <FormControlLabel value="kml" control={<Radio />} label="KML" />
                                        <FormControlLabel value="navjson" control={<Radio />} label="NavJSON" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </FormGroup>

                        <FormGroup sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ mr: 2 }}>Select your map template:</Typography>
                                <FormControl sx={{ m: 1, minWidth: 300 }}>
                                    <InputLabel id="template-select-label">Template</InputLabel>
                                    <Select
                                        labelId="template-select-label"
                                        id="template-select"
                                        value={template}
                                        label="Template"
                                        onChange={handleTemplateChange}
                                    >
                                        <MenuItem value={'heatmap'}>Heat Map</MenuItem>
                                        <MenuItem value={'distributiveflowmap'}>Distributive Flow Map</MenuItem>
                                        <MenuItem value={'pointmap'}>Point Map</MenuItem>
                                        <MenuItem value={'choroplethmap'}>Choropleth Map</MenuItem>
                                        <MenuItem value={'3drectangle'}>3D Rectangle Map</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </FormGroup>

                        <Box sx={{ mt: 2 }}>
                            <DropzoneArea
                                onChange={handleFileChange}
                                filesLimit={3}
                                dropzoneText="Drag files here, or click below!"
                                showPreviewsInDropzone={true}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleClose} variant="outlined" sx={{ color: "black", mr: '5px' }}>Cancel</Button>
                            <Button id="createMapBtnFromMyMaps" onClick={handleCreateMap} variant="contained" sx={{ bgcolor: theme.palette.primary.main, color: "black", ml: '5px' }}>Create</Button> {/* CHANGE THE ONCLICK! */}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
