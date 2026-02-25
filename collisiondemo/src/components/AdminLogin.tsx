import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import '../styles/AdminLogin.css'
import { authenticateAdmin } from './middleware/admin.ts';
import { getBodyShopByName } from './middleware/bodyshop.ts';

function AdminLogin() {
    const { autobody } = useParams();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
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

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!(bodyShop)) return

        const loginData = {
            username : username,
            password : password,
            autobody : bodyShop._id
        }

        try {
        const authenticate = await authenticateAdmin(loginData);

        if (authenticate) {
            console.log("Success")
            navigate(`/${bodyShop.name}/admin`, { replace: true });
        }
        } catch(err) {
            console.log(err)
        return
        }
    }

    return (
        <>
            <div className='AdminLogin'>
                <div className='LoginForm'>
                    <h1>Admin Login</h1>
                    <label htmlFor='username'>Username</label>
                    <input placeholder='Username' onChange={(e) => {setUsername(e.currentTarget.value)}} name='username'></input>
                    <label htmlFor='password' typeof='password'>Password</label>
                    <input placeholder='Password' name='password' type='password' onChange={(e) => {setPassword(e.currentTarget.value)}}></input>
                    <button onClick={() => {handleLogin()}}>Submit</button>
                </div>
            </div>
        </>
    )
}


    export default AdminLogin;
