"use client"

import {Line} from "react-chartjs-2"
import {CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, scales,} from "chart.js"
import { FC } from "react"

ChartJS.register(LineElement,CategoryScale,LinearScale,PointElement)

type Props ={
    scores:{date:string; score:number;}[]
}

const ChartClient:FC<Props> =({scores})=>{
    const sortedScores = [...scores].sort((a,b)=>{
        return new Date(a.date).getTime()-new Date(b.date).getTime()
    })


    const data ={
        labels:sortedScores.map((s)=>s.date),
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

    const options ={
        scales:{
            y:{
                ticks:{
                    stepSize:1,
                    precision:0
                }
            }
        }
    }

    return(
        <div className="">
            <Line data={data} options={options}/>
        </div>
    )
}

export default ChartClient