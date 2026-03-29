import { IME_APLIKACIJE } from "../constants";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Home(){
    return(
    <>
    <h1>Dobrodošli na {IME_APLIKACIJE}</h1>
    <div style={{maxWidth: '300px', margin: 'auto'}}>
                <DotLottieReact
                    src="/car safe.lottie"

                    loop
                    autoplay
                />
            </div>
    </>
    )
}