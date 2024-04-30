import { useRef, useState } from "react"
import './style.css';
import { useNavigate } from "react-router";
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { MdDeveloperMode } from "react-icons/md";

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const nav = useNavigate()

    const nameRef=useRef(null)
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Check if name, email, and password are empty
        if (!data.name || !data.email || !data.password) {
            alert(`Please enter your username, email, and password`);
            return; 
        }
    
        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert(`Please enter a valid email address`);
            return;
        }
    
        // Check if password is at least 8 characters long
        if (data.password.length < 8) {
            alert(`Password must be at least 8 characters long`);
            return;
        }
    
        const res = await fetch("http://ec2-54-242-42-249.compute-1.amazonaws.com:8000/register", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
    
        if (!res.ok) {
            const errorData = await res.json();
            if (errorData && errorData.message === "Email already exists") {
                alert(`Email already in use.`);
            } else {
                console.log("Registration failed");
            }
            return;
        }
    
        const responseData = await res.json();
    
        if (responseData && responseData.user) {
            console.log("Successful login", responseData.user);
            nav("/");
        } else {
            console.log("Registration failed");
        }
    };
    
    
    return (
        <>
        <div className="BackGround-image">
            <nav className="navbar">
            <div className="navbar-brand"><MdDeveloperMode className='navbar-logo'/>TaskFlow</div>
        </nav>
        <div className="container_login back-ground">
            <div className="header">
                <h1>Register to TaskFlow</h1>
            </div>

            <form className="formhehee" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="name"
                    ref={nameRef}
                    onChange={handleChange}
                    value={data.name}
                />

                <label htmlFor="email">Email</label>
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
                <input type="submit" value="Submit" />
            </form>

            <a href="#" onClick={()=>nav("/login")}>Already have an account? <strong>Log in</strong> </a>
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

export default Register;
