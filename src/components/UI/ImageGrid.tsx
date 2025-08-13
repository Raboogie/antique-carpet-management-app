import '../../Css/UI/ImageGrid.css';

type ImageGridProps = {
    imageUrls: string[];
}

export const ImageGrid = ({imageUrls}: ImageGridProps) => {
    return (
        <div className="imageGrid-container">
            { imageUrls && imageUrls.map((imaUrl) => (
                    <div className="image-item" key={imaUrl}>
                        <img src={imaUrl} alt={"picture of a carpet"}/>
                    </div>
                ))
            }
        </div>
    );
};