import { useRef, useState } from "react";
import './style.css';
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { MdDeveloperMode } from "react-icons/md";

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const { login } = useAuth(); 
    const nav = useNavigate();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!data.email || !data.password) {
            alert(`Please enter both email and password`);
            return; 
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert(`Please enter a valid email address`);
            return; 
        }
    
        if (data.password.length < 8) {
            alert(`Password must be at least 8 characters long`);
            return; 
        }
    
        const res = await fetch("http://ec2-50-16-103-100.compute-1.amazonaws.com:8000/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
    
        if (!res.ok) {
            alert(`Invalid credentials`);
            return; 
        }
    
        const fetchedData = await res.json();
        console.log("Login successful", fetchedData);
        login(data.email); // Set the authentication state with the user's email
        nav("/");
    };
      

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
        <div className="BackGround-image">
        <nav className="navbar">
            <div className="navbar-brand"><MdDeveloperMode className='navbar-logo'/>TaskFlow</div>
        </nav>
        <div className="container_login back-ground">
            <div className="header">
                <h1>Login to TaskFlow</h1>
            </div>

            <form className="formhehee" onSubmit={handleSubmit}>
                <label htmlFor="email" className="email_header">Email</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    ref={emailRef}
                    onChange={handleChange}
                    value={data.email}
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    ref={passwordRef}
                    onChange={handleChange}
                    value={data.password}
                />
                <input type="submit" value="Login" />
            </form>

            <a href="#" onClick={() => nav("/register")}>Don't have an account? <strong>Register</strong> </a>
        </div>
        <div className='footer'>
            <div className="row">
                <div className="contact-left">
                    <h1 className="sub-title skill">Contact Us</h1>
                    <p className="gmail"> <IoIosMail className='footer-icon' /> Taskflow@gmail.com</p>
                    <p className="gmail"> <FaPhone className='footer-icon' /> 123-456-7890</p>
                </div>
                <div className="contact-right">
                    <form action="">
                        <input type="text" name="Name" placeholder="Your Name" required />
                        <input type="email" name="email" id="" placeholder="Your Email" required />
                        <button type="submit" className="btn2">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
        </>
    );
};

export default Login;
