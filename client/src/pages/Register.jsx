import { useForm } from "react-hook-form"
import { useState,useEffect,useRef } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { User,Mail,LockKeyhole } from "lucide-react";
import { FormCheckBox, FormInput } from "../Form"
import { Icon,Button } from "../components/common";
import { AuthPageLayout } from "../components/layouts/AuthPageLayout.jsx";
import { handleAuthSubmit } from "../auth/authHandler.jsx";

export const formInputResource = [
    {id: 1,labelName: "Full Name",inputIcon: <User strokeWidth={1} />,type: "text",placeholder: "Enter Your Full Name",registerFor: "name"},
    {id: 2,labelName: "Email Address",inputIcon: <Mail strokeWidth={1} />,type: "email",placeholder: "you@gmail.com",registerFor: "email"},
    {id: 3,labelName: "Password",inputIcon: <LockKeyhole strokeWidth={1} />,type: "password",placeholder: "Min 6 Characters",registerFor: "password"},
]

export const Register = () => {
    const [error,setError] = useState(null);
    const [success,setSuccess] = useState(null);
    const { register,
            handleSubmit,
            formState: { errors,isSubmitting} } = useForm( {mode: "onBlur"} );

    const navigate = useNavigate();
    const timeRef = useRef(null);

    useEffect(() => {
        return () => clearTimeout(timeRef.current);
    },[])

    const onSubmit = async (data) => {
        await handleAuthSubmit({type: "register",data,setSuccess,setError,navigate,timeRef});
    }

    return(
        <>
            <AuthPageLayout imgSrc="register_image.png" h3Content="Create Your Sanctuary" h4Content="Start your journey to mental clarity with organized, focus-driven notes." success={success} error={error} >
                <form className="form-section" onSubmit={handleSubmit(onSubmit)}>
                    {
                        formInputResource.map(obj => (
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
                    <div className="flex-ic ml-1 gap-2 ">
                        <FormCheckBox register={register}
                            registerFor="terms" 
                            error={errors.terms}
                        />
                        <p>I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span>.</p>
                    </div>
                    {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}
                    <Button varient="logBtn" type="submit" disabled={isSubmitting} >
                        {isSubmitting ? "Creating..." : "Create Account"}
                    </Button>
                </form>
                <div className="w-full flex-jc h-1">
                    <div className="h-[1px] bg-toolbar/30 opacity-50 shadow-md rounded-md w-[65%]" />
                </div>
                <div className="w-full py-4 flex-jc">
                    <p className="">Already have an account? <NavLink className="text-blue-600 hover:text-blue-500 transition-colors duration-all" to="/login" >Log IN</NavLink></p>
                </div>
            </AuthPageLayout>
        </>
    )
}
