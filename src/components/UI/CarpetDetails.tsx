import { CarpetDataType } from '../../lib/firebase/FireBaseCarpet.ts';

type CarpetDetailsProps = {
    carpet: CarpetDataType;
};

export const CarpetDetails = ({ carpet }: CarpetDetailsProps) => {
    return (
        <div className="carpetInfoContainer">
            <p>Carpet Number: {carpet.carpetNum}</p>
            <p>Type: {carpet.carpetType}</p>
            <p>
                Dimensions: {carpet.length} x {carpet.width} {carpet.unit}
            </p>
        </div>
    );
};