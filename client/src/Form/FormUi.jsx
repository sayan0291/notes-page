const validationRules={
    title: {
        required : {value: true,message: "Title is required"}
    },
    description: {
        required: {value: true,message: "Description is required"}
    },
    name: {
        required: {value: true,message: "Name is required"},
        minLength: {
            value: 5,
            message: "Minimum 5 characters are allowed"
        },
        maxLength: {
            value: 30,
            message: "Maximum 30 characters are allowed"
        }
    },
    email: {
        required: {value: true,message: "Email is required"},
        pattern: {
            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Please enter a valid email',
        }
    },
    password: {
        required: {value: true,message: "Password is required"},
        minLength: {
            value: 6,
            message: "Password must be at least 6 characters"
        },

        pattern: {
            value:
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
            message:
            "Must contain uppercase, lowercase and number"
        }
    },
    terms: {
        required: {value: true,message: "Terms and condition is required"}
    }
}

export const FormInput = ({ id,type,placeholder,registerFor,register,error}) => {
    return(
        <>
            <input 
                className="w-full outline-none placeholder:text-black/30 placeholder:text-lg text-lg text-green"
                id={id}
                type={type} 
                placeholder={placeholder} 
                {...register(registerFor,validationRules[registerFor])}
            />
        </>
    )
}

export const FormTextArea = ({type,placeholder,registerFor,register,error}) => {
    return(
        <textarea type={type} placeholder={placeholder} {...register(registerFor,validationRules[registerFor])} />
    )
}

export const FormCheckBox = ({ register,registerFor,error }) => {
    return(
        <>
            <input 
                className={error ? "border-red-500" : ""}
                type="checkbox" 
                {...register(registerFor,validationRules[registerFor])}
            />
        </>
    )
}

export const SuccessMessage = ({success}) => {
    return(
        <>
            <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-md">
                <p className="text-green-600 text-sm font-medium">{success}</p>
            </div>
        </>
    )
}

export const ErrorMessage = ({error}) => {
    return(
        <>
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-md">
                <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
        </>
    )
}