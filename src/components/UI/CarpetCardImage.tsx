import '../../Css/UI/ImageGrid.css';
import { useNavigate, useLocation } from 'react-router';

type CarpetCardImageProps = {
    imageUrl: string;
    carpetNum: string;
    altText?: string;
}

export const CarpetCardImage = ({ imageUrl, carpetNum, altText }: CarpetCardImageProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        navigate(`/carpet/${carpetNum}`, {
            state: { from: location.pathname + location.search }
        });
    };

    return (
        <div className="carpet-card-image-container">
            <div
                className="carpet-card-image-item"
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                    }
                }}
            >
                <img
                    src={imageUrl}
                    alt={altText || `Carpet ${carpetNum}`}
                    loading="lazy"
                />
                <div className="carpet-card-overlay">
                    <span>Click to view details</span>
                </div>
            </div>
        </div>
    );
};


