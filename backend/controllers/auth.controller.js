import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import {redis} from "../lib/redis.js"

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
    return { accessToken, refreshToken }
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7*24*60*60) // 7 days
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // preventing XSS attacks, cross site scripting attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // preventing CSRF attacks, cross site request forgery
        maxAge: 15*60*1000
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // preventing XSS attacks, cross site scripting attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // preventing CSRF attacks, cross site request forgery
        maxAge: 7*24*60*60*1000
    })
}

export const signup = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const userExists = await User.findOne({ email })

        if(userExists) {
            return res.status(400).json({message: "User already exists"})
        }

        const user = await User.create({ email, password, name })

        // authenticate user
        const { accessToken, refreshToken } = generateTokens(user._id)
        await storeRefreshToken(user._id, refreshToken)

        setCookies(res, accessToken, refreshToken)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })
    } catch (error) {
        console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })

        if(user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id)
            await storeRefreshToken(user._id, refreshToken)

            setCookies(res, accessToken, refreshToken)

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            })
        }
        else{
            res.status(401).json({message: "Invalid credentials"})
        }
    } catch (error) {
        console.log("Error in Login controller", error.message)
        res.status(500).json({message: error.message})
    }
}

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// since accessToken is 15min long, it will be expired after 15min, so we have to refresh it / recreate it
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            res.status(401).json({message: "No refresh token provided"})
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const storedRefreshToken = await redis.get(`refresh_token:${decoded.userId}`)

        // user is trying to cheat us.... :) ---> Like user that is trying to refresh token of another user or smthn like that
        if(storedRefreshToken !== refreshToken) {
            return res.status(401).json({message: "Invalid refresh token"})
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
        res.cookie("accessToken", accessToken, {
            httpOnly: true, // preventing XSS attacks, cross site scripting attacks
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", // preventing CSRF attacks, cross site request forgery
            maxAge: 15*60*1000
        })

        res.json({message: "Token refreshed successfully."})
    } catch (error) {
        console.log("Error in refresh token controller", error.message)
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export const getProfile = async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log("Error in getProfile controller", error.message)
        res.status(500).json({message: "Server error", error: error.message})
    }
}