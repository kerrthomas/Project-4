import { Link } from 'react-router-dom';
import App from './App.js';
import db from '../../project-4-api/routes/api.js';

const handleSubmit = async(event) => {
    console.log("The submit button was clicked");
    if(username == db.username && password == db.password) {
        <Link to="/"></Link>
    } else {
        alert("The username or password is incorrect. Please try again.")
    }
};

function Login() {
return(
    <div style={{backgroundColor: "white"}} padding="50px">
    <Link to="/"><button>Go Back</button></Link>
    <h1>Please enter your username and password.</h1>
    <form>
        <div><label>Username: </label><input type="text" id="username" required/></div>
        <div><label>Password: </label><input type="password" id="password" required/></div>
        <div><button type="submit" onSubmit={handleSubmit}>Login</button></div>
    </form>
    <Link to="/register">Don't have an account? Click here to register!</Link>
    </div>
)
}

export default Login;