"use client"

import {Line} from "react-chartjs-2"
import {CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement,} from "chart.js"
import { FC } from "react"

ChartJS.register(LineElement,CategoryScale,LinearScale,PointElement)

type Props ={
    scores:{date:string; score:number;}[]
}

const ChartClient:FC<Props> =({scores})=>{
    const data ={
        labels:scores.map((s)=>s.date),
        datasets:[
            {
                label:"スコア",
                data:scores.map((s)=>s.score),
                borderColor:"rgba(75,192,192,1)",
                backgroundColor:"rgba(75,192,192,0.2)",
                tension:0.3,
                fill:true,
            }
        ]
    }
    return(
        <div className="">
            <Line data={data}/>
        </div>
    )
}

export default ChartClient