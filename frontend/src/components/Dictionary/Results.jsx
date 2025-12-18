import React from "react";
import Meaning from "./Meaning";
import Phonetic from "./Phonetic";
import Photos from "./Photos";
import "./Results.css";

export default function Results(props){
    if (props.results){
    return(
        <div className="Results">
        <section>
        <h3><strong>{props.results.word}</strong></h3>
        {props.results.phonetics.map(function(phonetic, index){
            return(
                <div key={index}>
                    <Phonetic phonetic={phonetic} />
                </div>
            )
        })}
        </section>
        
        {props.results.meanings.map(function(meaning, index){
            return(
                <section key={index}>
                <Meaning meaning={meaning}/>
                </section>
            )
        })}
        <Photos photos={props.photos} alt={props.alt}/>        
        </div>
    )
    } else {
        return (
            <div className="Results">
            <section>
            <h3 className="text-center">Try searching for another word.</h3>
            </section>
            </div>
        )
    }
    
}