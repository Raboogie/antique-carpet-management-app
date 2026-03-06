import { useState } from 'react';
import { CarpetDataTypeWithDate, deleteCarpet } from '../../lib/firebase/FireBaseCarpet.ts';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import '../../Css/UI/CarpetDetails.css';
import { useLongPress } from '../../hooks/useLongPress';

type CarpetDetailsProps = {
    carpet: CarpetDataTypeWithDate;
    /**
     * Called after a carpet is successfully deleted.
     * When provided, the delete icon button is shown and deletion is handled
     * internally. The parent is responsible for removing the carpet from its
     * own state/cache (e.g. on CarpetSearch) or navigating away (CarpetDetail).
     * When omitted, no delete button is rendered.
     */
    onDeleted?: (deletedCarpetNum: string) => void;
};

export const CarpetDetails = ({ carpet, onDeleted }: CarpetDetailsProps) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeletingCarpet, setIsDeletingCarpet] = useState(false);
    const isFeet = carpet.unit === 'Feet';
    const unitLabel = isFeet ? 'ft' : 'm';

    // Long-press: after 300ms hold, reveals the delete icon button for 3s
    const { handlers, isPressed } = useLongPress(300, 3000);

    const handleDeleteCarpetConfirm = async () => {
        setIsDeletingCarpet(true);
        try {
            await deleteCarpet(carpet.carpetNum, carpet.imageUrls);
            setIsDeleteDialogOpen(false);
            onDeleted?.(carpet.carpetNum);
        } catch (err) {
            console.error('Error deleting carpet:', err);
        } finally {
            setIsDeletingCarpet(false);
        }
    };

    return (
        <div
            className={`carpet-details-card${isPressed ? ' is-long-pressed' : ''}`}
            {...handlers}
        >
            <div className="searched-carpet-details-header">
                <div className="detail-item">
                    <span className="detail-label">Carpet Number</span>
                    <h3 className='carpet-number-label'>{carpet.carpetNum}</h3>
                </div>
                <span className="carpet-type-badge">{carpet.carpetType}</span>
            </div>
            <div className="searched-carpet-details-body">
                <div className="detail-item">
                    <span className="detail-label">Dimensions</span>
                    <span className="detail-value">
                        {carpet.length}
                        <span className="dimension-separator">{unitLabel}</span>
                        {isFeet && carpet.lengthInches != null && carpet.lengthInches > 0 && (
                            <>
                                {carpet.lengthInches}
                                <span className="dimension-separator">in</span>
                            </>
                        )}
                        <span className="dimension-by-separator">×</span>
                        {carpet.width}
                        <span className="dimension-separator">{unitLabel}</span>
                        {isFeet && carpet.widthInches != null && carpet.widthInches > 0 && (
                            <>
                                {carpet.widthInches}
                                <span className="dimension-separator">in</span>
                            </>
                        )}
                    </span>
                </div>
            </div>

            {/* Delete icon button — only shown when a parent provides onDeleted */}
            {onDeleted && (
                <>
                    <IconButton
                        className="carpet-details-delete-icon-btn"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        aria-label="delete carpet"
                        size="small"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>

                    <Dialog
                        open={isDeleteDialogOpen}
                        onClose={() => setIsDeleteDialogOpen(false)}
                    >
                        <DialogTitle>Delete Carpet</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this carpet? This action will also delete all its associated images from storage and cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeletingCarpet}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteCarpetConfirm}
                                color="error"
                                variant="contained"
                                disabled={isDeletingCarpet}
                            >
                                {isDeletingCarpet ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </div>
    );
};