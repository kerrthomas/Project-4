import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { App, Home } from './App.js';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
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
            alert("Success!!")
            return <Home />
        }
        else {
            alert("User not found.")
        }
    }
    return (
        <div style={{ backgroundColor: "white" }} padding="50px">
            <Link to="/"><button>Go Back</button></Link>
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