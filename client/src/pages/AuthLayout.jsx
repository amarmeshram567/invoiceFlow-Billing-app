import React from 'react';
import ExperiencePanel from '../components/ExperiencePanel';
import AuthForm from '../components/AuthForm';

const AuthLayout = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Left: Experience Panel */}
            <div className="hidden lg:block lg:w-[50%] xl:w-[50%]">
                <ExperiencePanel />
            </div>

            {/* Right: Auth Form */}
            <div className="w-full lg:w-[60%] xl:w-[60%] overflow-y-auto">
                <AuthForm />
            </div>
        </div>
    );
}

export default AuthLayout;
