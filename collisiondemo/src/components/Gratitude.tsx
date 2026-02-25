import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import '../styles/Gratitude.css'
import { getBodyShopByName } from './middleware/bodyshop.ts';

function Gratitude() {
    const { autobody } = useParams();
    const [bodyShop, setBodyShop] = useState<any>(null);

    useEffect(() => {
        const getBodyShop = async () => {
            if (autobody) {
                const protoBodyShop = await getBodyShopByName(autobody);
                console.log(protoBodyShop)
                setBodyShop(protoBodyShop);
            } 

            return;
        }; getBodyShop();
    }, [])
    
    return (
        <>
            <div className='Gratitude'>
                {bodyShop ? <div className='Logo'>
                    <img src={bodyShop.logo} />
                </div> : null}

                <div className='GratitudeContainer fade-in-slide-up'>
                    <h1>Thank You!</h1> 
                    {bodyShop ? <h2>{bodyShop.name} has received your request.</h2> : null}
                    <h2>Please check your email.</h2>
                </div>
            </div>
        </>
    )
}


    export default Gratitude;
