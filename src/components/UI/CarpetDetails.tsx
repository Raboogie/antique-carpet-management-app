import { CarpetDataTypeWithDate } from '../../lib/firebase/FireBaseCarpet.ts';
import '../../Css/UI/CarpetDetails.css';

type CarpetDetailsProps = {
    carpet: CarpetDataTypeWithDate;
};

export const CarpetDetails = ({ carpet }: CarpetDetailsProps) => {
    return (
        <div className="carpet-details-card">
            <div className="carpet-details-header">
                <div className="detail-item">
                    <span className="detail-label">Carpet Number</span>
                    <h3 className='carpet-number-label'>{carpet.carpetNum}</h3>
                </div>
                <span className="carpet-type-badge">{carpet.carpetType}</span>
            </div>
            <div className="carpet-details-body">
                <div className="detail-item">
                    <span className="detail-label">Dimensions</span>
                    <span className="detail-value">
                        {carpet.length} <span style={{color: '#cbd5e1', margin: '0 4px'}}>×</span> {carpet.width} 
                        <span className="detail-value-unit">{carpet.unit}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};