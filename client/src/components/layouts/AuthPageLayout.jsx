import { Logo } from "../shared/Navbar";
import { SuccessMessage,ErrorMessage } from "../../Form/FormUi";

export const AuthPageLayout = ({ imgSrc,children,h3Content,h4Content,error,success }) => {
    return(
        <>
            <div className="reg-log-page">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="glass-card hidden lg:flex p-4 rounded-lg">
                        <img src={imgSrc} alt="auth page image" />
                    </div>
                    <div className="form-page">
                        <div className="flex-ic flex-col">
                            <Logo className1="w-[80%]" className2="text-violet"  />
                            <div className="form-desc">
                                <h3>{h3Content}</h3>
                                <h4>{h4Content}</h4>
                            </div>
                            <div>
                                {error && <ErrorMessage error={error} /> }
                                { success && <SuccessMessage success={success} />}
                            </div>
                            <div className="glass-card">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}