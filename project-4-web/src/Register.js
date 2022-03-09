import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles/user.css';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("The submit button was clicked");
        let fetchData = await fetch('http://localhost:3000/api/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        fetchData = await fetchData.json();
        if (!fetchData.error) {
            alert("Registry Successful!")
            window.location.replace('/');
        } else {
            alert("Username was already taken!")
        }
    }
    return (
        <div className='form'>
            <Link to="/"><button className='userbuttons'>Go Back</button></Link>
            <h1>Please enter a username and password you would like to use.</h1>
            <form onSubmit={handleSubmit}>
                <div><label>Enter a Username: </label><input type="text" value={username} onChange={(event) => setUsername(event.target.value)} required /></div>
                <div><label>Enter a Password: </label><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
                <div><button type="submit">Register</button></div>
            </form>
            <Link to="/login">Already have an account? Click here to login!</Link>
        </div>
    )
};
export default Register;