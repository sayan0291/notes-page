import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { NavLink, useNavigate } from "react-router-dom"
import { formInputResource } from "./Register"
import { AuthPageLayout } from "../components/layouts/AuthPageLayout"
import { FormInput } from "../Form"
import { Icon,Button } from "../components/common"
import { handleAuthSubmit } from "../auth/authHandler.jsx"

export const Login = () => {
    const [error,setError] = useState(null);
    const [success,setSuccess] = useState(null);

    const navigate = useNavigate();
    const timeRef = useRef(null);

    useEffect(() => {
        return () => clearTimeout(timeRef.current);
    },[])

    const onSubmit = async (data) => {
        await handleAuthSubmit({type: "login",data,setSuccess,setError,navigate,timeRef});
    }

    const { register,
            handleSubmit,
            formState: { errors,isSubmitting} } = useForm( {mode: "onBlur"} );

    return(
        <>
            <AuthPageLayout imgSrc="login_image.png" h3Content="Welcome Back" h4Content="Log in to your calm space. Your notes are waiting for you" error={error} success={success}  >
                <form className="form-section min-w-[25vw]" onSubmit={handleSubmit(onSubmit)}>
                    {
                        formInputResource.filter(obj => obj.id !== 1).map(obj => (
                                                <div className="flex flex-col gap-2" key={obj.id} >
                                                    <label>{obj.labelName}</label>
                                                    <div>
                                                        <Icon varient="formIcon">
                                                            {obj.inputIcon}
                                                        </Icon>
                                                        <FormInput
                                                            id={obj.registerFor}
                                                            type={obj.type} 
                                                            placeholder={obj.placeholder} 
                                                            registerFor={obj.registerFor} 
                                                            register={register} 
                                                            error={errors[obj.registerFor]}
                                                        />
                                                    </div>
                                                    {errors[obj.registerFor] && (
                                                        <p className="text-red-500 text-xs">
                                                            {errors[obj.registerFor].message}
                                                        </p>
                                                    )}
                                                </div>
                        ))
                    }
                    <Button varient="logBtn" type="submit" disabled={isSubmitting} >
                        {isSubmitting ? "Loading..." : "Log In"}
                    </Button>
                </form>
                <div className="w-full flex-jc h-1">
                    <div className="h-[1px] bg-toolbar/30 opacity-50 shadow-md rounded-md w-[65%]" />
                </div>
                <div className="w-full py-4 flex-jc">
                    <p className="">Don't have an account? <NavLink className="text-blue-600 hover:text-blue-500 transition-colors duration-all" to="/register" >Sign Up for free</NavLink></p>
                </div>
            </AuthPageLayout>
        </>
    )
}
