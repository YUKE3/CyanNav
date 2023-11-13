import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIPublishMapModal(props) {
    const [open, setOpen] = React.useState(props.open);
    const handleClose = () => {
        setOpen(false)
        props.onClose()
    };

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="delete-map-modal-title"
                aria-describedby="delete-map-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="delete-map-modal-title" variant="h6" component="h2">
                            Publish Map
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Typography id="delete-map-modal-description" variant="body1">
                        Please confirm if you would like to publish this map.<br></br>
                        Note: Once published, it can no longer be edited.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mr: 2 }}>

                        <Button
                            onClick={handleClose}
                            variant="contained"
                            sx={{
                                backgroundColor: "cyan",
                                color: "black",
                                mr: "10px"
                            }}
                        >
                            PUBLISH
                        </Button>
                        <Button
                            onClick={handleClose} /* MUST CHANGE ONCLICK! */
                            variant="outlined"
                            sx={{
                                color: "black",
                            }}
                        >
                            CANCEL
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div >
    );
}