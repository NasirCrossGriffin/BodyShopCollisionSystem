import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import '../styles/Admin.css'
import { check } from './middleware/admin.ts';
import { getBodyShopByName } from './middleware/bodyshop.ts';
import { getEstimateQueriesByBodyshop } from './middleware/estimatequery.ts';
import { getUserById } from './middleware/user.ts';

function Admin() {
    const [bodyShop, setBodyShop] = useState<any>(null);
    const [estimates, setEstimates] = useState<any>(null);
    const [users, setUsers] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<Boolean>(false);
    const { autobody } = useParams();

    useEffect(() => {
        const validateAdmin = async () => { 
            try {
                const validateAdmin = await check(bodyShop._id.toString());

                if (!(validateAdmin)) {
                    console.log("Verification failed")
                    navigate(`/${bodyShop.name}/admin/login`, { replace: true });
                }

                setIsAdmin(true);
                console.log("Validation Successful")
                
                return
            } catch(err) {
                console.log(err);
                setIsAdmin(false);
                navigate(`/${bodyShop.name}/admin/login`, { replace: true });
                return
            }
        }; 
        
        validateAdmin();
    }, [bodyShop])

    useEffect(() => {
        async function getEstimate() {
            const protoEstimates = await getEstimateQueriesByBodyshop(bodyShop.name);
            console.log(protoEstimates)
            setEstimates(protoEstimates);
        }; getEstimate();
    }, [isAdmin])

    useEffect(() => {
        async function getUsers() {
            const protoUsers = [];

            for (let estimate of estimates) {
                var protoUser = await getUserById(estimate.user.toString());
                protoUsers.push(protoUser);
            }

            console.log(protoUsers);
            setUsers(protoUsers);
        }; getUsers()
    }, [estimates])

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

    const navigate = useNavigate();

    return (
        <>
            <div className='AdminDashboard'>
                {bodyShop ? <div className='Logo'>
                    <img src={bodyShop.logo} />
                </div> : null}

                <div className='EstimateContainer'>
                    {
                        estimates && estimates.length > 0 && users && users.length > 0 ? estimates.map((estimate : any, index : number) => (
                            <div className='Estimate'>
                                <p>{formatIsoString(estimate.createdAt)}</p>
                                <p>{users[index].firstName + " " + users[index].lastName}</p>
                                <p>{estimate.make}</p>
                                <p>{estimate.model}</p>
                                <p>{estimate.vehicleYear}</p>
                                <p>{estimate.insurerName}</p>
                                <p>{estimate.policyNumber}</p>
                                <p>{formatIsoString(estimate.appointmentDateTime)}</p>

                            </div>                     
                        )) : null
                    }
                </div>
            </div>
        </>
    )
}




    export default Admin;
