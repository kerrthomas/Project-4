import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles/user.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("The submit button was clicked");
        let fetchData = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        fetchData = await fetchData.json();
        if(!fetchData.error) {
            alert("Login Successful!")
            sessionStorage.setItem('userid', fetchData.results[0].userid);
            sessionStorage.setItem('balance', fetchData.results[0].balance);
            sessionStorage.setItem('username', username);
            window.location.replace('/')
        }
        else {
            alert("Inavlid Login. Please try again");
        }
    }

    return (
        <div className='form'>
            <Link to="/"><button className='userbuttons'>Go Back</button></Link>
            <h1>Please enter your username and password.</h1>
            <form onSubmit={handleSubmit}>
                <div><label>Username: </label><input type="text" value={username} onChange={(event) => setUsername(event.target.value)} required /></div>
                <div><label>Password: </label><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
                <div><button type="submit">Login</button></div>
            </form>
            <Link to="/register">Don't have an account? Click here to register!</Link>
        </div>
    )
};
export default Login;