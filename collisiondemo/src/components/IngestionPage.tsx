import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/IngestionPage.css'
import { getBodyShopByName } from './middleware/bodyshop';
import { createUser } from './middleware/user';
import AppointmentDatePicker from './DatePicker';
import { uploadToS3 } from './middleware/s3';
import { createEstimatePhoto } from './middleware/estimatephoto';
import { createEstimateQuery } from './middleware/estimatequery';
import { newContact } from './middleware/contact';

function IngestionPage() {
    const { autobody } = useParams();
    const navigate = useNavigate();


    const FormState = [
        'Driver Information',
        'Vehicle Information',
        'Damage Description',
        'Photo Upload',
        'Insurance Information',
        'Appointment Date Selection',
        'Confirmation'
    ]

    const [bodyShop, setBodyShop] = useState<any>(null);

    const [formState] = useState<Array<string>>(FormState);
    const [formIndex, setFormIndex] = useState<number>(0);
    const [vehicleFormIndex, setVehicleFormIndex] = useState<number>(0);

    // input states
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [vehicleMake, setVehicleMake] = useState<string>('');
    const [vehicleModel, setVehicleModel] = useState<string>('');
    const [vehicleYear, setVehicleYear] = useState<string>('');

    const [insuranceProvider, setInsuranceProvider] = useState<string>('');
    const [policyNumber, setPolicyNumber] = useState<string>('');

    // validator states
    const [firstNameValidator, setFirstNameValidator] = useState<string>('');
    const [lastNameValidator, setLastNameValidator] = useState<string>('');
    const [phoneNumberValidator, setPhoneNumberValidator] = useState<string>('');
    const [emailValidator, setEmailValidator] = useState<string>('');
    const [appointmentValidator, setAppointmentValidator] = useState<string>('');
    const [vehicleMakeValidator, setVehicleMakeValidator] = useState<string>('');
    const [vehicleModelValidator, setVehicleModelValidator] = useState<string>('');
    const [vehicleYearValidator, setVehicleYearValidator] = useState<string>('');

    const [insuranceProviderValidator, setInsuranceProviderValidator] = useState<string>('');
    const [policyNumberValidator, setPolicyNumberValidator] = useState<string>('');
    const [user, SetUser] = useState<any>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [description, setDescription] = useState<string>('');
    const [isoString, setIsoString] = useState<string>("");


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

    useEffect(() => {
        if (uploadedFiles.length === 0) return;

        const latestFile = uploadedFiles[uploadedFiles.length - 1];
        const tempUrl = URL.createObjectURL(latestFile);

        setPreviewUrls((prev) => [...prev, tempUrl]);

        // cleanup when component unmounts
        return () => {
            URL.revokeObjectURL(tempUrl);
        };
    }, [uploadedFiles]);

    const COMMON_US_VEHICLE_MAKES : string[] = [
        "Toyota",
        "Ford",
        "Chevrolet",
        "Honda",
        "Nissan",
        "Hyundai",
        "Kia",
        "Jeep",
        "Subaru",
        "GMC",
        "Ram",
        "Volkswagen",
        "BMW",
        "Mercedes-Benz",
        "Lexus",
        "Mazda",
        "Dodge",
        "Tesla",
        "Audi",
        "Acura"
    ];

    const TOP_AUTO_INSURANCE_PROVIDERS: string[] = [
        "State Farm",
        "GEICO",
        "Progressive",
        "Allstate",
        "USAA",
        "Liberty Mutual"
    ];

    // validator methods
    const validateFirstName = (value: string) => value.trim().length > 0 ? '' : 'First name is required';
    const validateLastName = (value: string) => value.trim().length > 0 ? '' : 'Last name is required';
    const validatePhoneNumber = (value: string) =>
        value.trim().length > 0
            ? (/^\+?[\d\s().-]{7,}$/.test(value.trim()) ? '' : 'Enter a valid phone number')
            : 'Phone number is required';
    const validateEmail = (value: string) =>
        value.trim().length > 0
            ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email')
            : 'Email is required';

    const validateVehicleMake = (value: string) => value.trim().length > 0 ? '' : 'Vehicle make is required';
    const validateVehicleModel = (value: string) => value.trim().length > 0 ? '' : 'Vehicle model is required';
    const validateVehicleYear = (value: string) =>
        value.trim().length > 0
            ? (/^\d{4}$/.test(value.trim()) && Number(value.trim()) >= 1900 && Number(value.trim()) <= 2100 ? '' : 'Enter a valid year')
            : 'Vehicle year is required';

    const validateInsuranceProvider = (value: string) => value.trim().length > 0 ? '' : 'Insurance provider is required';
    const validatePolicyNumber = (value: string) => value.trim().length > 0 ? '' : 'Policy number is required';
    const validateAppointment = (value: string) => value.trim().length > 0 ? '' : 'Appointment date/time is required';

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

    // one massive validator method
    const runAllValidators = () => {
        const fn = validateFirstName(firstName);
        const ln = validateLastName(lastName);
        const pn = validatePhoneNumber(phoneNumber);
        const em = validateEmail(email);

        const vmk = validateVehicleMake(vehicleMake);
        const vmd = validateVehicleModel(vehicleModel);
        const vyr = validateVehicleYear(vehicleYear);

        const ip = validateInsuranceProvider(insuranceProvider);
        const pol = validatePolicyNumber(policyNumber);

        const appt = validateAppointment(isoString);

        setFirstNameValidator(fn);
        setLastNameValidator(ln);
        setPhoneNumberValidator(pn);
        setEmailValidator(em);

        setVehicleMakeValidator(vmk);
        setVehicleModelValidator(vmd);
        setVehicleYearValidator(vyr);

        setInsuranceProviderValidator(ip);
        setPolicyNumberValidator(pol);

        setAppointmentValidator(appt);

        return !(fn || ln || pn || em || vmk || vmd || vyr || ip || pol || appt);
    };

    async function createNewUser() {
        if (!(bodyShop)) return;

        const protoUser = {
            firstName : firstName,
            lastName : lastName,
            email : email,
            phoneNumber : phoneNumber,
            bodyShop : bodyShop._id
        }

        console.log(protoUser)

        const newUser = await createUser(protoUser);

        console.log(newUser)

        SetUser(newUser);
    }


    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e) return;

        console.log("ooga booga")

        const file = e.target.files?.[0];
        if (!file) return;

        setUploadedFiles((prev) => [...prev, file]);

        e.target.value = '';
    };

    async function createNewInquiry() {
        if (!(bodyShop && user)) return;

        const protoInquiry = {
            bodyShop : bodyShop._id,
            user : user._id,
            vehicleYear : Number(vehicleYear),
            make : vehicleMake,
            model : vehicleModel, 
            insurerName : insuranceProvider,
            policyNumber : policyNumber,
            damageDescription : description,
            appointmentDateTime : isoString,
        }

        console.log(uploadedFiles)

        console.log(protoInquiry)

        const newEstimate = await createEstimateQuery(protoInquiry);

        if (!(newEstimate)) return;

        await uploadDamagePhotos(newEstimate._id)
    }

    /*async function autofill() {
        setFirstName("Nasir")
        setLastName("Griffin")
        setEmail("nasircrossgriffin@gmail.com")
        setPhoneNumber("6098059113")

        await createNewUser()

        setVehicleYear("2026")
        setVehicleMake("Mercedes-Benz")
        setVehicleModel("S-Class"), 
        setInsuranceProvider("Progressive")
        setPolicyNumber("C57534734947383")
        setDescription("I was in a car accident")
        setIsoString("2026-02-23T06:35:57+00:00")
    }*/

    async function uploadDamagePhotos(estimateid : string) {
        console.log(estimateid);

        for (let file of uploadedFiles) {
            await damagePhotoHelper(file, estimateid);
        }
    } 

    async function damagePhotoHelper(file : File, estimateid : string) {
        if (!(file)) return

        const s3URL = await uploadToS3(file);

        console.log(s3URL)

        if (!(s3URL)) return

        const newEstimatePhoto = await createEstimatePhoto(
            {
                estimateQuery: estimateid,
                url: s3URL.url
            }
        )

        console.log(newEstimatePhoto);
    }

    async function submitInquiry() {
        const validated = runAllValidators();

        console.log(validated);

        if (!(validated)) return

        await createNewUser()
            
        await createNewInquiry();

        const contactCompleted = await newContact({
            email : email,
            firstname : firstName,
            lastname : lastName,
            make : vehicleMake,
            model : vehicleModel,
            year : vehicleYear,
            appointmentDateTime : formatIsoString(isoString),
            bodyshop : bodyShop.name
        })

        console.log(contactCompleted)

        if (contactCompleted) navigate(`/${bodyShop.name}/gratitude`, { replace: true });
    }

    return (
        <>
            <div className='IngestionPage'>
            <button
                className='NavButton Continue'
                onClick={() => {(formIndex + 1) < formState.length ? setFormIndex(formIndex + 1) : null}}
            >
                Continue
            </button>

            {bodyShop ? <div className='Logo'>
                <img src={bodyShop.logo} />
            </div> : null}

            <button
                className='NavButton Back'
                onClick={() => {(formIndex - 1) > -1 ? setFormIndex(formIndex - 1) : null}}
            >
                Back
            </button>
                {  
                    formIndex === 0 ?
                        <div className='CustomerInformation fade-in-slide-up'>
                            <h1>We're here to help</h1>

                            <h2>Let's get some information about you</h2>

                            <div className='NameFields'>
                                <div className='NameField'>
                                    <label htmlFor='FirstName'>First Name</label>
                                    <input
                                        placeholder='First Name'
                                        type='text'
                                        name='FirstName'
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>

                                <div className='NameField'>
                                    <label htmlFor='LastName'>Last Name</label>
                                    <input
                                        placeholder='Last Name'
                                        type='text'
                                        name='LastName'
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='ContactFields'>
                                <div className='ContactField'>
                                    <label htmlFor='PhoneNumber'>Phone Number</label>
                                    <input
                                        placeholder='Phone Number'
                                        type='text'
                                        name='PhoneNumber'
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>

                                <div className='ContactField'>
                                    <label htmlFor='Email'>Email</label>
                                    <input
                                        placeholder='Email'
                                        type='email'
                                        name='Email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    : null
                }

                {
                    formIndex === 1 ?
                        <div className='VehicleInformation fade-in-slide-up'>
                            <h1>Let's get some information about your vehicle</h1>
                            <div className='SwitchButtons'>
                                <button
                                    className='SwitchButton'
                                    onClick={() => setVehicleFormIndex(0)}
                                >
                                    Make
                                </button>

                                <button
                                    className='SwitchButton'
                                    onClick={() => setVehicleFormIndex(1)}
                                >
                                    Model & Year
                                </button>
                            </div>
                            {
                                vehicleFormIndex === 0 ? 
                                    <div className='VehicleMake'>
                                        <h2>Select a make below or enter manually</h2>

                                        <div className='ManualEntry'>
                                            <input
                                                placeholder='Vehicle Make'
                                                type='text'
                                                name='Vehicle'
                                                value={vehicleMake}
                                                onChange={(e) => setVehicleMake(e.target.value)}
                                            />
                                        </div>

                                        <div className='MakeGridContainer fade-scroll'>
                                            <div className='MakeGrid'>
                                                {
                                                    COMMON_US_VEHICLE_MAKES.map((make, index) => (
                                                        <button
                                                            className='MakeButton'
                                                            onClick={() => setVehicleMake(make)}
                                                        >
                                                            <div>
                                                                <img src={'/' + COMMON_US_VEHICLE_MAKES[index] + '.png'}/>
                                                            </div>
                                                        </button>
                                                        
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                : null
                            }

                            {
                                vehicleFormIndex === 1 ? 
                                    <div className='VehicleModel'>
                                        <h2>Enter your vehicle model and year</h2>
                                    
                                        <div className='VehicleInformationFields'>
                                            <div className='VehicleInformationField'>
                                                <label htmlFor='Model'>Model</label>
                                                <input
                                                    placeholder='Model'
                                                    type='text'
                                                    name='Model'
                                                    value={vehicleModel}
                                                    onChange={(e) => setVehicleModel(e.target.value)}
                                                />
                                            </div>

                                            <div className='VehicleInformationField'>
                                                <label htmlFor='Year'>Year</label>
                                                <input
                                                    placeholder='Year'
                                                    type='text'
                                                    name='Year'
                                                    value={vehicleYear}
                                                    onChange={(e) => setVehicleYear(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        
                                    </div>
                                : null
                            }
                        </div>
                    : null
                }

                {
                    formIndex === 2 ?
                        <div className='DamageDescriptionPage fade-in-slide-up'>
                            <div className='DamageDescriptionContainer'>
                                <h1>Describe the damage to your vehicle</h1>

                                <textarea
                                    placeholder='Describe the damage to your vehicle...'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>

                            </div>
                        </div> 
                    : null
                }

                {
                    formIndex === 3 ?
                        <div className='PhotoUploadPage fade-in-slide-up'>
                            <div className='PhotoUploadContainer'>
                                <h1>Please upload photos of the damage</h1>

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelected}
                                />

                                <button className='UploadButton' onClick={handleUploadButtonClick}>
                                    <img src='/upload.png' />
                                </button>
                                
                                <div className='UploadedPhotosContainer fade-scroll'> 
                                    <div className='UploadedPhotosGrid'>
                                        {previewUrls.map((url, index) => (
                                            <div key={index} className='UploadedPhoto'>
                                                <img src={url} alt="Uploaded preview" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div> 
                    : null
                }

                {
                    formIndex === 4 ?
                        <div className='InsuranceInformation fade-in-slide-up'>
                            <h1>Lets get your insurance information</h1>
                            
                            <div className='InsuranceProvider'>
                                <h2>Select a provider below or enter manually</h2>

                                <div className='InsuranceFields'>
                                    <div className='InsuranceField'>
                                        <label>Insurance Provider</label>
                                        <input
                                            placeholder='Insurance Provider'
                                            type='text'
                                            name='InsuranceProvider'
                                            value={insuranceProvider}
                                            onChange={(e) => setInsuranceProvider(e.target.value)}
                                        />
                                    </div>

                                    <div className='InsuranceField'>
                                        <label>Policy Number</label>
                                        <input
                                            placeholder='Policy Number'
                                            type='text'
                                            name='PolicyNumber'
                                            value={policyNumber}
                                            onChange={(e) => setPolicyNumber(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className='InsuranceGridContainer'> 
                                    <div className='InsuranceGrid'>
                                        {
                                            TOP_AUTO_INSURANCE_PROVIDERS.map((provider, index) => (
                                                <button
                                                    className='MakeButton'
                                                    onClick={() => setInsuranceProvider(provider)}
                                                >
                                                    <div>
                                                        <img src={'/' + TOP_AUTO_INSURANCE_PROVIDERS[index] + '.png'}/>
                                                    </div>
                                                </button>
                                                
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>   
                        </div>
                    : null
                }

                {
                    formIndex === 5 ?
                        <div className='SelectAppointmentDate fade-in-slide-up'>
                            <div className='SelectAppointmentDateContainer'>
                                <h1>Select a date and time for your appointment</h1>

                                <div>
                                    <AppointmentDatePicker setIsoString={setIsoString} />
                                </div>
                            </div>
                        </div> 
                    : null
                }

                {
                    formIndex === 6 ?
                        <div className='ConfirmationPage fade-in-slide-up'>
                            <h1>Reveiw and Confirm</h1>

                            <button
                                className='ConfirmButton'
                                onClick={() => {submitInquiry()}}
                            >
                                Confirm
                            </button>

                            <div className='ReviewItem'>
                                <strong>Appointment:</strong> {formatIsoString(isoString)}
                                {appointmentValidator !== '' ? <p className='Validator'>{appointmentValidator}</p> : null}
                            </div>
                            
                            <div className='Review'>
                                <div className='ReviewItem'>
                                    <strong>First Name:</strong> {firstName}
                                    {firstNameValidator !== '' ? <p className='Validator'>{firstNameValidator}</p> : null}
                                </div>

                                <div className='ReviewItem'>
                                    <strong>Last Name:</strong> {lastName}
                                    {lastNameValidator !== '' ? <p className='Validator'>{lastNameValidator}</p> : null}
                                </div>

                                <div className='ReviewItem'>
                                    <strong>Phone Number:</strong> {phoneNumber}
                                    {phoneNumberValidator !== '' ? <p className='Validator'>{phoneNumberValidator}</p> : null}
                                </div>

                                <div className='ReviewItem'>
                                    <strong>Email:</strong> {email}
                                    {emailValidator !== '' ? <p className='Validator'>{emailValidator}</p> : null}
                                </div>

                                <div className='ReviewItem'>
                                    <strong>Vehicle Make:</strong> {vehicleMake}
                                    {vehicleMakeValidator !== '' ? <p className='Validator'>{vehicleMakeValidator}</p> : null}
                                </div>

                                <div className='ReviewItem'>
                                    <strong>Vehicle Model:</strong> {vehicleModel}
                                    {vehicleModelValidator !== '' ? <p className='Validator'>{vehicleModelValidator}</p> : null}
                                </div>

                                <div className='ReviewItem'>
                                    <strong>Vehicle Year:</strong> {vehicleYear}
                                    {vehicleYearValidator !== '' ? <p className='Validator'>{vehicleYearValidator}</p> : null}
                                </div>

                                <div className='ReviewItem'>
                                    <strong>Insurance Provider:</strong> {insuranceProvider}
                                    {insuranceProviderValidator !== '' ? <p className='Validator'>{insuranceProviderValidator}</p> : null}
                                </div>

                                <div className='ReviewItem'>
                                    <strong>Policy Number:</strong> {policyNumber}
                                    {policyNumberValidator !== '' ? <p className='Validator'>{policyNumberValidator}</p> : null}
                                </div>
                            </div>
                        </div>
                    : null
                }
            </div>
        </>
    )
}

export default IngestionPage
