import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null); // Initialize auth as null

    const login = (email) => {
        setAuth({ email }); // Set auth to an object with the user's email
    };

    const logout = () => {
        setAuth(null); // Reset auth to null on logout
        
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};