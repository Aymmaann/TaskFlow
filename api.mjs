import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const users = []; // This array will store user data temporarily in-memory

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email already exists in the users array
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashPass = await bcrypt.hash(password, 10);
        console.log("Hash", hashPass);
        const user = {
            id: Math.random().toLocaleString(),
            name,
            email,
            password: hashPass
        };
        console.log("User", user);

        if (!user) {
            return res.status(500).json({ error: "Could not create user" });
        }
        users.push(user);
        console.log("User appended", users);
        res.status(201).json({ message: "User created", user: user });
    } catch (e) {
        return res.status(500).json({ message: "Internal Server error", error: e });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const findUser = users.find(user => user.email === email);
        if (!findUser) {
            return res.status(404).json({ message: "Could not find user" });
        }

        const checkPass = await bcrypt.compare(password, findUser.password);
        if (!checkPass) {
            return res.json({ message: "Wrong password" });
        }

        res.status(200).json({ message: "User logged in", user: findUser });
    } catch (e) {
        return res.status(500).json({ message: "Internal server error", error: e });
    }
});

app.listen(8000, () => {
    console.log("Server listening at port 8000...");
});
