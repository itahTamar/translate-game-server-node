import {allowedOrigins} from './allowedOrigins'

export const corsOptions = {
    origin: (origin, callback) => {
        // console.log("allowed origin are:", allowedOrigins)
        // console.log('Environment Variables:', process.env.ALLOWED_ORIGINS);
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionSuccessStatus: 200
}