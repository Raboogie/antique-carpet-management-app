import { useState, useEffect } from 'react';
import '../../Css/UI/ImageGrid.css';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCarpetImage } from '../../lib/firebase/FireBaseCarpet';

type ImageGridProps = {
    imageUrls: string[];
    isAdmin?: boolean;
    carpetNum?: string;
    onImageDeleted?: (deletedUrl: string) => void;
}

export const ImageGrid = ({ imageUrls, isAdmin = false, carpetNum, onImageDeleted }: ImageGridProps) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ url: string; index: number } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openModal = (index: number) => {
        setSelectedImageIndex(index);
    };

    const closeModal = () => {
        setSelectedImageIndex(null);

    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => 
                prev === 0 ? imageUrls.length - 1 : (prev as number) - 1
            );
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => 
                prev === imageUrls.length - 1 ? 0 : (prev as number) + 1
            );
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, url: string, index: number) => {
        e.stopPropagation();
        setDeleteTarget({ url, index });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget || !carpetNum) return;

        setIsDeleting(true);
        try {
            await deleteCarpetImage(carpetNum, deleteTarget.url);
            onImageDeleted?.(deleteTarget.url);
        } catch (err) {
            console.error('Error deleting image:', err);
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteTarget(null);
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') setSelectedImageIndex((prev) => prev === 0 ? imageUrls.length - 1 : (prev as number) - 1);
            if (e.key === 'ArrowRight') setSelectedImageIndex((prev) => prev === imageUrls.length - 1 ? 0 : (prev as number) + 1);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, imageUrls.length]);

    // Safety check: Adjust selection if the underlying array changes (e.g., external deletion)
    useEffect(() => {
        if (selectedImageIndex !== null && selectedImageIndex >= imageUrls.length) {
            // If the index is out of bounds, reset to the last valid image or close if empty
            setSelectedImageIndex(imageUrls.length > 0 ? imageUrls.length - 1 : null);
        }
    }, [imageUrls, selectedImageIndex]);

    return (
        <>
            <div className="imageGrid-container">
                {imageUrls && imageUrls.map((imgUrl, index) => (
                    <div 
                        className="image-item" 
                        key={imgUrl}
                        onClick={() => openModal(index)}
                    >
                        <img src={imgUrl} alt={`Carpet view ${index + 1}`} loading="lazy" />
                        {isAdmin && carpetNum && (
                            <IconButton
                                className="image-delete-btn"
                                onClick={(e) => handleDeleteClick(e, imgUrl, index)}
                                aria-label="delete image"
                                size="small"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </div>
                ))}
            </div>

            {selectedImageIndex !== null && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <IconButton 
                            className="modal-close-btn" 
                            onClick={closeModal}
                            aria-label="close"
                            size="large"
                        >
                            <CloseIcon />
                        </IconButton>
                        
                        <div className="modal-image-container">
                            <img 
                                src={imageUrls[selectedImageIndex]} 
                                alt={`Enlarged view ${selectedImageIndex + 1}`} 
                                className="modal-image"
                            />
                        </div>

                        {imageUrls.length > 1 && (
                            <>
                                <IconButton 
                                    className="modal-nav-btn prev" 
                                    onClick={handlePrev}
                                    aria-label="previous image"
                                    size="large"
                                >
                                    <ArrowBackIosNewIcon />
                                </IconButton>
                                <IconButton 
                                    className="modal-nav-btn next" 
                                    onClick={handleNext}
                                    aria-label="next image"
                                    size="large"
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                                
                                <div className="modal-counter">
                                    {selectedImageIndex + 1} / {imageUrls.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            
            <Dialog
                open={deleteTarget !== null}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Delete Image</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this image? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
