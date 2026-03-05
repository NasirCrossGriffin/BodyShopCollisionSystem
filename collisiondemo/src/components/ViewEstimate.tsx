import React, { useEffect, useState } from 'react';
import '../styles/ViewEstimate.css';
import { getUserById } from './middleware/user';
import { getEstimatePhotos } from './middleware/estimatephoto';
import { createEstimate } from './middleware/estimate';
import { createEstimateContact } from './middleware/contact';

function ViewEstimate({
    estimate,
    setViewEstimate,
    bodyShop
} : {
    estimate: any;
    setViewEstimate: React.Dispatch<React.SetStateAction<Boolean>>;
    bodyShop : any
}) {
    const [user, setUser] = useState<any>(null);
    const [estimatePhotos, setEstimatePhotos] = useState<Array<any>>([]);
    const [estimatePrice, setEstimatePrice] = useState<string>("");
    const [completedEstimate, setCompletedEstimate] = useState<any>(null);
    const [estimatePriceValidator, setEstimatePriceValidator] = useState<string>('');

    useEffect(() => {
        generateEstimateContact();
    }, [completedEstimate])

    useEffect(() => {
        console.log(bodyShop);
    }, [bodyShop])

    useEffect(() => {
        if (estimate) {
            const getUser = async () => {
                const foundUser = await getUserById(estimate.user);
                console.log(foundUser);
                setUser(foundUser);
            }; 

            const getAllEstimatePhotos = async () => {
                const estimatePhotos = await getEstimatePhotos(estimate._id);
                setEstimatePhotos(estimatePhotos);
            };
            
            getUser(); getAllEstimatePhotos();
        }
    }, [estimate])

    const formatIsoString = (value: string) => {
        if (!value || value.trim().length === 0) return '';

        const d = new Date(value);
        if (isNaN(d.getTime())) return value; // fallback: show raw if invalid

        return d.toLocaleString(undefined, {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const generateEstimateContact = async () => {
        if (!(user && estimate && bodyShop)) return;

        const newEstimateContact = {
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName,
            appointmentDateTime : estimate.appointmentDateTime,
            bodyshop : bodyShop._id,
            price : parseEstimatePrice(estimatePrice)
        }

        const completedContact = await createEstimateContact(newEstimateContact);

        console.log(completedContact);
    }

    const clickHandler = async () => {
        const priceNumber = parseEstimatePrice(estimatePrice);

        const validation = validateEstimatePrice(estimatePrice);
        setEstimatePriceValidator(validation);
        if (validation !== '') return;

        const protoEstimate = {
            estimateQuery: estimate._id,
            price: priceNumber as number
        };

        const newEstimate = await createEstimate(protoEstimate);
        console.log(newEstimate);

        setCompletedEstimate(newEstimate);
    };

    const normalizePriceString = (value: string) => {
    // remove $ and commas and whitespace
    return value.replace(/\$/g, '').replace(/,/g, '').trim();
    };

    const parseEstimatePrice = (value: string) => {
        const normalized = normalizePriceString(value);
        if (normalized.length === 0) return null;

        const num = Number(normalized);
        if (!Number.isFinite(num)) return null;
        if (num < 0) return null;

        return num;
    };

    const validateEstimatePrice = (value: string) => {
        const parsed = parseEstimatePrice(value);
        return parsed === null ? 'Enter a valid numeric price (e.g. 2500 or $2,500)' : '';
    };
        
    return (
        <>
            {estimate ? <div className='ViewEstimate'>
                <div className='Background' onClick={() => setViewEstimate(false)}></div>
                <div className='ViewEstimateContainer'>
                    <div className='ContentContainer'>
                        {estimate && user ? <div className='EstimateInformation'>
                            <div className='EstimateField'>
                                <h3>Request Created At:</h3>
                                <p>{formatIsoString(estimate.createdAt)}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Appointment Date and Time:</h3>
                                <p>{formatIsoString(estimate.appointmentDateTime)}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Name:</h3>
                                <p>{user.firstName + " " + user.lastName}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Email:</h3>
                                <p>{user.email}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Phone Number:</h3>
                                <p>{user.phoneNumber}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Vehicle Make:</h3>
                                <p>{estimate.make}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Vehicle Model:</h3>
                                <p>{estimate.model}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Vehicle Year:</h3>
                                <p>{estimate.vehicleYear}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Using Insurance:</h3>
                                <p>{estimate.usingInsurance ? "Yes" : "Out Of Pocket"}</p>
                            </div>

                            {
                                estimate. usingInsurance ? 
                                <>
                                    <div className='EstimateField'>
                                        <h3>Insurer:</h3>
                                        <p>{estimate.insurerName}</p>
                                    </div> 

                                    <div className='EstimateField'>
                                        <h3>Policy Number:</h3>
                                        <p>{estimate.policyNumber}</p>
                                    </div> 
                                </>: null
                            }
                        </div> : null}

                        {estimate ? <div className='Description'>
                            <p>{estimate.damageDescription}</p>
                        </div> : null}

                        <div className='EstimatePhotosContainer'>
                            {estimate && estimatePhotos.length > 0 ? <div className='EstimatePhotos'>
                                {estimatePhotos.map((estimatePhoto, index) => (<div className='EstimatePhoto' key={index}>
                                    <img src={estimatePhoto.url}/>
                                </div>))}
                            </div> : null}
                        </div>

                        <div className='EstimatePrice'>
                            <label htmlFor='EstimatePriceInput'>Price Estimate</label>
                            <input
                                name="EstimatePriceInput"
                                type="text"
                                placeholder="$2,500"
                                value={estimatePrice}
                                onChange={(e) => setEstimatePrice(e.currentTarget.value)}
                            />
                            <button onClick={() => clickHandler()}>Send</button>
                        </div>

                        {estimatePriceValidator !== '' ? (
                                <p className="Validator">{estimatePriceValidator}</p>
                                ) : null}

                        {completedEstimate ? <p className='EstimateSent'>The estimate was sent to the customer</p> : null}
                    </div>
                </div>
            </div> : null}
        </>
    )
}

export default ViewEstimate;
