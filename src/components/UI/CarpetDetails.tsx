import { CarpetDataTypeWithDate } from '../../lib/firebase/FireBaseCarpet.ts';
import '../../Css/UI/CarpetDetails.css';

type CarpetDetailsProps = {
    carpet: CarpetDataTypeWithDate;
};

export const CarpetDetails = ({ carpet }: CarpetDetailsProps) => {
    const isFeet = carpet.unit === 'Feet';
    const unitLabel = isFeet ? 'ft' : 'm';

    return (
        <div className="carpet-details-card">
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
        </div>
    );
};