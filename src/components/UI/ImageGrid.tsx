import { useState, useEffect } from 'react';
import '../../Css/UI/ImageGrid.css';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type ImageGridProps = {
    imageUrls: string[];
}

export const ImageGrid = ({ imageUrls }: ImageGridProps) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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
        </>
    );
};
