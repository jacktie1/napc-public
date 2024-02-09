import React from "react";
import SpinnerOverlay from "../components/SpinnerOverlay";

import CustomRouter from "../router";


const App = () => {
    return (
        <>
            <SpinnerOverlay />
            <CustomRouter />
        </>
    );
}

export default App;
