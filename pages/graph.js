import Tutorial from "components/graph/tutorial";
import { data } from "components/graph/source";
import React from "react";

export default function Graph() {
    return (
        <Tutorial logEventJSON={data}/>
    )
}